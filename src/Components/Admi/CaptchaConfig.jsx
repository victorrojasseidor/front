import { useAuth } from '@/Context/DataContext'
import { useRouter } from 'next/router'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Button from '../Atoms/Buttons'
import React, { useState, useEffect } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import { IconArrow, IconDate } from '@/helpers/report'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export default function CaptchaConfig () {
  const { session, setModalToken, logout, l, idCountry } = useAuth()
  const t = l.Captcha
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').format('DD/MM/YYYY'))

  const [showPassword, setShowPassword] = useState(false)

  const [data, setData] = useState(null)
  // const [error, setError] = useState(null);
  const [isEmailFieldEnabled, setEmailFieldEnabled] = useState(true)
  const [ShowM, setShowM] = useState(false)
  const [conditions, setConditions] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'))
  }

  return (
    <div className='admin-captcha'>
      <div className=''>
        <h3 className='sub'> {t['Captcha solver settings']} </h3>
        <p className='description'> {t['Configure the captcha solver']} </p>

        <div className='reporting-box '>
          <div className='report-content'>
            <div className='report red'>
              <div className='report_icon  '>
                <ImageSvg name='Profile' />
              </div>

              <div className='report_data'>
                <article>{t['Available balance']}</article>
                <h4> 533883.783</h4>
              </div>
            </div>

            <div className='report  blue'>
              <div className='report_icon  '>
                <ImageSvg name='Support' />
              </div>

              <div className='report_data'>
                <article>{t['Update date']}</article>
                <h4> 14/02/2024</h4>

                <p> </p>
              </div>
            </div>
          </div>
        </div>

        <div className='content'>
          <Formik
            initialValues={{
              api: '',
              user: '',
              password: '',
              balance: '',
              connection: '',
              descripcion: '',
              date: ''
            }}
            validateOnChange
            //   validate={(values) => validateFormRegister(values, l.validation)}
            onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
              // same shape as initial values
              handleSubmit(values, { setSubmitting, setStatus, resetForm })
            }}
            enableReinitialize
          >
            {({ isValid, isSubmitting, status }) => (
              <Form className='form-container '>
                <div className='group'>
                  <div className='input-box'>
                    <Field type='text' id='api' name='api' placeholder=' ' autoComplete='off' disabled={isSubmitting} />
                    <label htmlFor='api'>{t['API key']}</label>
                    <ErrorMessage className='errorMessage' name='api' component='span' />
                  </div>

                  <div className='input-box'>
                    <Field type='text' name='user' id='user' placeholder=' ' disabled={!isEmailFieldEnabled || isSubmitting} />
                    <label htmlFor='user'>{t.User}</label>
                    <ErrorMessage className='errorMessage' name='user' component='span' />
                  </div>

                  <div className='input-box'>
                    <span className='iconPassword' onClick={togglePasswordVisibility}>
                      <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
                    </span>
                    <Field type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder=' ' disabled={isSubmitting} />
                    <label htmlFor='password'>{t.Password}</label>
                    <ErrorMessage className='errorMessage' name='password' component='span' />
                  </div>

                  <div className='input-box'>
                    <Field type='number' name='connection' id='connection' placeholder=' ' />
                    <label htmlFor='connection'>{t['Maximum connections']}</label>
                    <ErrorMessage className='errorMessage' name='connection' component='span' />
                  </div>
                </div>

                <div className='input-box'>
                  <Field type='text' name='descripcion' id='descripcion' placeholder=' ' />
                  <label htmlFor='descripcion'>{t['Connected RPA - description']} ({t.optional}) </label>

                  <ErrorMessage className='errorMessage' name='descripcion' component='span' />
                </div>

                <div className='box-buttons'>
                  <Button className={isValid ? 'btn_primary' : 'btn_primary disabled'} onClick={() => setEmailFieldEnabled(true)} label={isSubmitting ? `${t.Update}${'....'}` : t.Update} />
                </div>

                <div className='contentError'>
                  <div className='errorMessage'>{status}</div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
