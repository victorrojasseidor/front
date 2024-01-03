import React, { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { fetchConTokenPost } from '@/helpers/fetch'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { styled } from '@mui/system'
import { outlinedInputClasses, selectClasses } from '@mui/material'
import LoadingComponent from '../Atoms/LoadingComponent'
import { useAuth } from '@/Context/DataContext'
import ImageSvg from '@/helpers/ImageSVG'
import { IconArrow } from '@/helpers/report'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function generateRandomData () {
  const min = 0.9
  const max = 1.4

  return Array.from({ length: 31 }, () => Math.random() * (max - min) + min)
}

const currentYear = new Date().getFullYear()

const typeOfChangeData = generateDataForYears(2022, currentYear)

function generateDataForYears (startYear, endYear) {
  const data = {}
  for (let year = startYear; year <= endYear; year++) {
    data[year] = {}
    for (let month = 1; month <= 12; month++) {
      const monthName = dayjs().month(month - 1).format('MMMM')
      data[year][monthName] = generateRandomData()
    }
  }
  return data
}

const typeOfCurrency = [
  {
    id: 'usd',
    name: 'Dólar estadounidense',
    symbol: 'USD'
  },
  {
    id: 'eur',
    name: 'Euro',
    symbol: 'EUR'
  },
  {
    id: 'jpy',
    name: 'Yen japonés',
    symbol: 'JPY'
  },
  {
    id: 'gbp',
    name: 'Libra esterlina',
    symbol: 'GBP'
  },
  {
    id: 'cny',
    name: 'Yuan chino',
    symbol: 'CNY'
  }
  // Puedes agregar más monedas según tus necesidades
]

const misoptions = {
  responsive: true,
  animation: true,
  maintainAspectRatio: true,
  height: 400,
  plugins: {
    legend: {
      display: true
    },
    filler: {
      propagate: true
    }
  },
  scales: {
    y: {
      min: 0,
      max: 2,
      stepSize: 0.5,
      grid: {
        display: false
      }
    },
    x: {
      min: 1,
      stepSize: 2,
      type: 'linear',
      position: 'bottom',
      ticks: { color: '#4F4F4F' },
      grid: {
        display: false
      }
    }
  }
}

export default function LineChart () {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // Suma 1 porque los meses en JavaScript van de 0 a 11

  const [selectedMonth, setSelectedMonth] = useState(currentMonth - 1)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [dates, setDates] = useState({})
  const [selectedCurrency, setSelectedCurrency] = useState('usd')
  const [requestError, setRequestError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { session, setModalToken, logout, l } = useAuth()

  const t = l.Reporting

  useEffect(() => {
    // Lógica para obtener las fechas iniciales
    const initialMonth = currentMonth - 1
    const initialYear = currentYear
    const initialDates = getMonthDates(initialYear, initialMonth)

    // Actualizar el estado dates con las fechas iniciales
    setDates(initialDates)

    if (dates) {
      GetTipoCambioRate()
    }

    // Puedes realizar otras operaciones de inicialización aquí si es necesario
  }, [selectedMonth, selectedYear, selectedCurrency])

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value)
  }

  const getMonthDates = (year, monthIndex) => {
    const startDate = dayjs(`${year}-${monthIndex + 1}-01`).format('DD/MM/YYYY') // Suma 1 para ajustarse a los índices de los meses
    const endDate = dayjs(`${year}-${monthIndex + 1}-${dayjs(`${year}-${monthIndex + 1}`).daysInMonth()}`).format('DD/MM/YYYY')
    return { sFechaDesde: startDate, sFechaHasta: endDate }
  }

  // Función para manejar el cambio de mes
  const handleMonthChange = (event) => {
    const newMonth = event.target.value
    const newDates = getMonthDates(selectedYear, newMonth)
    setSelectedMonth(newMonth)
    setDates(newDates)
  }
  console.log({ dates })
  // Función para manejar el cambio de año
  const handleYearChange = (event) => {
    const newYear = event.target.value
    const newDates = getMonthDates(newYear, selectedMonth)
    setSelectedYear(newYear)
    setDates(newDates)
  }

  async function GetExchangeRate () {
    setIsLoading(true)

    const body = {
      oResults: {
        sFechaDesde: dates?.sFechaDesde,
        sFechaHasta: dates?.sFechaHasta,
        oIdEmpresa: [5]
      }
    }

    const tok = session?.sToken

    try {
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetExchangeRate', body, tok)
      console.log('ResponseGetEXchangeRate', responseData)
      if (responseData.oAuditResponse.iCode == 1) {
        setRequestError(null)
        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const message = responseData?.oAuditResponse.sMessage
        setRequestError(message)
        setModalToken(false)
      }
    } catch (error) {
      console.error('Error:', error)
      throw new Error('Hubo un error en la operación asincrónica.')
    } finally {
      setIsLoading(false)
    }
  }

  async function GetTipoCambioRate () {
    setIsLoading(true)

    const body = {
      oResults: {
        sFechaDesde: dates?.sFechaDesde,
        sFechaHasta: dates?.sFechaHasta,
        iMoneda: 1
      }
    }

    const tok = session?.sToken
    console.log({ body })
    try {
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetTipoCambioRate', body, tok)
      console.log('ResponseGetTipoCambioRate', responseData)
      if (responseData.oAuditResponse.iCode == 1) {
        setRequestError(null)
        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const message = responseData?.oAuditResponse.sMessage
        setRequestError(message)
        setModalToken(false)
      }
    } catch (error) {
      console.error('Error:', error)
      throw new Error('Hubo un error en la operación asincrónica.')
    } finally {
      setIsLoading(false)
    }
  }

  // lógica para la gráfica
  const maxDaysToShow = 30
  const daysToShow = Array.from({ length: maxDaysToShow }, (_, i) => i + 1)

  const dataToShow = typeOfChangeData[selectedYear]?.[selectedMonth]?.slice(0, maxDaysToShow) || []

  // Resaltar el día 10 con un color diferente
  const highlightedColor = '#5DB92C'
  const borderColor = daysToShow.map((day) => (day === 10 ? highlightedColor : '#5932EA'))

  const midata = {
    labels: daysToShow,
    datasets: [
      {
        label: 'Type of change',
        data: dataToShow,
        tension: 0.5,
        fill: 'start',
        borderColor,
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height)
          gradient.addColorStop(0, 'rgba(89, 50, 234, 0.2)') // Color inicial
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)') // Color final con opacidad cero
          return gradient
        },
        pointBackgroundColor: '#5932EA',
        pointBorderColor: '#5932EA',
        pointRadius: 2,
        pointHoverRadius: 5
      }
    ]
  }

  const currentYearMonths = Number(currentYear) == Number(selectedYear) ? months.slice(0, currentMonth) : months

  // Array de años (desde 2022 hasta el año actual)
  const years = Array.from({ length: currentYear - 2021 }, (_, index) => (2022 + index).toString())

  return (

    <div>

      <div className='rates-description'>

        <div className='rates-title'>
          <h3>
            {t['Exchange rate']}
          </h3>
          <p>
            {t['Result obtained according to the SBS']}
          </p>

          <p className='country-svg'>

            <span>
              <ImageSvg name='IconTipo' />
              {t['Currency origin']}: PEN (soles)

            </span>

            <span>
              <ImageSvg name='Report' />
              Perú
            </span>

          </p>
        </div>

        <div className='box-filter'>

          <FormControl sx={{
            m: 1,
            minWidth: 100

          }}
          >
            <InputLabel id='account-label'>{t.Year}</InputLabel>
            <Select
              labelId='account-label'
              value={selectedYear}
              onChange={handleYearChange}
              IconComponent={IconArrow}
            >

              {/* <MenuItem value=''>
                <em>{t['All Accounts']}</em>
              </MenuItem> */}
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  <div> {year} </div>
                </MenuItem>
              ))}

            </Select>

          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id='account-label'>{t.Month}</InputLabel>
            <Select
              labelId='account-label'
              value={selectedMonth}
              onChange={handleMonthChange}
              IconComponent={IconArrow}

            >

              {
currentYearMonths?.map((month, index) => (
  <MenuItem key={month} value={index}>
    {month}
  </MenuItem>))
              }

            </Select>

          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id='currencySelect'>{t['From PEN to']}</InputLabel>
            <Select
              labelId='currencySelect'
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              IconComponent={IconArrow}
            >

              {typeOfCurrency.map((coin) => (
                <MenuItem key={coin.id} value={coin.id}>
                  <div> {coin.symbol} </div>
                </MenuItem>
              ))}

            </Select>

          </FormControl>
        </div>

      </div>

      <div className='grafics' style={{ overflowX: 'auto' }}>
        {isLoading && <LoadingComponent />}
        <Line data={midata} options={misoptions} />
      </div>

      {requestError && <div className='errorMessage'> {requestError}</div>}

    </div>

  )
}
