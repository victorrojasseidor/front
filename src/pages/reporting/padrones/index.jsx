import React, { useState } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'
import { useRouter } from 'next/navigation' // Changed from 'next/navigation'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const padrones = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { session, empresa, setModalToken, logout, setEmpresa, l } = useAuth()
  const [page, setPage] = useState(1)
  const t = l.Captcha

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  return (
    <LayoutProducts menu='Reporting'>
      <NavigationPages title={t.Standards}>

        <Link href='/reporting'>
          <ImageSvg name='Dashboard' />
          <p>
            {t.Reporting}

          </p>
        </Link>

        <ImageSvg name='Navegación' />

        <Link href='#'>
          {t.Standards}
        </Link>

      </NavigationPages>
      <section className='captcha'>

        <div className='box-tabs'>

          <div className='tab-content'>

            <div className='tabOne'>

              <div className='contaniner-tables'>

                <div className='box-search'>
                  <div>
                    <h3>  {t['Sunat register repor']}</h3>
                    <p> {t['Results Obtained from Dates']} </p>
                  </div>

                </div>

                <div className='boards'>

                  <div className='tableContainer'>

                    <table className='dataTable'>

                      <thead>
                        <tr>
                          <th>{t.Standards} </th>
                          <th> {t['Update date']}</th>

                        </tr>
                      </thead>

                      <tbody>

                        <tr>
                          <td>Agentes de retención</td>
                          <td>01/01/2024</td>

                        </tr>

                        <tr>
                          <td>Buenos contribuyentes</td>
                          <td>01/01/2024</td>

                        </tr>

                        <tr>
                          <td>Agentes de Percepción de hidrocarburos</td>
                          <td>01/01/2024</td>

                        </tr>

                        <tr>
                          <td>Agentes de Percepción de IGV venta inter na</td>
                          <td>01/01/2024</td>

                        </tr>

                        <tr>
                          <td>Contribuyentes no hallados</td>
                          <td>01/01/2024</td>

                        </tr>

                        <tr>
                          <td>Contribuyentes no habidos</td>
                          <td>01/01/2024</td>

                        </tr>

                        <tr>
                          <td>Lista de entidades exceptuados de la percepción de IGV</td>
                          <td>01/01/2024</td>

                        </tr>

                      </tbody>

                      {/* <div className=' '>

              <p className='errorMessage'>
                {t['Add patterns']}
              </p>

              </div> */}

                    </table>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

    </LayoutProducts>
  )
}

export default padrones
