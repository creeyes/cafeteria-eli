import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Matches the structure of data/menu.json
type ProductJson = {
  en: { name: string; price: string; description?: string }
  es: { name: string; price: string; description?: string }
  ca: { name: string; price: string; description?: string }
}

type MenuJson = {
  hotDrinks: {
    simple: ProductJson[]
    withDescription: ProductJson[]
  }
  coldDrinks: ProductJson[]
  beers: ProductJson[]
  craftBeers: ProductJson[]
  wines: ProductJson[]
  toasts: ProductJson[]
  snacks: ProductJson[]
  sandwiches: ProductJson[]
}

async function main() {
  const menuPath = path.join(process.cwd(), 'data', 'menu.json')
  const menuData: MenuJson = JSON.parse(fs.readFileSync(menuPath, 'utf-8'))

  console.log('Seeding database...')

  // Clear existing data
  await prisma.product.deleteMany({})

  // Helper to insert products
  const createProduct = async (category: string, item: ProductJson, order: number) => {
    // Some items might not have description in all languages, use empty string or null?
    // Schema allows null.
    
    // Check if item has the expected structure
    if (!item.es || !item.en || !item.ca) {
        console.warn(`Skipping item in ${category} due to missing language data`, item)
        return
    }

    await prisma.product.create({
      data: {
        category,
        order,
        name_es: item.es.name,
        name_en: item.en.name,
        name_ca: item.ca.name,
        price: item.es.price, // Assuming price is same for all langs
        desc_es: item.es.description || null,
        desc_en: item.en.description || null,
        desc_ca: item.ca.description || null,
      },
    })
  }

  // Hot Drinks - Simple
  let order = 1
  for (const item of menuData.hotDrinks.simple) {
    await createProduct('hotDrinks', item, order++)
  }
  // Hot Drinks - With Description
  for (const item of menuData.hotDrinks.withDescription) {
    await createProduct('hotDrinks', item, order++)
  }

  // Cold Drinks
  order = 1
  for (const item of menuData.coldDrinks) {
    await createProduct('coldDrinks', item, order++)
  }

  // Beers
  order = 1
  for (const item of menuData.beers) {
    await createProduct('beers', item, order++)
  }

  // Craft Beers
  order = 1
  for (const item of menuData.craftBeers) {
    await createProduct('craftBeers', item, order++)
  }

  // Wines
  order = 1
  for (const item of menuData.wines) {
    await createProduct('wines', item, order++)
  }

  // Toasts
  order = 1
  for (const item of menuData.toasts) {
    await createProduct('toasts', item, order++)
  }

  // Snacks
  order = 1
  for (const item of menuData.snacks) {
    await createProduct('snacks', item, order++)
  }

  // Sandwiches
  order = 1
  for (const item of menuData.sandwiches) {
    await createProduct('sandwiches', item, order++)
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
