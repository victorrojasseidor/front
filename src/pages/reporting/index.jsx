import React, { useState, useEffect } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import LimitedParagraph from '@/helpers/limitParagraf'
import Link from 'next/link'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'
import reportMovement from '../../../public/img/report-movement.png'
import reportBalance from '../../../public/img/report-balance.png'
import Image from 'next/image'
import LineChart from '@/Components/Grafics/BarChart'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { fetchConTokenPost } from '@/helpers/fetch'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Loading from '@/Components/Atoms/Loading'
import { format, getDay, addDays, startOfMonth, differenceInDays, parseISO } from 'date-fns'

function index (props) {
  const { session, setModalToken, logout, l } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState()
  const [dataInitialSelect, setInitialDataselect] = useState([])
  const [todaytype, setTodaytype] = useState(null)

  const t = l.Reporting

  useEffect(() => {
    getBalancesInitial()
    GetTipoCambioToday()
  }, [])

  async function getBalancesInitial () {
    setIsLoading(true)
    const body = {
      oResults: {}
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetInitSaldos', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        const dataInit = responseData.oResults
        setInitialDataselect(dataInit)
        setModalToken(false)
        setRequestError(null)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse
          ? responseData.oAuditResponse.sMessage
          : 'Error in sending the form'
        setRequestError(errorMessage)
        setTimeout(() => {
          setRequestError(null)
        }, 2000)
      }
    } catch (error) {
      console.error('error', error)
      setModalToken(true)
      setRequestError(error)
      setTimeout(() => {
        setRequestError(null)
      }, 1000)
    } finally {
      setIsLoading(false) // Ocultar señal de carga
    }
  }

  async function GetTipoCambioToday () {
    const currentDate = new Date()

    //  fecha actual
    const dateToday = format(currentDate, 'dd/MM/yyyy')

    // Obtener la fecha del primero de este mes
    const firstDayOfMonth = startOfMonth(currentDate)

    // Formatear la fecha del primero de este mes en el formato deseado
    const formattedFirstDayOfMonth = format(firstDayOfMonth, 'dd/MM/yyyy')

    setIsLoading(true)
    const body = {
      oResults: {
        sFechaDesde: formattedFirstDayOfMonth,
        sFechaHasta: dateToday,
        iMoneda: 2 // solar
      }
    }

    const tok = session?.sToken
    try {
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetTipoCambioRate', body, tok)
      if (responseData.oAuditResponse.iCode == 1) {
        setRequestError(null)
        const data = responseData.oResults
        const dataOrderTODate = data?.sort((a, b) =>
          b.fecha_tipo_cambio.localeCompare(a.fecha_tipo_cambio)
        )
        setTodaytype(dataOrderTODate[0])
        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const message = responseData?.oAuditResponse.sMessage
        setRequestError(message)
        setModalToken(false)
        setTimeout(() => {
          setRequestError(null)
        }, 1000)
      }
    } catch (error) {
      console.error('Error:', error)
      throw new Error('Hubo un error en la operación asincrónica.')
    } finally {
      setIsLoading(false)
    }
  }

  console.log({ todaytype })

  function formatearFecha (fecha) {
    const fechaParseada = new Date(fecha)
    const dia = fechaParseada.getUTCDate().toString().padStart(2, '0')
    const mes = (fechaParseada.getUTCMonth() + 1).toString().padStart(2, '0')
    const anio = fechaParseada.getUTCFullYear().toString()
    return `${dia}/${mes}/${anio}`
  }

  return (
    <LayoutProducts menu='Reporting'>

      <NavigationPages title={t.Reporting}>

        <Link href='/product'>
          Home
        </Link>

      </NavigationPages>
      <section className='reporting'>
        <div className='reporting-box reporting_dashboard'>

          <div className='report-content'>

            <div className='report red'>

              <div className='report_icon  '>

                <ImageSvg name='Bank' />

              </div>

              <div className='report_data'>

                <article>
                  {t['Total Banks']}

                </article>
                <h2> {dataInitialSelect.oBanco?.length} </h2>
                <p> <ImageSvg name='ArrowUp' />   {t['for the companies']}    </p>
              </div>

            </div>

            <div className='liner' />

            <div className='report green '>

              <div className='report_icon  '>

                <ImageSvg name='Account' />

              </div>

              <div className='report_data'>

                <article>
                  {t['Total Accounts']}

                </article>
                <h2>{dataInitialSelect.oCuenta?.length} </h2>
                <p> <ImageSvg name='ArrowUp' />       {t['for the companies']} </p>
              </div>

            </div>
            <div className='liner' />

            <div className='report  blue'>

              <div className='report_icon  '>

                <ImageSvg name='IconTipo' />

              </div>

              <div className='report_data'>

                <article>
                  {t['Exchange rate']} ({t.Selling})

                </article>
                <h2> {todaytype?.tipo_cambio_venta}
                </h2>
                <p>  <span> {todaytype && formatearFecha(todaytype?.fecha_tipo_cambio)} </span>     PEN  <ImageSvg name='ArrowLeft' />  USD </p>
              </div>

            </div>

          </div>

        </div>

        <div className='reporting_rates'>

          <div className='reporting_rates-exchange'>

            <LineChart />

          </div>

          <div className='reporting_rates-menu'>

            <h3>  {t.Reporting} </h3>

            <div className='menu-list'>

              <div className='box-option'>

                <div className='image'>

                  <Image src={reportBalance} width={500} alt='img-reporting' />

                </div>

                <div>
                  <h4> {t.Balance} </h4>

                  <Link href='/reporting/balance'>
                    {t['View reporting']}
                  </Link>

                </div>

              </div>

              <div className='box-option'>

                <div className='image'>

                  <Image src={reportMovement} width={500} alt='img-reporting' />

                </div>

                <div>
                  <h4> {t.Movement} </h4>

                  <Link href='/reporting/movement'>
                    {t['View reporting']}
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </LayoutProducts>

  )
}

// index.propTypes = {

// }

export default index
