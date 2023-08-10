import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Select from 'react-select'

const AddCredentials = ({ onAgregar, initialVal, dataUser, handleEditListBank }) => {
  const [countryOptions, setCountryOptions] = useState([])
  const [bankOptions, setBankOptions] = useState([])
  const [country, setCountry] = useState(null)

  const countryData = dataUser?.oPaisBanco

  console.log('initialvalues', initialVal);

  useEffect(() => {
    // Cargar las opciones del país en el estado usando useEffect
    setCountryOptions(countryData.map((country) => ({ value: country.value, label: country.label })))
  }, [])

  useEffect(() => {
    // Cargar las opciones de banco según el país seleccionado
    if (country) {
      const selectedCountryData = countryData.find((c) => c.value === country.value)
      setBankOptions(selectedCountryData.banks)
    } else {
      setBankOptions([])
    }
  }, [country])

  // console.log("camposeditables", initialVal);

  const initialValues = {
    name: initialVal?.nombre || '', // Usamos los valores iniciales si están disponibles
    password: initialVal?.password || '',
    principalCredential: initialVal?.usuario || '',
    credential2: initialVal?.usuario_a || '',
    credential3: initialVal?.usuario_b || '',
    credential4: initialVal?.usuario_c || '',
    bank: initialVal?.bank || null,
    country: initialVal?.country || null,
    state: initialVal?.state || 'Active'
  }

  return (
    <div className='Form-listCredential'>
      <h2 className='box'>{initialVal ? 'Edit record' : 'Add New Bank Credential'}</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          if (initialVal) {
            // Si initialValues existe, significa que estamos editando
            // En este caso, llamamos a la función onSubmit y pasamos los valores editados
            handleEditListBank(values)
          } else {
            // Si no hay initialValues, estamos agregando un nuevo registro
            onAgregar(values)
          }
          resetForm()
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className='form-container'>
            <div className='input-box'>
              <Field type='text' name='name' placeholder=' ' />
              <label htmlFor='name'>Name</label>
              <ErrorMessage name='name' component='span' className='errorMessage' />
            </div>

            <div className='input-box'>
              <Field type='password' name='password' placeholder=' ' />
              <label htmlFor='password'>Password</label>
              <ErrorMessage name='password' component='span' className='errorMessage' />
            </div>
            <div className='input-box'>
              <Field type='text' name='principalCredential' placeholder=' ' />
              <label htmlFor='principalCredential'>Principal Credential</label>
              <ErrorMessage name='principalCredential' component='span' className='errorMessage' />
            </div>
            <div className='input-box'>
              <Field type='text' name='credential2' placeholder=' ' />
              <label htmlFor='credential2'>Credential 2</label>
              <ErrorMessage name='credential2' component='span' className='errorMessage' />
            </div>
            <div className='input-box'>
              <Field type='text' name='credential3' placeholder=' ' />
              <label htmlFor='credential3'>Credential 3</label>
              <ErrorMessage name='credential3' component='span' className='errorMessage' />
            </div>
            <div className='input-box'>
              <Field type='text' name='credential4' placeholder=' ' />
              <label htmlFor='credential4'>Credential 4</label>
              <ErrorMessage name='credential4' component='span' className='errorMessage' />
            </div>

            <div className='country-box'>
              <label htmlFor='country'>Select a country</label>
              <Select
                options={countryOptions}
                name='country'
                placeholder='Select a country'
                isClearable
                value={country}
                onChange={(selectedOption) => {
                  setCountry(selectedOption)
                  setFieldValue('country', selectedOption)
                  setFieldValue('bank', null) // Resetear el banco seleccionado cuando se cambia el país
                }}
              />
            </div>

            <div className='bank-box'>
              <label htmlFor='bank'>Select a bank</label>
              <Select
                options={bankOptions}
                name='bank'
                placeholder='Select a bank'
                isClearable
                value={values.bank}
                onChange={(selectedOption) => {
                  setFieldValue('bank', selectedOption)
                }}
                isDisabled={!country} // Deshabilitar el campo hasta que se seleccione un país
              />
            </div>

            <div className='state-box'>
              <label>State: </label>
              <div className='content'>
                <label>
                  <Field type='radio' name='state' value='Active' />
                  Activo
                </label>
                <label>
                  <Field type='radio' name='state' value='Disabled' />
                  Desactivado
                </label>
              </div>
            </div>
            <div className='submit-box'>
              <button type='submit' className='btn_primary'>
                {initialVal ? 'Update' : 'Add'}
              </button>

            </div>

          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddCredentials
