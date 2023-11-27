import React, { useState } from 'react'
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

const typeOfChangeData = {
  Enero: [1.2, 1.1, 1.3, 1.2, 1.25, 1.3, 1.35, 1.4, 1.38, 1.3, 1.28, 1.25, 1.22, 1.18, 1.15, 1.1, 1.2, 1.3, 1.25, 1.18, 1.15, 0.6, 1.28, 1.3, 1.35, 1.4, 1.38, 1.25, 1.22, 1.18, 1.3, 1.28, 1.0, 1.22, 1.18, 1.15, 1.1, 1.2, 1.25, 1.3],
  Febrero: [1.3, 1.28, 1.25, 1.22, 1.18, 1.15, 1.1, 1.2, 1.25, 1.3, 1.35, 1.4, 1.38, 1.3, 1.28, 1.25, 1.22, 1.18, 1.15, 1.1, 1.2, 1.3, 1.2, 1.25, 1.3, 1.35, 1.4, 1.38, 1.3, 1.28, 1.3, 1.28, 1.25, 1.22, 1.18, 1.15, 1.1, 1.2, 1.25, 1.3],
  Marzo: [1.1, 1.2, 1.25, 1.3, 1.35, 1.4, 1.38, 1.3, 1.28, 1.25, 1.22, 1.18, 1.15, 1.1, 1.2, 1.3, 1.28, 1.25, 1.22, 1.18, 1.15, 1.1, 1.2, 1.2, 1.25, 1.3, 1.35, 1.4, 1.38, 1.3, 1.28, 1.25, 1.22, 1.18, 1.15, 1.1, 1.2, 1.3]
  // ... Datos para los demás meses
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
      max: 1.6,
      stepSize: 0.5,
      grid: {
        display: false
      }
    },
    x: {
      type: 'linear',
      position: 'bottom',
      ticks: { color: '#5932EA' },
      grid: {
        display: false
      }
    }
  }
}

export default function LineChart () {
  const [selectedMonth, setSelectedMonth] = useState('Enero')

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  const maxDaysToShow = 20
  const daysToShow = Array.from({ length: maxDaysToShow }, (_, i) => i + 1)

  console.log({ daysToShow })
  const dataToShow = typeOfChangeData[selectedMonth].slice(0, maxDaysToShow)

  // Resaltar el día 10 con un color diferente
  const highlightedColor = '#5DB92C'
  const borderColor = daysToShow.map((day) => (day === 10 ? highlightedColor : '#5932EA'))

  const midata = {
    labels: daysToShow,
    datasets: [
      {
        label: 'Type of change',
        data: dataToShow,
        tension: 0.2,
        fill: true,
        borderColor,
        backgroundColor: 'red', // Cambia el color degradado según tus preferencias
        pointBackgroundColor: '#5932EA',
        pointBorderColor: '#5932EA',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }

  return (
    <div style={{ overflowX: 'auto', maxWidth: '800px' }}>
      <label htmlFor='monthSelect'>Selecciona un mes:</label>
      <select id='monthSelect' value={selectedMonth} onChange={handleMonthChange}>
        <option value='Enero'>Enero</option>
        <option value='Febrero'>Febrero</option>
        <option value='Marzo'>Marzo</option>
        {/* Agrega opciones para los demás meses */}
      </select>
      <div style={{ overflowX: 'auto' }}>
        <Line data={midata} options={misoptions} />
      </div>
    </div>
  )
}
