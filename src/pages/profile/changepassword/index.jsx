import Link from 'next/link'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import React, { useState } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import { validateFormUpdatePassword } from '@/helpers/validateForms'
import { useRouter } from 'next/router'
import { useAuth } from '@/Context/DataContext'
import LayoutProducts from '@/Components/LayoutProducts'
import NavigationPages from '@/Components/NavigationPages'
import Loading from '@/Components/Atoms/Loading'
import Modal from '@/Components/Modal'

import { fetchConTokenPost } from '@/helpers/fetch'

export default function changepassword () {
  const [showPasswordOld, setShowPasswordOld] = useState(false)
  const [showPasswordNew, setShowPasswordNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmedUpdate, setConfirmedUpdate] = useState(false)
  const { session, setModalToken, logout, l } = useAuth()

  const togglePasswordVisibilityOld = () => {
    setShowPasswordOld(!showPasswordOld)
  }

  const togglePasswordVisibilityNew = () => {
    setShowPasswordNew(!showPasswordNew)
  }

  const t = l.update_password
  const router = useRouter()

  async function handleUpdatePassword (values, { setSubmitting, setStatus, resetForm, setFieldValue }) {
    setIsLoading(true)

    const body = {
      oResults: {
        sPasswordOld: values.passwordold,
        sPasswordNew: values.passwordnew

      }
    }

    const tok = session?.sToken

    try {
      const responseData = await fetchConTokenPost('BPasS?Accion=CambioPassword', body, tok)
      if (responseData.oAuditResponse.iCode == 1) {
        setStatus(null)
        setModalToken(false)
        setConfirmedUpdate(true)
        setFieldValue('passwordold', '') // Vaciar el campo passwordold
        setFieldValue('passwordnew', '') // Vaciar el campo passwordnew
        setSubmitting(false)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 43) {
        setStatus(t['Update failed. The current password is incorrect'])
        setTimeout(() => {
          setFieldValue('passwordold', '') // Vaciar el campo passwordold
          setSubmitting(false)
          setStatus(null)
        }, 8000)
      } else {
        const message = responseData?.oAuditResponse.sMessage
        setStatus(message)
        setConfirmedUpdate(false)
        setTimeout(() => {
          setStatus(null)
          setFieldValue('passwordold', '') // Vaciar el campo passwordold
          setFieldValue('passwordnew', '') // Vaciar el campo passwordnew
          setSubmitting(false)
        }, 5000)

        setModalToken(false)
      }
    } catch (error) {
      console.error('Error:', error)
      throw new Error('Hubo un error en la operación asincrónica.')
    } finally {
      setIsLoading(false)
    }
  }

  return (

    <LayoutProducts menu='Profile'>
      <NavigationPages title='Profile'>
        <Link href='/profile'>{t.Profile}</Link>
        <ImageSvg name='Navegación' />

        <Link href='#'>
          {t['Update password']}
        </Link>
      </NavigationPages>

      <div className='profile'>
        {isLoading && <Loading />}

        <div className='style-container'>

          <div className='register'>
            <h2> {t['Update password']}</h2>
            <p>{t['Please enter the correct current password and the desired new password']}  </p>

            <Formik
              initialValues={{
                corporateEmail: '',
                password: ''
              }}
              validateOnChange
              validate={(values) => validateFormUpdatePassword(values, l.validation)}
              onSubmit={(values, { setSubmitting, setStatus, resetForm, setFieldValue }) => {
                handleUpdatePassword(values, { setSubmitting, setStatus, resetForm, setFieldValue })
              }}
              enableReinitialize
            >
              {({ isValid, isSubmitting, status }) => (
                <Form className='form-container'>

                  <div className='input-box'>
                    <span className='iconPassword' onClick={togglePasswordVisibilityOld}>
                      <ImageSvg name={showPasswordOld ? 'ShowPassword' : 'ClosePassword'} />
                    </span>
                    <Field type={showPasswordOld ? 'text' : 'password'} id='passwordold' name='passwordold' placeholder=' ' />
                    <label htmlFor='passwordold'>  {t['Current password']}</label>
                    <ErrorMessage className='errorMessage' name='passwordold' component='span' />
                  </div>

                  <div className='input-box'>
                    <span className='iconPassword' onClick={togglePasswordVisibilityNew}>
                      <ImageSvg name={showPasswordNew ? 'ShowPassword' : 'ClosePassword'} />
                    </span>
                    <Field type={showPasswordNew ? 'text' : 'password'} id='passwordnew' name='passwordnew' placeholder=' ' />
                    <label htmlFor='passwordnew'>  {t['New password']}</label>
                    <ErrorMessage className='errorMessage' name='passwordnew' component='span' />
                  </div>

                  <button type='submit' disabled={isSubmitting} className={isValid ? 'btn_primary' : 'btn_primary disabled'}>
                    {t.Update}
                  </button>

                  <div className='contentError'>
                    <div className='errorMessage'>{status}</div>
                  </div>
                </Form>
              )}
            </Formik>

          </div>

        </div>

        {confirmedUpdate && (
          <Modal close={() => {
            setConfirmedUpdate(false)
          }}
          >
            <ImageSvg name='Check' />

            <div>
              <h3>{t['Password updated successfully']}</h3>
              <div className='box-buttons'>
                <button type='button' className='btn_primary small' onClick={() => { setConfirmedUpdate(false); router.push('/profile') }}>
                  {t['Go to profile']}
                </button>

              </div>
            </div>
          </Modal>
        )}

      </div>
    </LayoutProducts>
  )
}
