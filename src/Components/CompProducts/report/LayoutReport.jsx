import React, { useState } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'
import { useRouter } from 'next/navigation' // Changed from 'next/navigation'

const LayouReport = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || 0)
  const { session, empresa, setModalToken, logout, setEmpresa, l } = useAuth()

  const today = new Date().toISOString().substr(0, 10) // Fecha de hoy en formato YYYY-MM-DD
  const defaultStartDate = '2023-01-01'
  const router = useRouter()
  const t = l.Reporting
  function obtenerFechaAnterior () {
    // Obtén la fecha actual
    const fechaActual = new Date()

    // Resta un día (86400000 milisegundos) a la fecha actual
    const fechaAnterior = new Date(fechaActual - 86400000)

    // Formatea la fecha en el formato deseado (por ejemplo, DD/MM/AAAA)
    const dia = fechaAnterior.getDate()
    const mes = fechaAnterior.getMonth() + 1 // Los meses comienzan en 0, por lo que debes sumar 1
    const anio = fechaAnterior.getFullYear()

    // Asegúrate de agregar ceros a la izquierda para que tenga siempre dos dígitos
    const fechaAnteriorFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`

    return fechaAnteriorFormateada
  }

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  return (
    <LayoutProducts menu='Reporting'>
      <NavigationPages title={defaultTab == 0 ? t.Balance : t.Movement}>

        <Link href='/reporting'>
          <ImageSvg name='Dashboard' />
          <p>
            {t.Reporting}
          </p>
        </Link>

        <ImageSvg name='Navegación' />

        <Link href='#'>
          <span> {defaultTab == 0 ? t.Balance : t.Movement}</span>
        </Link>

      </NavigationPages>
      <section className='layoutReporting'>

        {/* <div className='layoutReporting-company'>
          <h5>
            {session?.jCompany.razon_social_company}
          </h5>
          <p> {t['Updated balances and movement as of']}
            <span>
              {obtenerFechaAnterior()}
            </span>
          </p>
        </div> */}

        <div className='horizontalTabs'>
          <div className='tab-header '>

            <button className={activeTab === 0 ? 'active ' : ''} onClick={() => { handleTabClick(0); router.push('/reporting/balance') }}>

              <h4>{t.Balance}</h4>

            </button>

            <button

              className={activeTab === 1 ? 'active ' : ''} onClick={() => { handleTabClick(1); router.push('/reporting/movement') }}
            >
              <h4> {t.Movement}</h4>
            </button>

          </div>
          <div className='tab-content'>
            {activeTab === 0 && (
              <div className='tabOne'>
                {defaultTab == 0 && children}
              </div>
            )}
            {activeTab === 1 && (
              <div className='tabOne'>

                {defaultTab == 1 && children}

              </div>
            )}

          </div>
        </div>

      </section>

    </LayoutProducts>
  )
}

export default LayouReport
