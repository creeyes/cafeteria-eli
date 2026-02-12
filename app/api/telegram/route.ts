import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// --- Config ---
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_ID
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`

// --- Category config ---
const CATEGORIES = [
  { key: "hotDrinks", emoji: "\u2615", label: "Bebidas Calientes" },
  { key: "coldDrinks", emoji: "\ud83e\uddca", label: "Bebidas Fr\u00edas" },
  { key: "beers", emoji: "\ud83c\udf7a", label: "Cervezas" },
  { key: "craftBeers", emoji: "\ud83c\udf7b", label: "C. Artesanas" },
  { key: "wines", emoji: "\ud83c\udf77", label: "Vinos y Vermuts" },
  { key: "toasts", emoji: "\ud83c\udf5e", label: "Tostadas" },
  { key: "snacks", emoji: "\ud83c\udf7d", label: "Para Picar" },
  { key: "sandwiches", emoji: "\ud83e\udd56", label: "Bocadillos" },
] as const

// Short keys for callback_data (Telegram 64 byte limit)
const SHORT: Record<string, string> = {
  hotDrinks: "hd", coldDrinks: "cd", beers: "be", craftBeers: "cb",
  wines: "wi", toasts: "to", snacks: "sn", sandwiches: "sa",
}
const LONG: Record<string, string> = Object.fromEntries(
  Object.entries(SHORT).map(([k, v]) => [v, k])
)

// --- Helpers: Telegram API ---
async function sendMessage(chatId: number, text: string, options: any = {}) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", ...options }),
  })
}

async function editMessage(chatId: number, messageId: number, text: string, options: any = {}) {
  await fetch(`${TELEGRAM_API}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", ...options }),
  })
}

async function answerCallback(id: string, text?: string) {
  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: id, text }),
  })
}

// --- Menus / Keyboards ---
function mainMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "\ud83d\udcb0 Modificar precio", callback_data: "a:p" }],
      [{ text: "\u270f\ufe0f Renombrar producto", callback_data: "a:n" }],
      [{ text: "\ud83d\udcdd Modificar descripci\u00f3n", callback_data: "a:ds" }],
      [{ text: "\u2795 A\u00f1adir producto", callback_data: "a:a" }],
      [{ text: "\ud83d\uddd1 Eliminar producto", callback_data: "a:d" }],
    ],
  }
}

const ACTION_LABELS: Record<string, string> = {
  p: "\ud83d\udcb0 Modificar precio",
  n: "\u270f\ufe0f Renombrar producto",
  ds: "\ud83d\udcdd Modificar descripci\u00f3n",
  a: "\u2795 A\u00f1adir producto",
  d: "\ud83d\uddd1 Eliminar producto",
}

function categoryKeyboard(action: string) {
  const rows: any[][] = []
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    const row: any[] = []
    row.push({
      text: `${CATEGORIES[i].emoji} ${CATEGORIES[i].label}`,
      callback_data: `c:${action}:${SHORT[CATEGORIES[i].key]}`,
    })
    if (CATEGORIES[i + 1]) {
      row.push({
        text: `${CATEGORIES[i + 1].emoji} ${CATEGORIES[i + 1].label}`,
        callback_data: `c:${action}:${SHORT[CATEGORIES[i + 1].key]}`,
      })
    }
    rows.push(row)
  }
  rows.push([{ text: "\u2190 Volver", callback_data: "m" }])
  return { inline_keyboard: rows }
}

function productKeyboard(products: any[], action: string, catShort: string) {
  const rows = products.map((prod: any) => {
    const name = prod.name_es
    const price = prod.price
    let label = action === "p" ? `${name} \u2014 ${price}\u20ac` : name
    if (label.length > 45) label = label.substring(0, 42) + "..."
    // Use ID instead of index for callback data
    return [{ text: label, callback_data: `i:${action}:${catShort}:${prod.id}` }]
  })
  rows.push([{ text: "\u2190 Volver", callback_data: `a:${action}` }])
  return { inline_keyboard: rows }
}

// --- Auth check ---
function isAuthorized(chatId: number): boolean {
  if (!ADMIN_CHAT_ID) return true
  return chatId.toString() === ADMIN_CHAT_ID
}

