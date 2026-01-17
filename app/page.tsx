"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Coffee, CupSoda, Sandwich, Cake, Sun, Moon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type Language = "en" | "es" | "ca"

// Definir traducciones básicas
const translations = {
  en: {
    title: "Café Noir",
    subtitle: "COFFEE & PASTRIES",
    drinks: "Drinks",
    food: "Food",
    hotDrinks: "Hot Drinks",
    coldDrinks: "Cold Drinks",
    pastries: "Pastries",
    savory: "Savory",
    toasts: "Toasts",
    snacks: "Snacks",
    sandwiches: "Sandwiches",
    taxIncluded: "All prices include tax",
    beers: "Beers",
    craftBeers: "Craft Beers 'Espiga'",
    winesVermouth: "Wines & Vermouth",
    milkSupplement: "Oat/Soy milk supplement",
    allergenInfo: "Allergen Information",
    fish: "Fish",
    milk: "Milk",
    crustaceans: "Crustaceans",
    mollusks: "Mollusks",
    sesame: "Sesame",
    nuts: "Nuts",
  },
  es: {
    title: "Café Noir",
    subtitle: "CAFÉ Y PASTELERÍA",
    drinks: "Bebidas",
    food: "Comida",
    hotDrinks: "Bebidas Calientes",
    coldDrinks: "Bebidas Frías",
    pastries: "Pastelería",
    savory: "Salado",
    toasts: "Tostadas",
    snacks: "Para Picar",
    sandwiches: "Sándwiches",
    taxIncluded: "Todos los precios incluyen IVA",
    beers: "Cervezas",
    craftBeers: "Cervezas Artesanas 'Espiga'",
    winesVermouth: "Vinos y Vermuts",
    milkSupplement: "Suplemento avena/soja",
    allergenInfo: "Información de Alérgenos",
    fish: "Pescado",
    milk: "Lácteos",
    crustaceans: "Crustáceos",
    mollusks: "Moluscos",
    sesame: "Sésamo",
    nuts: "Frutos secos",
  },
  ca: {
    title: "Café Noir",
    subtitle: "CAFÈ I PASTISSERIA",
    drinks: "Begudes",
    food: "Menjar",
    hotDrinks: "Begudes Calentes",
    coldDrinks: "Begudes Fredes",
    pastries: "Pastisseria",
    savory: "Salat",
    toasts: "Torrades",
    snacks: "Per Picar",
    sandwiches: "Entrepans",
    taxIncluded: "Tots els preus inclouen IVA",
    beers: "Cerveses",
    craftBeers: "Cerveses Artesanes 'Espiga'",
    winesVermouth: "Vins i Vermuts",
    milkSupplement: "Suplement civada/soja",
    allergenInfo: "Informació d'Al·lèrgens",
    fish: "Peix",
    milk: "Lactis",
    crustaceans: "Crustacis",
    mollusks: "Mol·luscs",
    sesame: "Sèsam",
    nuts: "Fruits secs",
  },
}

