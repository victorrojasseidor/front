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

export default function anterior ({ nameEmpresa }) {
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
  console.log(product)

  const parsedStartDate = dayjs(product?.sDateInit, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' })
  const parsedEndDate = dayjs(product?.sDateEnd, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' })

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [requestError, setRequestError] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const [valueNotHired, setValueNotHired] = useState(null)
  const [modalNotHired, setModalNotHired] = useState(false)

  const [valueFreeTrial, setValueFreeTrial] = useState(null)
  const [modalFreeTrial, setModalFreeTrial] = useState(false)

  const [valueApproved, setValueApprobed] = useState(null)
  const [modalApproved, setModalApproved] = useState(false)

  const [valueConfirmed, setValueConfirmed] = useState(null)
  const [modalConfirmed, setModalConfirmed] = useState(false)

  console.log(startDate, endDate)

  useEffect(() => {
    getDataProduct()
  }, [iIdProdEnv, valueConfirmed, valueApproved, modalApproved, modalConfirmed, t, modalFreeTrial, modalNotHired])

  const handleChangeNotHired = (event) => {
    setValueNotHired(event.target.value)
    if (event.target.value === 'Active') {
      // Muestra el modal de confirmación
      setModalNotHired(true)
    }
  }

  const handleChangeFreeTrial = (event) => {
    setValueFreeTrial(event.target.value)
    if (event.target.value === 'Active') {
      // Muestra el modal de confirmación
      setModalFreeTrial(true)
    }
  }

  const handleChangeAprobed = (event) => {
    setValueApprobed(event.target.value)
    if (event.target.value === 'Active') {
      // Muestra el modal de confirmación
      setModalApproved(true)
    }
  }

  const handleChangeConfirmed = (event) => {
    setValueConfirmed(event.target.value)
    if (event.target.value === 'Active') {
      // Muestra el modal de confirmación
      setModalConfirmed(true)
    }
  }

  useEffect(() => {
    if (pStatus == 31) {
      setValueNotHired('Active')
    } else {
      setValueNotHired('Disabled')
    }

    if (pStatus == 27) {
      setValueFreeTrial('Active')
    } else {
      setValueFreeTrial('Disabled')
    }

    if (pStatus == 28) {
      setValueApprobed('Active')
    } else {
      setValueApprobed('Disabled')
    }

    if (pStatus === 23) {
      setValueConfirmed('Active')
    } else {
      setValueConfirmed('Disabled')
    }
  }, [pStatus])

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('DD/MM/YYYY'))
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'))
  }

  async function handleServiceNotHired () {
    setIsLoading(true)
    const body = {
      oResults: {
        sProd: product?.sProd,
        iIdProdEnv: product?.iIdProdEnv,
        sCorreo: session?.sCorreo,
        sTitle: 'Not hired- Admin',
        sPhoneNumber: session?.sPhone,
        sMessage: 'Not hired- Admin'

      }
    }

    try {
      const token = session?.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=NotHiredProducto', body, token)
      console.log({ responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setModalNotHired(false)
        setValueNotHired('Active')
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

  async function handleServiceFreeTrial () {
    setIsLoading(true)
    const body = {
      oResults: {
        sProd: product?.sProd,
        iIdProdEnv: product?.iIdProdEnv,
        sCorreo: session?.sCorreo,
        sTitle: 'Free trial - Admin',
        sPhoneNumber: session?.sPhone,
        sMessage: 'Free trial - Admin'

      }
    }

    try {
      const token = session?.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=SolicitarProducto', body, token)
      console.log({ responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setModalFreeTrial(false)
        setValueFreeTrial('Active')
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

  async function handleApproveFreetrial () {
    setIsLoading(true)
    const body = {
      oResults: {
        sProd: product?.sProd,
        iIdProdEnv: product?.iIdProdEnv

      }
    }

    try {
      const token = session?.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=AprobarSolProducto', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setModalApproved(false)
        setValueApprobed('Active')
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

  async function handleconfirmedConfiguration () {
    setIsLoading(true)
    const body = {
      oResults: {
        sProd: product?.sProd,
        iIdProdEnv: product?.iIdProdEnv,
        iIdExtBanc: product?.iIdProdEnv

      }
    }

    try {
      const token = session?.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=ConfirmarConfiguracion', body, token)
      console.log({ responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalConfirmed(false)
        setValueConfirmed('Active')
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
          <h5 className='sub'>  {t['Not Hired Status']}</h5>
          <p className='description'> {t['Change from any status to uncontracted']} - {t.State}:31 </p>

          <div className='content'>

            <FormControl>

              <RadioGroup
                row
                aria-labelledby='demo-form-control-label-placement'
                name='position'
                value={valueNotHired}
                onChange={handleChangeNotHired}
              >

                <FormControlLabel
                  value='Active'
                  control={<Radio color='success' />}
                  label={t.Approve}
                />

                <FormControlLabel
                  value='Disabled'
                  control={<Radio sx={{
                    color: 'grey',
                    '&.Mui-checked': {
                      color: 'red'
                    }
                  }}
                           />}
                  label={t.Disapprove}
                />

              </RadioGroup>

            </FormControl>

          </div>
        </div>

        <div className='subtitle'>
          <h5 className='sub'>  {t['Requested Status']}</h5>
          <p className='description'> {t['Service requested by digital employees (Free trial)']} - {t.State}:27 </p>

          <div className='content'>

            <FormControl>

              <RadioGroup
                row
                aria-labelledby='demo-form-control-label-placement'
                name='position'
                value={valueFreeTrial}
                onChange={handleChangeFreeTrial}
              >

                <FormControlLabel
                  value='Active'
                  control={<Radio color='success' />}
                  label={t.Approve}
                />

                <FormControlLabel
                  value='Disabled'
                  control={<Radio sx={{
                    color: 'grey',
                    '&.Mui-checked': {
                      color: 'red'
                    }
                  }}
                           />}
                  label={t.Disapprove}
                />

              </RadioGroup>

            </FormControl>

          </div>
        </div>

        <div className='subtitle'>
          <h5 className='sub'>  {t['Status Pending configuration']}</h5>
          <p className='description'> {t['Change to configuration pending state']} - {t.State}:28 </p>

          {pStatus == 31
            ? <div className='state-message'> {t['This digital employee is not yet requested']}</div>
            : <div className='content dates-box'>

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

              <div className='box-state'>
                <FormControl>

                  <RadioGroup
                    row
                    aria-labelledby='demo-form-control-label-placement'
                    name='position'
                    value={valueApproved}
                    onChange={handleChangeAprobed}
                  >

                    <FormControlLabel
                      value='Active'
                      control={<Radio color='success' />}
                      label={t.Approve}
                    />

                    <FormControlLabel
                      value='Disabled'
                      control={<Radio sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: 'red'
                        }
                      }}
                               />}
                      label={t.Disapprove}
                    />

                  </RadioGroup>

                </FormControl>
              </div>

            </div>}
        </div>

        <div className='subtitle'>
          <h5 className='sub'> {t['Configured status']} </h5>
          <p className='description'>{t['Change to configured state']} - {t.State}:23 </p>

          {pStatus == 28 || pStatus == 23
            ? <div className='content box-filter'>

              <div className='content'>

                <FormControl>

                  <RadioGroup
                    row
                    aria-labelledby='demo-form-control-label-placement'
                    name='position'
                    value={valueConfirmed}
                    onChange={handleChangeConfirmed}
                  >

                    <FormControlLabel
                      value='Active'
                      control={<Radio color='success' />}
                      label={t.Approve}
                    />

                    <FormControlLabel
                      value='Disabled'
                      control={<Radio sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: 'red'
                        }
                      }}
                               />}
                      label={t.Disapprove}
                    />

                  </RadioGroup>

                </FormControl>
              </div>

              </div>
            : <div className='state-message'> {t['Not configured yet']}</div>}

        </div>

        {isLoading && <Loading />}

      </div>

      {modalNotHired && (
        <Modal close={() => { setModalNotHired(false); setValueNotHired('Disabled') }}>
          <ImageSvg name='Question' />

          <h3>
            {t['You want to change the status to Not-hired']}
          </h3>

          <div className='box-buttons'>
            <button
              type='button'
              className='btn_primary small'
              onClick={() => { handleServiceNotHired() }}
            >
              {t.Yees}
            </button>

            <button
              type='button'
              className='btn_primary small'
              onClick={() => { setValueNotHired('Disabled') }}
            >
              {t.No}
            </button>

          </div>

        </Modal>
      )}

      {modalFreeTrial && (
        <Modal close={() => { setModalFreeTrial(false); setValueFreeTrial('Disabled') }}>
          <ImageSvg name='Question' />

          <h3>
            {t['Change to requested status']}
          </h3>

          <div className='box-buttons'>
            <button
              type='button'
              className='btn_primary small'
              onClick={() => { handleServiceFreeTrial() }}
            >
              {t.Yees}
            </button>

            <button
              type='button'
              className='btn_primary small'
              onClick={() => { setValueFreeTrial('Disabled') }}
            >
              {t.No}
            </button>

          </div>

        </Modal>
      )}

      {modalApproved && (
        <Modal close={() => { setModalApproved(false); setValueApprobed('Disabled') }}>
          <ImageSvg name='Question' />

          <h3>
            {t['You want to enable settings for this company']}
          </h3>

          <div className='box-buttons'>
            <button
              type='button'
              className='btn_primary small'
              onClick={() => { handleApproveFreetrial() }}
            >
              {t.Yees}
            </button>

            <button
              type='button'
              className='btn_primary small'
              onClick={() => { setValueApprobed('Disabled'); setModalApproved(false) }}
            >
              {t.No}
            </button>

          </div>

        </Modal>
      )}

      {modalConfirmed && (
        <Modal close={() => { setModalConfirmed(false); setValueConfirmed('Disabled') }}>
          <ImageSvg name='Question' />

          <h3>
            {t['You want to approve the setup of this company']}
          </h3>

          <div className='box-buttons'>
            <button
              type='button'
              className='btn_primary small'
              onClick={() => { handleconfirmedConfiguration() }}
            >
              {t.Yees}
            </button>

            <button
              type='button'
              className='btn_primary small'
              onClick={() => { setValueConfirmed('Disabled'); setModalConfirmed(false) }}
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