// --- Webhook setup (GET) ---
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action")

  if (action === "setup") {
    const webhookUrl = searchParams.get("url")
    if (!webhookUrl) {
      return NextResponse.json({ error: "Missing ?url= parameter" }, { status: 400 })
    }
    const res = await fetch(`${TELEGRAM_API}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    })
    const data = await res.json()
    return NextResponse.json(data)
  }

  if (action === "info") {
    const res = await fetch(`${TELEGRAM_API}/getWebhookInfo`)
    const data = await res.json()
    return NextResponse.json(data)
  }

  return NextResponse.json({ status: "Bot webhook active" })
}

// --- Main POST handler ---
export async function POST(req: NextRequest) {
  try {
    const update = await req.json()

    if (update.callback_query) {
      await handleCallback(update.callback_query)
    } else if (update.message) {
      await handleMessage(update.message)
    }
  } catch (err: any) {
    console.error("Webhook error:", err)
  }

  return NextResponse.json({ ok: true })
}

// --- Handle text messages ---
async function handleMessage(message: any) {
  const chatId = message.chat.id
  const text = message.text?.trim() || ""

  if (!isAuthorized(chatId)) {
    await sendMessage(chatId, "\u26d4 No tienes permisos para usar este bot.")
    return
  }

  // Commands
  if (text === "/start" || text === "/menu") {
    await sendMessage(chatId, "\ud83c\udf7d <b>Gesti\u00f3n de Carta - L'Alternativa</b>\n\n\u00bfQu\u00e9 quieres hacer?", {
      reply_markup: mainMenuKeyboard(),
    })
    return
  }

  // Reply to a ForceReply message with [ctx:...] marker
  if (message.reply_to_message?.text) {
    const original = message.reply_to_message.text
    const ctxMatch = original.match(/\[ctx:([^\]]+)\]/)
    if (ctxMatch) {
      await handleContextReply(chatId, ctxMatch[1], text)
      return
    }
  }

  // Default
  await sendMessage(chatId, "\ud83c\udf7d <b>Gesti\u00f3n de Carta - L'Alternativa</b>\n\n\u00bfQu\u00e9 quieres hacer?", {
    reply_markup: mainMenuKeyboard(),
  })
}

// --- Handle callback queries (button presses) ---
async function handleCallback(query: any) {
  const chatId = query.message.chat.id
  const messageId = query.message.message_id
  const data = query.data as string

  await answerCallback(query.id)

  if (!isAuthorized(chatId)) {
    await sendMessage(chatId, "\u26d4 No tienes permisos.")
    return
  }

  const parts = data.split(":")

  // m → main menu
  if (data === "m") {
    await editMessage(chatId, messageId, "\ud83c\udf7d <b>Gesti\u00f3n de Carta - L'Alternativa</b>\n\n\u00bfQu\u00e9 quieres hacer?", {
      reply_markup: mainMenuKeyboard(),
    })
    return
  }

  // a:ACTION → show categories for that action
  if (parts[0] === "a") {
    const action = parts[1]
    await editMessage(chatId, messageId, `${ACTION_LABELS[action]}\n\nElige categor\u00eda:`, {
      reply_markup: categoryKeyboard(action),
    })
    return
  }

  // c:ACTION:CATSHORT → show products or start add flow
  if (parts[0] === "c") {
    const action = parts[1]
    const catShort = parts[2]
    const catKey = LONG[catShort]
    const catInfo = CATEGORIES.find((c) => c.key === catKey)!

    if (action === "a") {
      // Add product: ask for name
      await sendMessage(
        chatId,
        `\u2795 <b>A\u00f1adir a ${catInfo.emoji} ${catInfo.label}</b>\n\nEscribe el nombre del producto en los 3 idiomas separados por /\nEjemplo: <i>Bomb\u00f3n / Bomb\u00f3n / Bomb\u00f3</i>\n\n[ctx:add:${catShort}]`,
        { reply_markup: { force_reply: true } }
      )
      return
    }

    // Show product list (fetch from DB)
    try {
      const products = await prisma.product.findMany({
        where: { category: catKey },
        orderBy: { order: "asc" },
      })

      if (products.length === 0) {
        await editMessage(chatId, messageId, `${catInfo.emoji} <b>${catInfo.label}</b>\n\nNo hay productos en esta categor\u00eda.`, {
          reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver", callback_data: `a:${action}` }]] },
        })
        return
      }

      await editMessage(chatId, messageId, `${catInfo.emoji} <b>${catInfo.label}</b>\n\nElige producto:`, {
        reply_markup: productKeyboard(products, action, catShort),
      })
    } catch (err) {
      console.error(err)
      await sendMessage(chatId, "\u274c Error al leer la base de datos.")
    }
    return
  }

  // i:ACTION:CATSHORT:ID → product detail / action
  if (parts[0] === "i") {
    const action = parts[1]
    const catShort = parts[2]
    // const catKey = LONG[catShort]
    const id = parseInt(parts[3])

    try {
      const product = await prisma.product.findUnique({ where: { id } })

      if (!product) {
        await sendMessage(chatId, "\u274c Producto no encontrado. Puede que haya sido eliminado.")
        return
      }

      if (action === "p") {
        // Modify price
        await sendMessage(
          chatId,
          `\ud83d\udcb0 <b>${product.name_es}</b>\nPrecio actual: <b>${product.price}\u20ac</b>\n\nEscribe el nuevo precio:\n\n[ctx:price:${catShort}:${id}]`,
          { reply_markup: { force_reply: true } }
        )
      } else if (action === "n") {
        // Rename
        await sendMessage(
          chatId,
          `\u270f\ufe0f <b>${product.name_es}</b>\n\n\ud83c\uddea\ud83c\uddf8 ${product.name_es}\n\ud83c\uddec\ud83c\udde7 ${product.name_en}\n\ud83c\udde6\ud83c\udde9 ${product.name_ca}\n\nEscribe los nuevos nombres (es / en / ca):\n\n[ctx:name:${catShort}:${id}]`,
          { reply_markup: { force_reply: true } }
        )
      } else if (action === "ds") {
        // Modify description
        const descEs = product.desc_es || "(sin descripci\u00f3n)"
        const descEn = product.desc_en || "(no description)"
        const descCa = product.desc_ca || "(sense descripci\u00f3)"
        await sendMessage(
          chatId,
          `\ud83d\udcdd <b>${product.name_es}</b>\n\n\ud83c\uddea\ud83c\uddf8 ${descEs}\n\ud83c\uddec\ud83c\udde7 ${descEn}\n\ud83c\udde6\ud83c\udde9 ${descCa}\n\nEscribe las nuevas descripciones (es / en / ca):\nEscribe "borrar" para quitar la descripci\u00f3n.\n\n[ctx:desc:${catShort}:${id}]`,
          { reply_markup: { force_reply: true } }
        )
      } else if (action === "d") {
        // Delete confirmation
        await editMessage(
          chatId,
          messageId,
          `\u26a0\ufe0f \u00bfSeguro que quieres eliminar <b>"${product.name_es}"</b> (${product.price}\u20ac)?`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "\u2705 S\u00ed, eliminar", callback_data: `x:${catShort}:${id}` },
                  { text: "\u274c Cancelar", callback_data: `c:d:${catShort}` },
                ],
              ],
            },
          }
        )
      }
    } catch (err) {
      console.error(err)
      await sendMessage(chatId, "\u274c Error al leer de la base de datos.")
    }
    return
  }

  // x:CATSHORT:ID → execute deletion
  if (parts[0] === "x") {
    const catShort = parts[1]
    const catKey = LONG[catShort]
    const id = parseInt(parts[2])
    const catInfo = CATEGORIES.find((c) => c.key === catKey)!

    try {
      const product = await prisma.product.delete({ where: { id } })

      await editMessage(
        chatId,
        messageId,
        `\ud83d\uddd1 <b>"${product.name_es}"</b> eliminado de ${catInfo.emoji} ${catInfo.label}.\n\n\u267b\ufe0f La web se actualiza al instante.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      console.error(err)
      await sendMessage(chatId, "\u274c Error al eliminar.")
    }
    return
  }
}

