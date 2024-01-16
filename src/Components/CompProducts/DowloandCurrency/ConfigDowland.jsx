import React, { useState, useEffect } from 'react'
import EmailsForm from './EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import FormCredentials from './FormCredentials'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import Modal from '@/Components/Modal'
import TabsConfig from './Tabsconfig'
import Loading from '@/Components/Atoms/Loading'
import LoadingComponent from '@/Components/Atoms/LoadingComponent'
import NavigationPages from '@/Components/NavigationPages'
import Link from 'next/link'
import ConfigAccount from './ConfigAccount'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { getProducts } from '@/helpers/auth'
import { formatDate } from '@/helpers/report'

export default function ConfigDowland () {
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [data, setData] = useState(null)
  const [dataCardProduct, setdataCardProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null)
  const [modalConfirmationShedule, setModalConfirmationShedule] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComponent, setIsLoadingComponent] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [completeEmails, setcompleteEmails] = useState(false)
  const [completeconfigBank, setCompleteconfigBank] = useState(false)
  const [completeShedule, setCompleteShedule] = useState(false)
  const [showAccounts, setShowAccounts] = useState(false)
  const [bankCredential, setBankCredential] = useState(null)
  const [updateEmails, setUpdateEmails] = useState(false)
  const [get, setGet] = useState(false)

  // Estado para almacenar si el checkbox está marcado o no
  const [isChecked, setIsChecked] = useState(false)

  // Función para manejar el cambio de estado del checkbox
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked)
  }

  useEffect(() => {
    if (isChecked) {
      setCompleteShedule(true)
    } else {
      setCompleteShedule(false)
    }
  }, [isChecked])

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const router = useRouter()
  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId
  const idEmpresa = router.query.idEmpresa

  const { session, setModalToken, logout, l } = useAuth()

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
  };

  async function handleAgregar (values) {
    setIsLoadingComponent(true)
    const body = {
      oResults: {
        iIdEmpresa: idEmpresa,
        sName: values.name,
        iIdPais: 1,
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

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarExtBancario', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        // const data = responseData.oResults
        setTimeout(() => {
          // setDataList(data)
          setModalToken(false)
          setGet(!get)
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

  const handleEdit = (dataEdit) => {
    setShowForm(true)
    setIinitialEdit(dataEdit)
    setIsEditing(true)
  }

  const handleDeleteConfirmation = async () => {
    if (selectedRowToDelete) {
      await handleDeleteBancoCredential(selectedRowToDelete.id_banco_credencial)
      setSelectedRowToDelete(null)
    }
  }

  async function handleEditListBank (values) {
    setIsLoadingComponent(true)
    const body = {
      oResults: {
        iIdEmpresa: idEmpresa,
        iIdCredencial: initialEdit?.id_credenciales,
        iIdBancoCredencial: initialEdit?.id_banco_credencial,
        sName: values.name,
        iIdPais: 1,
        iBanco: values.bank ? values.bank.id : (initialEdit ? initialEdit.id_banco : null),
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
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=ActualizarExtBancario', body, token)
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
  }, [get, idEmpresa, updateEmails])

  async function getExtrBanc () {
    setIsLoadingComponent(true)
    const body = {
      oResults: {
        iIdExtBanc: iIdProdEnv,
        iIdPais: 1
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetExtBancario', body, token)
      console.log('get', responseData)
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
        iIdExtBanc: iIdProdEnv,
        iIdBancoCredencial: idbankcred

      }
    }
    try {
      const response = await fetchConTokenPost('dev/BPasS/?Accion=EliminarBancoCredencialExtBancario', body, token)
      console.error('res', response)
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setGet(!get)
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

  const handleAcount = (row) => {
    setBankCredential(row)
    setShowAccounts(true)
  }

  // obtener el token

  const getToken = async () => {
    try {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
      myHeaders.append('Cookie', '__cf_bm=GMHDiUtTatiuiC1CXX.28tdsv3OeMMonu3iKj9ZmFK8-1704317969-1-ASvMCfPQ97jY6Rj+FLd72sxRp8HOgXzu88b/MnxyMhN/VOYZlfTylTB9J+qzNCMJCPv28mR4ikOrTdwfaYzmLzU=')

      const urlencoded = new URLSearchParams()
      urlencoded.append('grant_type', 'client_credentials')
      urlencoded.append('client_id', 'dde9aed6-97b2-4cb7-b61c-3602cfa9fd18')
      urlencoded.append('client_secret', 't#qdBDY$7A*(HKH%')
      urlencoded.append('scope', 'OR.Jobs OR.Jobs.Read OR.Jobs.Write')

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      }

      const response = await fetch('https://cloud.uipath.com/identity_/connect/token', requestOptions)
      const result = await response.text()
      const resultJSON = JSON.parse(result)
      return resultJSON
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const runSchedule = async () => {
    try {
      // Obtiene el token utilizando la función getToken
      const obtainedToken = await getToken()

      console.log({ obtainedToken })
      const token = obtainedToken?.access_token
      const toke = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2RTAyOEZCRDk1MzlFNTY3MjU2MjY1OTZGRkQyQjk0OUU3MjEwMkIiLCJ4NXQiOiJodUFvLTlsVG5sWnlWaVpaYl8wcmxKNXlFQ3MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2Nsb3VkLnVpcGF0aC5jb20vaWRlbnRpdHlfIiwibmJmIjoxNzA0MzE3NjY5LCJpYXQiOjE3MDQzMTc5NjksImV4cCI6MTcwNDMyMTU2OSwiYXVkIjoiVWlQYXRoLk9yY2hlc3RyYXRvciIsInNjb3BlIjpbIk9SLkpvYnMiLCJPUi5Kb2JzLlJlYWQiLCJPUi5Kb2JzLldyaXRlIl0sInN1Yl90eXBlIjoic2VydmljZS5leHRlcm5hbCIsInBydF9pZCI6IjAwNDg1YWQwLWY3M2EtNGJiZS1iZmRkLTJkZDg2NzE3ZjRlMiIsImNsaWVudF9pZCI6ImRkZTlhZWQ2LTk3YjItNGNiNy1iNjFjLTM2MDJjZmE5ZmQxOCIsImp0aSI6IjYzODJFQThBMTBGMENGNDAzNjI1NEQzMEFBQzdCQ0JGIn0.KXfyKw_sOOgHcW2pqfGI1sPkTdCoEh_B47GNy0KTMrS0KxMrgtS96poGBSWoMDYSG_gigVjxVxxBzgdWw98N9y7jHYUS36P46H69Rh5S_Qz-E1d4VUlEGZ3JwO90mPV6aajXOf4jZnuQXbewiuuQG7p7T8nI1ZYNHlB7OG49rgq20bSjfxqfhlvNaVZRm31eZUTwXeEvTtjUHr_pCpNlAvhZ6_A3Dzs5GjqN4XIftwKb49j4fbeJVyO0py7_lvYECM45NR3Og42ojFE58gEcAoWyl-fPCERSnrYiB6QXdidsqDpbpjSnriWBuvfrchDTASsD9iMr0YrrZmqt_Ng5eg'

      console.log(token)
      // Configuración de los encabezados de la solicitud
      const myHeaders = new Headers()
      myHeaders.append('Authorization', `Bearer ${token}`)
      myHeaders.append('X-UIPATH-TenantName', 'DefaultTenant')
      myHeaders.append('X-UIPATH-OrganizationUnitId', '3785083')
      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Cookie', '__cf_bm=GMHDiUtTatiuiC1CXX.28tdsv3OeMMonu3iKj9ZmFK8-1704317969-1-ASvMCfPQ97jY6Rj+FLd72sxRp8HOgXzu88b/MnxyMhN/VOYZlfTylTB9J+qzNCMJCPv28mR4ikOrTdwfaYzmLzU=')

      // Cuerpo de la solicitud
      const raw = JSON.stringify({
        startInfo: {
          ReleaseKey: '2b717bf0-65bb-451d-a267-7ea101572091',
          RobotIds: [],
          JobsCount: 1,
          JobPriority: 'Normal',
          Strategy: 'ModernJobsCount',
          RuntimeType: 'Unattended',
          InputArguments: ''
        }
      })

      // Configuración de las opciones de la solicitud
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        // mode: 'no-cors', // Agrega esta línea para activar el modo "no-cors"
        redirect: 'follow'
      }

      // Realiza la solicitud a la API utilizando fetch
      const apiUrl = 'https://cloud.uipath.com/demo_rch/DefaultTenant/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs'
      const apiResponse = await fetch(apiUrl, requestOptions)

      // Procesa la respuesta de la API
      const responseDataSchedule = await apiResponse.text()
      console.log(responseDataSchedule)

      const resultJSON = JSON.parse(responseDataSchedule)
      return resultJSON
    } catch (error) {
      console.error('Error al realizar la solicitud:', error)
    }
  }

  // Función para verificar si un objeto tiene datos en oListCuentas
  const haveAccounts = (data) => data?.oListBancoCredendicial.some(
    (objeto) => objeto.oListCuentas && objeto.oListCuentas.length > 0
  )

  useEffect(() => {
    getDataProduct()
  }, [idEmpresa])

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
            <h4>  {t['Bank and Accounts']}  </h4>
          </button>

          <button style={{ visibility: completeconfigBank ? 'visible' : 'hidden' }} className={` ${activeTab === 2 ? 'activeST' : ''} ${completeShedule ? 'completeST' : ''}`} onClick={() => handleTabClick(2)}>
            <ImageSvg name='Check' />
            <h4> {t['Schedule and repository']}</h4>
          </button>
        </div>

        <div className='Tabsumenu-content'>
          {activeTab === 0 &&
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

              <EmailsForm dataEmails={data?.oCorreoEB} setUpdateEmails={setUpdateEmails} sProduct={dataCardProduct?.sProd} />

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

              {
              bankCredential && <div className=' title-Config navegation' style={{ justifyContent: 'flex-start' }}>

                <button onClick={() => { setShowAccounts(false); setBankCredential(null) }}>
                  {t['List Bank Credential']}
                </button>

                <ImageSvg name='Navegación' />

                <span>

                  {bankCredential?.nombre}
                </span>

              </div>
            }

              {showAccounts
                ? <>
                  <ConfigAccount idbancoCredential={bankCredential?.id_banco_credencial} setShowAccounts={setShowAccounts} OptionBanks={data?.oPaisBanco} />

                  <div className='box-buttons'>
                    <button
                      type='button'
                      className='btn_secundary small  '
                      onClick={() => { setShowAccounts(false); setBankCredential(null) }}
                    >
                      <ImageSvg name='Back' />
                      {t.Previus}
                    </button>

                  </div>
                </>

                : <>

                  <div className='contaniner-tables'>

                    <div className='box-search'>
                      <h3>{t['List Bank Credential']} </h3>
                      <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                        {showForm ? t['Close Form'] : t['+ Add credential']}
                      </button>
                    </div>

                    <div className='tableContainer'>

                      <div className='boards'>

                        {data.oListBancoCredendicial.length > 0
                          ? <table className='dataTable'>

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
                                <tr key={row.id_banco_credencial}>
                                  <td>{row.nombre}</td>
                                  <td>{row.usuario}</td>
                                  <td>{row.nombre_banco}</td>
                                  <td>Perú</td>
                                  <td>
                                    <span className={row.estado_c == '23' ? 'status-active' : 'status-disabled'}>{row.estado_c == '23' ? 'Active' : 'Disabled'}</span>
                                  </td>

                                  <td className='head-status'>
                                    {row.oListCuentas.length > 0
                                      ? <button className='btn_green' onClick={() => handleAcount(row)}> {t['Show Accounts']} </button>
                                      : <button className='btn_red' onClick={() => handleAcount(row)}>     {t['Add Accounts']}  </button>}
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
                          : <div>
                            <p> {t['Register your bank Credentials']}

                            </p>

                            </div>}

                      </div>
                      {isLoadingComponent && <LoadingComponent />}
                      {showForm && <FormCredentials onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListBank={handleEditListBank} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} />}
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
                  data.oListBancoCredendicial.length > 0 && <div>
                    {completeconfigBank
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
                            className={`btn_secundary small  ${completeconfigBank ? ' ' : 'disabled'}`}
                            onClick={() => handleTabClick(2)}
                            disabled={!completeconfigBank}
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

                </>}

            </div>}

          {activeTab === 2 &&
            <div className='shedule'>
              <h2>
                {t.Schedule}
              </h2>
              <div className='input-box'>
                <label className='checkbox'>
                  <input
                    className='checkboxId'
                    id='acceptTerms'
                    type='checkbox'
                    name='acceptTerms'
                    checked={isChecked} // Establece el estado del checkbox
                    onChange={handleCheckboxChange}
                  />
                  <span>   <strong>{t.Daily}:  </strong>   {t.Timezone} (UTC -05:00) Bogota </span>
                </label>
              </div>

              <div />

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
                  type='button'
                  className='btn_primary small'
                  onClick={() => setModalConfirmationShedule(true)}
                >
                  {t.Next}
                  <ImageSvg name='Next' />
                </button>
              </div>
            </div>}
        </div>
      </div>

      {modalConfirmationShedule && (
        <Modal close={() => {
          setModalConfirmationShedule(false)
        }}
        >
          <div>
            <ImageSvg name='Check' />
          </div>
          <div>

            <h2>{t.Configured}  </h2>

            <p>
              {t['Download automated Bank Statements']}
            </p>

            <div className='box-buttons'>

              <button
                type='button'
                className='btn_primary small'
                onClick={() => { router.push('/product'); setModalConfirmationShedule(false) }}
              >
                {t['Return a Digital Employees']}
              </button>

            </div>

          </div>
        </Modal>
      )}

    </section>
  )
}
