import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import ImageSvg from '@/helpers/ImageSVG'
import Modal from '@/Components/Modal'
import FormAccounts from '@/Components/CompProducts/DowloandCurrency/FormAccounts'
import Loading from '@/Components/Atoms/Loading'
import LoadingComponent from '@/Components/Atoms/LoadingComponent'

export default function ConfigAccount ({ idbancoCredential, setShowAccounts, setGet, get, getBank, registerAccount, updateAccount, deleteAccount }) {
  const [data, setData] = useState(null)
  const [initialEdit, setIinitialEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [showcomponent, setShowComponentAccounts] = useState(null)
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComponent, setIsLoadingComponent] = useState(false)
  const [getAccounts, setGetAccounts] = useState(false)
  const { session, setModalToken, logout, l, idCountry } = useAuth()

  const router = useRouter()
  const iIdProdEnv = router.query.iIdProdEnv

  const t = l.Download

  async function handleCommonCodes (response) {
    if (response.oAuditResponse?.iCode === 27) {
      setModalToken(true)
    } else if (response.oAuditResponse?.iCode === 4) {
      await logout()
    } else {
      const errorMessage = response.oAuditResponse ? response.oAuditResponse.sMessage : 'Error in service'
      console.log('errok, ', errorMessage)
      setModalToken(false)
      setRequestError(errorMessage)
      setTimeout(() => {
        setRequestError(null) // Limpiar el mensaje después de 3 segundos
      }, 5000)
    }
  }

  useEffect(() => {
    if (session) {
      getExtrBancAccount()
    }
  }, [getAccounts, l])

  async function getExtrBancAccount () {
    setIsLoadingComponent(true)
    const body = {
      oResults: {
        iIdExtBanc: parseInt(iIdProdEnv),
        iIdPais: idCountry
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost(`BPasS/?Accion=${getBank}`, body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        setGet(!get)
        const data = responseData.oResults.oListBancoCredendicial
        const filterData = data.filter((account) => account.id_banco_credencial == idbancoCredential || account.id_banco_credencial_est == idbancoCredential ) //para los dos estarctos y estados 
        setData(filterData[0])
        const filterOptionsBanks = responseData.oResults.oPaisBanco[0].banks
        const filterBank = filterOptionsBanks.filter((account) => account.id == filterData[0].id_banco)
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
      const idDelete = selectedRowToDelete.id_eb_conf_cuentas || selectedRowToDelete.id_esb_conf_cuentas  // para estados y estractos 
      await handleDeleteAccount(idDelete)
      setSelectedRowToDelete(null)
    }
  }

  const handleDeleteAccount = async (idAccount) => {
    setIsLoadingComponent(true)
    const token = session.sToken
    const body = {
      oResults: {
        iIdExtBanc: parseInt(iIdProdEnv),
        iIdEBConfCuentas: idAccount
      }
    }

    try {
      const response = await fetchConTokenPost(`BPasS/?Accion=${deleteAccount}`, body, token)
      if (response.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setGetAccounts(!getAccounts)
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
        iIdBancoCredencial: parseInt(data.id_banco_credencial) || parseInt(data.id_banco_credencial_est) ,
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

      const responseData = await fetchConTokenPost(`BPasS/?Accion=${registerAccount}`, body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        setGetAccounts(!getAccounts)
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
        iIdEBConfCuentas: initialEdit?.id_eb_conf_cuentas || initialEdit?.id_esb_conf_cuentas ,
        iIdBancoCredencial: parseInt(data.id_banco_credencial) || parseInt(data.id_banco_credencial_est),
        iIdTipoArchivo: values.TypeFile?.value ? values.TypeFile.value : initialEdit.id_tipo_archivo,
        sEmpresa: values?.Company,
        sEmpresaDescripcion: values?.DesCompany,
        sRuc: values.Ruc,
        sCuenta: values?.Account,
        sCuentaDescripcion: values?.DesAccount,
        sMoneda: values?.Coin,
        sMonedaDescripcion: values?.DesCoin,
        bCodeEnabled: values?.state == 'Active' // no hay en estado de cuenta
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost(`BPasS/?Accion=${updateAccount}`, body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        setGetAccounts(!getAccounts)
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
          <div className='container-status'>
            <div className='status-config'>
              <h3 className='title-Config'> {t.State} </h3>
              <ul>
                <li>
                  <p>{t.Name} </p>
                  <p>:</p>
                  <p className='name-blue'>
                    {' '}
                    <h5> {data?.nombre}</h5>{' '}
                  </p>
                </li>

                <li>
                  <p>{t.State} </p>
                  <p>:</p>
                  <p className='Active'>{data?.estado_c == 23 ? 'Active' : 'Disabled'}</p>
                </li>

                <li>
                  <p>{t.Bank} </p>
                  <p>: </p>
                  <p>{data?.nombre_banco}</p>
                </li>
                <li>
                  <p>{t.Credentials} </p>
                  <p>:</p>
                  <p>
                    <span>{data?.usuario}</span>
                    <span>{data?.usuario_a}</span>
                    <span>{data?.usuario_b}</span>
                    <span>{data?.usuario_c}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className='contaniner-tables  '>
            <div className='box-search'>
              <div>
                <h3>{t.Accounts} </h3>
                <p> {t['Register accounts for bank credentials']} </p>
              </div>

              <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                {showForm ? t['Close Form'] : t['+ Add Account']}
              </button>
            </div>

            {data?.oListCuentas.length > 0 && (
              <div className='boards'>
                <div className='tableContainer  '>
                  <table className='dataTable '>
                    <thead>
                      <tr>
                        <th>{t['Account Alias']}</th>
                        <th>{t['Account Description']}</th>
                        <th>{t.Company}</th>
                        <th>{t['Company Description']}</th>
                        <th>{t.RUC}</th>
                        <th>{t.File}</th>
                        <th>{t.Currency}</th>
                        <th>{t['Description currency']}</th>
                        <th>{t.State}</th>
                        <th>{t.Actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.oListCuentas?.map((row) => (
                        <tr key={row.id_eb_conf_cuentas || row.id_esb_conf_cuentas}>
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
              </div>
            )}

            {requestError && <div className='errorMessage'>{requestError.message || ' error service'}</div>}

            {isLoadingComponent && <LoadingComponent />}
          </div>

          {selectedRowToDelete && (
            <Modal
              close={() => {
                setSelectedRowToDelete(null)
              }}
            >
              <ImageSvg name='Question' />

              <div >
                <h3>{t['Delete this account?']}</h3>
                <div className='box-buttons'>
                  <button type='button' className='btn_primary small' onClick={handleDeleteConfirmation}>
                    {t.YES}
                  </button>
                  <button type='button' className='btn_secundary small' onClick={() => setSelectedRowToDelete(null)}>
                    {t.NOT}
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>

        <div />

        {showForm && <FormAccounts onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListAccount={handleEditListAccount} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} showForm={showForm} showcomponent={showcomponent} />}
      </section>
    </>
  )
}