// --- Handle context replies (user typed text in response to ForceReply) ---
async function handleContextReply(chatId: number, ctx: string, text: string) {
  const parts = ctx.split(":")

  // --- PRICE ---
  if (parts[0] === "price") {
    // const catShort = parts[1]
    const id = parseInt(parts[2])
    const newPrice = text.replace(",", ".").replace("\u20ac", "").replace(/\s/g, "")

    if (isNaN(parseFloat(newPrice)) || parseFloat(newPrice) < 0) {
      await sendMessage(chatId, "\u274c Precio no v\u00e1lido. Escribe un n\u00famero, por ejemplo: <b>2.50</b>")
      return
    }

    try {
      const product = await prisma.product.update({
        where: { id },
        data: { price: newPrice },
      })

      await sendMessage(
        chatId,
        `\u2705 <b>${product.name_es}</b>\nPrecio actualizado: <b>${newPrice}\u20ac</b>\n\n\u267b\ufe0f La web se actualiza al instante.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      console.error(err)
      await sendMessage(chatId, "\u274c Error al actualizar precio.")
    }
    return
  }

  // --- NAME ---
  if (parts[0] === "name") {
    // const catShort = parts[1]
    const id = parseInt(parts[2])
    const names = text.split("/").map((n: string) => n.trim())

    if (names.length !== 3) {
      await sendMessage(chatId, "\u274c Formato incorrecto. Escribe 3 nombres separados por /\nEjemplo: <i>Cortadito / Short Cut / Tallat</i>")
      return
    }

    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          name_es: names[0],
          name_en: names[1],
          name_ca: names[2],
        },
      })

      await sendMessage(
        chatId,
        `\u2705 Producto renombrado:\n\ud83c\uddea\ud83c\uddf8 ${names[0]}\n\ud83c\uddec\ud83c\udde7 ${names[1]}\n\ud83c\udde6\ud83c\udde9 ${names[2]}\n\n\u267b\ufe0f La web se actualiza al instante.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      console.error(err)
      await sendMessage(chatId, "\u274c Error al renombrar.")
    }
    return
  }

  // --- DESCRIPTION ---
  if (parts[0] === "desc") {
    // const catShort = parts[1]
    const id = parseInt(parts[2])

    try {
      let data: any = {}
      let msg = ""

      if (text.toLowerCase() === "borrar") {
        data = { desc_es: null, desc_en: null, desc_ca: null }
        msg = `\u2705 Descripci\u00f3n eliminada`
      } else {
        const descs = text.split("/").map((d: string) => d.trim())
        if (descs.length !== 3) {
          await sendMessage(chatId, '\u274c Formato incorrecto. Escribe 3 descripciones separadas por /\nO escribe <b>"borrar"</b> para quitar la descripci\u00f3n.')
          return
        }
        data = { desc_es: descs[0], desc_en: descs[1], desc_ca: descs[2] }
        msg = `\u2705 Descripci\u00f3n actualizada`
      }

      const product = await prisma.product.update({ where: { id }, data })

      await sendMessage(
        chatId,
        `${msg} de <b>${product.name_es}</b>\n\n\u267b\ufe0f La web se actualiza al instante.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      console.error(err)
      await sendMessage(chatId, "\u274c Error al actualizar descripci\u00f3n.")
    }
    return
  }

  // --- ADD (step 1: got names, ask for price) ---
  if (parts[0] === "add") {
    const catShort = parts[1]
    const names = text.split("/").map((n: string) => n.trim())

    if (names.length !== 3) {
      await sendMessage(chatId, "\u274c Formato incorrecto. Escribe 3 nombres separados por /\nEjemplo: <i>Bomb\u00f3n / Bomb\u00f3n / Bomb\u00f3</i>")
      return
    }

    const encoded = names.map((n) => encodeURIComponent(n)).join(":")
    await sendMessage(
      chatId,
      `\ud83d\udcb0 <b>${names[0]}</b>\n\nEscribe el precio:\n\n[ctx:addprice:${catShort}:${encoded}]`,
      { reply_markup: { force_reply: true } }
    )
    return
  }

  // --- ADD (step 2: got price, create product) ---
  if (parts[0] === "addprice") {
    const catShort = parts[1]
    const catKey = LONG[catShort]
    const nameEs = decodeURIComponent(parts[2])
    const nameEn = decodeURIComponent(parts[3])
    const nameCa = decodeURIComponent(parts[4])
    const price = text.replace(",", ".").replace("\u20ac", "").replace(/\s/g, "")

    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      await sendMessage(chatId, "\u274c Precio no v\u00e1lido. Escribe un n\u00famero, por ejemplo: <b>2.50</b>")
      return
    }

    try {
      // Find max order to put at end
      const last = await prisma.product.findFirst({
        where: { category: catKey },
        orderBy: { order: "desc" },
      })
      const newOrder = (last?.order || 0) + 1

      await prisma.product.create({
        data: {
          category: catKey,
          name_es: nameEs,
          name_en: nameEn,
          name_ca: nameCa,
          price,
          order: newOrder,
        },
      })

      const catInfo = CATEGORIES.find((c) => c.key === catKey)!
      await sendMessage(
        chatId,
        `\u2705 <b>${nameEs}</b> a\u00f1adido a ${catInfo.emoji} ${catInfo.label}\nPrecio: <b>${price}\u20ac</b>\n\n\u267b\ufe0f La web se actualiza al instante.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      console.error(err)
      await sendMessage(chatId, "\u274c Error al a\u00f1adir producto.")
    }
    return
  }
}
