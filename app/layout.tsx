import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Noto_Sans_Arabic } from "next/font/google"

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  title: "منصة كيورا الطبية - تقييم اضطرابات النوم",
  description: "منصة طبية متخصصة لتقييم انقطاع التنفس أثناء النوم بالشراكة مع Air Liquide Healthcare",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${notoSansArabic.variable} antialiased`}>
      <body className="font-arabic">{children}</body>
    </html>
  )
}
