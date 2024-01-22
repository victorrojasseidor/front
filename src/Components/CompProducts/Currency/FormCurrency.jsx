import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { validateFormCurrency } from '@/helpers/validateForms'
import ModalForm from '@/Components/Atoms/ModalForm'
import { useAuth } from '@/Context/DataContext'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { IconArrow } from '@/helpers/report'

const FormCurrency = ({ onAgregar, initialVal, setIinitialEdit, dataTypeChange, handleEditCurrency, setShowForm, typeOfChange }) => {
  const [selectedCountry, setSelectedCountry] = useState(initialVal?.id_pais || '')
  const [selectedPortal, setSelectedPortal] = useState(initialVal?.id_fuente || '')
  const [selectedCoinOrigin, setSelectedCoinOrigin] = useState(initialVal?.id_moneda_origen || '')
  const [selectedCoinDestiny, setSelectedCoinDestiny] = useState(initialVal?.id_moneda_destino || '')
  const [selectedDays, setSelectedDays] = useState(initialVal?.dias_adicional || '1')
  const [valueState, setValueState] = useState(initialVal && initialVal.estado == '23' ? 'Active' : initialVal ? 'Disabled' : 'Active')

  const [registerDuplicate, setRegisterDuplicate] = useState(false)

  const { l } = useAuth()
  const t = l.Currency

  const formValues = {
    country: parseInt(selectedCountry), // Usamos los valores iniciales si están disponibles
    fuente: parseInt(selectedPortal),
    coinOrigin: parseInt(selectedCoinOrigin),
    coinDestiny: parseInt(selectedCoinDestiny),
    days: parseInt(selectedDays)
    // state: initialVal && initialVal.estado == '23' ? 'Active' : initialVal ? 'Disabled' : 'Active'

  }

  useEffect(() => {
    const typeRe = dataTypeChange[typeOfChange == 1 ? 'oDailyExchange' : 'oMonthExchange'].map(regis => ({
      country: regis.id_pais,
      fuente: regis.id_fuente,
      coinOrigin: regis.id_moneda_origen,
      coinDestiny: regis.id_moneda_destino,
      days: regis.dias_adicional

    }))

    const isIncluded = typeRe.some(arr => JSON.stringify(arr) === JSON.stringify(formValues))

    if (isIncluded) {
      setRegisterDuplicate(true)
    } else {
      setRegisterDuplicate(false)
    }

    if (initialVal) {
      const dataInitial = {
        country: initialVal.id_pais,
        fuente: initialVal.id_fuente,
        coinOrigin: initialVal.id_moneda_origen,
        coinDestiny: initialVal.id_moneda_destino,
        days: initialVal.dias_adicional
      }

      const dataInitialString = JSON.stringify(dataInitial)
      const formValuesString = JSON.stringify(formValues)
      // Comparar cadenas JSON
      const sonIguales = dataInitialString === formValuesString

      if (isIncluded && !sonIguales) {
        setRegisterDuplicate(true)
      } else {
        setRegisterDuplicate(false)
      }
    }
  }, [formValues])

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
  }

  const handleCoinDestinyChange = (event) => {
    const selectValue = event.target.value
    setSelectedCoinDestiny(selectValue)
  }

  const handleDaysChange = (event) => {
    const selectValue = event.target.value
    setSelectedDays(selectValue)
  }

  const handleStateChange = (event) => {
    setValueState(event.target.value)
  }

  const daysOptionslabel = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' }
  ]

  return (
    <ModalForm
      close={() => {
        setIinitialEdit(null)
        setShowForm(false)
        setSelectedCountry('')
        setSelectedPortal('')
        setSelectedCoinOrigin('')
        setSelectedCoinDestiny('')
        setSelectedDays('1')
      }}
    >
      <div className='conten-form-Curency'>

        <h2 className='box'>{initialVal ? t['Edit exchange rate'] : t['Add exchange rate']}</h2>

        <Formik
          initialValues={formValues}
          validate={(values) => validateFormCurrency(values)}
          onSubmit={(values, { resetForm }) => {
            if (initialVal) {
              handleEditCurrency({
                country: parseInt(selectedCountry), // Usamos los valores iniciales si están disponibles
                fuente: parseInt(selectedPortal),
                coinOrigin: parseInt(selectedCoinOrigin),
                coinDestiny: parseInt(selectedCoinDestiny),
                days: parseInt(selectedDays),
                state: valueState
              })
            } else {
              onAgregar({
                country: parseInt(selectedCountry), // Usamos los valores iniciales si están disponibles
                fuente: parseInt(selectedPortal),
                coinOrigin: parseInt(selectedCoinOrigin),
                coinDestiny: parseInt(selectedCoinDestiny),
                days: parseInt(selectedDays),
                state: valueState
              })
            }
            resetForm()
          }}
        >
          {({ values, isValid, setFieldValue, status }) => (
            <Form className='form-Curency'>
              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 1. {t['Select the exchange rate']} </h5>
                  <p className='description'>{t['Add the bank']}</p>
                </div>
                <div className='group'>

                  <div className='box-filter'>

                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                      <InputLabel id='country' name='country'>{t.Country}</InputLabel>

                      <Select
                        labelId='country'
                        name='country' // Make sure this matches the Field name
                        value={selectedCountry}
                        IconComponent={IconArrow}
                        onChange={(values) => { handleCountryChange(values); setFieldValue('country', values.target.value) }}
                      >

                        {dataTypeChange?.oPais.map((country) => (
                          <MenuItem key={country.id_pais} value={country.id_pais}>
                            {country.descripcion_pais}
                          </MenuItem>)
                        )}
                      </Select>
                      <FormHelperText> {selectedCountry ? '' : t.Select} </FormHelperText>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 180 }}>
                      <InputLabel id='fuente'>{t['Portal Available']}</InputLabel>
                      <Select
                        labelId='fuente'
                        value={selectedPortal}
                        IconComponent={IconArrow}
                        onChange={(values) => { handlePortalChange(values); setFieldValue('fuente', values.target.value) }}
                      >

                        {dataTypeChange?.oFuente.map((option) => (
                          <MenuItem key={option.id_fuente} value={option.id_fuente}>
                            {option.nombre}
                          </MenuItem>)
                        )}
                      </Select>

                      <FormHelperText> {selectedPortal ? '' : t.Select} </FormHelperText>

                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 180 }}>
                      <InputLabel id='coinOrigin'>{t['Source Currency']}</InputLabel>
                      <Select
                        labelId='coinOrigin'
                        value={selectedCoinOrigin}
                        IconComponent={IconArrow}
                        onChange={(values) => { handleCoinOriginChange(values); setFieldValue('coinOrigin', values.target.value) }}
                      >

                        {dataTypeChange?.oMoneda.map((option) => (
                          <MenuItem key={option.id_moneda} value={option.id_moneda}>
                            {option.codigo_moneda} -{option.descripcion_moneda}
                          </MenuItem>)
                        )}
                      </Select>
                      <FormHelperText> {selectedCoinOrigin ? '' : t.Select} </FormHelperText>
                      {
                      selectedCoinOrigin && selectedCoinDestiny && selectedCoinDestiny === selectedCoinOrigin ? <FormHelperText className='errorMessage'> {t['Select different currencies']} </FormHelperText> : ''
                      }

                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 180 }}>
                      <InputLabel id='coinDestiny'>{t['Target currency']}</InputLabel>
                      <Select
                        labelId='coinDestiny'
                        value={selectedCoinDestiny}
                        IconComponent={IconArrow}
                        onChange={(values) => { handleCoinDestinyChange(values); setFieldValue('coinDestiny', values.target.value) }}
                      >

                        {dataTypeChange?.oMoneda.map((option) => (
                          <MenuItem key={option.id_moneda} value={option.id_moneda}>
                            {option.codigo_moneda} -{option.descripcion_moneda}
                          </MenuItem>)
                        )}
                      </Select>
                      <FormHelperText> {selectedCoinDestiny ? '' : t.Select} </FormHelperText>

                      {
                      selectedCoinOrigin && selectedCoinDestiny && selectedCoinDestiny === selectedCoinOrigin ? <FormHelperText className='errorMessage'> {t['Select different currencies']} </FormHelperText> : ''
                      }

                    </FormControl>

                  </div>

                </div>
              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 2.{t['Additional days']} </h5>
                  <p className='description'>{t['Day explication']} </p>
                </div>

                <div className='box-filter'>

                  <FormControl sx={{ m: 1, minWidth: 80 }}>
                    <InputLabel id='days'> {t.Days}</InputLabel>
                    <Select
                      labelId='days'
                      value={selectedDays}
                      IconComponent={IconArrow}
                      onChange={(values) => { handleDaysChange(values); setFieldValue('days', values.target.value) }}
                    >

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

                <div className='content'>

                  <FormControl sx={{ m: 1 }}>

                    <RadioGroup
                      row
                      aria-labelledby='demo-form-control-label-placement'
                      name='state'
                      value={valueState}
                      onChange={(values) => { handleStateChange(values); setFieldValue('state', values.target.value) }}
                    >

                      <FormControlLabel
                        value='Active'
                        control={<Radio />}
                        label={t.Active}
                      />

                      <FormControlLabel
                        value='Disabled'
                        control={<Radio />}
                        label={t.Disabled}
                      />

                    </RadioGroup>

                  </FormControl>

                </div>

              </div>

              {registerDuplicate && <div className='error '>

                <p className='errorMessage'>
                  {t['Exchange rate record already exists']}
                </p>

                                    </div>}

              <div className='submit-box'>

                <button
                  type='submit'
                  className='btn_secundary small'
                  onClick={() => {
                    setShowForm(false)
                    setIinitialEdit(null)
                    setSelectedCountry('')
                    setSelectedPortal('')
                    setSelectedCoinOrigin('')
                    setSelectedCoinDestiny('')
                    setSelectedDays('1')
                  }}
                >
                  {t.Close}
                </button>

                <button type='submit' className={`btn_primary small ${!isValid || registerDuplicate ? 'disabled' : ''}`} disabled={!isValid || registerDuplicate}>
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

export default FormCurrency
