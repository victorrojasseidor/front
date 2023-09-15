import React, { useState, useEffect } from 'react'
import LayouReport from '@/Components/CompProducts/report/LayoutReport'
import { useAuth } from '@/Context/DataContext'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { fetchConTokenPost } from '@/helpers/fetch'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const Balance = () => {
  const { session, setModalToken, logout } = useAuth()
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('DD/MM/YYYY'))
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').format('DD/MM/YYYY'))
  const [dataInitialSelect, setInitialDataselect] = useState([])
  const [filteredBank, setFilteredBank] = useState(null) // Cambié el nombre a filteredBank
  const [filteredAccounts, setFilteredAccounts] = useState(null) // Estado para cuentas filtradas
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [requestError, setRequestError] = useState()
  const [balances, setBalances] = useState(null)
  const [itemsPerPage] = useState(15)
  const [page, setPage] = useState(1)

  useEffect(() => {
    getBalancesInitial()
  }, [selectedCompany, startDate, endDate, selectedCompany, selectedBank, selectedAccount])

  useEffect(() => {
    if (dataInitialSelect) {
      getBalancesReport()
    }
  }, [dataInitialSelect, startDate, endDate, selectedCompany, selectedBank, selectedAccount, filteredBank, filteredAccounts])

  async function getBalancesInitial () {
    const body = {
      oResults: {}
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetInitSaldos', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        const dataInit = responseData.oResults
        setInitialDataselect(dataInit)
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
        setTimeout(() => {
          setRequestError(null)
        }, 2000)
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

  async function getBalancesReport () {
    const body = {
      oResults: {
        sFechaDesde: startDate,
        sFechaHasta: endDate,
        oIdEmpresa: selectedCompany ? [selectedCompany] : [],
        oIdBanco: selectedBank ? [selectedBank] : [],
        oCuenta: selectedAccount ? [selectedAccount] : []
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=GetReporteSaldos', body, token)
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
        setTimeout(() => {
          setRequestError(null)
        }, 1000)
      }
    } catch (error) {
      console.error('error', error)
      setRequestError(error)
      setTimeout(() => {
        setRequestError(null)
      }, 1000)
    }
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('DD/MM/YYYY'))
  }

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'))
  }

  const handleCompanyChange = (event) => {
    const selectCompanyValue = event.target.value
    setSelectedCompany(selectCompanyValue)
    if (selectCompanyValue === '') {
      setFilteredBank([])
      setFilteredAccounts([])
    } else {
      const BankForSelectedCompany = balances.oSaldos.filter(
        (bank) => bank.id_empresa === selectCompanyValue
      )

      const seenIds = new Set()
      const uniqueBanks = []

      BankForSelectedCompany.forEach((bank) => {
        if (!seenIds.has(bank.id_banco)) {
          seenIds.add(bank.id_banco)
          uniqueBanks.push({ id_banco: bank.id_banco, nombre_banco: bank.nombre_banco })
        }
      })
      setFilteredBank(uniqueBanks)
    }
    setSelectedBank('') // Restablece la selección de banco
    setSelectedAccount('') // Restablece la selección de cuenta
  }

  const handleBankChange = (event) => {
    const selectedBankValue = event.target.value
    setSelectedBank(selectedBankValue)
    if (selectedBankValue === '') {
      setFilteredAccounts([])
    } else {
      const accountsForSelectedBank = balances.oSaldos.filter(
        (bank) => bank.id_banco === selectedBankValue)

      const seenIds = new Set()
      const uniqueBanks = []

      accountsForSelectedBank.forEach((report) => {
        if (!seenIds.has(report.desc_cuenta_conf_cuenta)) {
          seenIds.add(report.desc_cuenta_conf_cuenta)
          uniqueBanks.push({ cuenta_conf_cuenta: report.cuenta_conf_cuenta, desc_cuenta_conf_cuenta: report.desc_cuenta_conf_cuenta, desc_cuenta: report.desc_cuenta })
        }
      })

      setFilteredAccounts(uniqueBanks)
    }
    setSelectedAccount('') // Restablece la selección de cuenta
  }

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value)
  }

  const handleClearFilters = () => {
    setSelectedCompany('')

    setSelectedBank('')
    setSelectedAccount('')
  }

  const hasAppliedFilters = () => {
    return (
      selectedCompany !== '' ||
      selectedBank !== '' ||
      selectedAccount !== ''
    )
  }

  function formatNumberToCurrency (number) {
    // Divide el número en parte entera y decimal
    const parts = number.toFixed(2).toString().split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]

    // Agrega comas como separadores de miles a la parte entera
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Si el número original no tenía decimales, agrega ".00"
    const formattedDecimal = decimalPart === '00' ? '.00' : `.${decimalPart}`

    // Combina la parte entera y la parte decimal formateadas
    const formattedNumber = formattedInteger + formattedDecimal

    return formattedNumber
  }

  return (
    <LayouReport defaultTab={0}>
      <div className='balance'>
        <div className='layoutReporting-company'>
          <h5>Balance report To {session?.jCompany.razon_social_company}</h5>
          <p>
            If you want to view the complete information, use the <span>export option</span>
          </p>
        </div>
        {dataInitialSelect && (
          <div className='container-filters'>
            <div className='box-filter'>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='From'
                  value={dayjs(startDate, 'DD/MM/YYYY')}
                  slotProps={{
                    textField: {
                      helperText: 'Date start'
                    }

                  }}
                  onChange={handleStartDateChange}
                  format='DD/MM/YYYY'
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='To'
                  value={dayjs(endDate, 'DD/MM/YYYY')}
                  slotProps={{
                    textField: {
                      helperText: 'Date end'
                    }

                  }}
                  onChange={handleEndDateChange}
                  format='DD/MM/YYYY'
                />
              </LocalizationProvider>

              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='company-label'>Company</InputLabel>
                <Select
                  labelId='company-label'
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                >
                  <MenuItem value=''>
                    <em>All Companys</em>
                  </MenuItem>
                  {dataInitialSelect.oEmpresa?.map((comp) => (
                    <MenuItem key={comp.id_empresa} value={comp.id_empresa}>
                      <div> {comp.razon_social_empresa}</div>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select a company</FormHelperText>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='bank-label'>Bank</InputLabel>
                <Select
                  labelId='bank-label'
                  value={selectedBank}
                  onChange={handleBankChange}
                >
                  <MenuItem value=''>
                    <em>All Banks</em>
                  </MenuItem>
                  {filteredBank && filteredBank.map((report) => (
                    <MenuItem key={report.id_banco} value={report.id_banco}>
                      <div> {report.nombre_banco} </div>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select a bank</FormHelperText>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='account-label'>Account</InputLabel>
                <Select
                  labelId='account-label'
                  value={selectedAccount}
                  onChange={handleAccountChange}
                >

                  <MenuItem value=''>
                    <em>All Accounts</em>
                  </MenuItem>
                  {selectedBank && filteredAccounts.map((account) => (
                    <MenuItem key={account.cuenta_conf_cuenta} value={account.cuenta_conf_cuenta}>
                      <div> {account.desc_cuenta_conf_cuenta} </div>
                    </MenuItem>
                  ))}

                </Select>
                <FormHelperText>Select an account</FormHelperText>
              </FormControl>

              <div className='box-clear'>
                <button className={`btn_black ${hasAppliedFilters() ? '' : 'desactivo'}`} onClick={handleClearFilters} disabled={!hasAppliedFilters()}>
                  Clear Filters
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {balances && (
        <div className='contaniner-tables'>
          <div className='boards'>
            <div className='tableContainer'>
              <div className='box-search'>
                <h3>Balance Report </h3>
                <button className='btn_black smallBack'>Export Report</button>
              </div>
              <table className='dataTable Account'>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Bank</th>
                    <th>Account</th>
                    <th>Currency</th>
                    <th>Balance</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className='rowTable'>
                  {balances.oSaldos.length > 0
                    ? (
                        balances.oSaldos.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((row) => (
                          <tr key={row.id_saldos}>
                            <td>{row.razon_social_empresa}</td>
                            <td>{row.nombre_banco}</td>
                            <td className='cuenta'>{row.desc_cuenta_conf_cuenta}</td>
                            <td>{row.moneda}</td>
                            <td className='importe'>{formatNumberToCurrency(row.saldo)}</td>
                            <td>{dayjs(row.fecha).format('DD/MM/YYYY')}</td>
                          </tr>
                        ))
                      )
                    : (
                      <tr>
                        <td colSpan='6'>No hay Datos</td>
                      </tr>
                      )}
                </tbody>
              </table>

              <Stack spacing={2}>
                <div className='pagination'>

                  <Typography>
                    Page {page} of {Math.ceil(balances.oSaldos.length / itemsPerPage)}
                  </Typography>
                  <Pagination
                    count={Math.ceil(balances.oSaldos.length / itemsPerPage)} // Calculate the total number of pages
                    page={page}
                    onChange={handleChangePage}
                  />
                </div>
              </Stack>

            </div>
          </div>
        </div>
      )}

      <div>
        {requestError && <div className='errorMessage'> {requestError} </div>}
      </div>
    </LayouReport>
  )
}

export default Balance
