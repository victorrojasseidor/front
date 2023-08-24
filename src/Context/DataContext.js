import { createContext, useContext, useState, useEffect } from 'react'
import en from '../../lang/en.json'
import es from '../../lang/es.json'
import { useRouter } from 'next/navigation'
import { fetchConTokenPost } from '@/helpers/fetch'

const DataContext = createContext()

export const useAuth = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useUserData debe ser utilizado dentro de un DataContextProvider')
  }
  return context
}

export const DataContextProvider = ({ children }) => {
  // data user
  const dataClient = {
    name: 'Agustin',
    years: 27,
    title: 'dataclienttt'
  }

  // State para almacenar los datos del usuario
  const [session, setSession] = useState(null)
  const [empresa, setEmpresa] = useState('')
  const [modalToken, setModalToken] = useState(false)

  // lang
  const locale = 'en'
  const t = locale === 'en' ? en : es
  const router = useRouter()
  // Logout

  async function logout () {
 
    try {
      const token = session.sToken
      const body = {
        oResults: {}
      }
      const response = await fetchConTokenPost('dev/BPasS/??Accion=SalidaUsuario', body, token);
      console.log("response",response);
      if (response.oAuditResponse?.iCode === 1 || response.oAuditResponse?.iCode === 4 || response.oAuditResponse?.iCode === 9) {
        setSession(null)
        localStorage.removeItem('session')
        localStorage.removeItem('selectedEmpresa')
        router.push('/login')
        console.log(" logoutincontext")
      }
    } catch (error) {
      console.error('error en logout del servicio', error)
    }
  }


  useEffect(() => {
    // Restaurar la información de sesión desde localStorage cuando se monte el componente
    // eslint-disable-next-line no-undef
    const storedSession = localStorage.getItem('session')
    if (storedSession) {
      setSession(JSON.parse(storedSession))
    }
  }, [])

  useEffect(() => {
    // Almacenar la información de sesión en localStorage cuando cambie el estado
    if (session) {
      localStorage.setItem('session', JSON.stringify(session))
    } else {
      localStorage.removeItem('session')
    }
  }, [session, empresa])

  return (
    <DataContext.Provider
      value={{
        dataClient,
        locale,
        session,
        setSession,
        logout,
        empresa,
        setEmpresa,
        modalToken,
        setModalToken,

        t
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
