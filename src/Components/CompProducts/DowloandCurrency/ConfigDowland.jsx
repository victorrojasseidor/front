/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react'
import EmailsForm from './EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import FormCredentials from './FormCredentials'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import Modal from '@/Components/Modal'
import TabsConfig from './Tabsconfig'
import Link from 'next/link'

export default function ConfigDowland () {
  const [haveEmails, setHaveEmails] = useState(true) // hay correos ?
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [data, setData] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null)
  const [modalConfirmationShedule, setModalConfirmationShedule] = useState(false)

  const [activeTab, setActiveTab] = useState(0)
  const [completeEmails, setcompleteEmails] = useState(false)
  const [completeconfigBank, setCompleteconfigBank] = useState(false)
  const [completeShedule, setCompleteShedule] = useState(false)

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const router = useRouter()
  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId

  const { session, empresa, setModalToken, logout } = useAuth()

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

  async function handleAgregar (values) {
    const body = {
      oResults: {
        iIdEmpresa: empresa?.id_empresa,
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
      // setModalToken(true)
      setShowForm(true)
      setRequestError(error)
      // setStatus("Service error");
    }
  }

  const handleEdit = (dataEdit) => {
    // console.log('handledit', dataEdit)
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
    const body = {
      oResults: {
        iIdEmpresa: empresa?.id_empresa,
        iIdCredencial: initialEdit?.id_credenciales,
        iIdBancoCredencial: initialEdit?.id_banco_credencial,
        sName: values.name,
        iIdPais: 1,
        iBanco: values.bank ? values.bank.id : (initialEdit ? initialEdit.id_banco : null),
        ...(values.password && { sPassword: values.password }),
        // sPassword: values.password ? values.password : initialEdit.password,
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
      // console.log('response', responseData)
      if (responseData.oAuditResponse?.iCode === 1) {
      // const data = responseData.oResults
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
    }
  }

  useEffect(() => {
    if (session) {
      getExtrBanc()
    }
  }, [session, haveEmails, initialEdit, showForm, empresa, selectedRowToDelete])

  async function getExtrBanc () {
    const body = {
      oResults: {
        iIdExtBanc: iIdProdEnv,
        iIdPais: 1
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetExtBancario', body, token)
      console.log('getestractosbancrios', responseData)
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const dataRes = responseData.oResults
        setData(dataRes)

        if (dataRes.oCorreoEB.length > 0) {
          setcompleteEmails(true)
        }
      } else {
        await handleCommonCodes(responseData)
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  // funcio+on de eliminar

  const handleDeleteBancoCredential = async (idbankcred) => {
    const token = session.sToken
    const body = {
      oResults: {
        iIdExtBanc: iIdProdEnv,
        iIdBancoCredencial: idbankcred

      }
    }
    try {
      const response = await fetchConTokenPost('dev/BPasS/?Accion=EliminarBancoCredencialExtBancario', body, token)
      console.log('res', response)
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setTimeout(() => {
        }, 1000)
      } else {
        await handleCommonCodes(response)
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación', error)
    }
  }

  const handleAcount = (row) => {
    console.log('domwla', row)
    router.push(`/product/configura/config?iIdProdEnv=${iIdProdEnv}&iId=${iId}&idbancoCredential=${row.id_banco_credencial}`)
  }

  const runShedule = async () => {
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
        MachineSessionIds: [
          125660
        ],
        RobotIds: [
          5055
        ]
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(bodyP),
        headers: {

          Authorization: 'Bearer  eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUTkVOMEl5T1RWQk1UZEVRVEEzUlRZNE16UkJPVU00UVRRM016TXlSalUzUmpnMk4wSTBPQSJ9.eyJodHRwczovL3VpcGF0aC9lbWFpbCI6Imp2aWxjYW5xdWlAc2VpZG9yLmVzIiwiaHR0cHM6Ly91aXBhdGgvZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vYWNjb3VudC51aXBhdGguY29tLyIsInN1YiI6Im9hdXRoMnxVaVBhdGgtQUFEVjJ8YWIwMzBhMDAtODkxYS00NGJkLWJiNTEtNjhiNjA2MWEzOTQ0IiwiYXVkIjpbImh0dHBzOi8vb3JjaGVzdHJhdG9yLmNsb3VkLnVpcGF0aC5jb20iLCJodHRwczovL3VpcGF0aC5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjk0NzMzODY1LCJleHAiOjE2OTQ4MjAyNjUsImF6cCI6IjhERXYxQU1OWGN6VzN5NFUxNUxMM2pZZjYyaks5M241Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyJ9.Kg8qoPTiREw6Q3MNtx-3m9Yl2-H25u1GS-PHTLrnBLCBeBOQLtINzukzu-mruViHtzatyjUOFk1mAsPR_gazFedefHQHNnlW6GpQ8A60IUzXTSlCHnUCKN_E277L0qsaUvTVzU0eZKB-allrFHPPCpNS4moLtipxLpWRCOzlvpSCH0eS_GhyeoaZKXmyK_YkfZJIjrUAv-_E-PIOmuXfjZLa-rkjMlYwFCU1zxPwKQ4rTl24d509rcgJE37ugV9NkPuV4DTEAKwTc0XAOjiLEmWWylJkTl3m8Ad5U_-f84cVuge9zi0ZjPzrPavMstaiFXpO8HSDh9cttPWGMPSvUg',
          'X-UIPATH-TenantName': 'Tenant_BPaaS',
          'X-UIPATH-OrganizationUnitId': '172516',
          'Content-Type': 'application/json'

        }
      })

      if (response.ok) {
        setModalConfirmationShedule(true)
      } else {
        console.log('res', response)
        throw new Error('Network response was not ok')
      }

      const responseData = await response.json()
      console.log('response shedule', responseData)
      return responseData
    } catch (error) {
      console.error('error', error)
      throw error
    }
  }

  return (
    <section className='config-Automated'>

      <div className='Tabsumenu'>
        <div className='Tabsumenu-header '>
          <button className={` ${activeTab === 0 ? 'activeST' : ''} ${completeEmails ? 'completeST' : ''}`} onClick={() => handleTabClick(0)}>
            <ImageSvg name='Check' />
            <h4> Status and emails </h4>

          </button>

          <button
            className={` ${activeTab === 1 ? 'activeST' : ''} ${completeconfigBank ? 'completeST' : ''}`} onClick={() => handleTabClick(1)}
          >
            <ImageSvg name='Check' />
            <h4>  Bank and Accounts  </h4>
          </button>

          <button className={` ${activeTab === 2 ? 'activeST' : ''} ${completeShedule ? 'completeST' : ''}`} onClick={() => handleTabClick(2)}>
            <ImageSvg name='Check' />
            <h4> Schedule and repository</h4>
          </button>

        </div>
        <div className='Tabsumenu-content'>
          {activeTab === 0 && (

            <div className='container-status'>
              <div className='status-config'>
                <ul>
                  <li>
                    <p>Start service :</p>
                    <p>17/06/2023</p>
                  </li>
                  <li>
                    <p>End service :</p>
                    <p>23/09/2023</p>
                  </li>
                  <li>
                    <p>State :</p>
                    <p className='Active'>Active</p>
                  </li>
                </ul>
              </div>
              {haveEmails
                ? <div className='box-emails'>
                  <h3>Emails for notifications</h3>
                  <div className='card--emails'>
                    <div className='emails'>
                      {data?.oCorreoEB.slice(0, 5).map((email) => (
                        <p key={email.correo_cc}>{email.correo_cc}</p>
                      ))}
                      <span>
                        <button className='btn_crud' onClick={() => setHaveEmails(false)}>
                          <ImageSvg name='Edit' />
                        </button>
                      </span>
                    </div>

                  </div>

                </div> : <div className='config-Automated--emails'>
                    <h3> Register emails</h3>
                    <div className='description'>
                    Add the emails to notify to <b> Download automated Bank Statements </b>
                  </div>
                    <EmailsForm setHaveEmails={setHaveEmails} idproduct={iIdProdEnv} dataEmails={data?.oCorreoEB} />
                           </div>}

            </div>

          )}

          {activeTab === 1 && (
            <div className='config-Automated--tables'>
              <div className='contaniner-tables'>
                <div className='box-search'>
                  <h3>List Bank Credential</h3>
                  {/* <div>Search</div> */}
                  <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                    {showForm ? 'Close Form' : '+ Add credential'}
                  </button>
                </div>
                <div className='boards'>
                  <div className='tableContainer'>
                    <table className='dataTable'>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Principal user</th>
                          <th>Bank</th>
                          <th>Country</th>
                          <th>State</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.oListBancoCredendicial?.map((row) => (
                          <tr key={row.id_banco_credencial}>
                            <td onClick={() => handleAcount(row)}>{row.nombre}</td>
                            <td onClick={() => handleAcount(row)}>{row.usuario}</td>
                            <td onClick={() => handleAcount(row)}>{row.nombre_banco}</td>
                            <td onClick={() => handleAcount(row)}>Perú</td>
                            <td onClick={() => handleAcount(row)}>
                              <span className={row.estado_c == '23' ? 'status-active' : 'status-disabled'}>{row.estado_c == '23' ? 'Active' : 'Disabled'}</span>
                            </td>
                            <td className='box-actions'>
                              <button className='btn_crud' onClick={() => handleEdit(row)}>
                                {' '}
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
                  </div>
                  {showForm && <FormCredentials onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListBank={handleEditListBank} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} />}
                </div>
                {selectedRowToDelete && (
                  <Modal close={() => {
                    setSelectedRowToDelete(null)
                  }}
                  >
                    <div>
                      <h3>Do you want to delete this credential bank list?</h3>
                      <div className='box-buttons'>
                        <button type='button' className='btn_primary small' onClick={handleDeleteConfirmation}>
                          YES
                        </button>
                        <button
                          type='button'
                          className='btn_secundary small'
                          onClick={() => setSelectedRowToDelete(null)}
                        >
                          NOT
                        </button>
                      </div>
                    </div>
                  </Modal>
                )}

                {requestError && <div className='errorMessage'> {
              requestError

              }
                                 </div>}

              </div>

            </div>
          )}
          {activeTab === 2 && (
            <div className='shedule'>

              <h2>
                schedule
              </h2>

              <div className='input-box'>
                <label className='checkbox'>
                  <input className='checkboxId' id='acceptTerms' type='checkbox' name='acceptTerms' />

                  Daily <span>Timezone: (UTC -05:00)</span> Bogota

                </label>

              </div>

              <div>
                <h5>
                  Repository
                </h5>

                <div className='repository'>
                  <span> Register your repository :  </span>

                  <Link href='https://drive.google.com/drive/u/1/folders/1o8_zA0tt3pgWT2-_tgZBAmxokv1F1aGC?pli=1'>
                    See repository
                  </Link>
                </div>

              </div>

              <button
                type='button'
                className='btn_primary'
                onClick={() => runShedule()}
              >
                Run the process
              </button>

            </div>
          )}

          {modalConfirmationShedule && (
            <Modal close={() => setModalConfirmationShedule(false)}>
              <div>
                <h3>
                  Successfully executed
                </h3>
              </div>
            </Modal>
          )}
        </div>
      </div>

      <div />
    </section>
  )
}