// Definir los elementos del menú directamente
const menuItems = {
  hotDrinks: {
    simple: [
      {
        en: { name: "Solo", price: "1.50" },
        es: { name: "Solo", price: "1.50" },
        ca: { name: "Sol", price: "1.50" },
      },
      {
        en: { name: "Cortado", price: "1.60" },
        es: { name: "Cortado", price: "1.60" },
        ca: { name: "Tallat", price: "1.60" },
      },
      {
        en: { name: "With Milk", price: "1.80" },
        es: { name: "Con leche", price: "1.80" },
        ca: { name: "Amb llet", price: "1.80" },
      },
      {
        en: { name: "Americano", price: "1.70" },
        es: { name: "Americano", price: "1.70" },
        ca: { name: "Americà", price: "1.70" },
      },
      {
        en: { name: "Cappuccino", price: "2.00" },
        es: { name: "Capuccino", price: "2.00" },
        ca: { name: "Capuccino", price: "2.00" },
      },
    ],
    withDescription: [
      {
        en: { name: "Teas & Infusions", description: "Delicate, aromatic and for all moods", price: "2.20" },
        es: { name: "Tés, infusiones", description: "Delicados, aromáticos y para todos los ánimos", price: "2.20" },
        ca: { name: "Tes, infusions", description: "Delicats, aromàtics i per a tots els ànims", price: "2.20" },
      },
      {
        en: { name: "Matcha Latte", description: "Green, creamy and with lots of flow", price: "3.00" },
        es: { name: "Matcha latte", description: "Verde, cremoso y con mucho flow", price: "3.00" },
        ca: { name: "Matcha latte", description: "Verd, cremós i amb molt de flow", price: "3.00" },
      },
      {
        en: { name: "Chai Latte", description: "Spicy, sweet and comforting. A hug in a cup", price: "3.00" },
        es: { name: "Chai latte", description: "Especiado, dulce y reconfortante. Un abrazo en taza", price: "3.00" },
        ca: { name: "Chai latte", description: "Especiat, dolç i reconfortant. Una abraçada en tassa", price: "3.00" },
      },
      {
        en: {
          name: "Pink Latte",
          description: "Pretty on the outside, smooth on the inside. Sweetness in pink",
          price: "3.00",
        },
        es: { name: "Pink latte", description: "Bonito por fuera, suave por dentro. Dulzura en rosa", price: "3.00" },
        ca: { name: "Pink latte", description: "Bonic per fora, suau per dins. Dolçor en rosa", price: "3.00" },
      },
      {
        en: { name: "Turmeric Latte", description: "Golden, warm and powerful. Ancient yet modern", price: "3.00" },
        es: { name: "Cúrcuma latte", description: "Dorado, cálido y con poder. Antiguo pero moderno", price: "3.00" },
        ca: { name: "Cúrcuma latte", description: "Daurat, càlid i amb poder. Antic però modern", price: "3.00" },
      },
      {
        en: { name: "Hot Chocolate", description: "Thick, intense and very craving. Pure indulgence", price: "2.90" },
        es: { name: "Chocolate a la taza", description: "Espeso, intenso y muy apetecible. Puro vicio", price: "2.90" },
        ca: { name: "Xocolata a la tassa", description: "Espessa, intensa i molt desitjable. Pur vici", price: "2.90" },
      },
      {
        en: {
          name: "Swiss Chocolate",
          description: "Chocolate + whipped cream. Total luxury. For true fans",
          price: "3.30",
        },
        es: { name: "Chocolate suizo", description: "Choco + nata. Lujo total. Para los muy fans", price: "3.30" },
        ca: { name: "Xocolata suïssa", description: "Xoco + nata. Luxe total. Per als molt fans", price: "3.30" },
      },
    ],
  },
  coldDrinks: [
    {
      en: { name: "Small Water", price: "1.40" },
      es: { name: "Agua pequeña", price: "1.40" },
      ca: { name: "Aigua petita", price: "1.40" },
    },
    {
      en: { name: "Cabreiroá Sparkling Water", price: "2.30" },
      es: { name: "Agua con gas Cabreiroá", price: "2.30" },
      ca: { name: "Aigua amb gas Cabreiroá", price: "2.30" },
    },
    {
      en: { name: "Fresh Orange Juice", price: "2.70" },
      es: { name: "Zumo de naranja natural", price: "2.70" },
      ca: { name: "Suc de taronja natural", price: "2.70" },
    },
    {
      en: { name: "Apple Juice", price: "1.90" },
      es: { name: "Zumo de manzana", price: "1.90" },
      ca: { name: "Suc de poma", price: "1.90" },
    },
    {
      en: { name: "Juice (pineapple, orange, peach, mango)", price: "1.90" },
      es: { name: "Zumo (piña, naranja, melocotón, mango)", price: "1.90" },
      ca: { name: "Suc (pinya, taronja, préssec, mango)", price: "1.90" },
    },
    {
      en: { name: "Citrus Matcha", price: "3.70" },
      es: { name: "Citrus Matcha", price: "3.70" },
      ca: { name: "Citrus Matcha", price: "3.70" },
    },
    {
      en: { name: "Cacaolat", price: "2.70" },
      es: { name: "Cacaolat", price: "2.70" },
      ca: { name: "Cacaolat", price: "2.70" },
    },
    {
      en: { name: "Kombucha", price: "3.20" },
      es: { name: "Kombucha", price: "3.20" },
      ca: { name: "Kombucha", price: "3.20" },
    },
    {
      en: {
        name: "Ginger Beer 0.0",
        description:
          "A Ginger Ale with ginger and organic lemons from Penedès. Very refreshing drink suitable for celiacs and alcohol-free.",
        price: "2.80",
      },
      es: {
        name: "Ginger Beer 0,0",
        description:
          "Un Ginger Ale con jengibre y limones ecológicos del Penedès. Bebida muy refrescante apta para celíacos y sin alcohol.",
        price: "2.80",
      },
      ca: {
        name: "Ginger Beer 0,0",
        description:
          "Un Ginger Ale amb gingebre i llimones ecològiques del Penedès. Beguda molt refrescant apta per a celíacs i sense alcohol.",
        price: "2.70",
      },
    },
    {
      en: { name: "Organic Blueberry Soda", price: "2.70" },
      es: { name: "Refresco ecológico de arándanos", price: "2.70" },
      ca: { name: "Refresc ecològic de nabius", price: "2.70" },
    },
    {
      en: { name: "Organic Apple Soda", price: "2.70" },
      es: { name: "Refresco ecológico de manzana", price: "2.70" },
      ca: { name: "Refresc ecològic de poma", price: "2.70" },
    },
    {
      en: { name: "Coca-Cola", price: "2.30" },
      es: { name: "Coca-Cola", price: "2.30" },
      ca: { name: "Coca-Cola", price: "2.30" },
    },
    {
      en: { name: "Coca-Cola Zero", price: "2.30" },
      es: { name: "Coca-Cola 0", price: "2.30" },
      ca: { name: "Coca-Cola 0", price: "2.30" },
    },
    {
      en: { name: "Fanta Lemon", price: "2.30" },
      es: { name: "Fanta de llimona", price: "2.30" },
      ca: { name: "Fanta de llimona", price: "2.30" },
    },
    {
      en: { name: "Fanta Orange", price: "2.30" },
      es: { name: "Fanta de naranja", price: "2.30" },
      ca: { name: "Fanta de taronja", price: "2.30" },
    },
    {
      en: { name: "Aquarius", price: "2.30" },
      es: { name: "Aquarius", price: "2.30" },
      ca: { name: "Aquarius", price: "2.30" },
    },
    {
      en: { name: "Nestea", price: "2.30" },
      es: { name: "Nestea", price: "2.30" },
      ca: { name: "Nestea", price: "2.30" },
    },
    {
      en: { name: "Trina", price: "2.30" },
      es: { name: "Trina", price: "2.30" },
      ca: { name: "Trina", price: "2.30" },
    },
    {
      en: { name: "Tonic Water", price: "2.30" },
      es: { name: "Tónica", price: "2.30" },
      ca: { name: "Tònica", price: "2.30" },
    },
    {
      en: { name: "Bitter Kas", price: "2.30" },
      es: { name: "Bitter Kas", price: "2.30" },
      ca: { name: "Bitter Kas", price: "2.30" },
    },
  ],
  beers: [
    {
      en: { name: "Estrella Galicia 33 cl", price: "2.30" },
      es: { name: "Estrella Galicia 33 cl", price: "2.30" },
      ca: { name: "Estrella Galicia 33 cl", price: "2.30" },
    },
    {
      en: { name: "Estrella Galicia 20 cl", price: "1.80" },
      es: { name: "Estrella Galicia 20 cl", price: "1.80" },
      ca: { name: "Estrella Galicia 20 cl", price: "1.80" },
    },
    {
      en: { name: "Estrella Galicia Gluten Free 33 cl", price: "2.30" },
      es: { name: "Estrella Galicia sin gluten 33 cl", price: "2.30" },
      ca: { name: "Estrella Galicia sense gluten 33 cl", price: "2.30" },
    },
    {
      en: { name: "Estrella Galicia 1906", price: "2.40" },
      es: { name: "Estrella Galicia 1906", price: "2.40" },
      ca: { name: "Estrella Galicia 1906", price: "2.40" },
    },
    {
      en: { name: "Estrella Galicia 0.0 Toasted 33 cl", price: "2.40" },
      es: { name: "Estrella Galicia 0,0 torrada 33 cl", price: "2.40" },
      ca: { name: "Estrella Galicia 0,0 torrada 33 cl", price: "2.40" },
    },
    {
      en: { name: "Turia 20 cl", price: "1.80" },
      es: { name: "Turia 20 cl", price: "1.80" },
      ca: { name: "Turia 20 cl", price: "1.80" },
    },
    {
      en: { name: "Voll-Damm", price: "2.40" },
      es: { name: "Voll-Damm", price: "2.40" },
      ca: { name: "Voll-Damm", price: "2.40" },
    },
    {
      en: { name: "Clara (Beer with Lemon)", price: "2.30" },
      es: { name: "Clara", price: "2.30" },
      ca: { name: "Clara", price: "2.30" },
    },
  ],
  craftBeers: [
    {
      en: { name: "Blonde", description: "A refreshing and aromatic blonde beer. Gluten-free.", price: "3.20" },
      es: { name: "Blonde", description: "Una cerveza rubia refrescante y aromática. Sin gluten.", price: "3.20" },
      ca: { name: "Blonde", description: "Una cervesa rossa refrescant i aromàtica. Sense gluten.", price: "3.20" },
    },
    {
      en: {
        name: "IPA Garage",
        description: "An amber IPA-style beer with more bitterness. Gluten-free.",
        price: "3.20",
      },
      es: {
        name: "IPA Garage",
        description: "Una cerveza ámbar de estilo IPA de mayor amargor. Sin gluten.",
        price: "3.20",
      },
      ca: {
        name: "IPA Garage",
        description: "Una cervesa ambre d'estil IPA de més amargor. Sense gluten.",
        price: "3.20",
      },
    },
    {
      en: {
        name: "Pale Ale",
        description:
          "Amber ale in traditional English style, with notes of caramel, chocolate, and spices. Dry and balanced bitterness.",
        price: "3.20",
      },
      es: {
        name: "Pale Ale",
        description:
          "Cerveza ámbar de estilo inglés, con notas de caramelo, chocolate y especias. Amargor seco y equilibrado.",
        price: "3.20",
      },
      ca: {
        name: "Pale Ale",
        description:
          "Cervesa ambrada d'estil anglès, amb notes de caramel, xocolata i espècies. Amargor sec i equilibrat.",
        price: "3.20",
      },
    },
    {
      en: {
        name: "Amber Ale",
        description: "A toasted beer with an easy sip. For malt lovers.",
        price: "3.20",
      },
      es: {
        name: "Amber Ale",
        description: "Una cerveza tostada de trago fácil. Para amantes de la malta.",
        price: "3.20",
      },
      ca: {
        name: "Amber Ale",
        description: "Una cervesa torrada de glop fàcil. Per a amants de la malta.",
        price: "3.20",
      },
    },
    {
      en: {
        name: "Porter",
        description: "A black beer with notes of coffee and roasted malts. Moderate alcohol content.",
        price: "3.70",
      },
      es: {
        name: "Porter",
        description: "Una cerveza negra con notas de café y maltas torrefactas. De graduación moderada.",
        price: "3.70",
      },
      ca: {
        name: "Porter",
        description: "Una cervesa negra amb notes de cafè i maltes torrefactes. De graduació moderada.",
        price: "3.70",
      },
    },
    {
      en: {
        name: "Dark Way",
        description:
          "Intense dark beer with a full body, silky texture, and notes of cocoa and pastry. Warm, sweet finish.",
        price: "4.60",
      },
      es: {
        name: "Dark Way",
        description:
          "Cerveza negra intensa, de cuerpo robusto, textura sedosa y notas de cacao y bollería. Final dulce y cálido.",
        price: "4.60",
      },
      ca: {
        name: "Dark Way",
        description:
          "Cervesa negra intensa amb cos robust, textura sedosa i notes de cacau i brioxeria. Final dolç i càlid.",
        price: "4.60",
      },
    },
  ],
  wines: [
    {
      en: { name: 'White Wine "Cabro"', price: "3.20 € glass / 30 € bottle" },
      es: { name: 'Vino blanco "Cabro"', price: "3,20 € copa / 30 € botella" },
      ca: { name: 'Vi blanc "Cabro"', price: "3,20 € copa / 30 € ampolla" },
    },
    {
      en: { name: 'Red Wine "Cabro"', price: "3.20 € glass / 30 € bottle" },
      es: { name: 'Vino tinto "Cabro"', price: "3,20 € copa / 30 € botella" },
      ca: { name: 'Vi negre "Cabro"', price: "3,20 € copa / 30 € ampolla" },
    },
    {
      en: { name: "Black Vermouth Pitteus", price: "3.50" },
      es: { name: "Vermut negro Pitteus", price: "3,50" },
      ca: { name: "Vermut negre Pitteus", price: "3,50" },
    },
    {
      en: { name: "White Vermouth Izaguirre", price: "3.50" },
      es: { name: "Vermut blanco Izaguirre", price: "3,50" },
      ca: { name: "Vermut blanc Izaguirre", price: "3,50" },
    },
  ],
  toasts: [
    {
      en: { name: "Iberian Ham Toast", description: "A classic with category. Never fails.", price: "6.20" },
      es: { name: "Jamón ibérico", description: "Un clásico con categoría. No falla.", price: "6.20" },
      ca: { name: "Pernil ibèric", description: "Un clàssic amb categoria. No falla.", price: "6.20" },
    },
    {
      en: { name: "Cooked Ham Toast", description: "Simple, smooth... the reliable one.", price: "3.70" },
      es: { name: "Jamón cocido", description: "Sencilla, suave… la de confianza.", price: "3.70" },
      ca: { name: "Pernil cuit", description: "Senzilla, suau... la de confiança.", price: "3.70" },
    },
    {
      en: {
        name: "Fuet Toast",
        description: "Direct and tasty, no beating around the bush.",
        price: "4.50",
      },
      es: { name: "Fuet", description: "Directa y sabrosa, sin rodeos.", price: "4.50" },
      ca: { name: "Fuet", description: "Directa i saborosa, sense voltes.", price: "4.50" },
    },
    {
      en: {
        name: "Cheese Toast",
        description: "For those who get to the point: creamy and always good.",
        price: "4.40",
      },
      es: { name: "Queso", description: "Para los que van al grano: cremosa y siempre buena.", price: "4.40" },
      ca: { name: "Formatge", description: "Per als que van al gra: cremosa i sempre bona.", price: "4.40" },
    },
    {
      en: { name: "Tuna Toast", description: "Light but with character, good at any time.", price: "4.70" },
      es: { name: "Atún", description: "Ligera pero con carácter, va bien a cualquier hora.", price: "4.70" },
      ca: { name: "Tonyina", description: "Lleugera però amb caràcter, va bé a qualsevol hora.", price: "4.70" },
    },
    {
      en: { name: "Avocado Toast", description: "Green, creamy and with flow. Very top.", price: "6.00" },
      es: { name: "Aguacate", description: "Verde, cremosa y con flow. Muy top.", price: "6.00" },
      ca: { name: "Alvocat", description: "Verda, cremosa i amb flow. Molt top.", price: "6.00" },
    },
    {
      en: { name: "Butter Toast", description: "Pure nostalgia. Smooth, simple, total breakfast.", price: "3.40" },
      es: { name: "Mantequilla", description: "Pura nostalgia. Suave, sencilla, de desayuno total.", price: "3.40" },
      ca: { name: "Mantega", description: "Pura nostàlgia. Suau, senzilla, d'esmorzar total.", price: "3.40" },
    },
    {
      en: { name: "Butter & Jam Toast", description: "Sweet, tender, like a good afternoon snack.", price: "3.70" },
      es: {
        name: "Mantequilla + mermelada",
        description: "Dulce, tierna, como una merienda de las buenas.",
        price: "3.70",
      },
      ca: { name: "Mantega + melmelada", description: "Dolça, tendra, com un berenar dels bons.", price: "3.70" },
    },
  ],
  snacks: [
    {
      en: { name: "Cockles", description: "With an appetite-opening dressing. Simple and flavorful.", price: "5.00" },
      es: {
        name: "Berberechos",
        description: "Con un aliño de los que abren el apetito. Sencillos y con mucho sabor.",
        price: "5.00",
      },
      ca: {
        name: "Escopinyes",
        description: "Amb un amaniment dels que obren la gana. Senzilles i amb molt de sabor.",
        price: "5.00",
      },
    },
    {
      en: { name: "Olives", description: "The classic ones, a must-have.", price: "2.50" },
      es: { name: "Olivas", description: "Las de siempre, no pueden faltar.", price: "2.50" },
      ca: { name: "Olives", description: "Les de sempre, no poden faltar.", price: "2.50" },
    },
    {
      en: { name: "Potato Chips", description: "Crunchy and tasty, they go well with any drink.", price: "2.00" },
      es: { name: "Patatas chips", description: "Crujientes y sabrosas, acompañan cualquier bebida.", price: "2.00" },
      ca: { name: "Patates xips", description: "Cruixents i saboroses, acompanyen qualsevol beguda.", price: "2.00" },
    },
    {
      en: {
        name: "Our Nachos (large)",
        description: "Homemade and freshly made. They have that addictive quality.",
        price: "9.00",
      },
      es: {
        name: "Nuestros Nachos (grandes)",
        description: "Caseros y recién hechos. Tienen ese punto que engancha.",
        price: "9.00",
      },
      ca: {
        name: "Els nostres Nachos (grans)",
        description: "Casolans i acabats de fer. Tenen aquest punt que enganxa.",
        price: "9.00",
      },
    },
    {
      en: {
        name: "Our Nachos (small)",
        price: "5.50",
      },
      es: {
        name: "Nuestros Nachos (pequeños)",
        price: "5.50",
      },
      ca: {
        name: "Els nostres Nachos (petits)",
        price: "5.50",
      },
    },
    {
      en: {
        name: 'Hummus "re boníssim"',
        description: "It changes depending on the day, but always creamy and tasty.",
        price: "5.00",
      },
      es: {
        name: 'Hummus "re boníssim"',
        description: "Va cambiando según el día, pero siempre cremoso y sabroso.",
        price: "5.00",
      },
      ca: {
        name: 'Hummus "re boníssim"',
        description: "Va canviant segons el dia, però sempre cremós i saborós.",
        price: "5.00",
      },
    },
    {
      en: {
        name: "Dip Combo",
        description: "A bit of everything: nachos, some hummus... and a desire to share.",
        price: "11.00",
      },
      es: {
        name: "Combinado de dips",
        description: "Un poco de todo: nachos, algo de hummus... y muchas ganas de compartir.",
        price: "11.00",
      },
      ca: {
        name: "Combinat de dips",
        description: "Una mica de tot: nachos, una mica d'hummus... i moltes ganes de compartir.",
        price: "11.00",
      },
    },
    {
      en: {
        name: "Zucchini Carpaccio",
        description: "Light, fresh and with a dressing that enhances without covering it.",
        price: "6.50",
      },
      es: {
        name: "Carpaccio de calabacín",
        description: "Ligero, fresco y con un aliño que lo realza sin taparlo.",
        price: "6.50",
      },
      ca: {
        name: "Carpaccio de carbassó",
        description: "Lleuger, fresc i amb un amaniment que el realça sense tapar-lo.",
        price: "6.50",
      },
    },
    {
      en: { name: "Cod Carpaccio", description: "Fine, smooth and tasty. An elegant way to start.", price: "11.50" },
      es: {
        name: "Carpaccio de bacalao",
        description: "Fino, suave y sabroso. Una forma elegante de empezar.",
        price: "11.50",
      },
      ca: {
        name: "Carpaccio de bacallà",
        description: "Fi, suau i saborós. Una forma elegant de començar.",
        price: "11.50",
      },
    },
    {
      en: {
        name: "Smoked Sardine",
        description: "Intense and delicate at the same time. For those who know what they're looking for.",
        price: "7.50",
      },
      es: {
        name: "Sardina ahumada",
        description: "Intensa y delicada a la vez. Para quien sabe lo que busca.",
        price: "7.50",
      },
      ca: {
        name: "Sardina fumada",
        description: "Intensa i delicada alhora. Per a qui sap el que busca.",
        price: "7.50",
      },
    },
    {
      en: {
        name: "Anchovies in Vinegar with Sour Apple",
        description: "A brutal contrast: classic with a fresh twist.",
        price: "6.00",
      },
      es: {
        name: "Boquerón en vinagre con cama de manzana ácida",
        description: "Un contraste brutal: clásico con un giro fresco.",
        price: "6.00",
      },
      ca: {
        name: "Seitó en vinagre amb llit de poma àcida",
        description: "Un contrast brutal: clàssic amb un gir fresc.",
        price: "6.00",
      },
    },
    {
      en: {
        name: "Gilda",
        description: "The classic one, with its perfect balance between salty and mild spicy.",
        price: "1.80",
      },
      es: {
        name: "Gilda",
        description: "La de siempre, con su equilibrio perfecto entre salado y picante suave.",
        price: "1.80",
      },
      ca: {
        name: "Gilda",
        description: "La de sempre, amb el seu equilibri perfecte entre salat i picant suau.",
        price: "1.80",
      },
    },
    {
      en: {
        name: "Provolone with Cherry Tomato and Basil",
        description: "Melted, aromatic and with that Mediterranean touch that never fails.",
        price: "7.50",
      },
      es: {
        name: "Provolone con tomate cherry y albahaca",
        description: "Fundido, aromático y con ese toque mediterráneo que nunca falla.",
        price: "7.50",
      },
      ca: {
        name: "Provolone amb tomàquet cherry i alfàbrega",
        description: "Fos, aromàtic i amb aquest toc mediterrani que mai falla.",
        price: "7.50",
      },
    },
  ],
  sandwiches: [
    {
      en: { name: "Clásico", description: "Cooked ham with cheese.\nThe classic one that never fails.", price: "4.00" },
      es: {
        name: "Clásico",
        description: "Jamón cocido con queso.\nEl de toda la vida, simple y que nunca falla.",
        price: "4.00",
      },
      ca: {
        name: "Clàssic",
        description: "Pernil cuit amb formatge.\nEl de tota la vida, simple i que mai falla.",
        price: "4.00",
      },
    },
    {
      en: {
        name: "Balear",
        description: "Mallorcan sobrasada, honey and cheese.\nA sweet-savory mix that's addictively good.",
        price: "4.20",
      },
      es: {
        name: "Balear",
        description: "Sobrasada de Mallorca, miel y queso.\nMezcla dulce-salada que engancha más de lo que debería.",
        price: "4.20",
      },
      ca: {
        name: "Balear",
        description: "Sobrassada de Mallorca, mel i formatge.\nBarreja dolça-salada que enganxa més del que hauria.",
        price: "4.20",
      },
    },
    {
      en: {
        name: "La Alternativa Balear",
        description: "Vegetable sobrasada and vegan cheese.\nSame flavor profile as above, but in veggie version.",
        price: "4.40",
      },
      es: {
        name: "La Alternativa Balear",
        description: "Sobrasada vegetal y queso vegetal.\nMismo rollo que el anterior, pero en versión veggie.",
        price: "4.40",
      },
      ca: {
        name: "L'Alternativa Balear",
        description: "Sobrassada vegetal i formatge vegetal.\nMateix rotllo que l'anterior, però en versió veggie.",
        price: "4.40",
      },
    },
    {
      en: {
        name: "Brie",
        description: "Iberian ham, brie cheese and arugula.\nFor those who want something refined with character.",
        price: "6.60",
      },
      es: {
        name: "Brie",
        description: "Jamón ibérico, queso brie y rúcula.\nPara los que quieren algo fino pero con carácter.",
        price: "6.60",
      },
      ca: {
        name: "Brie",
        description: "Pernil ibèric, formatge brie i ruca.\nPer als que volen alguna cosa fina però amb caràcter.",
        price: "6.60",
      },
    },
    {
      en: {
        name: "La Alternativa",
        description: "Avocado, brie, arugula and pesto.\nFresh, smooth with that pesto touch that elevates everything.",
        price: "6.60",
      },
      es: {
        name: "La Alternativa",
        description: "Aguacate, brie, rúcula y pesto.\nFresco, suave y con ese toque de pesto que lo sube todo.",
        price: "6.60",
      },
      ca: {
        name: "L'Alternativa",
        description: "Alvocat, brie, ruca i pesto.\nFresc, suau i amb aquest toc de pesto que ho puja tot.",
        price: "6.60",
      },
    },
    {
      en: {
        name: "Nórdico",
        description:
          "Smoked salmon, cheese, greens and a touch of mustard.\nVery elegant, ideal if you're looking for something gourmet.",
        price: "7.20",
      },
      es: {
        name: "Nórdico",
        description:
          "Salmón ahumado, queso, hojas verdes y un toque de mostaza.\nMuy elegante, ideal si buscas algo más gourmet.",
        price: "7.20",
      },
      ca: {
        name: "Nòrdic",
        description:
          "Salmó fumat, formatge, fulles verdes i un toc de mostassa.\nMolt elegant, ideal si busques alguna cosa més gourmet.",
        price: "7.20",
      },
    },
    {
      en: {
        name: "Sicilia",
        description:
          "Sicilian mortadella with pistachios, mozzarella, pesto and greens.\nA trip to Italy in every bite.",
        price: "6.50",
      },
      es: {
        name: "Sicilia",
        description:
          "Mortadela siciliana con pistachos, mozzarella, pesto y hojas verdes.\nUn viaje a Italia en cada bocado. Cremoso, sabroso, perfecto.",
        price: "6.50",
      },
      ca: {
        name: "Sicília",
        description:
          "Mortadel·la siciliana amb festucs, mozzarella, pesto i fulles verdes.\nUn viatge a Itàlia en cada mossegada.",
        price: "6.50",
      },
    },
  ],
}

