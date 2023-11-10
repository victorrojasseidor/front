import React, { useState, useEffect } from 'react'
import EmailsForm from '../DowloandCurrency/EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import Modal from '@/Components/Modal'
import LoadingComponent from '@/Components/Atoms/LoadingComponent'
import Link from 'next/link'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { getProducts } from '@/helpers/auth'
import { formatDate } from '@/helpers/report'
import FormCurrency from './FormCurrency'

export default function ConfigCurrency () {
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [dataTypeChange, setDataTypeChange] = useState(null)
  const [dataCardProduct, setdataCardProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null)
  const [modalConfirmationShedule, setModalConfirmationShedule] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComponent, setIsLoadingComponent] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [completeEmails, setcompleteEmails] = useState(false)
  const [completeConfigDayly, setCompleteConfigDayly] = useState(true)
  const [completeConfigMontly, setCompleteConfigMontly] = useState(true)

  const [showAccounts, setShowAccounts] = useState(false)
  // const [bankCredential, setBankCredential] = useState(null)
  // const [modalConfirmationEmail, setModalConfirmationEmail] = useState(false)
  // Estado para almacenar si el checkbox está marcado o no

  const [updateEmails, setUpdateEmails] = useState(false)

  const handleTabClick = (index) => {
    setActiveTab(index)
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

  console.log({ dataTypeChange })

  async function handleAgregar (values) {
    setIsLoadingComponent(true)

    console.log('values', values)

    const body = {
      oResults: {

        oTipoCambio: [
          {

            iIdTipCamb: parseInt(iIdProdEnv),
            iIdPais: values.country,
            iIdMonedaOrigen: values.coinOrigin,
            iIdMonedaDestino: values.coinDestiny,
            iIdFuente: values.fuente,
            iDiasAdicional: values.days,
            iIdTiempoTipoCambio: 1,
            sEstado: 'X'
          }
        ]
      }

    }

    console.log(body)

    try {
      const token = session.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarTipoCambio', body, token)
      console.log({ responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        // const data = responseData.oResults
        setTimeout(() => {
          setModalToken(false)
          setShowForm(false)
          setRequestError(null)
        }, 1000)
      } else {
        await handleCommonCodes(responseData)
        setShowForm(true)
      }
    } catch (error) {
      console.error('error', error)

      setShowForm(true)
      setRequestError(error)
    } finally {
      setIsLoadingComponent(false)
    }
  }

  useEffect(() => {
    if (session) {
      getTipCambio()
    }
  }, [updateEmails, showForm, selectedRowToDelete])

  const toggleForm = () => {
    setShowForm(!showForm)
  }

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

  async function getTipCambio () {
    setIsLoadingComponent(true)
    const body = {
      oResults: {
        iIdTipCamb: iIdProdEnv,
        iIdPais: 1
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetTipCambio', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const dataRes = responseData.oResults
        setDataTypeChange(dataRes)
        if (dataRes.oCorreo.length > 0) {
          setcompleteEmails(true)
        }
        // Verificar si al menos un objeto tiene datos en oListCuentas
        // const atLeastOneAccount = haveAccounts(responseData.oResults)

        // if (atLeastOneAccount) {
        //   setCompleteconfigBank(true)
        // } else {
        //   setCompleteconfigBank(false)
        // }
      } else {
        await handleCommonCodes(responseData)
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      setIsLoadingComponent(false)
    }
  }

  const handleDeleteConfirmation = async () => {
    if (selectedRowToDelete) {
      await handleDeleteTypeChange(selectedRowToDelete.id_moneda_fuente_tipo_cambio)
      setSelectedRowToDelete(null)
    }
  }

  const handleDeleteTypeChange = async (idbankcred) => {
    setIsLoadingComponent(true)
    const token = session.sToken
    const body = {
      oResults: {
        oIdRegistro: [
          idbankcred
        ]

      }
    }
    try {
      const response = await fetchConTokenPost('dev/BPasS/?Accion=EliminarTipoCambio', body, token)
      console.error('res', response)
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setTimeout(() => {
        }, 1000)
      } else {
        await handleCommonCodes(response)
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación', error)
    } finally {
      setIsLoadingComponent(false)
    }
  }



  
  return (
    <div className='Currency_configurations'>

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

          <button style={{ visibility: completeConfigMontly ? 'visible' : 'hidden' }} className={` ${activeTab === 2 ? 'activeST' : ''} ${completeConfigMontly ? 'completeST' : ''}`} onClick={() => handleTabClick(2)}>
            <ImageSvg name='Check' />
            <h4> {t['Monthly exchange rate']}</h4>
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
                    <p> {formatDate(dataCardProduct?.sDateEnd)}</p>
                  </li>
                  <li>
                    <p>{t['End service:']}</p>
                    <p>:</p>
                    <p> {formatDate(dataCardProduct?.sDateInit)} </p>
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
            <div className='config-Automated--tables'>

              <div className='box-search'>
                <div>
                  <h3>{t['Daily exchange rate']} </h3>
                  <p> {t['Add the setting for Daily exchange rate']} </p>
                </div>

                <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                  {showForm ? t.Close : t.Add}
                </button>
              </div>

              <div className='contaniner-tables'>

                <div className='boards'>
                  <div className='tableContainer'>

                    <table className='dataTable'>

                      <thead>
                        <tr>
                          <th>{t.Country} </th>
                          <th> {t['Portal Available']}</th>
                          <th> {t['Source Currency']}</th>

                          <th> {t['Target currency']}</th>
                          <th> {t['Additional days']}</th>

                          <th>{t.State} </th>

                          <th>{t.Actions} </th>
                        </tr>
                      </thead>

                      <tbody>

                        {dataTypeChange?.oDailyExchange?.map((row) => (
                          <tr key={row.id_moneda_fuente_tipo_cambio}>
                            <td>{row.descripcion_pais}</td>
                            <td>{row.nombre} </td>
                            <td>{row.descripcion_moneda_origen}</td>
                            <td>{row.descripcion_moneda_destino}</td>
                            <td>{row.dias_adicional}</td>

                            <td>
                              <span className={row.estado == '23' ? 'status-active' : 'status-disabled'}>{row.estado == '23' ? 'Active' : 'Disabled'}</span>
                            </td>

                            <td className='box-actions'>
                              <button className='btn_crud' onClick={() => handleEdit(row)}>
                                <ImageSvg name='Edit' />{' '}
                              </button>
                              <button
                                className='btn_crud' onClick={() => {
                                  setSelectedRowToDelete(row)
                                }}
                              >
                                <ImageSvg name='Delete' />
                              </button>
                            </td>

                          </tr>
                        ))}

                      </tbody>
                    </table>
                    <div>
                      <p> {t['Register your bank Credentials']}

                      </p>

                    </div>

                  </div>
                  {isLoadingComponent && <LoadingComponent />}
                  {showForm &&

                    <FormCurrency
                      onAgregar={handleAgregar} dataTypeChange={dataTypeChange} initialVal={isEditing ? initialEdit : null}
                    // setIinitialEdit={setIinitialEdit}
                      setShowForm={setShowForm}
                    />}
                </div>

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
                )}
                {requestError && <div className='errorMessage'>{requestError}</div>}

              </div>

              {
                  dataTypeChange?.oMonthExchange.length > 0 && <div>
                    {completeConfigDayly
                      ? (
                        <div className='box-buttons'>
                          <button
                            type='button'
                            className='btn_secundary small'
                            onClick={() => handleTabClick(0)}
                          >
                            <ImageSvg name='Back' />

                            {t.Previus}
                          </button>
                          <button
                            className={`btn_secundary small  ${completeConfigDayly ? ' ' : 'disabled'}`}
                            onClick={() => handleTabClick(2)}
                            disabled={!completeConfigDayly}
                          >
                            {t.Next}
                            <ImageSvg name='Next' />
                          </button>
                        </div>

                        )
                      : (

                        <div className='noti'>
                          <p> {t['Register at least one bank account to proceed to the next step in the setup process']}

                          </p>
                          <p> <span> {t['Please click on Add Accounts']} </span> </p>
                        </div>

                        )}
                  </div>
}

            </div>}

          {activeTab === 2 &&
            <div className='config-Automated--tables'>

              <div className='box-search'>
                <div>
                  <h3>{t['Monthly exchange rate']} </h3>
                  <p> {t['This exchange rate is used for the monthly accounting closing']} </p>
                </div>

                <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                  {showForm ? t.Close : t.Add}
                </button>
              </div>

              <div className='contaniner-tables'>

                <div className='boards'>
                  <div className='tableContainer'>

                    <table className='dataTable'>

                      <thead>
                        <tr>
                          <th>{t.Country} </th>
                          <th> {t['Portal Available']}</th>
                          <th> {t['Source Currency']}</th>

                          <th> {t['Target currency']}</th>
                          <th> {t['Additional days']}</th>

                          <th>{t.State} </th>

                          <th>{t.Actions} </th>
                        </tr>
                      </thead>

                      <tbody>

                        {dataTypeChange?.oMonthExchange?.map((row) => (
                          <tr key={row.id_moneda_fuente_tipo_cambio}>
                            <td>{row.descripcion_pais}</td>
                            <td>{row.nombre} </td>
                            <td>{row.descripcion_moneda_origen}</td>
                            <td>{row.descripcion_moneda_destino}</td>
                            <td>{row.dias_adicional}</td>

                            <td>
                              <span className={row.estado == '23' ? 'status-active' : 'status-disabled'}>{row.estado == '23' ? 'Active' : 'Disabled'}</span>
                            </td>

                            <td className='box-actions'>
                              <button className='btn_crud' onClick={() => handleEdit(row)}>
                                <ImageSvg name='Edit' />{' '}
                              </button>
                              <button
                                className='btn_crud' onClick={() => {
                                  setSelectedRowToDelete(row)
                                }}
                              >
                                <ImageSvg name='Delete' />
                              </button>
                            </td>

                          </tr>
                        ))}

                      </tbody>
                    </table>
                    <div>
                      <p> {t['Register your bank Credentials']}

                      </p>

                    </div>

                  </div>
                  {isLoadingComponent && <LoadingComponent />}
                  {showForm && <FormCurrency
                    onAgregar={handleAgregar} dataTypeChange={dataTypeChange} initialVal={isEditing ? initialEdit : null}

                 // setIinitialEdit={setIinitialEdit}

                    setShowForm={setShowForm}
                               />}
                </div>

                {selectedRowToDelete && (
                  <Modal close={() => {
                    setSelectedRowToDelete(null)
                  }}
                  >
                    <ImageSvg name='Question' />

                    <div>
                      <h3>{t['Do you want to delete this credential bank ?']}</h3>
                      <div className='box-buttons'>
                        <button type='button' className='btn_primary small' onClick={handleDeleteConfirmation}>
                          {t.YES}
                        </button>
                        <button
                          type='button'
                          className='btn_secundary small'
                          onClick={() => setSelectedRowToDelete(null)}
                        >
                          {t.NOT}
                        </button>
                      </div>
                    </div>
                  </Modal>
                )}
                {requestError && <div className='errorMessage'>{requestError}</div>}

              </div>

              {
               dataTypeChange?.oDailyExchange.length > 0 && <div>
                 {completeConfigDayly
                   ? (
                     <div className='box-buttons'>
                       <button
                         type='button'
                         className='btn_secundary small'
                         onClick={() => handleTabClick(1)}
                       >
                         <ImageSvg name='Back' />

                         {t.Previus}
                       </button>
                       <button
                         className={`btn_secundary small  ${completeConfigDayly ? ' ' : 'disabled'}`}
                         onClick={() => handleTabClick(2)}
                         disabled={!completeConfigDayly}
                       >
                         {t.Next}
                         <ImageSvg name='Next' />
                       </button>
                     </div>

                     )
                   : (

                     <div className='noti'>
                       <p> {t['Register at least one bank account to proceed to the next step in the setup process']}

                       </p>
                       <p> <span> {t['Please click on Add Accounts']} </span> </p>
                     </div>

                     )}
               </div>
}

            </div>}
        </div>
      </div>

    </div>
  )
}
