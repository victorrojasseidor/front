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
  const [dataProfileStart, setdataProfileStart] = useState(null)

  // lang

  const router = useRouter()
  const { locale } = router
  const l = locale === 'en' ? en : es

  // Función para manejar el cierre de sesión
  async function logout () {
    setIsLoading(true)
    try {
      const token = session.sToken
      const body = {
        oResults: {}
      }
      const response = await fetchConTokenPost('dev/BPasS/??Accion=SalidaUsuario', body, token)
      if (
        response.oAuditResponse?.iCode === 1 ||
        response.oAuditResponse?.iCode === 4 ||
        response.oAuditResponse?.iCode === 9
      ) {
        router.push('/login')
        setdataProfileStart(null)
        localStorage.removeItem('session')
        localStorage.removeItem('selectedEmpresa')
        setSession(null)
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
    }
  }, [])

  // UseEffect para guardar la sesión en el almacenamiento local cuando cambie
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
        l

      }}
    >
      {children}
      {isLoading && <Loading />}
    </DataContext.Provider>
  )
}
