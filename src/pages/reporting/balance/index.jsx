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
import * as XLSX from 'xlsx'
import ImageSvg from '@/helpers/ImageSVG'
import Loading from '@/Components/Atoms/Loading'

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
  const [itemsPerPage] = useState(32)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isDateSorted, setIsDateSorted] = useState(false)
  const [isCompanySorted, setIsCompanySorted] = useState(false)
  const [isBankSorted, setIsBankSorted] = useState(false)
  const [isAccountSorted, setIsAccountSorted] = useState(false)
  const [isCurrencySorted, setIsCurrencySorted] = useState(false)
  const [isBalanceSorted, setIsBalanceSorted] = useState(false)

  useEffect(() => {
    getBalancesInitial()
  }, [selectedCompany, startDate])

  useEffect(() => {
    if (dataInitialSelect) {
      getBalancesReport()
    }
  }, [dataInitialSelect, startDate, endDate, selectedCompany, selectedBank, selectedAccount, filteredBank, filteredAccounts])

  async function getBalancesInitial () {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false) // Ocultar señal de carga
    }
  }

  async function getBalancesReport () {
    setIsLoading(true)
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
      console.log('balances', responseData)
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setBalances(data)
        setModalToken(false)
        setRequestError(null)
        // orderDataByDate('fecha', true)
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
    } finally {
      setIsLoading(false) // Ocultar señal de carga
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

  console.log('isDateSorted', isDateSorted)
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

  const exportToExcel = () => {
    if (balances && balances.oSaldos.length > 0) {
      const filteredData = balances.oSaldos.map((row) => ({
        Date: formatDate(row.fecha),
        Company: row.razon_social_empresa,
        Bank: row.nombre_banco,
        Account: row.desc_cuenta_conf_cuenta,
        Currency: row.moneda,
        Balance: formatNumberToCurrency(row.saldo)

      }))

      if (filteredData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(filteredData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Balance Report')
        XLSX.writeFile(wb, 'balance_report.xlsx')
      }
    }
  }

  const orderDataAlphabetically = (columnName, setIsSorted, prevIsSorted) => {
    setIsSorted((prevIsSorted) => !prevIsSorted)

    setBalances((prevBalances) => {
      const sortedData = [...prevBalances.oSaldos]

      if (prevIsSorted) {
        sortedData.sort((a, b) => a[columnName].localeCompare(b[columnName]))
      } else {
        sortedData.sort((a, b) => b[columnName].localeCompare(a[columnName]))
      }

      return {
        ...prevBalances,
        oSaldos: sortedData
      }
    })
  }

  // Función de ordenamiento genérica para columnas numéricas
  const orderDataNumerically = (columnName, setIsSorted, prevIsSorted) => {
    setIsSorted((prevIsSorted) => !prevIsSorted)

    setBalances((prevBalances) => {
      const sortedData = [...prevBalances.oSaldos]

      if (prevIsSorted) {
        sortedData.sort((a, b) => a[columnName] - b[columnName])
      } else {
        sortedData.sort((a, b) => b[columnName] - a[columnName])
      }

      return {
        ...prevBalances,
        oSaldos: sortedData
      }
    })
  }

  // Función de ordenamiento genérica para columnas de fecha
  const orderDataByDate = () => {
    setIsDateSorted(!isDateSorted)

    setBalances((prevBalances) => {
      const sortedData = [...prevBalances.oSaldos]

      if (isDateSorted) {
        sortedData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      } else {
        sortedData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      }

      return {
        ...prevBalances,
        oSaldos: sortedData
      }
    })
  }

  const formatDate = (date) => {
    // Crear un objeto Date a partir de la fecha ISO y asegurarse de que esté en UTC
    const fechaObjeto = new Date(date)

    // Obtener las partes de la fecha (mes, día y año)
    const mes = (fechaObjeto.getUTCMonth() + 1).toString().padStart(2, '0') // +1 porque los meses comienzan en 0
    const dia = fechaObjeto.getUTCDate().toString().padStart(2, '0')
    const año = fechaObjeto.getUTCFullYear()

    // Formatear la fecha en el formato deseado (DD/MM/YYYY)
    const fechaFormateada = `${dia}/${mes}/${año}`
    return fechaFormateada
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

      {isLoading
        ? (
          <Loading />
          )
        : (
            ''
          )}

      {balances && (
        <div className='contaniner-tables'>
          <div className='boards'>
            <div className='box-search'>
              <h3>Balance Report </h3>
              <button className='btn_black ' onClick={exportToExcel}>
                <ImageSvg name='Download' /> Export to Excel
              </button>
            </div>
            <div className='tableContainer'>

              <table className='dataTable Account'>
                <thead>
                  <tr>
                    <th onClick={() => orderDataByDate()}>
                      Date
                      <button className='btn_crud'>
                        <ImageSvg name={isDateSorted ? 'OrderDown' : 'OrderUP'} />
                      </button>
                    </th>

                    <th onClick={() => orderDataAlphabetically('razon_social_empresa', setIsCompanySorted, isCompanySorted)}>
                      Company
                      <button className='btn_crud'>
                        <ImageSvg name={isCompanySorted ? 'OrderZA' : 'OrderAZ'} />
                      </button>
                    </th>
                    <th onClick={() => orderDataAlphabetically('nombre_banco', setIsBankSorted, isBankSorted)}>
                      Bank
                      <button className='btn_crud'>
                        <ImageSvg name={isBankSorted ? 'OrderZA' : 'OrderAZ'} />
                      </button>
                    </th>
                    <th onClick={() => orderDataAlphabetically('desc_cuenta_conf_cuenta', setIsAccountSorted, isAccountSorted)}>
                      Account
                      <button className='btn_crud'>
                        <ImageSvg name={isAccountSorted ? 'OrderZA' : 'OrderAZ'} />
                      </button>
                    </th>
                    <th onClick={() => orderDataAlphabetically('moneda', setIsCurrencySorted, isCurrencySorted)}>
                      Currency
                      <button className='btn_crud'>
                        <ImageSvg name={isCurrencySorted ? 'OrderZA' : 'OrderAZ'} />
                      </button>
                    </th>
                    <th onClick={() => orderDataNumerically('saldo', setIsBalanceSorted, isBalanceSorted)}>
                      Balance
                      <button className='btn_crud'>
                        <ImageSvg name={isBalanceSorted ? 'OrderDown' : 'OrderUP'} />
                      </button>
                    </th>

                  </tr>
                </thead>
                <tbody className='rowTable'>
                  {balances.oSaldos.length > 0
                    ? balances.oSaldos
                      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                      .map((row) => (
                        <tr key={row.id_saldos}>
                          <td>{formatDate(row.fecha)}</td>
                          <td>{row.razon_social_empresa}</td>
                          <td>{row.nombre_banco}</td>
                          <td className='cuenta'>{row.desc_cuenta_conf_cuenta}</td>
                          <td>{row.moneda}</td>
                          <td className='importe'>{formatNumberToCurrency(row.saldo)}</td>

                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan='6'>
                          There is no data
                        </td>
                      </tr>
                      )}
                </tbody>
              </table>

            </div>

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
      )}

      <div>
        {requestError && <div className='errorMessage'> {requestError.message} </div>}
      </div>
    </LayouReport>
  )
}

export default Balance
