import React, { useState } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import { useAuth } from '@/Context/DataContext'
import NavigationPages from '@/Components/NavigationPages'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import { countryOptions } from '@/helpers/contry'
import { validateFormprofilestart } from '@/helpers/validateForms'
import { fetchConTokenPost } from '@/helpers/fetch'
import { refresToken } from '@/helpers/auth'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function profile () {
  const [edit, setEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState('')

  const [formValues, setFormValues] = useState({})
  const [country, setCountrySelect] = useState('')

  const { session, setModalToken, logout, l } = useAuth()
  const router = useRouter()
  const [selectedCompanies, setSelectedCompanies] = useState([])

  const t = l.profile

  const toggleCompanySelection = (companyId) => {
    if (selectedCompanies.includes(companyId)) {
      setSelectedCompanies(selectedCompanies.filter((id) => id !== companyId))
    } else {
      setSelectedCompanies([...selectedCompanies, companyId])
    }
  }

  const handleCountryChange = (event) => {
    const valueSelect = event.target.value
    setCountrySelect(valueSelect)
  }

  // enviar formulario
  async function handleSumbit (values, { setSubmitting, setStatus }) {
    const oEmpresaSelect = values.companies.map((companyId) => {
      const company = session.oEmpresa.find((option) => option.id_empresa === companyId)
      return {
        iIdEmpresa: company.id_empresa,
        sRucEmpresa: company.ruc_empresa
      }
    })

    setEdit(!edit)

    // const body = {
    //   oResults: {
    //     sEmail: session.sCorreo,
    //     sUserName: session.sUserName,
    //     sLastName: values.lastName,
    //     sCodePhone: values.countryCode.value,
    //     sPhone: values.phoneNumber,
    //     bCodeNotEmail: true,
    //     bCodeNotBpas: true,
    //     oEmpresa: oEmpresaSelect

    //   }
    // }

    // const tok = session.sToken

    // try {
    //   const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarUsuarioEnd', body, tok)

    //   if (responseData.oAuditResponse.iCode == 30 || responseData.oAuditResponse.iCode == 1) {
    //     router.push('/product')
    //     setStatus(null)

    //     setModalToken(false)
    //   } else if (responseData.oAuditResponse?.iCode === 27) {
    //     setModalToken(true)
    //   } else {
    //     const message = responseData?.oAuditResponse.sMessage
    //     setStatus(message)
    //     setSubmitting(false)
    //     setModalToken(false)
    //   }
    // } catch (error) {
    //   console.error('Error:', error)

    //   throw new Error('Hubo un error en la operación asincrónica.')
    // }
  }

  return (
    <LayoutProducts menu='Profile'>
      <NavigationPages title='Profile'>
        {/* <div>

          </div> */}
      </NavigationPages>

      <div className='profile'>
        <div className='box-action'>

          {
            edit
              ? ''
              : <button className='btn_primary small' onClick={() => setEdit(!edit)}> {t['Edit profile']}</button>
          }
        </div>

        <div>
          {
                edit
                  ? <div className='edit-profile'>

                    <h2> {t['Edit profile']} </h2>

                    <Formik
                      initialValues={{
                        lastName: '',
                        countryCode: countryOptions[0], // Valor inicial de Perú
                        phoneNumber: '',
                        notificationsInBpass: true,
                        emailNotifications: true,
                        companies: []
                      }}
                      // validate={validateFormprofilestart} // Use the custom validation function here
                      onSubmit={(values, { setSubmitting, setStatus }) => {
                        setFormValues(values)
                        handleSumbit(values, { setSubmitting, setStatus })
                      }}
                      enableReinitialize
                    >
                      {({ isSubmitting, status, values, setFieldValue }) => (
                        <Form className='form-container'>
                          <div>
                            <h4> 1.{t['Personal information']}</h4>

                            <div className='box-forms'>

                              <div className='input-box'>
                                <Field type='text' name='name' placeholder=' ' value={session?.sUserName || ''} readOnly />
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
                                    <Select
                                      labelId='company-label'
                                      value={country}
                                      onChange={handleCountryChange}
                                      className='delimite-text'
                                    >

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
                                <Field type='email' name='corporateEmail' placeholder=' ' value={session?.sCorreo || ''} readOnly />
                                <label htmlFor='corporateEmail'>{t['Company email']}</label>
                              </div>

                            </div>
                          </div>

                          <div className='companies-container'>
                            <h4> 2.{t['Company profile']} </h4>
                            <div>
                              <div>
                                <p>
                                  {t.Corporate}: <span>{session?.jCompany.razon_social_company}</span>
                                </p>
                              </div>

                              <div>
                                <p>{t['Select the Profile to company']}</p>
                              </div>
                              <div className='companies'>
                                {session?.oEmpresa.map((option) => (
                                  <div
                                    className={`box-companies ${selectedCompanies.includes(option.id_empresa) ? 'selected' : ''}`}
                                    key={option.id_empresa}
                                    onClick={() => toggleCompanySelection(option.id_empresa)}
                                  >
                                    <div className='card'>
                                      <span className='initial'>{option.razon_social_empresa.match(/\b\w/g).join('').slice(0, 2)}</span>
                                    </div>
                                    <label htmlFor={`companies[${option.id_empresa}]`}>{option.razon_social_empresa}</label>
                                  </div>
                                ))}
                              </div>

                            </div>

                          </div>

                          <div className='container-notificatión'>
                            <h4>3.{t.Notifications}</h4>
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

                              <button type='submit' className='btn_primary small' disabled={isSubmitting}>
                                {t.Update}
                              </button>
                            </div>

                            <div className='contentError'>
                              <div className='errorMessage'>{status}</div>
                            </div>

                          </div>

                        </Form>
                      )}
                    </Formik>

                    </div>

                  : <div className='data-profile'>

                    <div className='card-info'>
                      <h4> 1. {t['Personal information']}</h4>

                      <ul>
                        <li>
                          {t.Username}:
                        </li>
                        <li>
                          <span> {session?.sUserName} </span>
                        </li>
                      </ul>

                      <ul>
                        <li>
                          {t['Company email']}:
                        </li>
                        <li>
                          <span> {session?.sCorreo}
                          </span>
                        </li>
                      </ul>

                      <ul>
                        <li>
                          {t.Estatus}:
                        </li>
                        <li>
                          <span> {session?.sDescription} </span>
                        </li>
                      </ul>

                    </div>

                    <div className='card-info'>
                      <h4> 2. {t['Company profile']} </h4>

                      <ul>
                        <li>
                          {t.Corporation}:
                        </li>
                        <li>
                          <span> {session?.jCompany.razon_social_company} </span>
                        </li>
                      </ul>

                      <ul>
                        <li>
                          {t.Companies}:
                        </li>
                        <li>
                          {
                          session?.oEmpresa.map((em, index) => (

                            <p key={em.id_empresa}>
                              <span> </span>

                              <span>
                                {em.razon_social_empresa}
                              </span>

                            </p>
                          ))
}

                        </li>
                      </ul>

                    </div>

                    <div>
                      <h4>3. {t.Notifications}</h4>

                    </div>
                    ....

                    </div>
              }

        </div>

      </div>
    </LayoutProducts>
  )
}
