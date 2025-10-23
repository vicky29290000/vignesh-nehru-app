import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Awesome App</title>
        {/* You can add other global meta tags here */}
      </head>
      <body className="bg-gray-50 text-gray-800">
        <header className="bg-white shadow-md p-4">
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="font-semibold text-indigo-600 hover:text-indigo-800">Home</a></li>
              <li><a href="/about" className="font-semibold text-indigo-600 hover:text-indigo-800">About</a></li>
              <li><a href="/contact" className="font-semibold text-indigo-600 hover:text-indigo-800">Contact</a></li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-800 text-white py-6">
          <div className="text-center">
            <p>&copy; 2025 My Awesome App. All rights reserved.</p>
            <p>
              <a href="/privacy" className="text-indigo-400 hover:text-indigo-600">Privacy Policy</a> | 
              <a href="/terms" className="text-indigo-400 hover:text-indigo-600"> Terms of Service</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
