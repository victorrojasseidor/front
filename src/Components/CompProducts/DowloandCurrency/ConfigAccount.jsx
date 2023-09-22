import React, { useEffect, useState } from 'react'
import LayoutConfig from '@/Components/CompProducts/LayoutConfig'
import { useRouter } from 'next/router'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import ImageSvg from '@/helpers/ImageSVG'
import Modal from '@/Components/Modal'
import FormAccounts from '@/Components/CompProducts/DowloandCurrency/FormAccounts'
import Loading from '@/Components/Atoms/Loading'
import LoadingComponent from '@/Components/Atoms/LoadingComponent'

export default function ConfigAccount ({ idbancoCredential, setShowAccounts }) {
  const [data, setData] = useState(null)
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [showcomponent, setShowComponentAccounts] = useState(null)
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComponent, setIsLoadingComponent] = useState(false)

  const { session, setModalToken, logout } = useAuth()

  const router = useRouter()
  const iIdProdEnv = router.query.iIdProdEnv
  const iId = router.query.iId
  const idEmpresa = router.query.idEmpresa

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

  useEffect(() => {
    if (session) {
      getExtrBancAccount()
    }
  }, [initialEdit, showForm, selectedRowToDelete])

  async function getExtrBancAccount () {
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
        const data = responseData.oResults.oListBancoCredendicial
        const filterData = data.filter(account => account.id_banco_credencial == idbancoCredential)
        setData(filterData[0])
        const filterOptionsBanks = responseData.oResults.oPaisBanco[0].banks
        const filterBank = filterOptionsBanks.filter(account => account.id == filterData[0].id_banco)
        setShowComponentAccounts(filterBank[0].jConfCuenta)
        setModalToken(false)
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
      await handleDeleteAccount(selectedRowToDelete.id_eb_conf_cuentas)
      setSelectedRowToDelete(null)
    }
  }

  const handleDeleteAccount = async (idAccount) => {
    setIsLoadingComponent(true)
    const token = session.sToken
    const body = {
      oResults: {
        iIdExtBanc: iIdProdEnv,
        iIdEBConfCuentas: idAccount
      }
    }

    try {
      const response = await fetchConTokenPost('dev/BPasS/?Accion=EliminarCuentaExtBancario', body, token)
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setSelectedRowToDelete(null)
      } else {
        await handleCommonCodes(response)
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación', error)
    } finally {
      setIsLoadingComponent(false) // Ocultar el indicador de carga después de que la petición se complete
    }
  }

  async function handleAgregar (values) {
    setIsLoadingComponent(true)
    const body = {
      oResults: {
        iIdExtBanc: parseInt(iIdProdEnv),
        iIdBancoCredencial: parseInt(data.id_banco_credencial),
        iIdTipoArchivo: values.TypeFile?.value,
        sEmpresa: values.Company,
        sEmpresaDescripcion: values.DesCompany,
        sRuc: values.Ruc,
        sCuenta: values.Account,
        sCuentaDescripcion: values.DesAccount,
        sMoneda: values.Coin,
        sMonedaDescripcion: values.DesCoin,
        bCodeEnabled: values.state === 'Active'
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

  async function handleEditListAccount (values) {
    setIsLoadingComponent(true)

    const body = {
      oResults: {
        iIdExtBanc: parseInt(iIdProdEnv),
        iIdEBConfCuentas: initialEdit.id_eb_conf_cuentas,
        iIdBancoCredencial: parseInt(data.id_banco_credencial),
        iIdTipoArchivo: values.TypeFile?.value ? values.TypeFile.value : initialEdit.id_tipo_archivo,
        sEmpresa: values?.Company,
        sEmpresaDescripcion: values?.DesCompany,
        sRuc: values.Ruc,
        sCuenta: values?.Account,
        sCuentaDescripcion: values?.DesAccount,
        sMoneda: values?.Coin,
        sMonedaDescripcion: values?.DesCoin,
        bCodeEnabled: values?.state == 'Active'
      }
    }

    console.log('body', body)

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=ActualizarCuentaExtBancario', body, token)
      console.log('respoedit', responseData)
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
        setRequestError(null)
      }
    } catch (error) {
      console.error('error', error)
      setShowForm(true)
      setIsEditing(true)
      setRequestError(null)
    } finally {
      setIsLoadingComponent(false)
      setRequestError(null)
      setRequestError(null)
    }
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  return (
    <>

      {isLoading && <Loading />}
      <section className='config-Automated'>
        <div className='config-Automated--tables accounts-tables '>

          <div className='container-status' style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>

            <div className='status-config'>
              <ul>
                <li>
                  <p>Name  :</p>
                  <p> <h5> {data?.nombre}</h5> </p>

                </li>

                <li>
                  <p>State :</p>
                  <p className='Active'>{data?.estado_c == 23 ? 'Active' : 'Disabled'}</p>
                </li>
              </ul>
            </div>
            <div className='box-emails'>
              <ul>
                <li>
                  <p>Bank : </p>
                  <p>{data?.nombre_banco}</p>
                </li>

                <li>
                  <p>Credentials :</p>
                  <p>
                    <span>
                      {data?.usuario}
                    </span>
                    <span>
                      {data?.usuario_a}

                    </span>
                    <span>
                      {data?.usuario_b}
                    </span>
                    <span>
                      {data?.usuario_c}

                    </span>
                  </p>

                </li>

              </ul>
              {/* <h5> Principal Credencial</h5> */}
              <div className='card--emails' />

            </div>
          </div>
          <div className='contaniner-tables  '>
            <div className='box-search'>
              <h3>Accounts </h3>
              <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                {showForm ? 'Close Form list' : '+ Add Account'}
              </button>
            </div>
            <div className='boards'>
              <div className='tableContainer  '>
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
                        <td>{row.nombre_tipo_archivo}</td>
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
                          <button className='btn_crud' onClick={() => setSelectedRowToDelete(row)}>
                            {' '}
                            <ImageSvg name='Delete' />
                          </button>

                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
              {showForm && <FormAccounts onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListAccount={handleEditListAccount} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} showForm={showForm} showcomponent={showcomponent} />}
            </div>

            {requestError && <div className='errorMessage'> {
            requestError

            }
                             </div>}

            {isLoadingComponent && <LoadingComponent />}

          </div>
          {selectedRowToDelete && (
            <Modal close={() => {
              setSelectedRowToDelete(null)
            }}
            >
              <div>
                <h3>Delete this account?</h3>
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

        </div>

        <div />
      </section>

    </>

  )
}
