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
    throw new Error('useUserData debe ser utilizado dentro de un DataContextProvider')
  }
  return context
}

export const DataContextProvider = ({ children }) => {
  // State para almacenar los datos del usuario
  const [session, setSession] = useState(null)
  const [modalToken, setModalToken] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLogout, setIsLogout] = useState(false)
  const [dataProfileStart, setdataProfileStart] = useState(null)
  const [empresa, setEmpresa] = useState(null)
  const [idCountry, setIdCountry] = useState(1)

  const router = useRouter()
  const { locale } = router
  const l = locale === 'en' ? en : es

  // Función para manejar el cierre de sesión
  async function logout () {
    setIsLogout(true)
    setIsLoading(true)
    try {
      router.push('/login')
      const token = session.sToken
      const body = {
        oResults: {}
      }

      const response = await fetchConTokenPost('BPasS/?Accion=SalidaUsuario', body, token)

      if (
        response.oAuditResponse?.iCode === 1 ||
        response.oAuditResponse?.iCode === 4 ||
        response.oAuditResponse?.iCode === 9
      ) {
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
      setIsLoading(false) // Ocultar el indicador de carga después de que la petición se complete
    }
  }

  // UseEffect para cargar la sesión desde el almacenamiento local al montar el componente
  useEffect(() => {
    const storedSession = localStorage.getItem('session')
    if (storedSession) {
      setSession(JSON.parse(storedSession))
    } else {
      console.log('no hay datos en local')
    }
  }, [])

  useEffect(() => {
    // Clear existing session data
    localStorage.removeItem('session')

    // Store new session data
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
        setIdCountry

      }}
    >
      {children}
      {isLoading && <Loading />}
    </DataContext.Provider>
  )
}
