import React, { useState, useEffect } from 'react'
import EmailsForm from './EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import FormCredentials from './FormCredentials'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import Modal from '@/Components/Modal'
import Loading from '@/Components/Atoms/Loading'
import LoadingComponent from '@/Components/Atoms/LoadingComponent'
import ConfigAccount from './ConfigAccount'
import { formatDate } from '@/helpers/report'

export default function ConfigDowland ({ getBank, registerBank, updateBank, deleteBank, registerAccount, updateAccount, deleteAccount }) {
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [data, setData] = useState(null)
  const [dataCardProduct, setdataCardProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null)
  const [modalConfirmationFinish, setModalConfirmationFinish] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComponent, setIsLoadingComponent] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [completeEmails, setcompleteEmails] = useState(true) // cambiar
  const [completeconfigBank, setCompleteconfigBank] = useState(false)
  const [showAccounts, setShowAccounts] = useState(false)
  const [bankCredential, setBankCredential] = useState(null)
  const [updateEmails, setUpdateEmails] = useState(false)
  const [get, setGet] = useState(false)

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const router = useRouter()
  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId
  const idEmpresa = router.query.idEmpresa

  const { session, setModalToken, logout, l, idCountry,getProducts } = useAuth()

  const t = l.Download

 
  async function handleCommonCodes (response) {
    if (response.oAuditResponse?.iCode === 27) {
      setModalToken(true)
    } else if (response.oAuditResponse?.iCode === 4) {
      await logout()
    } else {
      const errorMessage = response.oAuditResponse ? response.oAuditResponse.sMessage : 'Error in services '
      console.log('errok, ', errorMessage)
      setModalToken(false)
      setRequestError(errorMessage)
      setTimeout(() => {
        setRequestError(null) // Limpiar el mensaje después de 3 segundos
      }, 5000)
    }
  }

  async function handleAgregar (values) {
    setIsLoadingComponent(true)
    const body = {
      oResults: {
        iIdEmpresa: idEmpresa,
        sName: values.name,
        iIdPais: idCountry,
        iBanco: values.bank.id,
        sPassword: values.password,
        sCredencial: values.principalCredential,
        sCredencial2: values.credential2,
        sCredencial3: values.credential3,
        sCredencial4: values.credential4,
        bCodeEnabled: values.state === 'Active'
      }
    }

    try {
      const token = session.sToken

      const responseData = await fetchConTokenPost(`BPasS/?Accion=${registerBank}`, body, token)
    
      if (responseData.oAuditResponse?.iCode === 1) {
        // const data = responseData.oResults
        setTimeout(() => {
          // setDataList(data)
          setModalToken(false)
          setGet(!get)
          setShowForm(false)
          setRequestError(null)
        }, 2000)
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

  const handleEdit = (dataEdit) => {
    setShowForm(true)
    setIinitialEdit(dataEdit)
    setIsEditing(true)
  }

  const handleDeleteConfirmation = async () => {
    if (selectedRowToDelete) {
      const idToDelete = selectedRowToDelete.id_banco_credencial || selectedRowToDelete.id_banco_credencial_est
      //tanto para estractos y estados 
      await handleDeleteBancoCredential(idToDelete)
      setSelectedRowToDelete(null)
    }
  }

  async function handleEditListBank (values) {
    setIsLoadingComponent(true)
    const body = {
      oResults: {
        iIdEmpresa: idEmpresa,
        iIdCredencial: initialEdit?.id_credenciales || initialEdit?.id_credenciales_est,
        iIdBancoCredencial: initialEdit?.id_banco_credencial || initialEdit?.id_banco_credencial_est ,
        sName: values.name,
        iIdPais: idCountry,
        iBanco: values.bank ? values.bank.id : initialEdit ? initialEdit.id_banco : null,
        ...(values.password && { sPassword: values.password }),
        sCredencial: values.principalCredential,
        sCredencial2: values.credential2,
        sCredencial3: values.credential3,
        sCredencial4: values.credential4,
        bCodeEnabled: values.state === 'Active'
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost(`BPasS/?Accion=${updateBank}`, body, token)
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setGet(!get)
        setShowForm(false)
        setIsEditing(false)
        setTimeout(() => {
          setIinitialEdit(null)
          setRequestError(null)
          setShowForm(false)
        }, 2000)
      } else {
        await handleCommonCodes(responseData)
        setShowForm(true)
        setIsEditing(true)
      }
    } catch (error) {
      console.error('error', error)
      // setModalToken(true)
      setShowForm(true)
      setIsEditing(true)
      setRequestError(null)
    } finally {
      setIsLoadingComponent(false)
      setIinitialEdit(null)
    }
  }

  useEffect(() => {
    if (session) {
      getExtrBanc()
    }
  }, [get, idEmpresa, updateEmails, l])

  async function getExtrBanc () {
    setIsLoadingComponent(true)

    const body = {
      oResults: {
        iIdPais: idCountry,
        iIdExtBanc: Number(iIdProdEnv)
      }
    }



    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost(`BPasS/?Accion=${getBank}`, body, token)
     
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const dataRes = responseData.oResults
        setData(dataRes)
        if (dataRes.oCorreoEB.length > 0) {
          setcompleteEmails(true)
        }
        // Verificar si al menos un objeto tiene datos en oListCuentas
        const atLeastOneAccount = haveAccounts(responseData.oResults)

        if (atLeastOneAccount) {
          setCompleteconfigBank(true)
        } else {
          setCompleteconfigBank(false)
        }
      } else {
        await handleCommonCodes(responseData)
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      setIsLoadingComponent(false)
    }
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const handleDeleteBancoCredential = async (idbankcred) => {
    setIsLoadingComponent(true)
    const token = session.sToken
    const body = {
      oResults: {
        iIdExtBanc: parseInt(iIdProdEnv),
        iIdBancoCredencial: idbankcred
      }
    }
    try {
      const response = await fetchConTokenPost(`BPasS/?Accion=${deleteBank}`, body, token)
      console.error('res', body, response)
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setGet(!get)
        setTimeout(() => {}, 1000)
      } else {
        await handleCommonCodes(response)
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación', error)
    } finally {
      setIsLoadingComponent(false)
    }
  }

  const handleAcount = (row) => {
    setBankCredential(row)
    setShowAccounts(true)
  }

  // Función para verificar si un objeto tiene datos en oListCuentas
  const haveAccounts = (data) => data?.oListBancoCredendicial.some((objeto) => objeto.oListCuentas && objeto.oListCuentas.length > 0)

  useEffect(() => {
    getDataProduct()
  }, [idEmpresa, l])

  async function getDataProduct () {
    setIsLoading(true)
    try {
      const token = session.sToken
      const responseData = await getProducts(idEmpresa, token, idCountry)
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
    <section className='config-Automated'>
      {isLoading && <Loading />}

      <div className='Tabsumenu'>
        <div className='Tabsumenu-header '>
          <button className={` ${activeTab === 0 ? 'activeST' : ''} ${completeEmails ? 'completeST' : ''}`} onClick={() => handleTabClick(0)}>
            <ImageSvg name='Check' />
            <h4> {t['Status and emails']} </h4>
          </button>

          <button style={{ visibility: completeEmails ? 'visible' : 'hidden' }} className={` ${activeTab === 1 ? 'activeST' : ''} ${completeconfigBank ? 'completeST' : ''}`} onClick={() => handleTabClick(1)}>
            <ImageSvg name='Check' />
            <h4> {t['Bank and Accounts']} </h4>
          </button>
        </div>

        {requestError && <div className='errorMessage'>{requestError}</div>}

        <div className='Tabsumenu-content'>
          {activeTab === 0 && (
            <div className='container-status'>
              <div className='status-config'>
                <h3 className='title-Config'> {t.State} </h3>
                <ul>
                  <li>
                    <p>{t['Digital employees']}</p>
                    <p>:</p>
                    <p className='name-blue'>
                      <h5>{dataCardProduct?.sName}</h5>
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

              <EmailsForm dataEmails={data?.oCorreoEB} setUpdateEmails={setUpdateEmails} sProduct={dataCardProduct?.sProd} get={get} setGet={setGet} />

              <div className='box-buttons'>
                <button type='button' className={`btn_secundary small ${completeEmails ? ' ' : 'disabled'}`} onClick={() => handleTabClick(1)} disabled={!completeEmails}>
                  {t.Next}
                  <ImageSvg name='Next' />
                </button>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className='config-Automated--tables'>
              {bankCredential && (
                <div className=' title-Config navegation' style={{ justifyContent: 'flex-start' }}>
                  <button
                    onClick={() => {
                      setShowAccounts(false)
                      setBankCredential(null)
                    }}
                  >
                    {t['List Bank Credential']}
                  </button>

                  <ImageSvg name='Navegación' />

                  <span>{bankCredential?.nombre}</span>
                </div>
              )}

              {showAccounts
                ? (
                  <>
                    <ConfigAccount getBank={getBank} registerAccount={registerAccount} updateAccount={updateAccount} deleteAccount={deleteAccount} sProduct={dataCardProduct?.sProd} idbancoCredential={bankCredential?.id_banco_credencial || bankCredential?.id_banco_credencial_est } setShowAccounts={setShowAccounts} OptionBanks={data?.oPaisBanco} setGet={setGet} get={get} />

                    <div className='box-buttons'>
                      <button
                        type='button'
                        className='btn_secundary small  '
                        onClick={() => {
                          setShowAccounts(false)
                          setBankCredential(null)
                        }}
                      >
                        <ImageSvg name='Back' />
                        {t.Previus}
                      </button>
                    </div>
                  </>
                  )
                : (
                  <>
                    <div className='contaniner-tables'>
                      <div className='box-search'>
                        <h3>{t['List Bank Credential']} </h3>
                        <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                          {showForm ? t['Close Form'] : t['+ Add credential']}
                        </button>
                      </div>

                      <div className='tableContainer'>
                        <div className='boards'>
                          {data?.oListBancoCredendicial.length > 0
                            ? (
                              <table className='dataTable'>
                                <thead>
                                  <tr>
                                    <th>{t.Name} </th>
                                    <th>{t['Principal user']} </th>
                                    <th>{t.Bank} </th>
                                    <th>{t.Country} </th>
                                    <th>{t.State} </th>
                                    <th>{t.Accounts} </th>
                                    <th>{t.Actions} </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {data?.oListBancoCredendicial?.map((row) => (
                                    <tr key={row.id_banco_credencial || row.id_banco_credencial_est}>
                                      <td>{row.nombre}</td>
                                      <td>{row.usuario}</td>
                                      <td>{row.nombre_banco}</td>
                                      <td>Perú</td>
                                      <td>
                                        <span className={row.estado_c == '23' ? 'status-active' : 'status-disabled'}>{row.estado_c == '23' ? 'Active' : 'Disabled'}</span>
                                      </td>

                                      <td className='head-status'>
                                        {row.oListCuentas.length > 0
                                          ? (
                                            <button className='btn_green' onClick={() => handleAcount(row)}>
                                              {' '}
                                              {t['Show Accounts']}{' '}
                                            </button>
                                            )
                                          : (
                                            <button className='btn_red' onClick={() => handleAcount(row)}>
                                              {' '}
                                              {t['Add Accounts']}{' '}
                                            </button>
                                            )}
                                      </td>
                                      <td className='box-actions'>
                                        <button className='btn_crud' onClick={() => handleEdit(row)}>
                                          <ImageSvg name='Edit' />{' '}
                                        </button>
                                        <button
                                          className='btn_crud'
                                          onClick={() => {
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
                              )
                            : (
                              <div>
                                <p> {t['Register your bank Credentials']}</p>
                              </div>
                              )}
                        </div>
                        {isLoadingComponent && <LoadingComponent />}
                        {showForm && <FormCredentials onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListBank={handleEditListBank} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} />}
                      </div>

                      {selectedRowToDelete && (
                        <Modal
                          close={() => {
                            setSelectedRowToDelete(null)
                          }}
                        >
                          <ImageSvg name='Question' />

                          <>
                            <h3>{t['Do you want to delete this credential bank ?']}</h3>
                            <div className='box-buttons'>
                              <button type='button' className='btn_primary small' onClick={handleDeleteConfirmation}>
                                {t.YES}
                              </button>
                              <button type='button' className='btn_secundary small' onClick={() => setSelectedRowToDelete(null)}>
                                {t.NOT}
                              </button>
                            </div>
                          </>
                        </Modal>
                      )}
                    </div>

                    {data?.oListBancoCredendicial.length > 0 && (
                      <div>
                        {completeconfigBank
                          ? (
                            <div className='box-buttons'>
                              <button type='button' className='btn_secundary small' onClick={() => handleTabClick(0)}>
                                <ImageSvg name='Back' />

                                {t.Previus}
                              </button>
                              <button className={`btn_secundary small  ${completeconfigBank ? ' ' : 'disabled'}`} onClick={() => setModalConfirmationFinish(true)} disabled={!completeconfigBank}>
                                {t.Next}
                                <ImageSvg name='Next' />
                              </button>
                            </div>
                            )
                          : (
                            <div className='noti'>
                              <p> {t['Register at least one bank account to proceed to the next step in the setup process']}</p>
                              <p>
                                {' '}
                                <span> {t['Please click on Add Accounts']} </span>{' '}
                              </p>
                            </div>
                            )}
                      </div>
                    )}
                  </>
                  )}
            </div>
          )}
        </div>
      </div>

      {modalConfirmationFinish && (
        <Modal
          close={() => {
            setModalConfirmationFinish(false)
          }}
        >
          <div>
            <ImageSvg name='Check' />
          </div>
          <div>
            <h2>{t.Configured} </h2>

            <p>{dataCardProduct?.sName}</p>

            <div className='box-buttons'>
              <button
                type='button'
                className='btn_primary small'
                onClick={() => {
                  router.push('/product')
                  setModalConfirmationFinish(false)
                }}
              >
                {t['Return a home']}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
