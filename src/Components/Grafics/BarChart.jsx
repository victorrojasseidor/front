import React, { useState } from 'react'
import { useAuth } from '@/Context/DataContext'
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

// Función para generar datos aleatorios
function generateRandomData () {
  return Array.from({ length: 31 }, () => Math.random() * 2)
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

  const { session, l } = useAuth()

  const t = l.Reporting

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
  }

  const maxDaysToShow = 30
  const daysToShow = Array.from({ length: maxDaysToShow }, (_, i) => i + 1)

  console.log({ daysToShow })
  const dataToShow = typeOfChangeData[selectedYear][selectedMonth].slice(0, maxDaysToShow)

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
          gradient.addColorStop(0, 'rgba(89, 50, 234, 0.3)') // Color inicial
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

        <div>
          <h3>
            {t['Exchange rate']}
          </h3>
          <p>
            {t['Result per days']}
          </p>
        </div>

        <div>
          <label htmlFor='monthSelect'>mes:</label>
          <select id='monthSelect' value={selectedMonth} onChange={handleMonthChange}>
            <option value='Enero'>Enero</option>
            <option value='Febrero'>Febrero</option>
            <option value='Marzo'>Marzo</option>
            {/* Agrega opciones para los demás meses */}
          </select>

          <label htmlFor='yearSelect'> año:</label>
          <select id='yearSelect' value={selectedYear} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className='grafics' style={{ overflowX: 'auto' }}>
        <Line data={midata} options={misoptions} />
      </div>

    </div>

  )
}
