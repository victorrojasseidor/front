import React, { useState } from 'react'
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
import { useAuth } from '@/Context/DataContext'
import ImageSvg from '@/helpers/ImageSVG'
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

const typeOfChangeData = {
  2021: {
    Enero: generateRandomData(),
    Febrero: generateRandomData(),
    Marzo: generateRandomData(),
    Abril: generateRandomData(),
    Mayo: generateRandomData(),
    Junio: generateRandomData(),
    Julio: generateRandomData(),
    Agosto: generateRandomData(),
    Septiembre: generateRandomData(),
    Octubre: generateRandomData(),
    Noviembre: generateRandomData(),
    Diciembre: generateRandomData()
  },
  2022: {
    Enero: generateRandomData(),
    Febrero: generateRandomData(),
    Marzo: generateRandomData(),
    Abril: generateRandomData(),
    Mayo: generateRandomData(),
    Junio: generateRandomData(),
    Julio: generateRandomData(),
    Agosto: generateRandomData(),
    Septiembre: generateRandomData(),
    Octubre: generateRandomData(),
    Noviembre: generateRandomData(),
    Diciembre: generateRandomData()
  },
  2023: {
    Enero: generateRandomData(),
    Febrero: generateRandomData(),
    Marzo: generateRandomData(),
    Abril: generateRandomData(),
    Mayo: generateRandomData(),
    Junio: generateRandomData(),
    Julio: generateRandomData(),
    Agosto: generateRandomData(),
    Septiembre: generateRandomData(),
    Octubre: generateRandomData(),
    Noviembre: generateRandomData(),
    Diciembre: generateRandomData()
  }
  // ... puedes seguir añadiendo más años
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
  const [selectedMonth, setSelectedMonth] = useState('Enero')
  const [selectedYear, setSelectedYear] = useState('2022')
  const [selectedCurrency, setSelectedCurrency] = useState('usd')

  const { session, l } = useAuth()

  const t = l.Reporting

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
  }

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value)
  }

  const maxDaysToShow = 30
  const daysToShow = Array.from({ length: maxDaysToShow }, (_, i) => i + 1)

  const dataToShow = typeOfChangeData[selectedYear][selectedMonth].slice(0, maxDaysToShow)

  // Resaltar el día 10 con un color diferente
  const highlightedColor = '#5DB92C'
  const borderColor = daysToShow.map((day) => (day === 10 ? highlightedColor : '#5932EA'))

  console.log({ daysToShow })

  console.log({ dataToShow })

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

  // Array de años (puedes ajustar el rango según tus necesidades)
  const years = Array.from({ length: 3 }, (_, index) => (new Date().getFullYear() - index).toString())

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

            >

              {/* <MenuItem value=''>
                <em>{t['All Accounts']}</em>
              </MenuItem> */}

              <MenuItem key='enero' value='Enero'>
                Enero
              </MenuItem>

              <MenuItem key='enero' value='Febrero'>
                Febrero
              </MenuItem>
              <MenuItem key='Marzo' value='Marzo'>
                Marzo
              </MenuItem>

            </Select>

          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id='currencySelect'>{t['From PEN to']}</InputLabel>
            <Select
              labelId='currencySelect'
              value={selectedCurrency}
              onChange={handleCurrencyChange}
            >

              {/* <MenuItem value=''>
                <em>USD</em>
              </MenuItem> */}
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
        <Line data={midata} options={misoptions} />
      </div>

    </div>

  )
}
