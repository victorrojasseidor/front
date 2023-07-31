// pages/_app.js
import { DataContextProvider } from '@/Context/DataContext'
import Loading from '@/Components/Atoms/Loading'
import { useState, useEffect } from 'react'
import '../../styles/styles.scss'

function MyApp ({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulamos una carga asíncrona (por ejemplo, una petición a una API)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  return (
    <DataContextProvider>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <Component {...pageProps} />
          )}
    </DataContextProvider>
  )
}

export default MyApp
