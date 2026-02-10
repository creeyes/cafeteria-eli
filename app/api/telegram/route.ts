import { NextRequest, NextResponse } from "next/server"

// --- Config ---
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_REPO = process.env.GITHUB_REPO || "creeyes/cafeteria-eli"
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_ID
const MENU_FILE_PATH = "data/menu.json"
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

// --- Helpers: product access ---
function getProducts(menu: any, catKey: string): any[] {
  const cat = menu[catKey]
  if (catKey === "hotDrinks") {
    return [...(cat.simple || []), ...(cat.withDescription || [])]
  }
  return Array.isArray(cat) ? cat : []
}

function setProductAtIndex(menu: any, catKey: string, index: number, product: any) {
  if (catKey === "hotDrinks") {
    const simpleLen = menu.hotDrinks.simple.length
    if (index < simpleLen) {
      menu.hotDrinks.simple[index] = product
    } else {
      menu.hotDrinks.withDescription[index - simpleLen] = product
    }
  } else {
    menu[catKey][index] = product
  }
}

function deleteProductAtIndex(menu: any, catKey: string, index: number) {
  if (catKey === "hotDrinks") {
    const simpleLen = menu.hotDrinks.simple.length
    if (index < simpleLen) {
      menu.hotDrinks.simple.splice(index, 1)
    } else {
      menu.hotDrinks.withDescription.splice(index - simpleLen, 1)
    }
  } else {
    menu[catKey].splice(index, 1)
  }
}

function addProduct(menu: any, catKey: string, product: any) {
  if (catKey === "hotDrinks") {
    // Add to simple if no description, withDescription if it has one
    if (product.es.description) {
      menu.hotDrinks.withDescription.push(product)
    } else {
      menu.hotDrinks.simple.push(product)
    }
  } else {
    menu[catKey].push(product)
  }
}

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

