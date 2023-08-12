import { createContext, useContext, useState, useEffect } from 'react'
import en from '../../lang/en.json'
import es from '../../lang/es.json'
import { useRouter } from 'next/navigation'

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

  // Logout
  const router = useRouter()
  const logout = () => {
    // Eliminar la información de sesión tanto del estado global como de localStorage
    setSession(null)
    // eslint-disable-next-line no-undef
    localStorage.removeItem('session')
    router.push('/login')
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
      // setEmpresa(session?.oEmpresa[0].razon_social_empresa);
    } else {
      localStorage.removeItem('session')
    }

    // Guardar la empresa seleccionada en localStorage cuando cambie el estado
    if (empresa) {
      localStorage.setItem('selectedEmpresa', empresa)
    } else {
      localStorage.removeItem('selectedEmpresa')
    }
  }, [session, empresa])

  // empresa

  useEffect(() => {
    const storedEmpresa = localStorage.getItem('selectedEmpresa')
    // console.log("empresanelelocal",storedEmpresa);
    if (storedEmpresa) {
      setEmpresa(storedEmpresa)
    } else {
      // Si no hay empresa seleccionada en el localStorage, seleccionar la primera por defecto si existe
      const defaultEmpresa = session?.oEmpresa[0]
      if (defaultEmpresa) {
        setEmpresa(defaultEmpresa)
        localStorage.setItem('selectedEmpresa', defaultEmpresa)
      }
    }
  }, [session])

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
