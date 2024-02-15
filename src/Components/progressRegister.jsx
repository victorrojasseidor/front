import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { countryOptions } from '@/helpers/contry'
import { validateFormprofilestart } from '@/helpers/validateForms'
import { useRouter } from 'next/navigation'
import { fetchConTokenPost, fetchNoTokenPost, decodeText } from '@/helpers/fetch'
import { useAuth } from '@/Context/DataContext'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import ImageSvg from '@/helpers/ImageSVG'
import Loading from '@/Components/Atoms/Loading'
import Modal from './Modal'
import RefreshToken from './RefresToken'

const ProgressRegister = ({ userData }) => {
  const [step, setStep] = useState(1)
  const [formValues, setFormValues] = useState({}) // Nuevo estado para almacenar los datos del formulario
  const [country, setCountrySelect] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [confirmRegister, setConfirmRegister] = useState(false)
  const [errorLogin, setErrorLogin] = useState('')

  const router = useRouter()
  const { session, logout, modalToken, setModalToken, setSession, l } = useAuth()

  const [selectedCompanies, setSelectedCompanies] = useState([])

  const t = l.profile

  const toggleCompanySelection = (companyId) => {
    if (selectedCompanies.includes(companyId)) {
      const seletcompany = selectedCompanies.filter((id) => id !== companyId)
      setSelectedCompanies(seletcompany)
    } else {
      setSelectedCompanies([...selectedCompanies, companyId])
    }
  }

  // steps funciones
  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const isLastStep = step === 3

  const handleCountryChange = (event) => {
    const valueSelect = event.target.value
    setCountrySelect(valueSelect)
  }

  async function login (email, password) {
    const dataRegister = {
      oResults: {
        sEmail: email,
        sPassword: password
      }
    }
    try {
      const responseData = await fetchNoTokenPost('BPasS/?Accion=ConsultaUsuario', dataRegister && dataRegister)
      if (responseData.oAuditResponse?.iCode === 1) {
        const userData = responseData.oResults
        setSession(userData)
        router.push('/product')
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        setErrorLogin(errorMessage)
      }
    } catch (error) {
      console.error('error', error)
      setErrorLogin('Service error')
    }
  }

  async function handleSumbit (values, { setSubmitting, setStatus }) {
    setIsLoading(true)

    const transfOempresa = selectedCompanies.map((company) => {
      return {
        iIdEmpresa: company.id_empresa,
        sRucEmpresa: company.ruc_empresa

      }
    })

    const body = {
      oResults: {
        sEmail: userData.sCorreo,
        sUserName: userData.sUserName,
        sLastName: values.lastName,
        sCodePhone: values.countryCode.value,
        sPhone: values.phoneNumber,
        bCodeNotEmail: true,
        bCodeNotBpas: true,
        oEmpresa: transfOempresa
      }
    }

    const tok = userData.sToken

    try {
      const responseData = await fetchConTokenPost('BPasS/?Accion=RegistrarUsuarioEnd', body, tok)
      if (responseData.oAuditResponse.iCode === 1) {
        setStatus(null)
        setModalToken(false)
        setSession(null)
        const secretPasw = await decodeText(responseData.oResults.password)
        login(body.oResults.sEmail, secretPasw.oResults)
      } else if (responseData.oAuditResponse.iCode === 30) {
        setStatus(null)
        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
        setConfirmRegister(false)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
        setConfirmRegister(false)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        setStatus(errorMessage)
        setConfirmRegister(false)
        console.log('error', errorMessage)
        setTimeout(() => {
          setStatus(null)
        }, 1000)
      }
    } catch (error) {
      console.error('Error:', error)
      setConfirmRegister(false)
      throw new Error('Hubo un error en la operación asincrónica.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className='containerProgress '>
        <div className='progressBar'>
          <div className='progressBarFill' style={{ width: `${(step - 1) * 50}%` }} />
        </div>
        <div className='step'>{t.Step} {step}</div>
        <Formik
          initialValues={{
            lastName: '',
            countryCode: countryOptions[0], // Valor inicial de Perú
            phoneNumber: '',
            notificationsInBpass: true,
            emailNotifications: true,
            companies: []
          }}
          validate={validateFormprofilestart} // Use the custom validation function here
          onSubmit={(values, { setSubmitting, setStatus }) => {
            if (isLastStep) {
              handleSumbit(values, { setSubmitting, setStatus })
            } else {
              handleNextStep()
            }
          }}
          enableReinitialize
        >
          {({ isSubmitting, status, values, setFieldValue, errors }) => (
            <Form className='form-container '>
              {step === 1 && (
                <div>
                  <h4> {t['Personal information']}</h4>

                  <div className='box-forms'>
                    <div className='input-box'>
                      <Field type='text' name='name' placeholder=' ' value={userData?.sUserName || ''} readOnly />
                      <label htmlFor='name'>{t.Username}</label>
                    </div>

                    <div className='input-box'>
                      <Field type='text' name='lastName' placeholder=' ' />
                      <label htmlFor='lastName'>{t['Last Name']}</label>
                      <ErrorMessage className='errorMessage' name='lastName' component='div' />
                    </div>

                    <div className='box-phone'>
                      <div className='box-filter'>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id='company-label'>{t.Code}</InputLabel>
                          <Select labelId='company-label' value={country || countryOptions[0]?.value} onChange={handleCountryChange} className='delimite-text'>
                            {countryOptions?.map((comp) => (
                              <MenuItem key={comp.value} value={comp.value}>
                                <div> {comp.label}</div>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      <div className='input-box'>
                        <Field type='text' id='phoneNumber' name='phoneNumber' placeholder=' ' />
                        <label htmlFor='phoneNumber'>{t['Phone Number']}</label>
                        <ErrorMessage className='errorMessage' name='phoneNumber' component='div' />
                      </div>
                    </div>

                    <div className='input-box'>
                      <Field type='email' name='corporateEmail' placeholder=' ' value={userData?.sCorreo || ''} readOnly />
                      <label htmlFor='corporateEmail'>{t['Company email']}</label>
                    </div>
                  </div>

                  <div className='box-buttons'>
                    {values.phoneNumber && values.lastName && (
                      <button className={`btn_secundary small ${'lastName' in errors || 'phoneNumber' in errors ? 'disabled' : ''}`} disabled={!values.phoneNumber || !values.lastName} onClick={handleNextStep}>
                        {t.Next}
                        <ImageSvg name='Next' />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className='companies-container'>
                  <h4> {t['Company profile']} </h4>

                  <div>
                    <div>
                      <p>
                        {t.Corporation}: <span>{userData.jCompany.razon_social_company}</span>
                      </p>
                    </div>

                    <div>
                      <p>{t['Select the Profile to company']}:</p>
                    </div>

                    <div className='companies'>
                      {userData?.oEmpresa.map((option) => (
                        <div className={`box-companies ${selectedCompanies.includes(option) ? 'selected' : ''}`} key={option.id_empresa} onClick={() => toggleCompanySelection(option)}>
                          <div className='card'>
                            <span className='initial'>{option.razon_social_empresa.match(/\b\w/g).join('').slice(0, 2)}</span>
                          </div>
                          <label htmlFor={`companies[${option.id_empresa}]`}>{option.razon_social_empresa}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='box-buttons'>
                    <button type='button' className='btn_secundary small' onClick={handlePreviousStep}>
                      <ImageSvg name='Back' />
                      {t.Previous}
                    </button>

                    <button type='button' className={`btn_secundary small ${selectedCompanies.length > 0 ? '' : 'disabled'}`} onClick={handleNextStep} disabled={selectedCompanies.length == 0}>
                      {t.Next}
                      <ImageSvg name='Next' />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className='container-notificatión'>
                  <h4>{t.Notifications}</h4>
                  <p>{t['Select how you want to be notified']}</p>
                  <ul>
                    <div className='box-notification'>
                      <Field type='checkbox' className='checkboxId' name='notificationsInBpass' />
                      <label htmlFor='notificationsInBpass'>{t['Notifications in ARI']}</label>
                    </div>

                    <div className='box-notification'>
                      <Field type='checkbox' className='checkboxId' name='emailNotifications' />
                      <label htmlFor='emailNotifications'>{t['Email notifications']}</label>
                    </div>
                  </ul>

                  <div className='box-buttons'>
                    <button type='button' className='btn_secundary small' onClick={handlePreviousStep}>
                      <ImageSvg name='Back' />
                      {t.Previous}
                    </button>
                    {isLastStep && (
                      <button
                        type='submit'
                        className='btn_primary small'
                        disabled={isSubmitting}
                      >
                        {t.Next}
                        <ImageSvg name='Next' />
                      </button>
                    )}
                  </div>

                  <div className='contentError'>
                    <div className='errorMessage'>{status}</div>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>

        {confirmRegister && (
          <Modal
            close={() => {
              setConfirmRegister(false)
            }}
          >
            <ImageSvg name='Check' />

            <div>
              <h3>{t['Completed profile']}</h3>
            </div>

            {errorLogin && <div className='errorMessage'> {errorLogin} </div>}
          </Modal>
        )}

        <div>{modalToken && session && <RefreshToken />}</div>
      </div>
    </>
  )
}

export default ProgressRegister
