import React, { useState, useEffect } from 'react'
import EmailsForm from '../DowloandCurrency/EmailsForm'
import ImageSvg from '@/helpers/ImageSVG'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import { useRouter } from 'next/router'
import Modal from '@/Components/Modal'
import LoadingComponent from '@/Components/Atoms/LoadingComponent'
import Link from 'next/link'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { getProducts } from '@/helpers/auth'
import { formatDate } from '@/helpers/report'
import FormDayleCurrency from './FormDayleCurrency'

export default function ConfigCurrency () {
  const [haveEmails, setHaveEmails] = useState(false)
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
  const [completeEmails, setcompleteEmails] = useState(true)
  const [completeconfigBank, setCompleteconfigBank] = useState(true)
  const [completeShedule, setCompleteShedule] = useState(true)
  const [showAccounts, setShowAccounts] = useState(false)
  const [bankCredential, setBankCredential] = useState(null)
  const [modalConfirmationEmail, setModalConfirmationEmail] = useState(false)
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

  const t = l.Currency

  async function handleSendEmails (emails) {
    const listEmails = emails?.map(correo => {
      return { sCorreo: correo }
    })

    const body = {
      oResults: {
        iIdTipoCambio: iIdProdEnv,
        iIdPais: 1,
        oCorreo: listEmails
      }
    }

    setIsLoading(true)
    try {
      const token = session?.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarCorreoTipoCambio', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        // const data= responseData.oResults;
        setModalConfirmationEmail(true)

        setModalToken(false)
        setTimeout(function () {
          setHaveEmails(true)
          setModalConfirmationEmail(false)
        }, 1000)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('errok, ', errorMessage)
        setModalToken(true)
        setModalConfirmationEmail(false)
      }
    } catch (error) {
      console.error('error', error)
      // setModalToken(true)
      setModalConfirmationEmail(false)
    } finally {
      setIsLoading(false)
    }
  }

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

  useEffect(() => {
    if (session) {
      // getExtrBanc()
    }
  }, [haveEmails, initialEdit, showForm, idEmpresa, selectedRowToDelete, showAccounts])

  const toggleForm = () => {
    setShowForm(!showForm)
  }

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
        const selectedProduct = data.find((p) => p.iIdProdEnv === parseInt(iIdProdEnv))
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
    <div className='Currency_configurations'>

      <div className='Tabsumenu'>
        <div className='Tabsumenu-header '>
          <button className={` ${activeTab === 0 ? 'activeST' : ''} ${completeEmails ? 'completeST' : ''}`} onClick={() => handleTabClick(0)}>
            <ImageSvg name='Check' />
            <h4> {t['Status and emails']} </h4>
          </button>

          <button style={{ visibility: completeEmails ? 'visible' : 'hidden' }} className={` ${activeTab === 1 ? 'activeST' : ''} ${completeconfigBank ? 'completeST' : ''}`} onClick={() => handleTabClick(1)}>
            <ImageSvg name='Check' />
            <h4>  {t['Daily exchange rate']}  </h4>
          </button>

          <button style={{ visibility: completeconfigBank ? 'visible' : 'hidden' }} className={` ${activeTab === 2 ? 'activeST' : ''} ${completeShedule ? 'completeST' : ''}`} onClick={() => handleTabClick(2)}>
            <ImageSvg name='Check' />
            <h4> {t['Monthly exchange rate']}</h4>
          </button>
        </div>

        <div className='Tabsumenu-content'>
          {activeTab === 0 &&
            <div className='container-status'>
              {/* <h1> {t['Currency Exchange rates automation']} </h1> */}
              <div className='status-config'>

                <ul>

                  <li>
                    <p>{t['Digital employees']}:</p>
                    <h5>  {t['Currency Exchange rates automation']} </h5>
                  </li>
                  <li>

                    <p>{t['Start service:']}:</p>

                    <p> {formatDate(dataCardProduct?.sDateEnd)}</p>
                  </li>
                  <li>
                    <p>{t['End service:']}:</p>
                    <p> {formatDate(dataCardProduct?.sDateInit)} </p>
                  </li>
                  <li>
                    <p>{t.Country}: </p>
                    <p>{dataCardProduct?.sCountry}</p>
                  </li>
                  <li>
                    <p>{t.State}:</p>
                    <p className='Active'>{dataCardProduct?.sDescStatus}</p>
                  </li>
                </ul>
              </div>
              {haveEmails
                ? <div className='box-emails'>
                  <h3>{t['Emails for notifications']}</h3>
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
                  </div>
                : <div className='config-Automated--emails'>

                  <EmailsForm setHaveEmails={setHaveEmails} dataEmails={data?.oCorreoEB} handleSendEmails={handleSendEmails} />
                  </div>}

            </div>}

          {activeTab === 1 &&
            <div className='config-Automated--tables'>

              <div className='box-search'>
                <div>
                  <h3>{t['Daily exchange rate']} </h3>
                  <p> {t['Add the setting for Daily exchange rate']} </p>
                </div>

                <button className='btn_black' style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={toggleForm}>
                  {showForm ? t.Close : t.Add}
                </button>
              </div>

              <div className='contaniner-tables'>

                <div className='boards'>
                  <div className='tableContainer'>

                    <table className='dataTable'>

                      <thead>
                        <tr>
                          <th>{t.Country} </th>
                          <th> {t['Portal Available']}</th>
                          <th> {t['Source Currency']}</th>

                          <th> {t['Additional days']}</th>
                          <th> {t['Target currency']}</th>

                          <th>{t.State} </th>

                          <th>{t.Actions} </th>
                        </tr>
                      </thead>

                      <tbody>

                        {/* {data?.oListBancoCredendicial?.map((row) => (
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
                        ))} */}

                      </tbody>
                    </table>
                    <div>
                      <p> {t['Register your bank Credentials']}

                      </p>

                    </div>

                  </div>
                  {isLoadingComponent && <LoadingComponent />}
                  {showForm && <FormDayleCurrency onAgregar={handleAgregar} dataUser={data} initialVal={isEditing ? initialEdit : null} handleEditListBank={handleEditListBank} setIinitialEdit={setIinitialEdit} setShowForm={setShowForm} />}
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
                  data?.oListBancoCredendicial.length > 0 && <div>
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

    </div>
  )
}
