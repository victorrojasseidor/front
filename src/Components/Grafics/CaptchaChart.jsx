import React, { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { fetchConTokenPost } from '@/helpers/fetch'
import dayjs from 'dayjs'

import LoadingComponent from '../Atoms/LoadingComponent'
import { useAuth } from '@/Context/DataContext'
import ImageSvg from '@/helpers/ImageSVG'
import { IconArrow } from '@/helpers/report'
import { Line } from 'react-chartjs-2'

import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function CaptchaChart ({ captchaData, exportToExcel }) {
  const { session, setModalToken, logout, l } = useAuth()

  const currentDay = new Date().getDate()
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // Suma 1 porque los meses en JavaScript van de 0 a 11

  const [selectedMonth, setSelectedMonth] = useState(currentMonth - 1)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [dates, setDates] = useState({})
  const [selectedCurrency, setSelectedCurrency] = useState(2)
  const [dataType, setDataType] = useState(null)
  const [requestError, setRequestError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const t = l.Captcha

  const dataOrderTODate = captchaData?.sort((a, b) =>
    a.fecha.localeCompare(b.fecha)
  )

  const dataTypeTranform = dataOrderTODate?.map((entry, i, array) => {
    const dateType = new Date(entry.fecha).getUTCDate()
    const captcharesolved = entry.captcha_resolved

    return { fecha: dateType, captcha_resolved: captcharesolved }
  })

  // trasnsformarDatos para la gráfica
  const dataResolved = dataTypeTranform?.map(entry => entry.captcha_resolved)

  const dataFecha = dataTypeTranform?.map(entry => entry.fecha)

  const valorMinimoResolved = dataResolved && Math.min(...dataResolved)
  const valorMaximoResolved = dataResolved && Math?.max(...dataResolved)

  const valorMinimoFecha = dataFecha && Math.min(...dataFecha)
  const valorMaximoFecha = dataFecha && Math.max(...dataFecha)

  const minDateX = valorMinimoFecha - (valorMinimoFecha * 0.001)
  const maxDateX = valorMaximoFecha + (1)

  const minDateY = valorMinimoResolved - (valorMinimoResolved * 0.001)
  const maxDateY = valorMaximoResolved + (valorMaximoResolved * 0.001)

  // // Resaltar el día 10 con un color diferente
  const borderColorCompra = dataType?.map((day) => (day === currentDay ? '#5DB92C' : '#5DB92C'))

  const midata = {
    labels: dataFecha,

    datasets: [
      {
        label: t.Purchase,
        data: dataResolved,
        tension: 0.4,
        fill: 'start',
        borderColorCompra,
        borderColor: 'rgba(5, 205, 153, 0.50)',
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height)
          gradient.addColorStop(0, 'rgba(5, 61, 153, 0.005)') // Color inicial con opacidad
          gradient.addColorStop(0.1, 'rgba(5, 205, 153, 0.002)') // Color final con opacidad
          return gradient
        },
        pointBackgroundColor: '#05CD99',
        pointBorderColor: '#05CD99',
        pointRadius: 2,
        pointHoverRadius: 5
      }

    ]
  }

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
        min: valorMinimoResolved,
        max: valorMaximoResolved,
        stepSize: 1,
        grid: {
          display: false
        }
      },

      x: {
        min: minDateX,
        max: maxDateX,
        stepSize: 1,
        type: 'linear',
        position: 'bottom',
        ticks: {
          autoSkip: true,
          precision: 0,
          maxTicksLimit: 30
          // callback: function (value, index, values) {
          //   const Mont = months[selectedMonth]
          //   const currentMon = Mont?.slice(0, 3)
          //   // Verificar si la etiqueta actual es igual a la etiqueta anterior
          //   if (index > 0 && value === values[index - 1]) {
          //     return '' // Devolver cadena vacía para evitar duplicados
          //   }

          //   return ` ${Math.round(value)} ${currentMon}`
          // }

        },
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div>
      <div className='rates-description'>
        <div className='rates-title'>
          <h3>{t['Captcha History']}</h3>
          <p>{t['Results obtained by']}</p>

          <p className='country-svg'>
            <span>
              <ImageSvg name='Reporting' />
              x time
            </span>

          </p>

        </div>

        <div className='box-filter'>
          <button className='btn_black ' onClick={() => exportToExcel()}>
            <ImageSvg name='Download' /> {t.Export}
          </button>

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
