import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { validateFormCurrency } from '@/helpers/validateForms'
import ModalForm from '@/Components/Atoms/ModalForm'
import { useAuth } from '@/Context/DataContext'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const FormCurrency = ({ onAgregar, initialVal, setIinitialEdit, dataTypeChange, handleEditListBank, setShowForm }) => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedPortal, setSelectedPortal] = useState('')
  const [selectedCoinOrigin, setSelectedCoinOrigin] = useState('')
  const [selectedCoinDestiny, setSelectedCoinDestiny] = useState('')
  const [selectedDays, setSelectedDays] = useState('0')

  const { l } = useAuth()
  const t = l.Currency

  // console.log(dataTypeChange)

  useEffect(() => {
    if (dataTypeChange?.oPais.length > 0) {
      setSelectedCountry(dataTypeChange.oPais[0])
    }
  }, [])

  const formValues = {
    country: parseInt(selectedCountry), // Usamos los valores iniciales si están disponibles
    fuente: parseInt(selectedPortal),
    coinOrigin: parseInt(selectedCoinOrigin),
    coinDestiny: parseInt(selectedCoinDestiny),
    days: parseInt(selectedDays),
    state: initialVal && initialVal.estado == '23' ? 'Active' : initialVal ? 'Disabled' : 'Active'

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
        // setIinitialEdit(null)
        setShowForm(false)
      }}
    >
      <div className='conten-form-Curency'>

        <h2 className='box'>{initialVal ? t.Edit : t['Set your daily exchange rate']}</h2>

        <Formik
          initialValues={formValues}
          validate={(values) => validateFormCurrency(values, formValues)}
          onSubmit={(values, { resetForm }) => {
            if (initialVal) {
              handleEditListBank(values)
            } else {
              onAgregar(formValues)
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
                      <InputLabel id='country' name='country'>{t.Country}</InputLabel>

                      <Select
                        labelId='country'
                        name='country' // Make sure this matches the Field name
                        value={selectedCountry}
                        onChange={(values) => { handleCountryChange(values); setFieldValue('country', values.target.value) }}
                      >

                        {dataTypeChange?.oPais.map((country) => (
                          <MenuItem key={country.id_pais} value={country.id_pais}>
                            {country.descripcion_pais}
                          </MenuItem>)
                        )}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 2, minWidth: 120 }}>
                      <InputLabel id='fuente'>{t['Portal Available']}</InputLabel>
                      <Select
                        labelId='fuente'
                        value={selectedPortal}
                        onChange={(values) => { handlePortalChange(values); setFieldValue('fuente', values.target.value) }}
                      >

                        {dataTypeChange?.oFuente.map((option) => (
                          <MenuItem key={option.id_fuente} value={option.id_fuente}>
                            {option.nombre}
                          </MenuItem>)
                        )}
                      </Select>

                      <FormHelperText>error: </FormHelperText>
                    </FormControl>

                    <FormControl sx={{ m: 2, minWidth: 120 }}>
                      <InputLabel id='coinOrigin'>{t['Source Currency']}</InputLabel>
                      <Select
                        labelId='coinOrigin'
                        value={selectedCoinOrigin}
                        onChange={(values) => { handleCoinOriginChange(values); setFieldValue('coinOrigin', values.target.value) }}
                      >

                        {dataTypeChange?.oMoneda.map((option) => (
                          <MenuItem key={option.id_moneda} value={option.id_moneda}>
                            {option.codigo_moneda} -{option.descripcion_moneda}
                          </MenuItem>)
                        )}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 2, minWidth: 120 }}>
                      <InputLabel id='coinDestiny'>{t['Target currency']}</InputLabel>
                      <Select
                        labelId='coinDestiny'
                        value={selectedCoinDestiny}
                        onChange={(values) => { handleCoinDestinyChange(values); setFieldValue('coinDestiny', values.target.value) }}
                      >
                        <MenuItem value=''>
                          <em>{t['All Companys']}</em>
                        </MenuItem>
                        {dataTypeChange?.oMoneda.map((option) => (
                          <MenuItem key={option.id_moneda} value={option.id_moneda}>
                            {option.codigo_moneda} -{option.descripcion_moneda}
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
                    <InputLabel id='days'>{t['Additional days']}</InputLabel>
                    <Select
                      labelId='days'
                      value={selectedDays}
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

export default FormCurrency
