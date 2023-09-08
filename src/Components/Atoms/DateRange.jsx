import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export default function DateRange () {
  return (

    <div className='box-dates'> fechas
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label='Initial Date ddgdgg'
          slotProps={{
            textField: {
              helperText: 'ingrese la fecha de inicio'
            }
          }}
        />

        <DatePicker
          label='Initial Date ddgdgg'
          slotProps={{
            textField: {
              helperText: 'ingrese la fecha de inicio'
            }
          }}
        />
      </LocalizationProvider>
    </div>

  )
}
