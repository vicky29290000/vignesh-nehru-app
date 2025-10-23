// src/app/auth/signup/layout.tsx
import React from 'react'
import './globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Quad+ Signup</title>
      </head>
      <body className="bg-gray-50">
        <header className="bg-gray-900 text-white p-4">
          <h1 className="text-3xl font-bold">Quad+ Architects</h1>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-900 text-white p-4 text-center">
          <p>&copy; {new Date().getFullYear()} Quad+ Architects. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
