import React, { useState } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'

const LayouReport = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || 0)
  const { session, empresa, setModalToken, logout, setEmpresa } = useAuth()

  const today = new Date().toISOString().substr(0, 10) // Fecha de hoy en formato YYYY-MM-DD
  const defaultStartDate = '2023-01-01'

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
      <NavigationPages title='Digital employees'>

        <Link href='/reporting'>
          <ImageSvg name='Dashboard' />
          <p>
            Reporting
          </p>
        </Link>

        <ImageSvg name='Navegación' />

        <Link href='#'>
          <span> {defaultTab == 0 ? 'Balance' : 'Movement'}</span>
        </Link>

      </NavigationPages>
      <section className='layoutReporting'>

        <div className='layoutReporting-company'>
          <h5>
            {session?.jCompany.razon_social_company}
          </h5>
          <p> Updated balances and movement as of
            <span>
              {obtenerFechaAnterior()}
            </span>
          </p>
        </div>

        <div className='horizontalTabs'>
          <div className='tab-header '>
            <Link href='/reporting/balance'>
              <button className={activeTab === 0 ? 'active ' : ''} onClick={() => handleTabClick(0)}>
                {/* <h4>Free Trial</h4> */}

                <h4>Balance</h4>

              </button>
            </Link>

            <Link
              href='/reporting/movement'
            >
              <button

                className={activeTab === 1 ? 'active ' : ''} onClick={() => handleTabClick(1)}
              >
                <h4> Movement</h4>
              </button>
            </Link>

          </div>
          <div className='tab-content'>
            {activeTab === 0 && (
              <div className='tabOne'>
                {defaultTab == 0 && children}
              </div>
            )}
            {activeTab === 1 && (
              <div>

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
