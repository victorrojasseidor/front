import React, { useState, useEffect } from 'react'
import EmailsForm from '../DowloandCurrency/EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import Modal from '@/Components/Modal'
import LoadingComponent from '@/Components/Atoms/LoadingComponent'
import { getProducts } from '@/helpers/auth'
import { formatDate } from '@/helpers/report'

export default function ConfigPattern () {
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [dataTypeChange, setDataTypeChange] = useState(null)
  const [dataCardProduct, setdataCardProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComponent, setIsLoadingComponent] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [completeEmails, setcompleteEmails] = useState(false)
  const [completeConfigDayly, setCompleteConfigDayly] = useState(false)
  const [completeConfigMontly, setCompleteConfigMontly] = useState(false)
  const [typeOfChange, setTypeofChange] = useState(0)
  const [updateEmails, setUpdateEmails] = useState(false)

  const handleTabClick = (index) => {
    setActiveTab(index)
  }
  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const router = useRouter()
  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId
  const idEmpresa = router.query.idEmpresa

  const { session, setModalToken, logout, l } = useAuth()

  const t = l.Currency

  async function handleCommonCodes (response) {
    if (response.oAuditResponse?.iCode === 27) {
      setModalToken(true)
    } else if (response.oAuditResponse?.iCode === 4) {
      await logout()
    } else {
      const errorMessage = response.oAuditResponse ? response.oAuditResponse.sMessage : 'Error in delete '
      console.log('errok, ', errorMessage)
      setModalToken(false)
      setRequestError(errorMessage)
      setTimeout(() => {
        setRequestError(null) // Limpiar el mensaje después de 3 segundos
      }, 5000)
    }
  };

  //   async function handleAgregar (values) {
  //     setIsLoadingComponent(true)

  //     const body = {
  //       oResults: {

  //         oTipoCambio: [
  //           {

  //             iIdTipCamb: parseInt(iIdProdEnv),
  //             iIdPais: values.country,
  //             iIdMonedaOrigen: values.coinOrigin,
  //             iIdMonedaDestino: values.coinDestiny,
  //             iIdFuente: values.fuente,
  //             iDiasAdicional: values.days,
  //             iIdTiempoTipoCambio: typeOfChange,
  //             bEstado: values.state === 'Active'
  //           }
  //         ]
  //       }

  //     }

  //     console.log({ body })

  //     try {
  //       const token = session.sToken

  //       const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarTipoCambio', body, token)
  //       console.log({ responseData })
  //       if (responseData.oAuditResponse?.iCode === 1) {
  //         // const data = responseData.oResults
  //         setTimeout(() => {
  //           setModalToken(false)
  //           setShowForm(false)
  //           setRequestError(null)
  //         }, 1000)
  //       } else {
  //         await handleCommonCodes(responseData)
  //         setShowForm(true)
  //       }
  //     } catch (error) {
  //       console.error('error', error)

  //       setShowForm(true)
  //       setRequestError(error)
  //     } finally {
  //       setIsLoadingComponent(false)
  //     }
  //   }

  useEffect(() => {
    if (session) {
    //   getTipCambio()
    }
  }, [updateEmails, showForm, selectedRowToDelete])

  useEffect(() => {
    getDataProduct()
  }, [idEmpresa, updateEmails])

  async function getDataProduct () {
    setIsLoading(true)
    try {
      const token = session.sToken
      const responseData = await getProducts(idEmpresa, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const data = responseData.oResults
        const selectedProduct = data.find((p) => p.iId === parseInt(iId))
        setdataCardProduct(selectedProduct)
      } else {
        await handleCommonCodes(responseData)
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='currency_configurations'>

      <div className='Tabsumenu'>
        <div className='Tabsumenu-header '>
          <button className={` ${activeTab === 0 ? 'activeST' : ''} ${completeEmails ? 'completeST' : ''}`} onClick={() => handleTabClick(0)}>
            <ImageSvg name='Check' />
            <h4> {t['Status and emails']} </h4>
          </button>

          <button style={{ visibility: completeEmails ? 'visible' : 'hidden' }} className={` ${activeTab === 1 ? 'activeST' : ''} ${completeConfigDayly ? 'completeST' : ''}`} onClick={() => handleTabClick(1)}>
            <ImageSvg name='Check' />
            <h4>  {t['Daily exchange rate']}  </h4>
          </button>

        </div>

        <div className='Tabsumenu-content'>
          {activeTab === 0 &&
            <div className='container-status'>
              {/* <h1> {t['Currency Exchange rates automation']} </h1> */}

              <div className='status-config'>
                <h3 className='title-Config'> {t.State} </h3>
                <ul>

                  <li>
                    <p>{t['Digital employees']}</p>
                    <p>:</p>
                    <p className='name-blue'>
                      {dataCardProduct?.sName}
                    </p>

                  </li>
                  <li>

                    <p>{t['Start service:']}</p>
                    <p>:</p>
                    <p> {formatDate(dataCardProduct?.sDateInit)}</p>
                  </li>
                  <li>
                    <p>{t['End service:']}</p>
                    <p>:</p>
                    <p> {formatDate(dataCardProduct?.sDateEnd)} </p>
                  </li>
                  <li>
                    <p>{t.Country} </p>
                    <p>:</p>
                    <p>{dataCardProduct?.sCountry}</p>
                  </li>
                  <li>
                    <p>{t.State} </p>
                    <p>:</p>
                    <p className='Active'>{dataCardProduct?.sDescStatus}</p>
                  </li>
                </ul>
              </div>

              <EmailsForm dataEmails={dataTypeChange?.oCorreo} setUpdateEmails={setUpdateEmails} sProduct={dataCardProduct?.sProd} />

              <div className='box-buttons'>
                <button
                  type='button'
                  className={`btn_secundary small ${completeEmails ? ' ' : 'disabled'}`}
                  onClick={() => handleTabClick(1)}
                  disabled={!completeEmails}
                >
                  {t.Next}
                  <ImageSvg name='Next' />
                </button>
              </div>

            </div>}

          {activeTab === 1 &&

            <div>
              aqui va configuiration
            </div>}

        </div>

        {/* {showForm &&

          <FormCurrency
            onAgregar={handleAgregar} dataTypeChange={dataTypeChange} initialVal={isEditing ? initialEdit : null}
            setIinitialEdit={setIinitialEdit}
            handleEditCurrency={handleEditCurrency}
            setShowForm={setShowForm}
            typeOfChange={typeOfChange}
          />}

        {selectedRowToDelete && (
          <Modal close={() => {
            setSelectedRowToDelete(null)
          }}
          >
            <ImageSvg name='Question' />

            <div>
              <h3>{t['Do you want to delete this record']}</h3>
              <div className='box-buttons'>
                <button type='button' className='btn_primary small' onClick={handleDeleteConfirmation}>
                  {t.Yeah}
                </button>
                <button
                  type='button'
                  className='btn_secundary small'
                  onClick={() => setSelectedRowToDelete(null)}
                >
                  {t.No}
                </button>
              </div>
            </div>
          </Modal>
        )} */}

      </div>

    </div>
  )
}
