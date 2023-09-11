import React, { useState } from 'react'
import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export default function DateRange () {
  // Fecha de inicio establecida en "01/01/2023"
  const [startDate, setStartDate] = useState(dayjs('01/01/2023', 'DD/MM/YYYY').format('DD/MM/YYYY'))

  // Fecha de finalización establecida en un día antes de la fecha actual
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').format('DD/MM/YYYY'))

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('DD/MM/YYYY'))
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'))
  }

  return (
    <div className='box-dates'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker', 'DatePicker']}>
          <DatePicker
            label='From'
            value={dayjs(startDate, 'DD/MM/YYYY')}
            onChange={handleStartDateChange}
            format='DD/MM/YYYY'
          />
          <DatePicker
            label='To'
            value={dayjs(endDate, 'DD/MM/YYYY')}
            onChange={handleEndDateChange}
            format='DD/MM/YYYY'
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  )
}
