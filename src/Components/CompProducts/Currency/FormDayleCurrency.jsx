import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { validateFormAddListBank } from '@/helpers/validateForms'
import ModalForm from '@/Components/Atoms/ModalForm'
import { useAuth } from '@/Context/DataContext'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

const FormDayleCurrency = ({ onAgregar, initialVal, setIinitialEdit, dataUser, handleEditListBank, setShowForm }) => {
  const [selectedCountry, setSelectedCountry] = useState('peru')
  const [bankOptions, setBankOptions] = useState([])

  const [showcomponent, setShowComponent] = useState(null)

  const { l } = useAuth()
  const t = l.Currency

  const countryData = dataUser?.oPaisBanco

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
    const selectCountryValue = event.target.value
    setSelectedCountry(selectCountryValue)

    // setSelectedBank('') // Restablece la selección de banco
    // setSelectedAccount('') // Restablece la selección de cuenta
  }

  const countryOptionslabel = [
    { value: 'peru', label: 'Peru' },
    { value: 'brazil', label: 'Brazil' },
    { value: 'mexico', label: 'Mexico' },
    { value: 'argentina', label: 'Argentina' }
    // Add more countries as needed
  ]

  console.log(countryOptionslabel)

  return (
    <ModalForm
      close={() => {
        setIinitialEdit(null)
        setShowForm(false)
      }}
    >
      <div className='Form-listCredential'>
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
            <Form className=''>
              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 1. {t['Select the exchange rate']} </h5>
                  <p className='description'>{t['Add the bank']}</p>
                </div>
                <div className=''>

                  <div className='box-filter'>

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
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

                  </div>

                </div>
              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 2. {t.Days} </h5>
                  {/* <p className='description'>{t['Register your credentials']}</p> */}
                </div>

                <div className='group'>

                  <div className='input-box'>
                    <Field type='text' name='principalCredential' placeholder=' ' />
                    <label htmlFor='principalCredential'>Additional days </label>
                    <ErrorMessage name='principalCredential' component='span' className='errorMessage' />
                  </div>

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
                    setIinitialEdit(null)
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
