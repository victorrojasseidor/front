/* eslint-disable eqeqeq */
/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react'
import EmailsForm from './EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import AddCredentials from './AddCredentials'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import Modal from '@/Components/Modal'

export default function ConfigDowland () {
  const [haveEmails, setHaveEmails] = useState(true) // hay correos ?
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [datalistAdd, setDataList] = useState([])
  const [data, setData] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)

  const router = useRouter()
  // const id = router.query.iId
  const iIdProdEnv = router.query.iIdProdEnv

  const { session, empresa, setModalToken } = useAuth()

  async function handleAgregar (values) {
    console.log('values', values)
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
        }, 1000)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('errok, ', errorMessage)
        setModalToken(true)
        setShowForm(true)
      }
    } catch (error) {
      console.error('error', error)
      setModalToken(true)
      setShowForm(true)
      // setStatus("Service error");
    }
  }

  const handleEdit = (user) => {
    console.log('handledit', user)
    setIinitialEdit(user)

    setIsEditing(true)
  }

  useEffect(() => {
    if (session) {
      getExtrBanc()
    }
  }, [session, haveEmails, showForm, showModalDelete])

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
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('errok, ', errorMessage)

        setModalToken(true)
        // setStatus(errorMessage);
      }
    } catch (error) {
      console.error('error', error)

      // setModalToken(true)
      // setStatus("Service error");
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
        setDataList(response.oResults)
        setShowModalDelete(false)
        setTimeout(() => {
          setShowModalDelete(false)
        }, 1000)
      } else {
        console.log('Error al eliminar la credencial')
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación', error)
    }
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
                  {data?.oCorreoEB.map((email) => (
                    <p key={email.correo_cc}>{email.correo_cc}</p>
                  ))}
                </div>
                <button className='btn_crud' onClick={() => setHaveEmails(false)}>
                  <ImageSvg name='Edit' />
                </button>
              </div>
            </div>
          </div>
          <div className='contaniner-tables'>
            <div className='box-search'>
              <h3>List Bank Credential</h3>
              {/* <div>Search</div> */}
              <button className='btn_black' onClick={toggleForm}>
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
                        <td>{row.nombre}</td>
                        <td>{row.usuario}</td>
                        <td>{row.id_banco}</td>
                        <td>Perú</td>
                        <td>
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
              {showForm && <AddCredentials onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} />}
            </div>

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
