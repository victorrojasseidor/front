import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import { countryOptions } from '@/helpers/contry'
import { validateFormprofilestart } from '@/helpers/validateForms'
import { useRouter } from 'next/navigation'
import { fetchConTokenPost } from '@/helpers/fetch'
import { refresToken } from '@/helpers/auth'
import { useAuth } from '@/Context/DataContext'

const ProgressRegister = ({ userData }) => {
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(userData)
  const [formValues, setFormValues] = useState({}) // Nuevo estado para almacenar los datos del formulario

  const router = useRouter()
  const { session, setSession, logout, setModalToken } = useAuth()

  // steps funciones
  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  // enviar formulario
  async function handleSumbit (values, { setSubmitting, setStatus }) {
    const oEmpresaSelect = values.companies.map((companyId) => {
      const company = user.oEmpresa.find((option) => option.id_empresa === companyId)
      return {
        iIdEmpresa: company.id_empresa,
        sRucEmpresa: company.ruc_empresa
      }
    })

    const body = {
      oResults: {
        sEmail: user.sCorreo,
        sUserName: user.sUserName,
        sLastName: values.lastName,
        sCodePhone: values.countryCode.value,
        sPhone: values.phoneNumber,
        bCodeNotEmail: true,
        bCodeNotBpas: true,
        oEmpresa: oEmpresaSelect

      }
    }

    const tok = user.sToken

    try {
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarUsuarioEnd', body, tok)

      if (responseData.oAuditResponse.iCode == 30 || responseData.oAuditResponse.iCode == 1) {
        router.push('/product')
        setStatus(null)

        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const message = responseData?.oAuditResponse.sMessage
        setStatus(message)
        setSubmitting(false)
        setModalToken(false)
      }
    } catch (error) {
      console.error('Error:', error)

      throw new Error('Hubo un error en la operación asincrónica.')
    }
  }

  // add companies

  return (
    <div className='containerProgress'>
      <div className='progressBar'>
        <div
          className='progressBarFill'
          style={{ width: `${(step - 1) * 50}%` }} // 50% per step
        />
      </div>
      <div className='step'>Step {step}</div>
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
          setFormValues(values)
          handleSumbit(values, { setSubmitting, setStatus })
        }}
        enableReinitialize
      >
        {({ isSubmitting, status, values, setFieldValue }) => (
          <Form className='form-container'>
            {step === 1 && (
              <div>
                <h4> Personal information</h4>

                <div>
                  <div className='input-box'>
                    <Field type='text' name='name' placeholder=' ' value={user?.sUserName || ''} readOnly />
                    <label htmlFor='name'>Username</label>
                  </div>

                  <div className='input-box'>
                    <Field type='text' name='lastName' placeholder=' ' />
                    <label htmlFor='lastName'>Last Name</label>
                    <ErrorMessage className='errorMessage' name='lastName' component='div' />
                  </div>

                  <div className='phone-field'>
                    <div>
                      <Field as='select' id='countryCode' name='countryCode'>
                        {countryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                    </div>

                    <div className='input-box'>
                      <Field type='text' id='phoneNumber' name='phoneNumber' placeholder=' ' />
                      <label htmlFor='phoneNumber'>Phone Number</label>
                      <ErrorMessage className='errorMessage' name='phoneNumber' component='div' />
                    </div>
                  </div>

                  <div className='input-box'>
                    <Field type='email' name='corporateEmail' placeholder=' ' value={user?.sCorreo || ''} readOnly />
                    <label htmlFor='corporateEmail'>Company email</label>
                  </div>

                  <div className='box-buttons'>
                    <button className='btn_primary small' type='submit' onClick={handleNextStep}>
                      NEXT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='companies-container'>
                <h4> Company profile </h4>

                <div>
                  <div>
                    <p>
                      Corporate: <span>{user.jCompany.razon_social_company}</span>
                    </p>
                  </div>

                  <div>
                    <p>Profile to company:</p>
                  </div>
                  {/* <FieldArray name="companies">
            {({ push, remove }) => (
              <div className="companies">
                {user.oEmpresa.map((option) => (
                  <div className="box-companies" key={option.id_empresa}>
                    <div className="card">
                      <span className="initial">{option.razon_social_empresa.match(/\b\w/g).join('').slice(0, 2)}</span>
                    </div>
                    <Field type="checkbox" className="checkboxId" name={`companies`} value={option.id_empresa} />
                    <label htmlFor={`companies[${option.id_empresa}]`}>{option.razon_social_empresa}</label>
                  </div>
                ))}
              </div>
            )}
          </FieldArray> */}

                  <div className='companies'>
                    {user.oEmpresa.map((option) => (
                      <div className='box-companies' key={option.id_empresa}>
                        <div className='card'>
                          <span className='initial'>{option.razon_social_empresa.match(/\b\w/g).join('').slice(0, 2)}</span>
                        </div>
                        <input
                          type='checkbox'
                          className='checkboxId'
                          checked={values.companies.includes(option.id_empresa)} // Marca el checkbox si el valor está incluido en companies
                          onChange={(e) => {
                            const checkedCompanyId = option.id_empresa
                            if (e.target.checked) {
                              // Agregar el ID de la empresa al array companies
                              setFieldValue('companies', [...values.companies, checkedCompanyId])
                            } else {
                              // Remover el ID de la empresa del array companies
                              setFieldValue('companies', values.companies.filter((id) => id !== checkedCompanyId))
                            }
                          }}
                        />
                        <label htmlFor={`companies[${option.id_empresa}]`}>{option.razon_social_empresa}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='box-buttons'>
                  <button type='button' className='btn_secundary' onClick={handlePreviousStep}>
                    Previous
                  </button>
                  <button type='button' className='btn_primary small' onClick={handleNextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='container-notificatión'>
                <h3>Notifications</h3>
                <p>Select how you want to be notified</p>
                <ul>
                  <div className='box-notification'>
                    <Field type='checkbox' className='checkboxId' name='notificationsInBpass' />
                    <label htmlFor='notificationsInBpass'>Notifications in Bpass</label>
                  </div>

                  <div className='box-notification'>
                    <Field type='checkbox' className='checkboxId' name='emailNotifications' />
                    <label htmlFor='emailNotifications'>Email notifications</label>
                  </div>
                </ul>

                <div className='box-buttons'>
                  <button type='button' className='btn_secundary small' onClick={handlePreviousStep}>
                    Previous
                  </button>
                  <button type='submit' className='btn_primary small' disabled={isSubmitting}>
                    Submit
                  </button>
                </div>

                <div className='contentError'>
                  <div className='errorMessage'>{status}</div>
                </div>

              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ProgressRegister
