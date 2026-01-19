import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Technical blog by Slaven Sakačić',
}

export default function HomePage() {
  return (
    <main className="container-custom py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-display font-bold mb-6">
          Slav.hr Blog
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Technical blog covering web development, JavaScript, and more.
        </p>
        <p className="text-gray-500">
          Blog is being set up. Visit <a href="/admin" className="text-blue-600 hover:underline">/admin</a> to get started.
        </p>
      </div>
    </main>
  )
}
