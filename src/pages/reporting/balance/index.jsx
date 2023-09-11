import React, { useState, useEffect } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import NavigationPages from '@/Components/NavigationPages'
import LayouReport from '@/Components/CompProducts/report/LayoutReport'
import { useAuth } from '@/Context/DataContext'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import { useRouter } from 'next/navigation' // Changed from 'next/navigation'
import { fetchConTokenPost } from '@/helpers/fetch'
import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const Balance = () => {
  const { session, empresa, setModalToken, logout } = useAuth()

  // Funciones para manejar los cambios en las fechas de inicio y final

  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [accountOptions, setAccountOptions] = useState([]) // Para almacenar las opciones de cuenta
  const [requestError, setRequestError] = useState('')
  const [balances, setBalances] = useState(null)

  // Fecha de inicio establecida en "01/01/2023"
  const [startDate, setStartDate] = useState(dayjs('01/01/2023', 'DD/MM/YYYY').format('DD/MM/YYYY'))

  // Fecha de finalización establecida en un día antes de la fecha actual
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').format('DD/MM/YYYY'))

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('DD/MM/YYYY'))
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'))
  }

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value)
    setSelectedBank('') // Reset bank selection when company changes
    setSelectedAccount('') // Reset account selection when company changes
  }

  const handleBankChange = (event) => {
    console.log('selectedBank', event.target.value)
    setSelectedBank(event.target.value)
    setSelectedAccount('') // Reset account selection when bank changes
  }

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value)
  }

  const router = useRouter()

  useEffect(() => {
    getBalances()
  }, [session, requestError])

  if (!session) {
    router.push('/login')
  }

  console.log('startDate', startDate)
  console.log('endDate', endDate)
  console.log('selectedCompany', selectedCompany)
  console.log('balances', balances)

  async function getBalances () {
    const body = {
      oResults: {
        sFechaDesde: '05/01/2023',
        sFechaHasta: '06/09/2023'
        // oIdEmpresa: [],
        // oIdTipo: [],
        // oIdBanco: [],
        // oCuenta: []

      }
    }

    try {
      const token = session.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetInitMovimientos', body, token)

      console.log('responseBalances', responseData)

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setBalances(data)
        setModalToken(false)
        setRequestError(null)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
      } else {
        const errorMessage = responseData.oAuditResponse
          ? responseData.oAuditResponse.sMessage
          : 'Error in sending the form'
        setRequestError(errorMessage)
        console.log('error', errorMessage)
        setTimeout(() => {
          setRequestError(null)
        }, 1000)
      }
    } catch (error) {
      console.error('error', error)
      setModalToken(true)
      setRequestError(error)
      setTimeout(() => {
        setRequestError(null)
      }, 1000)
    }
  }

  // Define las opciones de cuenta según el banco seleccionado
  const renderAccountOptions = () => {
    if (selectedBank === 'banco1') {
      return ['cuenta1', 'cuenta2'] // Agrega más opciones de cuenta para Banco 1
    }
    if (selectedBank === 'banco2') {
      return ['cuentaA', 'cuentaB'] // Agrega más opciones de cuenta para Banco 2
    }
    return [] // Devuelve una lista vacía si no hay opciones para el banco seleccionado
  }

  // Actualiza las opciones de cuenta cuando cambia el banco
  useEffect(() => {
    setAccountOptions(renderAccountOptions())
  }, [selectedBank])

  console.log('selectedCompany', selectedCompany)

  return (
    <LayouReport defaultTab={0}>
      <div className='balance'>
        <div className='layoutReporting-company'>
          <h5>Balance report To {session?.jCompany.razon_social_company}</h5>
          <p>
            If you want to view the complete information, use the{' '}
            <span>export option</span>
          </p>
        </div>

        <div className='box-company'>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id='company-label'>Company</InputLabel>
            <Select
              labelId='company-label'
              value={selectedCompany}
              onChange={handleCompanyChange}
            >
              <MenuItem value=''>
                <em>Select a company</em>
              </MenuItem>
              <MenuItem value='compania1'>Compañía 1</MenuItem>
              <MenuItem value='compania2'>Compañía 2</MenuItem>

              {/* Agrega más opciones de compañía según tus necesidades */}
              {session?.oEmpresa.map((company) => (
                <MenuItem key={company.id_company} value={company.id_company}>
                  {company.razon_social_company || company.razon_social_empresa}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select a company</FormHelperText>
          </FormControl>
        </div>

        <div className='box-filter'>

          <div className='box-dates'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                  label='From'
                  value={dayjs(startDate, 'DD/MM/YYYY')}
                  onChange={handleStartDateChange}
                  format='DD/MM/YYYY'
                />
                <DatePicker
                  label='To'
                  value={dayjs(endDate, 'DD/MM/YYYY')}
                  onChange={handleEndDateChange}
                  format='DD/MM/YYYY'
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          {selectedCompany && (
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id='bank-label'>Banco</InputLabel>
              <Select
                labelId='bank-label'
                value={selectedBank}
                onChange={handleBankChange}
              >
                <MenuItem value=''>
                  <em>Selecciona un banco</em>
                </MenuItem>
                {selectedCompany === 'compania1' && (
                  <>
                    <MenuItem value='banco1'>Banco 1</MenuItem>
                    <MenuItem value='banco2'>Banco 2</MenuItem>
                    {/* Agrega más opciones de banco para Compañía 1 */}
                  </>
                )}
                {selectedCompany === 'compania2' && (
                  <>
                    <MenuItem value='bancoA'>Banco A</MenuItem>
                    <MenuItem value='bancoB'>Banco B</MenuItem>
                    {/* Agrega más opciones de banco para Compañía 2 */}
                  </>
                )}
                {/* Agrega más bloques condicionales para otras compañías */}
              </Select>
              <FormHelperText>Selecciona un banco</FormHelperText>
            </FormControl>
          )}

          {selectedBank && (
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id='account-label'>Cuenta</InputLabel>
              <Select
                labelId='account-label'
                value={selectedAccount}
                onChange={handleAccountChange}
              >
                <MenuItem value=''>
                  <em>Selecciona una cuenta</em>
                </MenuItem>
                {accountOptions.map((account) => (
                  <MenuItem key={account} value={account}>
                    <div> varias cuenats </div>
                  </MenuItem>
                ))}
                {/* Renderiza las opciones de cuenta según el banco seleccionado */}
              </Select>
              <FormHelperText>Selecciona una cuenta</FormHelperText>
            </FormControl>
          )}
        </div>

        <div />

        {/* ... Otras partes de tu componente */}
      </div>

      <div className='contaniner-tables'>
        <div className='box-search'>
          <h3>Balance Report </h3>
          <button className='btn_black smallBack'>Export Report</button>
        </div>
        <div className='boards'>
          <div className='tableContainer'>

            <table className='dataTable Account'>

              <thead>
                <tr>
                  <th>Company</th>
                  <th>Bank</th>
                  <th>Cuenta</th>
                  <th>Tipo</th>
                  <th>Moneda</th>
                  <th>saldo</th>
                  <th>fecha</th>
                </tr>
              </thead>
              <tbody>

                <td>
                  {balances?.oEmpresa.map((row, index) => (

                    <tr key={row.id_empresa}>
                      {row.razon_social_empresa}
                    </tr>
                  ))}

                </td>

                <td>
                  {balances?.oBanco.map((bankRow, bankIndex) => (
                    <tr key={bankRow.id_banco}>
                      {bankRow.nombre}
                    </tr>
                  ))}
                </td>

                <td>
                  {balances?.oCuenta.map((rowtipo, index) => (
                    <tr key={index}>
                      {rowtipo.cuenta}
                    </tr>
                  ))}
                </td>

                <td>
                  {balances?.oTipo.map((rowtipo) => (
                    <tr key={rowtipo.id_tipo}>
                      {rowtipo.descripcion}
                    </tr>
                  ))}
                </td>

              </tbody>
            </table>

          </div>
        </div>
      </div>
    </LayouReport>
  )
}

export default Balance
