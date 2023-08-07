/* eslint-disable eqeqeq */
/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react'
import EmailsForm from './EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import AddCredentials from './AddCredentials'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'

export default function ConfigDowland () {
  const [haveEmails, setHaveEmails] = useState(true) // hay correos ?
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  // const [emails, setEmails] = useState([])
  const [data, setData] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const router = useRouter()
  const { id } = router.query

  const { session, setSession, empresa, setModalToken } = useAuth()

  async function handleAgregar (values) {
    console.log('values', values)
    const body = {
      oResults: {
        iIdEmpresa: 5,
        sName: values.name,
        iIdPais: 1,
        iBanco: values.bank.id,
        sPassword: '123456789',
        sCredencial: 'Credencial',
        sCredencial2: 'Credencial2',
        sCredencial3: 'Credencial3',
        sCredencial4: 'Credencial4',
        bCodeEnabled: values.state === 'Active'
      }
    }



    try {
      const token = session.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarExtBancario', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        console.log('data', data)
        setModalToken(false)
        setShowForm(false)

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

  // const handleEliminar = (id) => {
  //   setData((prevData) => prevData.filter((row) => row.id !== id));
  // };

  // const handleUpdate = (updatedRecord) => {
  //   // Actualiza el estado 'data' con el registro editado
  //   setData((prevData) => prevData.map((row) => (row.id === updatedRecord.id ? updatedRecord : row)));
  //   setCurrentRecord(null);
  //   setIsEditing(false);
  // };

  useEffect(() => {
    if (session) {
      getDataConfigured()
    }
  }, [session,haveEmails])

  console.log('dat', data)

  async function getDataConfigured () {
    const body = {
      oResults: {
        iIdExtBanc: id,
        iIdPais: 1
      }
    }

    try {
      const token = session.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetExtBancario', body, token)
      console.log('data', responseData)

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

  // useEffect(() => {
  //   if (!data) {
  //     return (
  //     <Loading/>
  //     )
  //   }
  // }, [data]);

  const toggleForm = () => {
    setShowForm(!showForm)
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
              <button className='btn_black' onClick={toggleForm}>{showForm ? 'Close Form list' : 'Add list Bank'}</button>
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
                          <button className='btn_crud' style={{ display: 'none' }} onClick={() => handleEdit(row)}>
                            {' '}
                            <ImageSvg name='Edit' />{' '}
                          </button>
                          <button className='btn_crud' style={{ display: 'none' }} onClick={() => handleEliminar(row.id_banco_credencial)}>
                            {' '}
                            <ImageSvg name='Delete' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showForm && (<AddCredentials
                onAgregar={handleAgregar}
                dataUser={data}
                initialVal={isEditing ? initialEdit : null}
                            />)}
            </div>
          </div>
        </div>
      ) : (
        <div className='config-Automated--emails'>
          <h3> Register emails</h3>
          <div className='description'>
            Add the emails to notify to <b> Download automated Bank Statements </b>
          </div>
          <EmailsForm setHaveEmails={setHaveEmails} idproduct={id} dataEmails={data?.oCorreoEB} />
        </div>
      )}
      <div />
    </section>
  )
}