// --- Helpers: GitHub API ---
async function getMenuFromGitHub(): Promise<{ content: any; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${MENU_FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    }
  )
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`)
  const data = await res.json()
  const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"))
  return { content, sha: data.sha }
}

async function updateMenuOnGitHub(menu: any, sha: string, message: string) {
  const content = Buffer.from(JSON.stringify(menu, null, 2)).toString("base64")
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${MENU_FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, content, sha, branch: "main" }),
    }
  )
  if (!res.ok) throw new Error(`GitHub PUT failed: ${res.status}`)
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
  const rows = products.map((prod: any, idx: number) => {
    const name = prod.es.name
    const price = prod.es.price
    let label = action === "p" ? `${name} \u2014 ${price}\u20ac` : name
    if (label.length > 45) label = label.substring(0, 42) + "..."
    return [{ text: label, callback_data: `i:${action}:${catShort}:${idx}` }]
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

    // Show product list
    try {
      const { content: menu } = await getMenuFromGitHub()
      const products = getProducts(menu, catKey)

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
      await sendMessage(chatId, "\u274c Error al leer el men\u00fa desde GitHub. Verifica GITHUB_TOKEN.")
    }
    return
  }

  // i:ACTION:CATSHORT:INDEX → product detail / action
  if (parts[0] === "i") {
    const action = parts[1]
    const catShort = parts[2]
    const catKey = LONG[catShort]
    const index = parseInt(parts[3])

    try {
      const { content: menu } = await getMenuFromGitHub()
      const products = getProducts(menu, catKey)
      const product = products[index]

      if (!product) {
        await sendMessage(chatId, "\u274c Producto no encontrado. Puede que haya sido eliminado.")
        return
      }

      if (action === "p") {
        // Modify price
        await sendMessage(
          chatId,
          `\ud83d\udcb0 <b>${product.es.name}</b>\nPrecio actual: <b>${product.es.price}\u20ac</b>\n\nEscribe el nuevo precio:\n\n[ctx:price:${catShort}:${index}]`,
          { reply_markup: { force_reply: true } }
        )
      } else if (action === "n") {
        // Rename
        await sendMessage(
          chatId,
          `\u270f\ufe0f <b>${product.es.name}</b>\n\n\ud83c\uddea\ud83c\uddf8 ${product.es.name}\n\ud83c\uddec\ud83c\udde7 ${product.en.name}\n\ud83c\udde6\ud83c\udde9 ${product.ca.name}\n\nEscribe los nuevos nombres (es / en / ca):\n\n[ctx:name:${catShort}:${index}]`,
          { reply_markup: { force_reply: true } }
        )
      } else if (action === "ds") {
        // Modify description
        const descEs = product.es.description || "(sin descripci\u00f3n)"
        const descEn = product.en.description || "(no description)"
        const descCa = product.ca.description || "(sense descripci\u00f3)"
        await sendMessage(
          chatId,
          `\ud83d\udcdd <b>${product.es.name}</b>\n\n\ud83c\uddea\ud83c\uddf8 ${descEs}\n\ud83c\uddec\ud83c\udde7 ${descEn}\n\ud83c\udde6\ud83c\udde9 ${descCa}\n\nEscribe las nuevas descripciones (es / en / ca):\nEscribe "borrar" para quitar la descripci\u00f3n.\n\n[ctx:desc:${catShort}:${index}]`,
          { reply_markup: { force_reply: true } }
        )
      } else if (action === "d") {
        // Delete confirmation
        await editMessage(
          chatId,
          messageId,
          `\u26a0\ufe0f \u00bfSeguro que quieres eliminar <b>"${product.es.name}"</b> (${product.es.price}\u20ac)?`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "\u2705 S\u00ed, eliminar", callback_data: `x:${catShort}:${index}` },
                  { text: "\u274c Cancelar", callback_data: `c:d:${catShort}` },
                ],
              ],
            },
          }
        )
      }
    } catch (err) {
      await sendMessage(chatId, "\u274c Error al leer el men\u00fa desde GitHub.")
    }
    return
  }

  // x:CATSHORT:INDEX → execute deletion
  if (parts[0] === "x") {
    const catShort = parts[1]
    const catKey = LONG[catShort]
    const index = parseInt(parts[2])
    const catInfo = CATEGORIES.find((c) => c.key === catKey)!

    try {
      const { content: menu, sha } = await getMenuFromGitHub()
      const products = getProducts(menu, catKey)
      const product = products[index]

      if (!product) {
        await sendMessage(chatId, "\u274c Producto no encontrado.")
        return
      }

      const name = product.es.name
      deleteProductAtIndex(menu, catKey, index)
      await updateMenuOnGitHub(menu, sha, `Eliminado: ${name}`)

      await editMessage(
        chatId,
        messageId,
        `\ud83d\uddd1 <b>"${name}"</b> eliminado de ${catInfo.emoji} ${catInfo.label}.\n\n\u267b\ufe0f La web se actualizar\u00e1 en ~1 minuto.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      await sendMessage(chatId, "\u274c Error al eliminar. Verifica GITHUB_TOKEN.")
    }
    return
  }
}

