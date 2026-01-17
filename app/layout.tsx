import type React from "react"
import "./globals.css"
import { Quicksand, Caveat } from "next/font/google"

// Load Quicksand font for body text - friendly, rounded, less serious
const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "300", "500"],
  variable: "--font-quicksand",
})

// Load Caveat font for headings - handwritten style that's not fully connected
const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-caveat",
})

export const metadata = {
  title: "Café Noir Menu",
  description: "A minimalist coffee shop menu",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${quicksand.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
