import { createContext, useContext, useState, useEffect } from 'react'
import en from '../../lang/en.json'
import es from '../../lang/es.json'
import { useRouter } from 'next/router'
import { fetchConTokenPost } from '@/helpers/fetch'
import Loading from '@/Components/Atoms/Loading'

const DataContext = createContext()

export const useAuth = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un DataContextProvider')
  }
  return context
}

export const DataContextProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [isMenuLateralOpen, setMenuLateralOpen] = useState(true)
  const [modalToken, setModalToken] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLogout, setIsLogout] = useState(false)
  const [dataProfileStart, setdataProfileStart] = useState(null)
  const [empresa, setEmpresa] = useState(null)
  const [idCountry, setIdCountry] = useState(1)

  const router = useRouter()
  const initialLocale = router.locale || 'es'
  const [locale, setLocale] = useState(initialLocale)
  const [l, setL] = useState(initialLocale === 'es' ? es : en)

  const updateLanguage = (newLocale) => {
    setLocale(newLocale)
    setL(newLocale === 'es' ? es : en)
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('locale', newLocale)
    router.push(newUrl.pathname + newUrl.search, undefined, { locale: newLocale })
  }

  useEffect(() => {
    const newLang = locale === 'es' ? es : en
    setL(newLang)
  }, [locale])

  const logout = async () => {
    setIsLogout(true)
    setIsLoading(true)
    try {
      router.push('/login')
      const token = session.sToken
      const response = await fetchConTokenPost('BPasS/?Accion=SalidaUsuario', { oResults: {} }, token)
      if ([1, 4, 9].includes(response.oAuditResponse?.iCode)) {
        console.log('ejecutaste logout')
        setdataProfileStart(null)
        setSession(null)
        localStorage.removeItem('session')
        localStorage.removeItem('selectedEmpresa')
        setIsLogout(false)
      }
    } catch (error) {
      console.log('error en logout del servicio', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storedSession = localStorage.getItem('session')
    if (storedSession) {
      setSession(JSON.parse(storedSession))
    } else {
      console.log('no hay datos en local')
    }
  }, [])

  useEffect(() => {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session))
    }
  }, [session])

  return (
    <DataContext.Provider
      value={{
        locale,
        dataProfileStart,
        setdataProfileStart,
        session,
        setSession,
        logout,
        modalToken,
        setModalToken,
        empresa,
        setEmpresa,
        l,
        isLogout,
        setIsLogout,
        idCountry,
        setIdCountry,
        isMenuLateralOpen,
        setMenuLateralOpen,
        updateLanguage
      }}
    >
      {children}
      {isLoading && <Loading />}
    </DataContext.Provider>
  )
}
