import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Quad Plus Architects</title>
      </head>
      {/* 👇 Add your custom background class here */}
      <body className={`${inter.className} bg-brand-light text-gray-900`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
