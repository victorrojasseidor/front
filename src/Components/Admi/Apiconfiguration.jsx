import { useAuth } from '@/Context/DataContext'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Loading from '@/Components/Atoms/Loading'
import dayjs from 'dayjs'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { fetchConTokenPost } from '@/helpers/fetch'
import Modal from '../Modal'
import ImageSvg from '@/helpers/ImageSVG'
import { getProducts } from '@/helpers/auth'

export default function Apiconfiguration ({ nameEmpresa }) {
  const { session, setModalToken, logout, l } = useAuth()
  const [product, setProduct] = useState(null)
  const router = useRouter()

  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId
  const idEmpresa = router.query.idEmpresa

  const t = l.Apiconfuguration

  const pStatus = product?.iCodeStatus

  async function getDataProduct () {
    setIsLoading(true)
    try {
      const token = session.sToken
      const responseData = await getProducts(idEmpresa, token)
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const data = responseData.oResults
        const selectedProduct = data.find((p) => p.iId === parseInt(iId))
        setProduct(selectedProduct)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse
          ? responseData.oAuditResponse.sMessage
          : 'Error in sending the form'
        setRequestError(errorMessage)
        setTimeout(() => {
          setRequestError(null)
        }, 1000)
      }
    } catch (error) {
      console.error('error', error)
      setRequestError(error)
      setTimeout(() => {
        setRequestError(null)
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const parsedStartDate = dayjs(product?.sDateInit, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' })
  const parsedEndDate = dayjs(product?.sDateEnd, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' })

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [requestError, setRequestError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [valueState, setValueState] = useState(null)
  const [modalConfirmed, setModalConfirmed] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getDataProduct()
  }, [pStatus, valueState, modalConfirmed])

  const handleChangemessage = (event) => {
    setMessage(event.target.value)
  }

  const handleChangeState = (event) => {
    setValueState(event.target.value)
  }

  useEffect(() => {
    if (pStatus == 31) {
      setValueState('NotHiredProducto')
    } else if (pStatus == 27) {
      setValueState('SolicitarProducto')
    } else if (pStatus == 28) {
      setValueState('AprobarSolProducto')
    } else if (pStatus == 23) {
      setValueState('ConfirmarConfiguracion')
    }
  }, [pStatus])

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('DD/MM/YYYY'))
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'))
  }

  async function handleServiceChange () {
    setIsLoading(true)

    const body = {
      oResults: {
        sProd: product?.sProd,
        iIdProdEnv: product?.iIdProdEnv,
        iIdExtBanc: product?.iIdProdEnv,
        sCorreo: session?.sCorreo,
        sTitle: 'Admin',
        sPhoneNumber: session?.sPhone,
        sMessage: message || 'message-Admin',
        sFechaInit: startDate || product?.sDateInit,
        sFechaEnd: endDate || product?.sDateEnd

      }
    }

    try {
      const token = session?.sToken

      const responseData = await fetchConTokenPost(`dev/BPasS/?Accion=${valueState}`, body, token)
      console.log({ responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        // setModalFreeTrial(false)
        setModalConfirmed(false)

        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse
          ? responseData.oAuditResponse.sMessage
          : 'Error in sending the form'
        setRequestError(errorMessage)
        setTimeout(() => {
          setRequestError(null)
        }, 1000)
      }
    } catch (error) {
      console.error('error', error)
      setRequestError(error)
      setTimeout(() => {
        setRequestError(null)
      }, 1000)
    } finally {
      setIsLoading(false) // Ocultar señal de carga
    }
  }

  return (
    <>
      <div className='apiconfiguration'>

        <h1> {t['Service configuration status']} </h1>

        <div className='name-product'>
          <p> <span> {t.Company}:  </span>{nameEmpresa}</p>
          <p> <span>  {t['Digital employees']}: </span>{product?.sName}</p>
          <p className='state'> <span>  {t.State}: </span> {pStatus} - {product?.sDescStatus}  </p>
        </div>

        <div className='subtitle'>
          <h5 className='sub'> {t.State} </h5>
          <p className='description'> {t['Change from any status to uncontracted']}  </p>

          <div className='content'>

            <FormControl>

              <RadioGroup
                row
                aria-labelledby='demo-form-control-label-placement'
                name='position'
                value={valueState}
                onChange={handleChangeState}
              >

                <FormControlLabel
                  value='NotHiredProducto'
                  control={<Radio color='success' />}
                  label='not hired'
                />

                <FormControlLabel
                  value='SolicitarProducto'
                  control={<Radio color='success' />}
                  label='free trial'
                />

                <FormControlLabel
                  value='AprobarSolProducto'
                  control={<Radio color='success' />}
                  label='Aprobar para soliicic'
                />
                <FormControlLabel
                  value='ConfirmarConfiguracion'
                  control={<Radio color='success' />}
                  label='configurado'
                />

              </RadioGroup>

            </FormControl>

          </div>
        </div>

        <div className='date'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t.From}
              value={dayjs(parsedStartDate, 'DD/MM/YYYY')}
              slotProps={{
                textField: {
                  helperText: t['Service start date']
                }

              }}
              onChange={handleStartDateChange}
              format='DD/MM/YYYY'
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t.To}
              value={dayjs(parsedEndDate, 'DD/MM/YYYY')}
              slotProps={{
                textField: {
                  helperText: t['End of service date']
                }

              }}
              onChange={handleEndDateChange}
              format='DD/MM/YYYY'
            />
          </LocalizationProvider>

        </div>

        <div className='input-box'>

          <textarea
            value={message}
            onChange={handleChangemessage}
            placeholder=''
            rows={4}
            cols={40}
            style={{ height: 'auto', minHeight: '3rem' }}
          />
          <label htmlFor='message'> mensaje  </label>

        </div>

        <button
          type='button'
          className='btn_primary small'
          onClick={() => { setModalConfirmed(true) }}
        >
          Send
        </button>

        {isLoading && <Loading />}

      </div>

      {modalConfirmed && (
        <Modal close={() => { setModalConfirmed(false) }}>
          <ImageSvg name='Question' />

          <h3>
            {t['You want to approve the setup of this company']}
          </h3>

          <div className='box-buttons'>
            <button
              type='button'
              className='btn_primary small'
              onClick={() => { handleServiceChange() }}
            >
              {t.Yees}
            </button>

            <button
              type='button'
              className='btn_primary small'
              onClick={() => { setModalConfirmed(false) }}
            >
              {t.No}
            </button>

          </div>

        </Modal>
      )}

      {requestError && <div className='errorMessage'> {requestError}</div>}

    </>

  )
}