export default function CoffeeMenu() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activePage, setActivePage] = useState<"drinks" | "food">("drinks")
  const [language, setLanguage] = useState<Language>("es")

  // Get current translations
  const t = translations[language]

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 md:p-12 flex flex-col items-center transition-colors duration-300">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-8 md:p-12 transition-colors duration-300">
        <header className="text-center mb-6 md:mb-8 relative">
          {/* Language switcher */}
          <div className="absolute left-0 top-0 flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage("ca")}
              className={cn(
                "text-xs px-1 sm:px-2 h-7 sm:h-8",
                language === "ca" ? "bg-yellow-400/20 text-black dark:text-white" : "",
              )}
            >
              CAT
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage("es")}
              className={cn(
                "text-xs px-1 sm:px-2 h-7 sm:h-8",
                language === "es" ? "bg-yellow-400/20 text-black dark:text-white" : "",
              )}
            >
              ESP
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage("en")}
              className={cn(
                "text-xs px-1 sm:px-2 h-7 sm:h-8",
                language === "en" ? "bg-yellow-400/20 text-black dark:text-white" : "",
              )}
            >
              ENG
            </Button>
          </div>

          {/* Theme toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="absolute right-0 top-0 h-7 w-7 sm:h-9 sm:w-9"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
            ) : (
              <Moon className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
            )}
          </Button>

          {/* Logo based on theme */}
          <div className="pt-8 sm:pt-0 mb-1 sm:mb-2 flex justify-center">
            <img
              src={isDarkMode ? "/images/lalternativa-logo-dark.png" : "/images/lalternativa-logo-light.png"}
              alt="L'Alternativa"
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
          </div>

          <div className="flex items-center justify-center my-4 sm:my-6">
            <div className="h-px w-8 sm:w-12 bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-1 w-6 sm:w-8 mx-2 bg-yellow-400 rounded-full"></div>
            <div className="h-px w-8 sm:w-12 bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 w-full max-w-xs">
            <button
              onClick={() => setActivePage("drinks")}
              className={cn(
                "flex-1 py-2 text-center transition-colors",
                activePage === "drinks"
                  ? "border-b-2 border-yellow-400 text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              {t.drinks}
            </button>
            <button
              onClick={() => setActivePage("food")}
              className={cn(
                "flex-1 py-2 text-center transition-colors",
                activePage === "food"
                  ? "border-b-2 border-yellow-400 text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              {t.food}
            </button>
          </div>
        </div>

        {/* Drinks Page */}
        <div
          className={cn(
            "transition-opacity duration-300",
            activePage === "drinks" ? "opacity-100" : "opacity-0 hidden",
          )}
        >
          {/* Hot Drinks Section */}
          <Collapsible className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h2 className="text-xl sm:text-2xl text-black dark:text-white">{t.hotDrinks}...</h2>
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid gap-4">
                {/* Items without descriptions */}
                {menuItems.hotDrinks.simple.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-2 sm:gap-4 py-2">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-1 text-gray-600 dark:text-gray-400 hidden sm:block">
                        <Coffee size={18} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg text-black dark:text-white">{item[language].name}</h3>
                      </div>
                    </div>
                    <div className="px-2 border-b border-yellow-400 text-black dark:text-white text-sm sm:text-base">
                      €{item[language].price}
                    </div>
                  </div>
                ))}

                {/* Items with descriptions */}
                {menuItems.hotDrinks.withDescription.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={<Coffee size={18} />}
                    name={item[language].name}
                    description={item[language].description}
                    price={item[language].price}
                  />
                ))}

                <div className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">*{t.milkSupplement} - €0.20</div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Cold Drinks Section */}
          <Collapsible className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h2 className="text-xl sm:text-2xl text-black dark:text-white">{t.coldDrinks}...</h2>
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid gap-4">
                {menuItems.coldDrinks.map((item, index) =>
                  item[language].description ? (
                    <MenuItem
                      key={index}
                      icon={<CupSoda size={18} />}
                      name={item[language].name}
                      description={item[language].description}
                      price={item[language].price}
                    />
                  ) : (
                    <div key={index} className="flex items-start justify-between gap-2 sm:gap-4 py-2">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="mt-1 text-gray-600 dark:text-gray-400 hidden sm:block">
                          <CupSoda size={18} />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg text-black dark:text-white">{item[language].name}</h3>
                        </div>
                      </div>
                      <div className="px-2 border-b border-yellow-400 text-black dark:text-white text-sm sm:text-base">
                        €{item[language].price}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Beers Section */}
          <Collapsible className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h2 className="text-xl sm:text-2xl text-black dark:text-white">{t.beers}...</h2>
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid gap-4">
                {menuItems.beers.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-2 sm:gap-4 py-2">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-1 text-gray-600 dark:text-gray-400 hidden sm:block">
                        <CupSoda size={18} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg text-black dark:text-white">{item[language].name}</h3>
                      </div>
                    </div>
                    <div className="px-2 border-b border-yellow-400 text-black dark:text-white text-sm sm:text-base">
                      €{item[language].price}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Craft Beers Section */}
          <Collapsible className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h2 className="text-xl sm:text-2xl text-black dark:text-white">{t.craftBeers}...</h2>
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid gap-4">
                {menuItems.craftBeers.map((beer, index) => {
                  // Check if beer has language-specific properties
                  if (beer[language]) {
                    return (
                      <MenuItem
                        key={index}
                        icon={<CupSoda size={18} />}
                        name={beer[language].name}
                        description={beer[language].description}
                        price={beer[language].price}
                      />
                    )
                  } else {
                    // Handle old format
                    return (
                      <div key={index} className="flex items-start justify-between gap-2 sm:gap-4 py-2">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="mt-1 text-gray-600 dark:text-gray-400 hidden sm:block">
                            <CupSoda size={18} />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg text-black dark:text-white">{beer.name}</h3>
                          </div>
                        </div>
                        <div className="px-2 border-b border-yellow-400 text-black dark:text-white text-sm sm:text-base">
                          €{beer.price}
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Wines & Vermouth Section */}
          <Collapsible className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h2 className="text-xl sm:text-2xl text-black dark:text-white">{t.winesVermouth}...</h2>
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid gap-4">
                {menuItems.wines.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-2 sm:gap-4 py-2">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-1 text-gray-600 dark:text-gray-400 hidden sm:block">
                        <CupSoda size={18} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg text-black dark:text-white">{item[language].name}</h3>
                      </div>
                    </div>
                    <div className="px-2 border-b border-yellow-400 text-black dark:text-white text-sm sm:text-base whitespace-nowrap">
                      {item[language].price.includes("€") ? item[language].price : `€${item[language].price}`}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Food Page */}
        <div
          className={cn("transition-opacity duration-300", activePage === "food" ? "opacity-100" : "opacity-0 hidden")}
        >
          {/* Sección de Torradas */}
          <Collapsible className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h2 className="text-xl sm:text-2xl text-black dark:text-white">{t.toasts}...</h2>
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid gap-4">
                {menuItems.toasts.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={<Sandwich size={18} />}
                    name={item[language].name}
                    description={item[language].description}
                    price={item[language].price}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Sección de Para Picar */}
          <Collapsible className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h2 className="text-xl sm:text-2xl text-black dark:text-white">{t.snacks}...</h2>
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid gap-4">
                {menuItems.snacks.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={<Cake size={18} />}
                    name={item[language].name}
                    description={item[language].description}
                    price={item[language].price}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Sección de Sandwiches */}
          <Collapsible className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <h2 className="text-xl sm:text-2xl text-black dark:text-white">{t.sandwiches}...</h2>
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pb-4">
              <div className="grid gap-4">
                {menuItems.sandwiches.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={<Sandwich size={18} />}
                    name={item[language].name}
                    description={item[language].description}
                    price={item[language].price}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Page Navigation */}
        <div className="flex justify-center mt-8 space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivePage("drinks")}
            disabled={activePage === "drinks"}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t.drinks}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivePage("food")}
            disabled={activePage === "food"}
            className="flex items-center gap-1"
          >
            {t.food}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 sm:mt-12 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-center mb-4 text-gray-700 dark:text-gray-300">{t.allergenInfo}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs text-center">
            <div className="flex flex-col items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fish_icon-icons.com_67594-yoNAGl3gRcAFLzZiEz10Bfs74T8pSj.png"
                alt={t.fish}
                className="h-8 w-8 mb-1"
              />
              <span className="text-gray-600 dark:text-gray-400">{t.fish}</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoLacteos-DairyProducts_icon-icons.com_67597-LVnnK459AB3KZ3W6E27IGvF6onDZNj.png"
                alt={t.milk}
                className="h-8 w-8 mb-1"
              />
              <span className="text-gray-600 dark:text-gray-400">{t.milk}</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoCrustaceo-Crustaceans_icon-icons.com_67603-p6fyMyDupjQjRpGmGlxhTULLDHP58a.png"
                alt={t.crustaceans}
                className="h-8 w-8 mb-1"
              />
              <span className="text-gray-600 dark:text-gray-400">{t.crustaceans}</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoMoluscos-Mollusks_icon-icons.com_67596%20%281%29-TZDNC5AKD6J4BT1m4ROlVJKpCMbOom.png"
                alt={t.mollusks}
                className="h-8 w-8 mb-1"
              />
              <span className="text-gray-600 dark:text-gray-400">{t.mollusks}</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoGranosSesamo-SesameGrains_icon-icons.com_67599-ygNc9SYBTuPwOEG0ymgQGfzIMwBoux.png"
                alt={t.sesame}
                className="h-8 w-8 mb-1"
              />
              <span className="text-gray-600 dark:text-gray-400">{t.sesame}</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoFrutosCascaraPeelFruits_icon-icons.com_67601-OR23rLMLvmU4KtQSZfxytVi0MEFWWr.png"
                alt={t.nuts}
                className="h-8 w-8 mb-1"
              />
              <span className="text-gray-600 dark:text-gray-400">{t.nuts}</span>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 tracking-wider">
          <p>{t.taxIncluded}</p>
        </footer>
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  name: string
  description?: string
  price: string
}

// Update the MenuItem function to include the specific dishes for allergen icons
function MenuItem({ icon, name, description, price }: MenuItemProps) {
  // Dividir la descripción en líneas usando el salto de línea, solo si hay descripción
  const descriptionLines = description ? description.split("\n") : []

  // Check if the item contains milk allergen information
  const hasMilkAllergen =
    (name.toLowerCase().includes("fuet") ||
      name.toLowerCase().includes("queso") ||
      name.toLowerCase().includes("cheese") ||
      name.toLowerCase().includes("formatge") ||
      name.toLowerCase().includes("mantequilla") ||
      name.toLowerCase().includes("butter") ||
      name.toLowerCase().includes("mantega") ||
      name.toLowerCase().includes("nachos") ||
      name.toLowerCase().includes("combinado de dips") ||
      name.toLowerCase().includes("dip combo") ||
      name.toLowerCase().includes("combinat de dips") ||
      name.toLowerCase().includes("carpaccio de ") ||
      name.toLowerCase().includes("combinat de dips") ||
      name.toLowerCase().includes("carpaccio de calabacín") ||
      name.toLowerCase().includes("zucchini carpaccio") ||
      name.toLowerCase().includes("carpaccio de carbassó") ||
      name.toLowerCase().includes("provolone") ||
      name.toLowerCase().includes("clásico") ||
      name.toLowerCase().includes("classic") ||
      name.toLowerCase().includes("clàssic") ||
      name.toLowerCase().includes("balear") ||
      name.toLowerCase().includes("brie") ||
      name.toLowerCase().includes("alternativa") ||
      name.toLowerCase().includes("nórdico") ||
      name.toLowerCase().includes("nordic") ||
      name.toLowerCase().includes("nòrdic") ||
      name.toLowerCase().includes("sicilia") ||
      name.toLowerCase().includes("sicily") ||
      name.toLowerCase().includes("sicília")) &&
    // Exclude "La Alternativa Balear" sandwich
    !name.toLowerCase().includes("alternativa balear") &&
    !name.toLowerCase().includes("l'alternativa balear")

  // Check if the item contains fish allergen information
  const hasFishAllergen =
    name.toLowerCase().includes("atún") ||
    name.toLowerCase().includes("tuna") ||
    name.toLowerCase().includes("tonyina") ||
    name.toLowerCase().includes("berberechos") ||
    name.toLowerCase().includes("cockles") ||
    name.toLowerCase().includes("escopinyes") ||
    name.toLowerCase().includes("carpaccio de bacalao") ||
    name.toLowerCase().includes("cod carpaccio") ||
    name.toLowerCase().includes("carpaccio de bacallà") ||
    name.toLowerCase().includes("sardina ahumada") ||
    name.toLowerCase().includes("smoked sardine") ||
    name.toLowerCase().includes("sardina fumada") ||
    name.toLowerCase().includes("bacalao") ||
    name.toLowerCase().includes("cod") ||
    name.toLowerCase().includes("bacallà") ||
    name.toLowerCase().includes("gilda") ||
    name.toLowerCase().includes("boquerón") ||
    name.toLowerCase().includes("anchovies") ||
    name.toLowerCase().includes("seitó") ||
    name.toLowerCase().includes("nórdico") ||
    name.toLowerCase().includes("nordic") ||
    name.toLowerCase().includes("nòrdic")

  // Check if the item contains sesame allergen information
  const hasSesameAllergen = name.toLowerCase().includes("nachos") || name.toLowerCase().includes("hummus")

  // Check if the item contains crustacean allergen information
  const hasCrustaceanAllergen =
    name.toLowerCase().includes("berberechos") ||
    name.toLowerCase().includes("cockles") ||
    name.toLowerCase().includes("escopinyes")

  // Check if the item contains peanut/legume allergen information
  const hasPeanutAllergen =
    name.toLowerCase().includes("carpaccio de calabacín") ||
    name.toLowerCase().includes("zucchini carpaccio") ||
    name.toLowerCase().includes("carpaccio de carbassó") ||
    name.toLowerCase().includes("alternativa balear") ||
    name.toLowerCase().includes("l'alternativa balear") ||
    name.toLowerCase().includes("sicilia") ||
    name.toLowerCase().includes("sicily") ||
    name.toLowerCase().includes("sicília")

  // Check if the item is specifically "Sardina ahumada" for mollusk allergen
  const hasMolluskAllergen =
    name.toLowerCase().includes("sardina ahumada") ||
    name.toLowerCase().includes("smoked sardine") ||
    name.toLowerCase().includes("sardina fumada")

  return (
    <div className="flex items-start justify-between gap-2 sm:gap-4 py-2">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="mt-1 text-gray-600 dark:text-gray-400 hidden sm:block">{icon}</div>
        <div>
          <h3 className="text-base sm:text-lg text-black dark:text-white flex items-center">
            {name}
            {hasMilkAllergen && (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoLacteos-DairyProducts_icon-icons.com_67597-LVnnK459AB3KZ3W6E27IGvF6onDZNj.png"
                alt="Milk allergen"
                className="ml-2 h-5 w-5 inline-block"
              />
            )}
            {hasFishAllergen && (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fish_icon-icons.com_67594-pOstG2ResLXqVYDjoffpNOcxDpkRWp.png"
                alt="Fish allergen"
                className="ml-2 h-5 w-5 inline-block"
              />
            )}
            {hasSesameAllergen && (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoGranosSesamo-SesameGrains_icon-icons.com_67599-uP3jJ0iiN4AdQE18jGDJ6e023TvSzX.png"
                alt="Sesame allergen"
                className="ml-2 h-5 w-5 inline-block"
              />
            )}
            {hasCrustaceanAllergen && (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoCrustaceo-Crustaceans_icon-icons.com_67603-bgA52S2urN5hbq1wVPuWRIJ86RygGh.png"
                alt="Crustacean allergen"
                className="ml-2 h-5 w-5 inline-block"
              />
            )}
            {hasMolluskAllergen && (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoMoluscos-Mollusks_icon-icons.com_67596-t7RUfBjY0h4VTh37UugJef6BfY57jV.png"
                alt="Mollusk allergen"
                className="ml-2 h-5 w-5 inline-block"
              />
            )}
            {hasPeanutAllergen && (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IconoAlergenoFrutosCascaraPeelFruits_icon-icons.com_67601-jcd6GwpiGGbyhmVxDkBBUUpyZPa6CV.png"
                alt="Peanut/legume allergen"
                className="ml-2 h-5 w-5 inline-block"
              />
            )}
          </h3>
          {description && (
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {descriptionLines.map((line, index) => (
                <p key={index} className={index > 0 ? "mt-1" : ""}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="px-2 border-b border-yellow-400 text-black dark:text-white text-sm sm:text-base whitespace-nowrap">
        €{price}
      </div>
    </div>
  )
}
