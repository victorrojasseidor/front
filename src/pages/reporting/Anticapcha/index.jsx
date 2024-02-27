import React, { useState } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import CaptchaChart from '@/Components/Grafics/CaptchaChart'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'
import { useRouter } from 'next/navigation' // Changed from 'next/navigation'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const captcha = () => {
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
      <NavigationPages title={t.Anticapcha}>

        <Link href='/reporting'>
          <ImageSvg name='Dashboard' />
          <p>
            {t.Reporting}
          </p>
        </Link>

        <ImageSvg name='Navegación' />

        <Link href='#'>
          {t.Anticapcha}
        </Link>

      </NavigationPages>
      <section className='captcha'>

        <div className='captcha-summary'>

          <div className='reporting-box'>
            <div className='report-content'>
              <div className='report  blue'>

                <div className='report_icon  '>

                  <ImageSvg name='Profile' />

                </div>

                <div className='report_data'>

                  <article>
                    empresa
                  </article>
                  <h3>
                    innovativa lab
                  </h3>

                  <p> <ImageSvg name='ArrowDown' />   {t.To} 20/02/2024   </p>

                  <div>
                    seleccionar las empresas
                  </div>

                </div>

              </div>

            </div>

            <div className='report-content'>

              <div className='report red'>

                <div className='report_icon  '>

                  <ImageSvg name='IconCaptcha' />

                </div>

                <div className='report_data'>

                  <article>
                    {t['Captcha solved']}

                  </article>
                  <h3> 1114 </h3>

                  <p> <ImageSvg name='ArrowUp' />   {t.To} 20/02/2024   </p>

                </div>

              </div>

              <div className='report green '>

                <div className='report_icon  '>

                  <ImageSvg name='IconCaptcha' />

                </div>

                <div className='report_data'>

                  <h3> 4366 </h3>

                  <article>
                    {t['Resolved Connections']}

                  </article>

                  <p> <ImageSvg name='ArrowUp' />   {t.To}  20/02/2024   </p>

                </div>

              </div>

            </div>

          </div>

          <div className='report-months'>

            <div className='contaniner-tables'>

              <div className='box-search'>
                <div>
                  <h3> {t['Last Months']}  </h3>
                  <p> {t['Results of the Last 5 Months']} </p>
                </div>

              </div>

              <div className='boards'>
                <div className='tableContainer'>

                  <table className='dataTable'>

                    <thead>
                      <tr>
                        <th>{t.Date} </th>
                        <th> {t['Number of Captchas Resolved']}</th>

                      </tr>
                    </thead>

                    <tbody>

                      {/* {dataPadrones?.oPadrones?.map((row) => (
                          <tr key={row.id_principal}>
                            <td>{row.desc_documento}</td>
                            <td>{row.id_pais == 1 ? 'Perú' : row.id_pais} </td>

                          </tr>
                        ))} */}
                      <tr>
                        <td>septiembre 2021</td>
                        <td>237021</td>

                      </tr>

                      <tr>
                        <td>septiembre 2021</td>
                        <td>237021</td>

                      </tr>
                      <tr>
                        <td>septiembre 2021</td>
                        <td>237021</td>

                      </tr>
                      <tr>
                        <td>septiembre 2021</td>
                        <td>237021</td>

                      </tr>
                      <tr>
                        <td>septiembre 2021</td>
                        <td>237021</td>

                      </tr>
                      <tr>
                        <td>septiembre 2021</td>
                        <td>237021</td>

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

        <div className='captcha-filters'>

          <h3> {t['Filter Statistics']}  </h3>
          <p> {t['Filter the Desired Reports and Graphs, and if you want to see the complete information, use the export option.']} </p>
          <div class='box-filters'>

            <button className='btn_filter active'>

              {t.Last}  12 {t.Months}

            </button>

            <button className='btn_filter '>

              {t.Last}  6 {t.Months}

            </button>

            <button className='btn_filter '>

              {t.Last}  30 {t.Days}

            </button>

            <button className='btn_filter '>

              {t.Last}  7 {t.Days}
            </button>

            <button className='btn_filter'>

              {t['Other Dates']}

              <ImageSvg name='Time' />

            </button>

          </div>
        </div>

        <div className='box-tabs'>
          <div className='reporting-box'>

            <div className='report-content'>

              <div className='report blue'>

                <div className='report_icon  '>

                  <ImageSvg name='IconCaptcha' />

                </div>

                <div className='report_data'>

                  <article>
                    {t['Captcha solved']}

                  </article>
                  <h3> 1114 </h3>

                </div>

              </div>

              <div className='report blue '>

                <div className='report_icon  '>

                  <ImageSvg name='IconCaptcha' />

                </div>

                <div className='report_data'>

                  <article>
                    {t['Resolved Connections']}
                  </article>
                  <h3> 4366 </h3>

                </div>

              </div>

            </div>

          </div>

          <div className='horizontalTabs'>
            <div className='tab-header'>

              <Link
                href='#'
              >
                <button
                  className={activeTab === 0 ? 'active' : ''}
                  onClick={() => handleTabClick(0)}
                >
                  <h4> {t.Reports}</h4>
                </button>
              </Link>

              <Link
                href='#'
              >
                <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}>
                  <h4> {t.Graphs}</h4>

                </button>
              </Link>

            </div>
            <div className='tab-content'>
              {activeTab === 0 && (
                <div className='tabOne'>

                  <div className='contaniner-tables'>

                    <div className='box-search'>
                      <div>
                        <h3> {t['2Captcha Report']}  </h3>
                        <p> {t['Results Obtained from Dates']} </p>
                      </div>

                      <div>

                        <button className='btn_black ' onClick={() => console.log('export')}>
                          <ImageSvg name='Download' /> {t.Export}
                        </button>
                      </div>

                    </div>

                    <div className='boards'>
                      <div className='tableContainer'>

                        <table className='dataTable'>

                          <thead>
                            <tr>
                              <th>{t.Date} </th>
                              <th> {t.Resolved}</th>
                              <th> {t['Not Resolved']}</th>
                              <th> {t['Captcha Type']}</th>
                              <th> {t['IP Address']}</th>

                            </tr>
                          </thead>

                          <tbody>

                            {/* {dataPadrones?.oPadrones?.map((row) => (
            <tr key={row.id_principal}>
              <td>{row.desc_documento}</td>
              <td>{row.id_pais == 1 ? 'Perú' : row.id_pais} </td>

            </tr>
          ))} */}
                            <tr>
                              <td>01/01/2024</td>
                              <td>1251</td>
                              <td>0</td>
                              <td>normal</td>
                              <td>1251 6383883 83993</td>
                            </tr>

                            <tr>
                              <td>01/01/2024</td>
                              <td>1251</td>
                              <td>0</td>
                              <td>normal</td>
                              <td>1251 6383883 83993</td>
                            </tr>

                            <tr>
                              <td>01/01/2024</td>
                              <td>1251</td>
                              <td>0</td>
                              <td>normal</td>
                              <td>1251 6383883 83993</td>
                            </tr>

                          </tbody>

                          {/* <div className=' '>

              <p className='errorMessage'>
                {t['Add patterns']}
              </p>

              </div> */}

                        </table>

                      </div>

                      <Stack spacing={2}>
                        <div className='pagination'>

                          <Typography>
                            {t.Page} {page} {t.of} 10
                            {/* {Math.ceil(balances.oSaldos.length / itemsPerPage) */}

                          </Typography>
                          <Pagination
                  // count={Math.ceil(balances.oSaldos.length / itemsPerPage)} // Calculate the total number of pages
                            count={10}
                            page={page}
                            onChange={handleChangePage}
                          />
                        </div>
                      </Stack>

                    </div>

                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div className='grafics'>

                  <CaptchaChart />

                </div>
              )}

            </div>
          </div>

        </div>

      </section>

    </LayoutProducts>
  )
}

export default captcha
