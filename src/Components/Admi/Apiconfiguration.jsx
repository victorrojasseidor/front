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
  const [stateInitial, setStateInitial] = useState(null)
  const [modalConfirmed, setModalConfirmed] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getDataProduct()
  }, [pStatus, valueState, modalConfirmed, startDate, endDate])

  const handleChangemessage = (event) => {
    setMessage(event.target.value)
  }

  const handleChangeState = (event) => {
    setValueState(event.target.value)
  }

  useEffect(() => {
    if (pStatus == 31) {
      setValueState('NotHiredProducto')
      setStateInitial('NotHiredProducto')
    } else if (pStatus == 27) {
      setValueState('SolicitarProducto')
      setStateInitial('SolicitarProducto')
    } else if (pStatus == 28) {
      setValueState('AprobarSolProducto')
      setStateInitial('AprobarSolProducto')
    } else if (pStatus == 23) {
      setValueState('ConfirmarConfiguracion')
      setStateInitial('ConfirmarConfiguracion')
    }
  }, [pStatus])

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('YYYY-MM-DDTHH:mm:ss.SSSZ'))
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('YYYY-MM-DDTHH:mm:ss.SSSZ'))
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
        sFechaInit: startDate || product.sDateInit,
        sFechaEnd: endDate || product.sDateEnd
        // sFechaInit: '2023-10-01',
        // sFechaEnd: '2024-03-01'
      }
    }

    try {
      const token = session?.sToken

      const responseData = await fetchConTokenPost(`dev/BPasS/?Accion=${valueState}`, body, token)
      console.log({ responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        // setModalFreeTrial(false)
        setModalConfirmed(false)
        setEndDate(null)
        setStartDate(null)
        setMessage(null)

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
  const formatDate = (date) => {
    // Crear un objeto Date a partir de la fecha ISO y asegurarse de que esté en UTC
    const fechaObjeto = new Date(date)

    // Obtener las partes de la fecha (mes, día y año)
    const mes = (fechaObjeto.getUTCMonth() + 1).toString().padStart(2, '0') // +1 porque los meses comienzan en 0
    const dia = fechaObjeto.getUTCDate().toString().padStart(2, '0')
    const año = fechaObjeto.getUTCFullYear()

    // Formatear la fecha en el formato deseado (DD/MM/YYYY)
    const fechaFormateada = `${dia}/${mes}/${año}`
    return fechaFormateada
  }

  return (
    <>
      <div className='apiconfiguration'>

        <h1> {t['Service configuration status']} </h1>

        <div className='name-product'>
          <p> <span> {t.Company}:  </span>{nameEmpresa}</p>
          <p> <span>  {t['Digital employees']}: </span>{product?.sName}</p>
          <p className='state'> <span>  {t.State}: </span> {pStatus} - {product?.sDescStatus}  </p>
          <p> <span>  {t['Service start date']}: </span>{formatDate(product?.sDateInit)}</p>
          <p> <span>  {t['End of service date']}: </span>{formatDate(product?.sDateEnd)}</p>
        </div>

        <div className='subtitle'>
          <h5 className='sub'> {t['Update the status']} </h5>
          <p className='description'> {t['Update the status of digital employees']}  </p>

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
                  control={<Radio />}
                  label={t['Not hired']}
                />

                <FormControlLabel
                  value='SolicitarProducto'
                  control={<Radio color='success' />}
                  label={t['Free Trial']}
                />

                <FormControlLabel
                  value='AprobarSolProducto'
                  control={<Radio />}
                  label={t.Pending}
                />
                <FormControlLabel
                  value='ConfirmarConfiguracion'
                  control={<Radio />}
                  label={t.Configured}
                />

              </RadioGroup>

            </FormControl>

          </div>
        </div>

        {valueState == 'AprobarSolProducto'
          ? <div className='date'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t.From}
                value={dayjs(parsedStartDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ')}
                slotProps={{
                  textField: {
                    helperText: t['Service start date']
                  }

                }}
                onChange={handleStartDateChange}
                format='DD-MM-YYYY'
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t.To}
                value={dayjs(parsedEndDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ')}
                slotProps={{
                  textField: {
                    helperText: t['End of service date']
                  }

                }}
                onChange={handleEndDateChange}
                format='DD-MM-YYYY'
              />
            </LocalizationProvider>

          </div>
          : ''}

        {valueState !== stateInitial || startDate || endDate
          ? <div className='box-buttons' style={{ justifyContent: 'flex-start' }}>
            <button
              type='button'
              className='btn_primary small'
              onClick={() => { setModalConfirmed(true) }}
            >
              {t.Update}

            </button>

            <button
              type='button'
              className='btn_secundary small'
              onClick={() => {
                setValueState(stateInitial); setEndDate(null)
                setStartDate(null)
              }}
            >
              {t.Cancel}

            </button>

          </div>
          : ''}

        {isLoading && <Loading />}

      </div>

      {modalConfirmed && (
        <Modal close={() => { setModalConfirmed(false) }}>
          <ImageSvg name='Question' />

          <h3>
            {t['Do you want to update the status?']}
          </h3>

          <div className='input-box'>

            <textarea
              value={message}
              onChange={handleChangemessage}
              placeholder=''
              rows={4}
              cols={40}
              style={{ height: 'auto', minHeight: '3rem' }}
            />
            <label htmlFor='message'> {t.Message} ({t.optional})  </label>

          </div>

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
