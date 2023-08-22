import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Select from 'react-select'
import { validateFormAddListBank } from '@/helpers/validateForms'
import ModalForm from '@/Components/Atoms/ModalForm'

const FormCredentials = ({ onAgregar, initialVal, setIinitialEdit, dataUser, handleEditListBank, setShowForm }) => {
  const [countryOptions, setCountryOptions] = useState([])
  const [bankOptions, setBankOptions] = useState([])
  const [country, setCountry] = useState(null)

  const countryData = dataUser?.oPaisBanco

  // useEffect(() => {
  //   // Cargar las opciones del país en el estado usando useEffect
  //   setCountryOptions(countryData.map((country) => ({ value: country.value, label: country.label })))

  //   // Si hay un valor preseleccionado en initialValues.country, seleccionar el país
  //   if (initialVal.country) {
  //     const selectedCountryData = countryData.find((c) => c.value === initialVal.country)
  //     setCountry(selectedCountryData)
  //   } else {
  //     setCountry(countryData[0])
  //   }

  //   // Cargar las opciones de banco según el país seleccionado
  //   if (country) {
  //     const selectedCountryData = countryData.find((c) => c.value === country.value)
  //     setBankOptions(selectedCountryData.banks)
  //   } else {
  //     setBankOptions([])
  //   }
  // }, [countryData, country])

  useEffect(() => {
    // Cargar las opciones del país en el estado usando useEffect
    setCountryOptions(countryData.map((country) => ({ value: country.value, label: country.label })))

    // Si hay un valor preseleccionado en initialValues.country o no estás en modo de edición, seleccionar el país
    if (initialVal && initialVal.country) {
      const selectedCountryData = countryData.find((c) => c.value === initialVal.country)
      setCountry(selectedCountryData)
    } else {
      setCountry(countryData[0]) // Seleccionar el primer país por defecto
    }

    // Cargar las opciones de banco según el país seleccionado
    if (country) {
      const selectedCountryData = countryData.find((c) => c.value === country.value)
      setBankOptions(selectedCountryData.banks)
    } else {
      setBankOptions([])
    }
  }, [countryData, initialVal, country])

  const initialValues = {
    name: initialVal?.nombre || '', // Usamos los valores iniciales si están disponibles
    // password: initialVal?.password || '',
    password: '', // parq ue no se vea el passwoard
    principalCredential: initialVal?.usuario || '',
    credential2: initialVal?.usuario_a || '',
    credential3: initialVal?.usuario_b || '',
    credential4: initialVal?.usuario_c || '',
    bank: initialVal?.bank || null,
    country: initialVal?.country || null,
    state: initialVal && initialVal.estado_c == '23' ? 'Active' : (initialVal ? 'Disabled' : 'Active')

  }

  return (
    <ModalForm close={() => { setIinitialEdit(null); setShowForm(false) }}>
      <div className='Form-listCredential'>
        <h2 className='box'>{initialVal ? 'Edit record' : 'Add New Bank Credential'}</h2>
        <Formik
          initialValues={initialValues}
        // validate={initialVal === null ? validateFormAddListBank : undefined}
        // validate={validateFormAddListBank}
          validate={(values) => validateFormAddListBank(values, initialValues)}
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
            <Form className='form-container formCredential'>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 1. Register your bank </h5>
                  <p className='description'>
                    Add all your accounts to automate
                  </p>
                </div>
                <div className='group'>
                  <div className='input-box'>
                    <Field type='text' name='name' placeholder=' ' />
                    <label htmlFor='name'>Name</label>
                    <ErrorMessage name='name' component='span' className='errorMessage' />
                  </div>

                  <div className='country-box'>
                    <label htmlFor='country'>Select a country</label>
                    <Select
                      options={countryOptions}
                      name='country'
                      placeholder='Select a country'
                      isClearable
                      value={countryOptions[0]}
               // value={country}
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
                      value={values.bank || (initialVal && bankOptions.find(option => option.id === initialVal.id_banco))}
                      onChange={(selectedOption) => {
                        setFieldValue('bank', selectedOption)
                      }}
                      isDisabled={!country}
                    />
                  </div>

                  <div className='input-box'>
                    <Field type='password' name='password' placeholder=' ' />
                    <label htmlFor='password'>{initialVal ? 'Update old password' : 'Password'}</label>
                    <ErrorMessage name='password' component='span' className='errorMessage' />
                  </div>
                </div>
              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 2. Add  Credential </h5>
                  <p className='description'>
                    Register your credentials
                  </p>
                </div>

                <div className='group'>

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
                </div>

              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 3. State  </h5>
                  <p className='description'>
                    Activate or deactivate your credential bank
                  </p>
                </div>
                <div className='state-box'>
                  <label>State: </label>
                  <div className='content'>
                    <label>
                      <Field type='radio' name='state' value='Active' />
                      Activate
                    </label>
                    <label>
                      <Field type='radio' name='state' value='Disabled' />
                      Deactivate
                    </label>
                  </div>
                </div>

              </div>
              <div className='submit-box'>

                <button type='submit' className='btn_secundary small' onClick={() => { setIinitialEdit(null); setShowForm(false) }}>
                  close
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

export default FormCredentials
