import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Select from 'react-select'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import { validateFormAddAccount } from '@/helpers/validateForms'
import ModalForm from '@/Components/Atoms/ModalForm'

const FormAccounts = ({ onAgregar, initialVal, setIinitialEdit, handleEditListAccount, setShowForm, showForm, showcomponent }) => {
  const [fileTypeOptions, setFileTypeOptions] = useState(null)

  const router = useRouter()
  // const id = router.query.iId
  const iIdProdEnv = router.query.iIdProdEnv

  const { session, setModalToken } = useAuth()

  useEffect(() => {
    if (session) {
      getExtrBancToFile()
    }
  }, [session, iIdProdEnv, showForm, initialVal])

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
        console.error('error, ', errorMessage)
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  const initialValues = {
    Account: initialVal?.cuenta || '',
    DesAccount: initialVal?.descripcion_cuenta || '', // Usamos los valores iniciales si están disponibles
    Company: initialVal?.descripcion_cuenta || '',
    DesCompany: initialVal?.descripcion_empresa || '',
    Ruc: initialVal?.ruc || '',
    Coin: initialVal?.moneda || '',
    DesCoin: initialVal?.descripcion_moneda || '',
    TypeFile: null,
    state: initialVal && initialVal.estado == '23' ? 'Active' : (initialVal ? 'Disabled' : 'Active')
  }

  return (
    <ModalForm close={() => { setIinitialEdit(null); setShowForm(false) }}>
      <div className='Form-listCredential'>
        <h2 className='box'>{initialVal ? 'Edit record' : 'Add account'}</h2>
        <Formik
          initialValues={initialValues}
          validate={(values) => validateFormAddAccount(values, initialValues)}
          onSubmit={(values, { resetForm }) => {
            if (initialVal) {
              handleEditListAccount(values)
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
                  <h5 className='sub'> 1. Register your Account </h5>

                </div>

                <div className='group'>
                  {showcomponent?.bAccount &&
                    <div className='input-box'>
                      <Field type='text' name='Account' placeholder=' ' />
                      <label htmlFor='Account'>{showcomponent.sAccount}</label>
                      <ErrorMessage name='Account' component='span' className='errorMessage' />
                    </div>}
                  {showcomponent?.bAccountDescription &&
                    <div className='input-box'>
                      <Field type='text' name='DesAccount' placeholder=' ' />
                      <label htmlFor='DesAccount'>{showcomponent.sAccountDescription}</label>
                      <ErrorMessage name='DesAccount' component='span' className='errorMessage' />
                    </div>}
                </div>
              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 2. Register company </h5>
                  {/* <p className='description'>
                  Add all your accounts to automate
                  </p> */}
                </div>
                <div className='group'>
                  {showcomponent?.bCompany &&
                    <div className='input-box'>
                      <Field type='text' name='Company' placeholder=' ' />
                      <label htmlFor='Company'>{showcomponent.sCompany}</label>
                      <ErrorMessage name='Company' component='span' className='errorMessage' />
                    </div>}
                  {showcomponent?.bCompanyDescription &&
                    <div className='input-box'>
                      <Field type='text' name='DesCompany' placeholder=' ' />
                      <label htmlFor='DesCompany'> {showcomponent.sCompanyDescription}</label>
                      <ErrorMessage name='DesCompany' component='span' className='errorMessage' />
                    </div>}
                  {showcomponent?.bRuc &&
                    <div className='input-box'>

                      <Field type='number' name='Ruc' placeholder=' ' />
                      <label htmlFor='Ruc'>{showcomponent.sRuc}</label>
                      <ErrorMessage name='Ruc' component='span' className='errorMessage' />
                    </div>}

                </div>
              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 3. Register currency </h5>
                  {/* <p className='description'>
                    Add all your accounts to automate
                  </p> */}
                </div>
                <div className='group'>
                  {showcomponent?.bCoin &&
                    <div className='input-box'>
                      <Field type='text' name='Coin' placeholder=' ' />
                      <label htmlFor='Coin'>{showcomponent.sCoin}</label>
                      <ErrorMessage name='Coin' component='span' className='errorMessage' />
                    </div>}
                  {showcomponent?.bCoinDescription &&
                    <div className='input-box'>
                      <Field type='text' name='DesCoin' placeholder=' ' />
                      <label htmlFor='DesCoin'>{showcomponent.sCoinDescription}</label>
                      <ErrorMessage name='DesCoin' component='span' className='errorMessage' />
                    </div>}
                </div>

              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 4.How do you want recibir tu information? </h5>
                  {/* <p className='description'>
                  Add all your accounts to automate
                  </p> */}
                </div>
                <div className='group'>

                  {showcomponent?.bType &&

                    <div className='bank-box'>
                      <label htmlFor='bank'>{showcomponent.sType}</label>
                      <Select
                        options={fileTypeOptions}
                        name='TypeFile'
                        placeholder='Select a type of file'
                        isClearable
                        // value={(initialVal && fileTypeOptions && TypeFile===null )?fileTypeOptions.find(option => option.value === initialVal.id_tipo_archivo) : values.TypeFile}
                        value={
                          (initialVal && fileTypeOptions && !values.TypeFile)
                            ? fileTypeOptions.find(option => option.value === initialVal.id_tipo_archivo)
                            : values.TypeFile
                        }
                        onChange={(selectedOption) => {
                          setFieldValue('TypeFile', selectedOption)
                        }}
                      />
                    </div>}

                </div>
              </div>

              <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 5. State  </h5>
                  <p className='description'>
                    Activate or deactivate your Account
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
                  Close
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

export default FormAccounts
