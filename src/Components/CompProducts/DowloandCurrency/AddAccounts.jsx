import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Select from 'react-select'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import { validateFormAddAccount } from '@/helpers/validateForms'

const AddAccounts = ({ onAgregar, initialVal, setIinitialEdit, handleEditListBank, setShowForm, showForm }) => {
  const [fileTypeOptions, setFileTypeOptions] = useState(null)

  const router = useRouter()
  // const id = router.query.iId
  const iIdProdEnv = router.query.iIdProdEnv

  const { session, setModalToken } = useAuth()

  useEffect(() => {
    if (session) {
      getExtrBancToFile()
    }
  }, [session, iIdProdEnv, showForm])


  async function getExtrBancToFile () {
    const body = {
      oResults: {
        iIdExtBanc: iIdProdEnv,
        iIdPais: 1
      }
    }
    try {
      const token = session.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetExtBancario', body, token)
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults.oTipoArchivo
        setFileTypeOptions(data.map((file) => ({ value: file.id_tipo_archivo, label: file.nombre })))
        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('error, ', errorMessage)
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  //   useEffect(() => {
  //     // Cargar las opciones del país en el estado usando useEffect
  //     setCountryOptions(countryData.map((country) => ({ value: country.value, label: country.label })));

  //     // Si hay un valor preseleccionado en initialValues.country o no estás en modo de edición, seleccionar el país
  //     if (initialVal && initialVal.country) {
  //       const selectedCountryData = countryData.find((c) => c.value === initialVal.country);
  //       setCountry(selectedCountryData);
  //     } else {
  //       setCountry(countryData[0]); // Seleccionar el primer país por defecto
  //     }

  //     // Cargar las opciones de banco según el país seleccionado
  //     if (country) {
  //       const selectedCountryData = countryData.find((c) => c.value === country.value);
  //       setBankOptions(selectedCountryData.banks);
  //     } else {
  //       setBankOptions([]);
  //     }
  //   }, [countryData, initialVal, country]);

  const initialValues = {
    Account: initialVal?.cuenta || '',
    DesAccount: initialVal?.descripcion_cuenta || '', // Usamos los valores iniciales si están disponibles
    Company: initialVal?.descripcion_cuenta || '',
    DesCompany: initialVal?.descripcion_empresa || '',
    Ruc: initialVal?.ruc || '',
    Coin: initialVal?.moneda || '',
    DesCoin: initialVal?.descripcion_moneda || '',
    TypeFile: initialVal?.id_tipo_archivo || null,
    state: initialVal && initialVal.estado == '23' ? 'Active' : (initialVal ? 'Disabled' : 'Active')
  }

  console.log('fileoptions', fileTypeOptions);
  console.log("initial",initialVal);
//   console.log('slectfile', fileTypeOptions &  initialVal & fileTypeOptions.find(option => option.value === initialVal.id_tipo_archivo))

  return (
    <div className='Form-listCredential'>
      <h2 className='box'>{initialVal ? 'Edit record' : 'Add account'}</h2>
      <Formik
        initialValues={initialValues}
        validate={(values) => validateFormAddAccount(values, initialValues)}
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
          <Form className='form-container'>
            <div className='input-box'>
              <Field type='text' name='Account' placeholder=' ' />
              <label htmlFor='Account'>Account</label>
              <ErrorMessage name='Account' component='span' className='errorMessage' />
            </div>

            <div className='input-box'>
              <Field type='text' name='DesAccount' placeholder=' ' />
              <label htmlFor='DesAccount'>Account description</label>
              <ErrorMessage name='DesAccount' component='span' className='errorMessage' />
            </div>
            <div className='input-box'>
              <Field type='text' name='Company' placeholder=' ' />
              <label htmlFor='Company'>Company</label>
              <ErrorMessage name='Company' component='span' className='errorMessage' />
            </div>
            <div className='input-box'>
              <Field type='text' name='DesCompany' placeholder=' ' />
              <label htmlFor='DesCompany'> Company description</label>
              <ErrorMessage name='DesCompany' component='span' className='errorMessage' />
            </div>
            <div className='input-box'>
              <Field type='number' name='Ruc' placeholder=' ' />
              <label htmlFor='Ruc'>RUC</label>
              <ErrorMessage name='Ruc' component='span' className='errorMessage' />
            </div>
            <div className='input-box'>
              <Field type='text' name='Coin' placeholder=' ' />
              <label htmlFor='Coin'>Coin</label>
              <ErrorMessage name='Coin' component='span' className='errorMessage' />
            </div>

            <div className='input-box'>
              <Field type='text' name='DesCoin' placeholder=' ' />
              <label htmlFor='DesCoin'>Coin description</label>
              <ErrorMessage name='DesCoin' component='span' className='errorMessage' />
            </div>

            <div className='bank-box'>
              <label htmlFor='bank'>Type of file</label>
              <Select
                options={fileTypeOptions}
                name='TypeFile'
                placeholder='Select a type of file'
                isClearable
                value={values.TypeFile}
                // value={values.TypeFile || initialVal & fileTypeOptions.find(option => option.value === initialVal.id_tipo_archivo)}
                onChange={(selectedOption) => {
                  setFieldValue('TypeFile', selectedOption)
                }}
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
  )
}

export default AddAccounts
