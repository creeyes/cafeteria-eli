"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Coffee, CupSoda, Sandwich, Cake, Sun, Moon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import menuItems from "@/data/menu.json"

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
