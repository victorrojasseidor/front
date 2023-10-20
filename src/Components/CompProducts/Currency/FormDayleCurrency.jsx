import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Select from 'react-select'
import { validateFormAddListBank } from '@/helpers/validateForms'
import ModalForm from '@/Components/Atoms/ModalForm'
import { useAuth } from '@/Context/DataContext'

const FormDayleCurrency = ({ onAgregar, initialVal, setIinitialEdit, dataUser, handleEditListBank, setShowForm }) => {
  const [countryOptions, setCountryOptions] = useState([])
  const [bankOptions, setBankOptions] = useState([])
  const [country, setCountry] = useState(null)
  const [showcomponent, setShowComponent] = useState(null)
  const { l } = useAuth()
  const t = l.Currency

  const countryData = dataUser?.oPaisBanco

  // useEffect(() => {
  //   // Cargar las opciones del país en el estado usando useEffect
  //   setCountryOptions(countryData.map((country) => ({ value: country.value, label: country.label })))

  //   // Si hay un valor preseleccionado en initialValues.country o no estás en modo de edición, seleccionar el país
  //   if (initialVal && initialVal.country) {
  //     const selectedCountryData = countryData.find((c) => c.value === initialVal.country)
  //     setCountry(selectedCountryData)
  //   } else {
  //     setCountry(countryData[0]) // Seleccionar el primer país por defecto
  //   }

  //   // Cargar las opciones de banco según el país seleccionado
  //   if (country) {
  //     const selectedCountryData = countryData.find((c) => c.value === country.value)
  //     setBankOptions(selectedCountryData.banks)
  //   } else {
  //     setBankOptions([])
  //   }
  // }, [countryData, initialVal, country])

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

  // useEffect(() => {
  //   if (initialVal && bankOptions) {
  //     const bankinintial = bankOptions.find((option) => option.id === initialVal.id_banco)
  //     if (bankinintial) {
  //       setShowComponent(bankinintial?.jConfCredencial)
  //     }
  //   }
  // }, [bankOptions, initialVal])

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
            <Form className='form-container formCredential'>
              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 1. {t['Select the exchange rate']} </h5>
                  <p className='description'>{t['Add the bank']}</p>
                </div>
                <div className='group'>
                  {/* <div className='input-box'>
                    <Field type='text' name='name' placeholder=' ' />
                    <label htmlFor='name'>{t['Name of Bank Credential']}</label>
                    <ErrorMessage name='name' component='span' className='errorMessage' />
                  </div>

                  <div className='input-box'>
                    <Field type='password' name='password' placeholder=' ' />
                    <label htmlFor='password'>{initialVal ? t['Update old password'] : t.Password}</label>
                    <ErrorMessage name='password' component='span' className='errorMessage' />
                  </div> */}

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