// --- Handle context replies (user typed text in response to ForceReply) ---
async function handleContextReply(chatId: number, ctx: string, text: string) {
  const parts = ctx.split(":")

  // --- PRICE ---
  if (parts[0] === "price") {
    const catShort = parts[1]
    const catKey = LONG[catShort]
    const index = parseInt(parts[2])
    const newPrice = text.replace(",", ".").replace("\u20ac", "").replace(/\s/g, "")

    if (isNaN(parseFloat(newPrice)) || parseFloat(newPrice) < 0) {
      await sendMessage(chatId, "\u274c Precio no v\u00e1lido. Escribe un n\u00famero, por ejemplo: <b>2.50</b>")
      return
    }

    try {
      const { content: menu, sha } = await getMenuFromGitHub()
      const products = getProducts(menu, catKey)
      const product = products[index]
      const oldPrice = product.es.price
      const name = product.es.name

      product.en.price = newPrice
      product.es.price = newPrice
      product.ca.price = newPrice
      setProductAtIndex(menu, catKey, index, product)

      await updateMenuOnGitHub(menu, sha, `${name}: ${oldPrice} -> ${newPrice}`)
      await sendMessage(
        chatId,
        `\u2705 <b>${name}</b>\nPrecio actualizado: ${oldPrice}\u20ac \u2192 <b>${newPrice}\u20ac</b>\n\n\u267b\ufe0f La web se actualizar\u00e1 en ~1 minuto.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      await sendMessage(chatId, "\u274c Error al actualizar precio. Verifica GITHUB_TOKEN.")
    }
    return
  }

  // --- NAME ---
  if (parts[0] === "name") {
    const catShort = parts[1]
    const catKey = LONG[catShort]
    const index = parseInt(parts[2])
    const names = text.split("/").map((n: string) => n.trim())

    if (names.length !== 3) {
      await sendMessage(chatId, "\u274c Formato incorrecto. Escribe 3 nombres separados por /\nEjemplo: <i>Cortadito / Short Cut / Tallat</i>")
      return
    }

    try {
      const { content: menu, sha } = await getMenuFromGitHub()
      const products = getProducts(menu, catKey)
      const product = products[index]
      const oldName = product.es.name

      product.es.name = names[0]
      product.en.name = names[1]
      product.ca.name = names[2]
      setProductAtIndex(menu, catKey, index, product)

      await updateMenuOnGitHub(menu, sha, `Renombrado: ${oldName} -> ${names[0]}`)
      await sendMessage(
        chatId,
        `\u2705 Producto renombrado:\n\ud83c\uddea\ud83c\uddf8 ${names[0]}\n\ud83c\uddec\ud83c\udde7 ${names[1]}\n\ud83c\udde6\ud83c\udde9 ${names[2]}\n\n\u267b\ufe0f La web se actualizar\u00e1 en ~1 minuto.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      await sendMessage(chatId, "\u274c Error al renombrar. Verifica GITHUB_TOKEN.")
    }
    return
  }

  // --- DESCRIPTION ---
  if (parts[0] === "desc") {
    const catShort = parts[1]
    const catKey = LONG[catShort]
    const index = parseInt(parts[2])

    try {
      const { content: menu, sha } = await getMenuFromGitHub()
      const products = getProducts(menu, catKey)
      const product = products[index]
      const name = product.es.name

      if (text.toLowerCase() === "borrar") {
        delete product.es.description
        delete product.en.description
        delete product.ca.description
        setProductAtIndex(menu, catKey, index, product)
        await updateMenuOnGitHub(menu, sha, `Descripcion eliminada: ${name}`)
        await sendMessage(
          chatId,
          `\u2705 Descripci\u00f3n eliminada de <b>${name}</b>\n\n\u267b\ufe0f La web se actualizar\u00e1 en ~1 minuto.`,
          { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
        )
        return
      }

      const descs = text.split("/").map((d: string) => d.trim())
      if (descs.length !== 3) {
        await sendMessage(chatId, '\u274c Formato incorrecto. Escribe 3 descripciones separadas por /\nO escribe <b>"borrar"</b> para quitar la descripci\u00f3n.')
        return
      }

      product.es.description = descs[0]
      product.en.description = descs[1]
      product.ca.description = descs[2]
      setProductAtIndex(menu, catKey, index, product)

      await updateMenuOnGitHub(menu, sha, `Descripcion actualizada: ${name}`)
      await sendMessage(
        chatId,
        `\u2705 Descripci\u00f3n de <b>${name}</b> actualizada:\n\ud83c\uddea\ud83c\uddf8 ${descs[0]}\n\ud83c\uddec\ud83c\udde7 ${descs[1]}\n\ud83c\udde6\ud83c\udde9 ${descs[2]}\n\n\u267b\ufe0f La web se actualizar\u00e1 en ~1 minuto.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      await sendMessage(chatId, "\u274c Error al actualizar descripci\u00f3n. Verifica GITHUB_TOKEN.")
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

    const newProduct: any = {
      en: { name: nameEn, price },
      es: { name: nameEs, price },
      ca: { name: nameCa, price },
    }

    try {
      const { content: menu, sha } = await getMenuFromGitHub()
      addProduct(menu, catKey, newProduct)
      await updateMenuOnGitHub(menu, sha, `Anadido: ${nameEs} (${price})`)

      const catInfo = CATEGORIES.find((c) => c.key === catKey)!
      await sendMessage(
        chatId,
        `\u2705 <b>${nameEs}</b> a\u00f1adido a ${catInfo.emoji} ${catInfo.label}\nPrecio: <b>${price}\u20ac</b>\n\n\u267b\ufe0f La web se actualizar\u00e1 en ~1 minuto.`,
        { reply_markup: { inline_keyboard: [[{ text: "\u2190 Volver al men\u00fa", callback_data: "m" }]] } }
      )
    } catch (err) {
      await sendMessage(chatId, "\u274c Error al a\u00f1adir producto. Verifica GITHUB_TOKEN.")
    }
    return
  }
}
