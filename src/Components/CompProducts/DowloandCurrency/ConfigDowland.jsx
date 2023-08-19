/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react'
import EmailsForm from './EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import AddCredentials from './AddCredentials'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
// import { useRouter } from 'next/navigation'
import Modal from '@/Components/Modal'
import CryptoJS from 'crypto-js'

export default function ConfigDowland () {
  const [haveEmails, setHaveEmails] = useState(true) // hay correos ?
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [data, setData] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [requestError, setRequestError] = useState('')

  const router = useRouter()
  // const id = router.query.iId
  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId

  const { session, empresa, setModalToken } = useAuth()

  async function handleAgregar (values) {
    console.log('values',iIdProdEnv, values);
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
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('errok, ', errorMessage)
        setRequestError(errorMessage)
        setModalToken(true)
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

  async function handleEditListBank (values) {
    // console.log('valueseditando', values)

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
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('errorsolicitudUpdate, ', errorMessage)
        setRequestError(errorMessage)
        setTimeout(() => {
          setRequestError(null) // Limpiar el mensaje después de 3 segundos
        }, 5000)

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
  }, [session,haveEmails,initialEdit,showForm])

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
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setData(data)
        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('error, ', errorMessage)
        // setModalToken(true)

        // setStatus(errorMessage);
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
        setShowModalDelete(false)
        setTimeout(() => {
          setShowModalDelete(false)
        }, 1000)
      } else {
        const errorMessage = response.oAuditResponse ? response.oAuditResponse.sMessage : 'Error in delete '
        console.log('errok, ', errorMessage)
        setModalToken(true)
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación', error)
    }
  }

  const handleAcount = (row) => {
    console.log('domwla', row)
    router.push(`/product/configura/config?iIdProdEnv=${iIdProdEnv}&iId=${iId}&idbancoCredential=${row.id_banco_credencial}`)
  }

  return (
    <section className='config-Automated'>
      {haveEmails && data?.oCorreoEB?.length >= 1 ? (
        <div className='config-Automated--tables'>
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
            <div className='box-emails'>
              <h5>Emails for notifications</h5>
              <div className='card--emails'>
                <div className='emails'>
                  {data?.oCorreoEB.slice(0, 4).map((email) => (
                    <p key={email.correo_cc}>{email.correo_cc}</p>
                  ))}
                  <span>
                    <button className='btn_crud' onClick={() => setHaveEmails(false)}>
                      <ImageSvg name='Edit' />
                    </button>
                  </span>
                </div>

              </div>
            </div>
          </div>
          <div className='contaniner-tables'>
            <div className='box-search'>
              <h3>List Bank Credential</h3>
              {/* <div>Search</div> */}
              <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                {showForm ? 'Close Form list' : 'Add list Bank'}
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
                          <button className='btn_crud' onClick={() => setShowModalDelete(true)}>
                            {' '}
                            <ImageSvg name='Delete' />
                          </button>

                        </td>
                        {showModalDelete && (
                          <Modal close={() => {
                            setShowModalDelete(false)
                          }}
                          >
                            <div>
                              <h3>Do you want to delete this credential bank list?</h3>
                              <div className='box-buttons'>
                                <button type='button' className='btn_primary small' onClick={() => handleDeleteBancoCredential(row.id_banco_credencial)}>
                                  YES
                                </button>
                                <button
                                  type='button'
                                  className='btn_secundary small'
                                  onClick={() => {
                                    setShowModalDelete(false)
                                  }}
                                >
                                  NOT
                                </button>
                              </div>
                            </div>
                          </Modal>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showForm && <AddCredentials onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListBank={handleEditListBank} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} />}
            </div>

            {requestError && <div className='errorMessage'> {

            requestError

            }
            </div>}

          </div>

        </div>
      ) : (
        <div className='config-Automated--emails'>
          <h3> Register emails</h3>
          <div className='description'>
            Add the emails to notify to <b> Download automated Bank Statements </b>
          </div>
          <EmailsForm setHaveEmails={setHaveEmails} idproduct={iIdProdEnv} dataEmails={data?.oCorreoEB} />
        </div>
      )}
      <div />
    </section>
  )
}
