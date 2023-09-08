// pages/_app.js
import { DataContextProvider } from '@/Context/DataContext'
import Loading from '@/Components/Atoms/Loading'
import { useState, useEffect } from 'react'
import '../../styles/styles.scss'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../../theme.js'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function MyApp ({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulamos una carga asíncrona (por ejemplo, una petición a una API)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}> 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataContextProvider>
        {isLoading
          ? (
            <Loading />
            )
          : (
            <Component {...pageProps} />
            )}
      </DataContextProvider>
    </ThemeProvider>
    </LocalizationProvider>
  )
}

export default MyApp
