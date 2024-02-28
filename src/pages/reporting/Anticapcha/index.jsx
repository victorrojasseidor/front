import React, { useState, useEffect } from 'react'
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
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { IconArrow, IconDate } from '@/helpers/report'

const captcha = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { session, empresa, setModalToken, logout, setEmpresa, l } = useAuth()
  const [page, setPage] = useState(1)
  const [selectedCompany, setSelectedCompany] = useState(session?.oEmpresa[0].id_empresa)
  const [dataSumary, setDataSumary] = useState(null)
  const [dataCaptcha, setDataCaptcha] = useState(1)
  const t = l.Captcha

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }
  const handleCompanyChange = (event) => {
    const selectCompanyValue = event.target.value
    setSelectedCompany(selectCompanyValue)
  }

  function sumByKey (data, key) {
    return data.reduce((accumulator, entry) => {
      accumulator += entry[key]
      return accumulator
    }, 0)
  }

  const captchaDataSummary = [
    {
      id_captcha_summary: 101,
      id_empresa: 1,
      fecha_until: '2022-01-01',
      captcha_resolved_until_now: 30,
      captcha_conexion_until_now: 307,
      data_summary: [
        {
          id_data: 201,
          fecha: 'Febrero-2024',
          captcha_resolved: 33
        },
        {
          id_data: 202,
          fecha: 'Enero-2024',
          captcha_resolved: 37
        },
        {
          id_data: 203,
          fecha: 'Diciembre-2023',
          captcha_resolved: 36
        },
        {
          id_data: 204,
          fecha: 'Noviembre-2023',
          captcha_resolved: 32
        },
        {
          id_data: 205,
          fecha: 'Octubre-2023',
          captcha_resolved: 31
        },
        {
          id_data: 28,
          fecha: 'Septiembre-2023',
          captcha_resolved: 36
        }
      ]
    },
    {
      id_captcha_data: 101,
      id_empresa: 2,
      fecha_until: '2022-01-01',
      captcha_resolved_until_now: 33,
      captcha_conexion_until_now: 307,
      data_summary: [
        {
          id_data: 206,
          fecha: 'Febrero-2024',
          captcha_resolved: 53
        },
        {
          id_data: 207,
          fecha: 'Enero-2024',
          captcha_resolved: 359
        },
        {
          id_data: 208,
          fecha: 'Diciembre-2023',
          captcha_resolved: 322
        },
        {
          id_data: 209,
          fecha: 'Noviembre-2023',
          captcha_resolved: 333
        },
        {
          id_data: 210,
          fecha: 'Octubre-2023',
          captcha_resolved: 222
        },
        {
          id_data: 26,
          fecha: 'Septiembre-2023',
          captcha_resolved: 335
        }
      ]
    },
    {
      id_captcha_data: 101,
      id_empresa: 3,
      fecha_until: '2022-01-01',
      captcha_resolved_until_now: 37,
      captcha_conexion_until_now: 307,
      data_summary: [
        {
          id_data: 211,
          fecha: 'Febrero-2024',
          captcha_resolved: 332
        },
        {
          id_data: 212,
          fecha: 'Enero-2024',
          captcha_resolved: 3733
        },
        {
          id_data: 213,
          fecha: 'Diciembre-2023',
          captcha_resolved: 36333
        },
        {
          id_data: 214,
          fecha: 'Noviembre-2023',
          captcha_resolved: 324
        },
        {
          id_data: 215,
          fecha: 'Octubre-2023',
          captcha_resolved: 333
        },
        {
          id_data: 216,
          fecha: 'septiembre-2023',
          captcha_resolved: 3335
        }

      ]
    }
    // Add more captchas for additional companies as needed
  ]

  const captchaData = [
    {
      id_captcha_data: 101,
      id_empresa: 1,
      fecha: '2022-01-01',
      captcha_name: 'ImageCaptcha',
      captcha_resolved: 30,
      captcha_not_resolved: 10,
      captcha_type: 'Text-based',
      ip_address: '192.168.0.1'
    },
    {
      id_captcha_data: 102,
      id_empresa: 1,
      fecha: '2022-01-02',
      captcha_name: 'AudioCaptcha',
      captcha_resolved: 20,
      captcha_not_resolved: 5,
      captcha_type: 'Audio-based',
      ip_address: '192.168.0.1'
    },
    {
      id_captcha_data: 105,
      id_empresa: 1,
      fecha: '2022-01-03',
      captcha_name: 'ImageCaptcha',
      captcha_resolved: 30,
      captcha_not_resolved: 10,
      captcha_type: 'Text-based',
      ip_address: '192.168.0.1'
    },
    {
      id_captcha_data: 105,
      id_empresa: 1,
      fecha: '2022-01-04',
      captcha_name: 'AudioCaptcha',
      captcha_resolved: 20,
      captcha_not_resolved: 5,
      captcha_type: 'Audio-based',
      ip_address: '192.168.0.1'
    },
    {
      id_captcha_data: 201,
      id_empresa: 2,
      fecha: '2022-01-03',
      captcha_name: 'TextCaptcha',
      captcha_resolved: 40,
      captcha_not_resolved: 15,
      captcha_type: 'Text-based',
      ip_address: '192.168.0.2'
    },
    {
      id_captcha_data: 202,
      id_empresa: 2,
      fecha: '2022-01-04',
      captcha_name: 'ImageCaptcha',
      captcha_resolved: 20,
      captcha_not_resolved: 10,
      captcha_type: 'Text-based',
      ip_address: '192.168.0.2'
    }
    // Add more captchas for company 2 as needed
  ]

  function filterDataByIdEmpresa (data, idEmpresa) {
    const datasuma = data.filter(company => company.id_empresa === idEmpresa)
    setDataSumary(datasuma[0])
  }

  useEffect(() => {
    filterDataByIdEmpresa(captchaDataSummary, selectedCompany)
  }, [selectedCompany])

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

                  <div className='box-filter'>

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id='company-label'>{l.Reporting.Company}</InputLabel>
                      <Select
                        labelId='company-label'
                        value={selectedCompany}
                        onChange={handleCompanyChange}
                        IconComponent={IconArrow}
                      >
                        <MenuItem value=''>
                          <em>{l.Reporting['All Companys']}</em>
                        </MenuItem>
                        {session.oEmpresa?.map((comp) => (
                          <MenuItem key={comp.id_empresa} value={comp.id_empresa}>
                            <div> {comp.razon_social_empresa}</div>
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{t['Select a company']}</FormHelperText>
                    </FormControl>
                  </div>

                  {/* <h3>
                    innovativa lab
                  </h3> */}
                  <article>
                    seleciona la empresa
                  </article>

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
                  <h3> {dataSumary?.captcha_resolved_until_now} </h3>

                  <p> <ImageSvg name='ArrowUp' />   {t.To}  {dataSumary?.fecha_until}  </p>

                </div>

              </div>

              <div className='report green '>

                <div className='report_icon  '>

                  <ImageSvg name='IconCaptcha' />

                </div>

                <div className='report_data'>

                  <h3> {dataSumary?.captcha_conexion_until_now} </h3>

                  <article>
                    {t['Resolved Connections']}

                  </article>

                  <p> <ImageSvg name='ArrowUp' />   {t.To}  {dataSumary?.fecha_until}   </p>

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

                      {dataSumary?.data_summary.map((row) => (
                        <tr key={row.id_data}>
                          <td>{row.fecha}</td>
                          <td>{row.captcha_resolved}</td>

                        </tr>
                      ))}

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
                  <h3> {sumByKey(captchaData, 'captcha_resolved')}
                  </h3>

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
                  <h3> {sumByKey(captchaData, 'captcha_not_resolved')} </h3>

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

                            {captchaData?.map((row) => (
                              <tr key={row.id_captcha_data}>
                                <td>{row.fecha}</td>
                                <td>{row.captcha_resolved} </td>
                                <td>{row.captcha_not_resolved}</td>
                                <td>{row.captcha_type}</td>
                                <td>{row.ip_address}</td>
                              </tr>
                            ))}

                          </tbody>

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
                    {/* <div className=' '>

              <p className='errorMessage'>
                {t['Add patterns']}
              </p>

              </div> */}
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div className='grafics'>

                  <CaptchaChart captchaData={captchaData} />

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
