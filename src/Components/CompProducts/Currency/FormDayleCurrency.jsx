import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { validateFormAddListBank } from '@/helpers/validateForms'
import ModalForm from '@/Components/Atoms/ModalForm'
import { useAuth } from '@/Context/DataContext'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const FormDayleCurrency = ({ onAgregar, initialVal, setIinitialEdit, dataTypeChange, handleEditListBank, setShowForm }) => {
  const [selectedCountry, setSelectedCountry] = useState('peru')
  const [selectedPortal, setSelectedPortal] = useState('')
  const [selectedCoinOrigin, setSelectedCoinOrigin] = useState('')
  const [selectedCoinDestiny, setSelectedCoinDestiny] = useState('')
  const [selectedDays, setSelectedDays] = useState('0')

  const { l } = useAuth()
  const t = l.Currency

  const countryData = dataTypeChange?.oPaisBanco

  const initialValues = {
    name: initialVal?.nombre || '', // Usamos los valores iniciales si están disponibles
    password: '', // parq ue no se vea el passwoard
    principalCredential: initialVal?.usuario || '',
    credential2: initialVal?.usuario_a || '',
    credential3: initialVal?.usuario_b || '',
    credential4: initialVal?.usuario_c || '',
    bank: initialVal?.bank || null,
    country: initialVal?.country || null,
    state: initialVal && initialVal.estado_c == '23' ? 'Active' : initialVal ? 'Disabled' : 'Active'
  }

  const handleCountryChange = (event) => {
    const selectValue = event.target.value
    setSelectedCountry(selectValue)

    setSelectedPortal('')
    setSelectedCoinOrigin('')
    setSelectedCoinDestiny('')
  }

  const handlePortalChange = (event) => {
    const selectValue = event.target.value
    setSelectedPortal(selectValue)

    setSelectedCoinOrigin('')
    setSelectedCoinDestiny('')
  }

  const handleCoinOriginChange = (event) => {
    const selectCountryValue = event.target.value
    setSelectedCoinOrigin(selectCountryValue)
    setSelectedCoinDestiny('')
  }

  const handleCoinDestinyChange = (event) => {
    const selectValue = event.target.value
    setSelectedCoinDestiny(selectValue)
  }

  const handleDaysChange = (event) => {
    const selectValue = event.target.value
    setSelectedDays(selectValue)
  }

  const countryOptionslabel = [
    { value: 'peru', label: 'Peru' },
    { value: 'brazil', label: 'Brazil' },
    { value: 'mexico', label: 'Mexico' },
    { value: 'argentinafggggggggg', label: 'Argentinafhhhhh' }
    // Add more countries as needed
  ]

  const coinOptionslabel = [
    { value: 'usd', label: 'Dólar estadounidense' },
    { value: 'eur', label: 'Euro' },
    { value: 'jpy', label: 'Yen japonés' },
    { value: 'gbp', label: 'Libra esterlina' },
    { value: 'aud', label: 'Dólar australiano' },
    { value: 'cad', label: 'Dólar canadiense' },
    { value: 'chf', label: 'Franco suizo' },
    { value: 'cny', label: 'Yuan chino' },
    { value: 'inr', label: 'Rupia india' }
    // Agrega más monedas según sea necesario
  ]

  const PortalOptionslabel = [
    { value: 'sbs', label: 'Superintendencia de Banca, Seguros y AFP (SBS) - Perú' },
    { value: 'bcrp', label: 'Banco Central de Reserva del Perú (BCRP) - Perú' },
    { value: 'xe', label: 'XE.com - Conversor de Divisas en Línea' },
    { value: 'oanda', label: 'OANDA - Servicios de Divisas y Cambio de Moneda' }
    // Agrega más portales y países según sea necesario
  ]

  const daysOptionslabel = [
    { value: 0, label: '0 days' },
    { value: 1, label: '1 days' },
    { value: 2, label: '2 days' },
    { value: 3, label: '3 days' },
    { value: 4, label: '4 days' },
    { value: 5, label: '5 days' },
    { value: 6, label: '6 days' },
    { value: 7, label: '7 days' },
    { value: 8, label: '8 days' },
    { value: 9, label: '9 days' },
    { value: 10, label: '10 days' }
  ]

  return (
    <ModalForm
      close={() => {
        // setIinitialEdit(null)
        setShowForm(false)
      }}
    >
      <div className='conten-form-Curency'>

        <h2 className='box'>{initialVal ? t.Edit : t['Set your daily exchange rate']}</h2>

        <Formik
          initialValues={initialValues}

          // validate={(values) => validateFormAddListBank(values, initialVal)}
          onSubmit={(values, { resetForm }) => {
            if (initialVal) {
              handleEditListBank(values)
            } else {
              onAgregar(values)
            }
            resetForm()
          }}
        >
          {({ values, isValid, setFieldValue }) => (
            <Form className='form-Curency'>
              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 1. {t['Select the exchange rate']} </h5>
                  <p className='description'>{t['Add the bank']}</p>
                </div>
                <div className='group'>

                  <div className='box-filter'>

                    <FormControl sx={{ m: 2, minWidth: 120 }}>
                      <InputLabel id='country-label'>{t.Country}</InputLabel>
                      <Select
                        labelId='country-label'
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      >
                        <MenuItem value=''>
                          <em>{t['All Companys']}</em>
                        </MenuItem>
                        {countryOptionslabel.map((country) => (
                          <MenuItem key={country.value} value={country.value}>
                            {country.label}
                          </MenuItem>)
                        )}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 2, minWidth: 120 }}>
                      <InputLabel id='country-label'>{t['Portal Available']}</InputLabel>
                      <Select
                        labelId='country-label'
                        value={selectedPortal}
                        onChange={handlePortalChange}
                      >
                        <MenuItem value=''>
                          <em>{t['All Companys']}</em>
                        </MenuItem>
                        {PortalOptionslabel.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>)
                        )}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 2, minWidth: 120 }}>
                      <InputLabel id='country-label'>{t['Source Currency']}</InputLabel>
                      <Select
                        labelId='country-label'
                        value={selectedCoinOrigin}
                        onChange={handleCoinOriginChange}
                      >
                        <MenuItem value=''>
                          <em>{t['All Companys']}</em>
                        </MenuItem>
                        {coinOptionslabel.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>)
                        )}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 2, minWidth: 120 }}>
                      <InputLabel id='country-label'>{t['Target currency']}</InputLabel>
                      <Select
                        labelId='country-label'
                        value={selectedCoinDestiny}
                        onChange={handleCoinDestinyChange}
                      >
                        <MenuItem value=''>
                          <em>{t['All Companys']}</em>
                        </MenuItem>
                        {coinOptionslabel.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>)
                        )}
                      </Select>
                    </FormControl>

                  </div>

                </div>
              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 2. {t.Days} </h5>
                  <p className='description'>{t['Register your credentials']} Additional days to .... </p>
                </div>

                <div className='box-filter'>

                  <FormControl sx={{ m: 2, minWidth: 150 }}>
                    <InputLabel id='country-label'>{t['Additional days']}</InputLabel>
                    <Select
                      labelId='country-label'
                      value={selectedDays}
                      onChange={handleDaysChange}
                    >
                      <MenuItem value=''>
                        <em>{t['All Companys']}</em>
                      </MenuItem>
                      {daysOptionslabel.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>)
                      )}
                    </Select>
                  </FormControl>

                </div>
              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 3. {t.State} </h5>
                  <p className='description'>{t['Enable or disable exchange rate']}</p>
                </div>
                <div className='state-box'>
                  <label>{t.State}: </label>
                  <div className='content'>
                    <label>
                      <Field type='radio' name='state' value='Active' />
                      {t.Active}
                    </label>
                    <label>
                      <Field type='radio' name='state' value='Disabled' />
                      {t.Disabled}
                    </label>
                  </div>
                </div>
              </div>
              <div className='submit-box'>
                <button
                  type='submit'
                  className='btn_secundary small'
                  onClick={() => {
                    // setIinitialEdit(null)
                    setShowForm(false)
                  }}
                >
                  {t.Close}
                </button>

                <button type='submit' className={`btn_primary small ${!isValid ? 'disabled' : ''}`} disabled={!isValid}>
                  {initialVal ? 'Update' : 'Add'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ModalForm>
  )
}

export default FormDayleCurrency
