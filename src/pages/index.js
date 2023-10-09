'use client'
import Register from '@/pages/register'
import Head from 'next/head'

export default function Home () {
  return (

    <div>
      <Head>
        <title>ARI</title>
        <meta name='description' content='Ari Seidor' />
        {/* Agrega aquí otros elementos del head, como enlaces a hojas de estilo, fuentes, etc. */}
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
          rel='stylesheet'
        />

      </Head>
      <main>

        <Register />

      </main>

    </div>
  )
}
