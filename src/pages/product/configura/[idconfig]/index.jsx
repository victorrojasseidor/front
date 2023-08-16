import React, { useEffect, useState } from 'react'
import LayoutConfig from '@/Components/CompProducts/LayoutConfig'
import { useRouter } from 'next/router'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import ImageSvg from '@/helpers/ImageSVG'

export default function index () {
  const [data, setData] = useState(null)
  const [haveEmails, setHaveEmails] = useState(true) // hay correos ?
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [requestError, setRequestError] = useState('')

  const router = useRouter()
  // const id = router.query.iId
  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId
  const idbancoCredential = router.query.idbancoCredential

  console.log('data', data?.nombre)

  const { session, empresa, setModalToken } = useAuth()

  useEffect(() => {
    if (session) {
      getExtrBancAccount()
    }
  }, [])

  async function getExtrBancAccount () {
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
        const data = responseData.oResults.oListBancoCredendicial
        const filterData = data.filter(account => account.id_banco_credencial == idbancoCredential)
        setData(filterData[0])
        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('error, ', errorMessage)
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  return (
    <LayoutConfig id={iId} iIdProdEnv={iIdProdEnv} defaultTab={1}>

      <section className='config-Automated'>
        <div className='config-Automated--tables'>
          <div className='container-status'>
            <div className='status-config'>
              <ul>
                <li>
                  <p>Name:</p>
                  <p> {data?.nombre}</p>
                </li>
                <li>
                  <p>Bank :</p>
                  <p>{data?.nombre_banco}</p>
                </li>
                <li>
                  <p>State :</p>
                  <p className='Active'>{data?.estado_c == 23 ? 'Active' : 'Disabled'}</p>
                </li>
              </ul>
            </div>
            <div className='box-emails'>
              <h5> Principal Credencials</h5>
              <div className='card--emails'>
                <div className='emails'>
                  {/* {data?.oCorreoEB.slice(0, 4).map((email) => (
                    <p key={email.correo_cc}>{email.correo_cc}</p>
                  ))} */}
                  <span>
                    <button className='btn_crud'>
                      <ImageSvg name='Edit' />
                    </button>
                  </span>
                </div>

              </div>
            </div>
          </div>
          <div className='contaniner-tables'>
            <div className='box-search'>
              <h3>List Bank Credential </h3>
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
                    {/* {data?.oListBancoCredendicial?.map((row) => (
                      <tr key={row.id_banco_credencial} onClick={() => handleAcount(row)}>
                        <td>{row.nombre}</td>
                        <td>{row.usuario}</td>
                        <td>{row.nombre_banco}</td>
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
                    ))} */}
                  </tbody>
                </table>
              </div>
              {/* {showForm && <AddCredentials onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListBank={handleEditListBank} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} />} */}
            </div>

            {requestError && <div className='errorMessage'> {
            requestError

            }
            </div>}

          </div>

        </div>

        <div />
      </section>

    </LayoutConfig>

  )
}
