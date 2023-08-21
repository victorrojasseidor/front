import React, { useEffect, useState } from 'react'
import LayoutConfig from '@/Components/CompProducts/LayoutConfig'
import { useRouter } from 'next/router'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import ImageSvg from '@/helpers/ImageSVG'
import Modal from '@/Components/Modal'
import AddAccounts from '@/Components/CompProducts/DowloandCurrency/AddAccounts'

export default function ConfigAccount () {
  const [data, setData] = useState(null)
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

  const { session, empresa, setModalToken } = useAuth()

  useEffect(() => {
    if (session) {
      getExtrBancAccount()
    }
  }, [session,initialEdit,showForm,showModalDelete,empresa])

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
        const data = responseData.oResults.oListBancoCredendicial;
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

  const handleDeleteAccount = async (row) => {
    const token = session.sToken
    const body = {
      oResults: {
        iIdExtBanc: row.id_banco_credencial,
        iIdEBConfCuentas: row.id_eb_conf_cuentas
      }
    }

    try {
      const response = await fetchConTokenPost('dev/BPasS/?Accion=EliminarCuentaExtBancario', body, token)
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setShowModalDelete(false)
        setTimeout(() => {
          setShowModalDelete(false)
        }, 1000)
      } else if (response.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const errorMessage = response.oAuditResponse ? response.oAuditResponse.sMessage : 'Error in delete '
        console.log('errok, ', errorMessage)
        setModalToken(true)
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación', error)
    }
  }

  async function handleAgregar (values) {
       const body = {
      oResults: {
        iIdExtBanc: parseInt(iIdProdEnv),
        iIdBancoCredencial: parseInt(idbancoCredential),
        iIdTipoArchivo: values.TypeFile?.value,
        sEmpresa: values.Company,
        sEmpresaDescripcion: values.DesCompany,
        sRuc: values.Ruc,
        sCuenta: values.Account,
        sCuentaDescripcion: values.DesAccount,
        sMoneda: values.Coin,
        sMonedaDescripcion: values.DesCoin
        // bCodeEnabled: values.state === 'Active'
      }
    }

  
    try {
      const token = session.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarCuentaExtBancario', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
         setTimeout(() => {
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
        iIdExtBanc: parseInt(iIdProdEnv),
        iIdEBConfCuentas: initialEdit.id_eb_conf_cuentas,
        iIdBancoCredencial: parseInt(idbancoCredential),
        iIdTipoArchivo: values.TypeFile?.value,
        sEmpresa: values?.Company,
        sEmpresaDescripcion: values?.DesCompany,
        sRuc: values.Ruc,
        sCuenta: values?.Account,
        sCuentaDescripcion: values?.DesAccount,
        sMoneda: values?.Coin,
        sMonedaDescripcion: values?.DesCoin
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=ActualizarCuentaExtBancario', body, token)
      console.log('responseactualizar', responseData)
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

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  return (
    <LayoutConfig id={iId} iIdProdEnv={iIdProdEnv} defaultTab={1} NameAcount={data?.nombre}>
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
              <h5> Principal Credencial</h5>
              <div className='card--emails'>
                <div className='emails'>
                    {data?.nombre_banco}
                  {/* {data?.oCorreoEB.slice(0, 4).map((email) => (
                    <p key={email.correo_cc}>{email.correo_cc}</p>
                  ))} */}
                  {/* <span>
                    <button className='btn_crud'>
                      <ImageSvg name='Edit' />
                    </button>
                  </span> */}
                </div>

              </div>
            </div>
          </div>
          <div className='contaniner-tables'>
            <div className='box-search'>
              <h3>Accounts </h3>
              <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                {showForm ? 'Close Form list' : 'Add list Account'}
              </button>
            </div>
            <div className='boards'>
              <div className='tableContainer'>
                <table className='dataTable Account'>
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Account Description</th>
                      <th>Company</th>
                      <th>Company Description</th>
                      <th>Ruc</th>
                      <th>File</th>
                      <th>Currency</th>
                      <th>Description currency</th>
                      <th>State</th>
                      <th>Actions</th>

                    </tr>
                  </thead>
                  <tbody>
                    {data?.oListCuentas?.map((row) => (
                      <tr key={row.id_eb_conf_cuentas}>
                        <td>{row.cuenta}</td>
                        <td>{row.descripcion_cuenta}</td>
                        <td>{row.empresa}</td>
                        <td>{row.descripcion_empresa}</td>
                        <td>{row.ruc}</td>
                        <td>{row.id_tipo_archivo}</td>
                        <td>{row.moneda}</td>
                        <td>{row.descripcion_moneda}</td>
                        <td>
                          <span className={row.estado == '23' ? 'status-active' : 'status-disabled'}>{row.estado == '23' ? 'Active' : 'Disabled'}</span>
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
                              <h3>Delete this account?</h3>
                              <div className='box-buttons'>
                                <button type='button' className='btn_primary small' onClick={() => handleDeleteAccount(row)}>
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
              {showForm && <AddAccounts onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListBank={handleEditListBank} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} showForm={showForm}/>}
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