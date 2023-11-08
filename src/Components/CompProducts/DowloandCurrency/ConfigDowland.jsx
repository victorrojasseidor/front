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
  }, [initialEdit, showForm, idEmpresa, selectedRowToDelete, showAccounts, updateEmails])

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

  const runShedule = async () => {
    setIsLoadingComponent(true)
    const url = 'https://cloud.uipath.com/seidovnzrjnf/Tenant_BPaaS/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs'
    const bodyP = {
      startInfo: {
        ReleaseKey: '9d06a0b6-56fe-41eb-b40e-932b1afe385e',
        JobsCount: 1,
        JobPriority: null,
        SpecificPriorityValue: null,
        Strategy: 'ModernJobsCount',
        ResumeOnSameContext: false,
        RuntimeType: 'Unattended',
        RunAsMe: false,
        InputArguments: '{}',
        MachineSessionIds: [125660],
        RobotIds: [5055]
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(bodyP),

        headers: {
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUTkVOMEl5T1RWQk1UZEVRVEEzUlRZNE16UkJPVU00UVRRM016TXlSalUzUmpnMk4wSTBPQSJ9.eyJodHRwczovL3VpcGF0aC9lbWFpbCI6Imp2aWxjYW5xdWlAc2VpZG9yLmVzIiwiaHR0cHM6Ly91aXBhdGgvZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vYWNjb3VudC51aXBhdGguY29tLyIsInN1YiI6Im9hdXRoMnxVaVBhdGgtQUFEVjJ8YWIwMzBhMDAtODkxYS00NGJkLWJiNTEtNjhiNjA2MWEzOTQ0IiwiYXVkIjpbImh0dHBzOi8vb3JjaGVzdHJhdG9yLmNsb3VkLnVpcGF0aC5jb20iLCJodHRwczovL3VpcGF0aC5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjk1MTc3MDIyLCJleHAiOjE2OTUyNjM0MjIsImF6cCI6IjhERXYxQU1OWGN6VzN5NFUxNUxMM2pZZjYyaks5M241Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyJ9.UQFksgkq3nYZt83ySjOoqb4zA9odpq-2wKCSojv60L6HehD1XiNdN10YORUffS_IjGUHCB53WqudMiQabKap2IavqYceaKCE7Xg62mMVGA47LxENOYsCap2xXs8hEC5qzllUZ-rKpnLZ9FHNxQe1hdjfx89Iugc2uZKspaa3QII6svgPJugETxMJsBpjdo8eHWYYUDSG4eQvVbRHcSt-wR9t1XHuC_Y5QmMowsHVVzfLu3_7BQIXH5WEIUrypEzGVHB-LtTCZa07bSP4MktnQAVxTcNAzn22hw2mhCnab2yt0_blvMT3SEvI878QQD-lYEullkUCi8kj-gQFyP5GyA',
          'Content-Type': 'application/json',
          'X-UIPATH-TenantName': 'Tenant_BPaaS',
          'X-UIPATH-OrganizationUnitId': '172516',

          Cookie: '__cf_bm=G2aRGtZF1xEjwPAfgJtiMEo0JT6p9oo1xZpEVjJgM54-1695220323-0-AUvpwiYDiFDHAG/c/Z76VpcEyoY98/QuVsR6sYpOeyZRVdYMwd/3Ux8U0DiyxZ1IiLKY2BLXFBAmiQyTe0CROdE='
        }
      })

      if (response.ok) {
        const result = await response.text()
        console.log({ result })
      } else {
        console.log('Error en la solicitud:', response, response.statusText)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error.message)
    } finally {
      setIsLoadingComponent(false)
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
              bankCredential && <div className='navegation '>

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

                  <div className='box-search'>
                    <h3>{t['List Bank Credential']} </h3>
                    <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                      {showForm ? t['Close Form'] : t['+ Add credential']}
                    </button>
                  </div>

                  <div className='contaniner-tables'>

                    <div className='boards'>
                      <div className='tableContainer'>

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

              <div className='repository'>

                <h5>
                  {t.Repository}
                </h5>

                <Formik
                  initialValues={{
                    Repository: 'https://drive.google.com/drive/u/2/folders/1s2Ot16GFkN7d534ur12hNj7PPVv7alDs'

                  }}

                  onSubmit={() => { console.log('inout ') }}
                >
                  {({ isSubmitting }) => (
                    <Form style={{ width: '70%' }}>
                      <div className='input-box'>
                        <Field type='text' name='repository' placeholder='' readOnly />
                        <label htmlFor='repository'>{t['Repository path']}</label>
                        <Link href='https://drive.google.com/drive/u/2/folders/1s2Ot16GFkN7d534ur12hNj7PPVv7alDs'>
                          {t['See repository']}
                        </Link>
                        <ErrorMessage className='errorMessage' name='repository' component='div' />

                      </div>

                    </Form>
                  )}
                </Formik>

              </div>

              <div />
              {session.jCompany.id_company == 4
                ? <button
                    type='button'
                    className={`btn_primary small ${completeShedule ? ' ' : 'disabled'}`}
                    onClick={runShedule}
                    disabled={!completeShedule}
                  >
                  <ImageSvg name='Automation' />
                  {t['Run automation']}
                  </button>
                : ''}
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
