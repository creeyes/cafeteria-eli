import { PrismaClient } from "@prisma/client"
import CoffeeMenu from "@/components/MenuClient"

const prisma = new PrismaClient()

// Disable caching for real-time updates
export const dynamic = "force-dynamic"

export default async function Page() {
    const products = await prisma.product.findMany({
        orderBy: { order: "asc" },
    })

    // Group by category to match MenuData structure
    const menuData = {
        hotDrinks: {
            simple: products.filter(p => p.category === "hotDrinks" && !p.desc_es),
            withDescription: products.filter(p => p.category === "hotDrinks" && !!p.desc_es),
        },
        coldDrinks: products.filter(p => p.category === "coldDrinks"),
        beers: products.filter(p => p.category === "beers"),
        craftBeers: products.filter(p => p.category === "craftBeers"),
        wines: products.filter(p => p.category === "wines"),
        toasts: products.filter(p => p.category === "toasts"),
        snacks: products.filter(p => p.category === "snacks"),
        sandwiches: products.filter(p => p.category === "sandwiches"),
    }

    return <CoffeeMenu menuItems={menuData} />
}
