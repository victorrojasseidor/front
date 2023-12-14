/* eslint-disable multiline-ternary */
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
import Link from 'next/link'
import Button from '@mui/material/Button'
import ImageSvg from '@/helpers/ImageSVG'
import Loading from '@/Components/Atoms/Loading'

export default function profile () {
  const [edit, setEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formValues, setFormValues] = useState({})
  const [country, setCountrySelect] = useState('')

  const { session, setSession, setModalToken, logout, l } = useAuth()

  const t = l.profile

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

    setIsLoading(true)

    const body = {
      oResults: {
        sEmail: session.sCorreo,
        sUserName: session.sUserName,
        sLastName: values.lastName,
        sCodePhone: values.countryCode.value,
        sPhone: values.phoneNumber,
        bCodeNotEmail: true,
        bCodeNotBpas: true,
        oEmpresa: oEmpresaSelect
      }
    }

    const tok = session?.sToken

    console.log({ body })

    try {
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarUsuarioEnd', body, tok)
      console.log('Response', responseData)
      if (responseData.oAuditResponse.iCode == 30 || responseData.oAuditResponse.iCode == 1) {
        setStatus(null)
        setModalToken(false)
        setEdit(false)
        // setSession()
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
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
    } finally {
      setIsLoading(false) // Ocultar el indicador de carga después de que la petición se complete
    }
  }

  console.log({ session })

  return (
    <LayoutProducts menu='Profile'>
      <NavigationPages title='Profile'>
        <Link href='/product'>Home</Link>
      </NavigationPages>

      <div className='profile'>
        <div className='box-action'>
          {edit
            ? (
                ''
              )
            : (
              <button className='btn_primary small' onClick={() => setEdit(!edit)}>
                {' '}
                {t['Edit profile']}
              </button>
              )}
        </div>

        <div>
          {edit ? (
            <div className='edit-profile style-container'>
              <h2> {t['Edit profile']} </h2>

              <Formik
                initialValues={{
                  name: session?.sUserName,
                  lastName: session?.sLastName,
                  countryCode: countryOptions[0], // Valor inicial de Perú
                  phoneNumber: session?.sPhone,
                  notificationsInBpass: session?.bCodeNotBpas,
                  emailNotifications: session?.bCodeNotEmail,
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
                    <div className='form-container_editProfile'>
                      <div>
                        <h3> {t['Personal information']}</h3>
                        <div className='box-forms'>
                          <div className='input-box'>
                            <Field type='text' name='name' placeholder=' ' />
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
                            <Field type='email' name='corporateEmail' placeholder=' ' value={session?.sCorreo || ''} readOnly />
                            <label htmlFor='corporateEmail'>{t['Company email']}</label>
                          </div>
                        </div>

                      </div>

                      <div className='notification-container'>
                        <h3>{t.Notifications}</h3>
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
                      </div>

                      <div className='box-buttons'>
                        <button type='submit' className='btn_secundary small' onClick={() => setEdit(false)}>
                          {t.Cancel}
                        </button>

                        <button type='submit' className='btn_primary small' disabled={isSubmitting}>
                          {t.Update}
                        </button>
                      </div>

                    </div>

                    <div className='contentError'>
                      <div className='errorMessage'>{status}</div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <div className='data-profile'>
              <div className='info-personal style-container'>
                <div className='box-name'>
                  <div className='box-img'>
                    <span className='img'>
                      {' '}
                      <ImageSvg name='Person' />
                    </span>

                    <h3>
                      {' '}
                      {session?.sUserName} {session?.sLastName}{' '}
                    </h3>
                    <p>{session?.sPerfilCode}</p>
                  </div>

                  <ul className='list-personal'>
                    <li>
                      <h2> 2</h2>
                      <p>{t.Companies} </p>
                    </li>
                    <li>
                      <h2> 3</h2>
                      <p>{t['Digital employees']} </p>
                    </li>
                  </ul>
                </div>

                <div className='box-information'>
                  <h3> {t['Personal information']}</h3>
                  <ul className='list-information'>
                    <li className='card-perfil'>
                      <span>{t.Username}</span>
                      <p> {session?.sUserName}</p>
                    </li>

                    <li className='card-perfil'>
                      <span>{t['Last Name']}</span>
                      <p> {session?.sLastName}</p>
                    </li>

                    <li className='card-perfil'>
                      <span>{t['Phone Number']}</span>
                      <p> {session?.sPhone}</p>
                    </li>

                    <li className='card-perfil'>
                      <span>{t['Company email']}</span>
                      <p> {session?.sCorreo}</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='box-companies'>
                <div className='info-companies style-container'>
                  <h3> {t['Company profile']}</h3>
                  {/* <p> bdbkjrndlkdmldkd </p> */}

                  <ul className='box-cards'>
                    <li className='card-perfil'>
                      <span>{t.Corporation}</span>
                      <p> {session?.jCompany.razon_social_company || 'Admin'}</p>
                    </li>

                    <li className='card-perfil'>
                      <span>{t.Estatus}</span>
                      <p> {session?.sDescription}</p>
                    </li>
                  </ul>

                  <ul>
                    <li className='card-perfil companies'>
                      <span>{t.Companies}</span>

                      <div className=''>
                        {session?.oEmpresa.map((em, index) => (
                          <p key={em.id_empresa}>{em.razon_social_empresa}</p>
                        ))}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className='info-notifi style-container'>
                  <h3> {t.Notifications}</h3>

                  <ul>
                    <li>{t['Notifications in ARI']}</li>
                    <li>{t['Email notifications']}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        {isLoading && <Loading />}
      </div>
    </LayoutProducts>
  )
}
