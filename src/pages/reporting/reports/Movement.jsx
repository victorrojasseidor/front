import React, { useState, useEffect, useRef } from 'react'
import LayouReport from '@/Components/CompProducts/report/LayoutReport'
import { useAuth } from '@/Context/DataContext'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { fetchConTokenPost } from '@/helpers/fetch'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import ImageSvg from '@/helpers/ImageSVG'
import Loading from '@/Components/Atoms/Loading'
import { IconArrow, IconDate, exportToExcelFormat } from '@/helpers/report'
import { TextField, IconButton, InputAdornment } from '@mui/material'

const Movement = () => {
  const { session, setModalToken, logout, l } = useAuth()
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('DD/MM/YYYY'))
  const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day').format('DD/MM/YYYY'))
  const [dataInitialSelect, setInitialDataselect] = useState([])
  const [filteredBank, setFilteredBank] = useState(null) // Cambié el nombre a filteredBank
  const [filteredAccounts, setFilteredAccounts] = useState(null) // Estado para cuentas filtradas
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedtype, setSelectedType] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [requestError, setRequestError] = useState()
  const [movement, setMovement] = useState(null)
  const [itemsPerPage] = useState(25)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isDateSorted, setIsDateSorted] = useState(false)
  const [isCompanySorted, setIsCompanySorted] = useState(false)
  const [isBankSorted, setIsBankSorted] = useState(false)
  const [isAccountSorted, setIsAccountSorted] = useState(false)
  const [isAccountDesSorted, setIsAccounDestSorted] = useState(false)
  const [isCurrencySorted, setIsCurrencySorted] = useState(false)
  const [isAmountSorted, setIsAmountSorted] = useState(false)
  const [isOperationSorted, setIsOperationSorted] = useState(false)
  const [isRucSorted, setIsRucSorted] = useState(false)
  const [apply, setApply] = useState(false)
  const [searchDes, setSearchDes] = useState(false)
  const [searchOpe, setSearchOpe] = useState(false)
  // buscar por description
  const [descripcion, setDescripcion] = useState('')
  const [operacion, setOperacion] = useState('')

  const t = l.Reporting

  useEffect(() => {
    getMovementInitial()
  }, [])

  useEffect(() => {
    if (dataInitialSelect) {
      getMovementReport()
    }
  }, [apply])

  async function getMovementInitial () {
    setIsLoading(true)
    const body = {
      oResults: {}
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetInitMovimientos', body, token)
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

  async function getMovementReport () {
    setIsLoading(true)
    const body = {
      oResults: {
        sFechaDesde: startDate,
        sFechaHasta: endDate,
        oIdEmpresa: selectedCompany ? [selectedCompany] : [],
        oIdTipo: selectedtype ? [selectedtype] : [],
        oIdBanco: selectedBank ? [selectedBank] : [],
        oCuenta: selectedAccount ? [selectedAccount] : []
      }
    }

    try {
      const token = session.sToken
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetReporteMovimientos', body, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setMovement(data.oConfCuentaMov)
        setPage(1)
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

  const handleTypeChange = (event) => {
    const selecttypeValue = event.target.value
    setSelectedType(selecttypeValue)
  }

  const handleCompanyChange = (event) => {
    const selectCompanyValue = event.target.value
    setSelectedCompany(selectCompanyValue)
    if (selectCompanyValue === '') {
      setFilteredBank([])
      setFilteredAccounts([])
    } else {
      const BankForSelectedCompany = movement?.filter(
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
    setSelectedType('')
    setSelectedBank('') // Restablece la selección de banco
    setSelectedAccount('') // Restablece la selección de cuenta
  }

  const handleBankChange = (event) => {
    const selectedBankValue = event.target.value
    setSelectedBank(selectedBankValue)
    if (selectedBankValue === '') {
      setFilteredAccounts([])
    } else {
      const accountsForSelectedBank = dataInitialSelect.oCuenta.filter(
        (bank) => bank.id_banco === selectedBankValue)
      const seenIds = new Set()
      const uniqueBanks = []

      accountsForSelectedBank.forEach((report) => {
        if (!seenIds.has(report.cuenta)) {
          seenIds.add(report.cuenta)
          uniqueBanks.push({ cuenta_conf_cuenta: report.cuenta, cuenta: report.cuenta, desc_cuenta: report.cuenta })
        }
      })

      setFilteredAccounts(uniqueBanks)
    }
    setSelectedAccount('')
  }

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value)
  }

  const handleClearFilters = () => {
    setSelectedCompany('')
    setSelectedType('')
    setSelectedBank('')
    setSelectedAccount('')
    setStartDate(dayjs().startOf('month').format('DD/MM/YYYY'))
    setEndDate(dayjs().subtract(1, 'day').format('DD/MM/YYYY'))
    setApply(!apply)
  }

  const hasAppliedFilters = () => {
    return (
      selectedCompany !== '' ||
      selectedtype !== '' ||
      selectedBank !== '' ||
      selectedAccount !== '' ||
      startDate !== dayjs().startOf('month').format('DD/MM/YYYY') ||
      endDate !== dayjs().subtract(1, 'day').format('DD/MM/YYYY')
    )
  }

  function formatNumberToCurrency (row) {
    const sign = row.id_tipo === 1 ? 1 : -1
    // Divide el número en parte entera y decimal
    const parts = (row.importe * sign).toFixed(2).toString().split('.')
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const decimalPart = parts[1]

    // Si el número original no tenía decimales, agrega ".00"
    const formattedDecimal = decimalPart === '00' ? '.00' : `.${decimalPart}`

    // Combina la parte entera y la parte decimal formateadas
    const formattedNumber = integerPart + formattedDecimal

    return formattedNumber
  }

  const exportToExcel = () => {
    if (movement && movement.length > 0) {
      const filteredData = movement.map((row) => ({
        Date: formatDate(row.fecha),
        Company: row.razon_social_empresa,
        Bank: row.nombre_banco,
        Account: row.desc_cuenta_conf_cuenta,
        Currency: row.moneda,
        Descripcion: row.descripcion,
        Type: row.descripcion_tipo,
        Operation_No: row.operacion,
        Amount: row.id_tipo === 1 ? 1 * row.importe : -1 * row.importe,
        Reference: row.referencia,
        UTC: row.utc,
        RUC: row.ruc

      }))

      if (filteredData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(filteredData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Movement Report')
        XLSX.writeFile(wb, 'movement_report.xlsx')
      }
    }
  }

  const orderDataAlphabetically = (columnName, setIsSorted, prevIsSorted) => {
    setIsSorted((prevIsSorted) => !prevIsSorted)

    setMovement((prevBalances) => {
      const sortedData = [...prevBalances]

      if (prevIsSorted) {
        sortedData.sort((a, b) => a[columnName].localeCompare(b[columnName]))
      } else {
        sortedData.sort((a, b) => b[columnName].localeCompare(a[columnName]))
      }

      return sortedData
    })
  }

  // Función de ordenamiento genérica para columnas numéricas
  const orderDataNumerically = (columnName, setIsSorted, prevIsSorted) => {
    setIsSorted((prevIsSorted) => !prevIsSorted)

    setMovement((prevBalances) => {
      const sortedData = [...prevBalances]

      if (prevIsSorted) {
        sortedData.sort((a, b) => a[columnName] - b[columnName])
      } else {
        sortedData.sort((a, b) => b[columnName] - a[columnName])
      }

      return sortedData
    })
  }

  // Función de ordenamiento genérica para columnas de fecha
  const orderDataByDate = () => {
    setIsDateSorted(!isDateSorted)

    setMovement((prevBalances) => {
      const sortedData = [...prevBalances]

      if (isDateSorted) {
        sortedData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      } else {
        sortedData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      }

      return sortedData
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

  const tableRef = useRef(null)

  useEffect(() => {
    // Desplazar hacia la izquierda al inicio
    if (tableRef.current) {
      tableRef.current.scrollLeft = tableRef.current.scrollWidth
    }
  }, []) // El efecto se ejecuta solo una vez al montar el componente

  const handleInputChangeSearchDescription = (e) => {
    const inputValue = e.target.value
    setDescripcion(inputValue)
    searchDescription(inputValue, 'descripcion')
  }

  const handleInputChangeSearchOperation = (e) => {
    const inputValue = e.target.value
    setOperacion(inputValue)
    searchDescription(inputValue, 'operacion')
  }

  const searchDescription = (word, key) => {
    // Verifica si movement.oConfCuentaMov existe antes de intentar acceder a sus propiedades

    if (word === null || word === '') {
      setApply(!apply)
    } else {
      if (movement) {
        const filteredItems = movement.filter(producto =>
          producto[key].toLowerCase().includes(word.toLowerCase())
        )
        if (filteredItems) {
          setMovement(filteredItems)
        } else {
          console.log('no hay movement')
        }
      }
    }
  }

  return (
    <>
      <div className='balance '>

        {dataInitialSelect && (
          <div className='container-filters'>
            <div className='layoutReporting-company'>
              <h3>{t['Movement report To']} {session?.jCompany.razon_social_company}</h3>
              <p>
                {t['If you want to view the complete information, use the']} <span>{t['export option']}</span>
              </p>
            </div>

            <div className='box-filter'>

              <div className='date'>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t.From}
                    value={dayjs(startDate, 'DD/MM/YYYY')}
                    slotProps={{
                      textField: {
                      // helperText: t['Date start']
                      }

                    }}
                    onChange={handleStartDateChange}
                    format='DD/MM/YYYY'
                    components={{
                      OpenPickerIcon: IconDate,
                      CalendarIcon: IconDate
                    }}
                    renderInput={(params) => (
                      <TextField {...params} />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t.To}
                    value={dayjs(endDate, 'DD/MM/YYYY')}
                    slotProps={{
                      textField: {
                      // helperText: t['Date end']
                      }

                    }}
                    onChange={handleEndDateChange}
                    format='DD/MM/YYYY'
                    components={{
                      OpenPickerIcon: IconDate,
                      CalendarIcon: IconDate
                    }}
                    renderInput={(params) => (
                      <TextField {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>

              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='company-label'>{t.Company}</InputLabel>
                <Select
                  labelId='company-label'
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  className='delimite-text'
                  IconComponent={IconArrow}
                >
                  <MenuItem value=''>
                    <em>{t['All Companys']}</em>
                  </MenuItem>
                  {dataInitialSelect.oEmpresa?.map((comp) => (
                    <MenuItem key={comp.id_empresa} value={comp.id_empresa}>
                      <div> {comp.razon_social_empresa}</div>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>{t['Select a company']}</FormHelperText> */}
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='bank-label'>{t.Bank}</InputLabel>
                <Select
                  labelId='bank-label'
                  value={selectedBank}
                  onChange={handleBankChange}
                  IconComponent={IconArrow} // Usa tu componente de ícono personalizado
                >
                  <MenuItem value=''>
                    <em>{t['All Banks']}</em>
                  </MenuItem>
                  {filteredBank && filteredBank.map((report) => (
                    <MenuItem key={report.id_banco} value={report.id_banco}>
                      <div> {report.nombre_banco} </div>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>{t['Select a bank']}</FormHelperText> */}
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='account-label'>{t['Account Alias']}</InputLabel>
                <Select
                  labelId='account-label'
                  value={selectedAccount}
                  onChange={handleAccountChange}
                  IconComponent={IconArrow}
                >

                  <MenuItem value=''>
                    <em>{t['All Accounts']}</em>
                  </MenuItem>
                  {selectedBank && filteredAccounts.map((account) => (
                    <MenuItem key={account.cuenta_conf_cuenta} value={account.cuenta}>
                      <div> {account.cuenta} </div>
                    </MenuItem>
                  ))}

                </Select>
                {/* <FormHelperText>{t['Select an account']}</FormHelperText> */}
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='company-label'>{t.Type}</InputLabel>
                <Select
                  labelId='type-label'
                  value={selectedtype}
                  onChange={handleTypeChange}
                  IconComponent={IconArrow}

                >
                  <MenuItem value=''>
                    <em>{t['All types']}</em>
                  </MenuItem>
                  {dataInitialSelect.oTipo?.map((comp) => (
                    <MenuItem key={comp.id_tipo} value={comp.id_tipo}>
                      <div> {comp.descripcion}</div>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>{t['Select a type']} </FormHelperText> */}
              </FormControl>

              <div className='box-clear'>
                <button className={`btn_primary small  ${hasAppliedFilters() ? '' : 'desactivo'}`} onClick={() => setApply(!apply)} disabled={!hasAppliedFilters()}>
                  {t.Apply}
                </button>

                <button className={`btn_secundary small ${hasAppliedFilters() ? '' : 'desactivo'}`} onClick={handleClearFilters} disabled={!hasAppliedFilters()}>
                  {t.Clear}
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

      {movement && (
        <div className='contaniner-tables movement-table '>

          <div className='box-search'>
            <h3>{t.Movement} </h3>
            <button className='btn_black ' onClick={exportToExcel}>
              <ImageSvg name='Download' /> {t['Export to Excel']}
            </button>
          </div>

          <div className='tableContainer' ref={tableRef}>
            <div class='scrollbarContainer' />
            <table className='dataTable Account'>
              <thead>
                <tr style={{ overflow: 'hidden' }}>
                  <th>
                    {t.Date}

                    {/* <button className='btn_crud' onClick={() => filterDate()}>
                      <ImageSvg name='Filter' />
                    </button> */}

                    <button className='btn_crud' onClick={() => orderDataByDate()}>
                      <ImageSvg name={isDateSorted ? 'OrderDown' : 'OrderUP'} />
                    </button>

                  </th>
                  <th>
                    {t.Company}
                    <button className='btn_crud' onClick={() => orderDataAlphabetically('razon_social_empresa', setIsCompanySorted, isCompanySorted)}>
                      <ImageSvg name={isCompanySorted ? 'OrderZA' : 'OrderAZ'} />
                    </button>

                  </th>
                  <th>
                    {t.Bank}
                    <button className='btn_crud' onClick={() => orderDataAlphabetically('nombre_banco', setIsBankSorted, isBankSorted)}>
                      <ImageSvg name={isBankSorted ? 'OrderZA' : 'OrderAZ'} />
                    </button>

                  </th>
                  <th>
                    {t['Account Alias']}
                    <button className='btn_crud' onClick={() => orderDataAlphabetically('cuenta_conf_cuenta', setIsAccountSorted, isAccountSorted)}>
                      <ImageSvg name={isAccountSorted ? 'OrderZA' : 'OrderAZ'} />
                    </button>

                  </th>

                  <th>
                    {t['Account Description']}
                    <button className='btn_crud' onClick={() => orderDataAlphabetically('desc_cuenta_conf_cuenta', setIsAccounDestSorted, isAccountDesSorted)}>
                      <ImageSvg name={isAccountDesSorted ? 'OrderZA' : 'OrderAZ'} />
                    </button>

                  </th>
                  <th>
                    {t.Currency}

                    <button className='btn_crud' onClick={() => orderDataAlphabetically('moneda', setIsCurrencySorted, isCurrencySorted)}>
                      <ImageSvg name={isCurrencySorted ? 'OrderZA' : 'OrderAZ'} />
                    </button>

                  </th>
                  <th className='th-search'>

                    {t.Description}

                    <button className='btn_crud' onClick={() => setSearchDes(!searchDes)}>
                      <ImageSvg name={searchDes ? ' ' : 'Search'} />
                    </button>

                    {searchDes &&

                      <div className='container-search'>

                        <div className='input-box'>
                          <input
                            // type='text'
                            // placeholder='Buscar por descripción'
                            // value={descripcion}
                            // onChange={handleInputChange}
                            type='text'
                            placeholder='Buscar por descripción'
                            value={descripcion}
                            onChange={handleInputChangeSearchDescription}
                          />
                        </div>

                        {/* <button className='btn_green' onClick={handleSearchClick}> <ImageSvg name='Search' /> </button> */}
                        <button className='btn_green' onClick={() => { setDescripcion(''); setSearchDes(!searchDes); setApply(!apply) }}> X </button>
                      </div>}

                  </th>
                  <th>{t.Type} </th>

                  <th className='th-search'>
                    {t['Operation No.']}

                    <button className='btn_crud' onClick={() => setSearchOpe(!searchOpe)}>
                      <ImageSvg name='Search' />
                    </button>

                    <button className='btn_crud' onClick={() => orderDataNumerically('operacion', setIsOperationSorted, isOperationSorted)}>
                      <ImageSvg name={isOperationSorted ? 'OrderDown' : 'OrderUP'} />
                    </button>

                    {searchOpe &&

                      <div className='container-search'>

                        <div className='input-box'>
                          <input
                            type='text'
                            placeholder='Buscar por operacion'
                            value={operacion}
                            onChange={handleInputChangeSearchOperation}
                          />
                        </div>

                        {/* <button className='btn_green' onClick={handleSearchClick}> <ImageSvg name='Search' /> </button> */}
                        <button className='btn_green' onClick={() => { setOperacion(''); setSearchOpe(!searchOpe); setApply(!apply) }}> X </button>
                      </div>}

                  </th>

                  <th>
                    {t.Amount}
                    <button className='btn_crud' onClick={() => orderDataNumerically('importe', setIsAmountSorted, isAmountSorted)}>
                      <ImageSvg name={isAmountSorted ? 'OrderDown' : 'OrderUP'} />
                    </button>
                  </th>

                  <th>{t.Reference}</th>
                  <th>{t.UTC}</th>

                  <th>
                    {t.RUC}
                    <button className='btn_crud' onClick={() => orderDataNumerically('ruc', setIsRucSorted, isRucSorted)}>
                      <ImageSvg name={isRucSorted ? 'OrderDown' : 'OrderUP'} />
                    </button>
                  </th>

                </tr>
              </thead>
              <tbody className='rowTable'>
                {movement?.length > 0
                  ? (
                      movement
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage) // Slice the array based on the current page
                        .map((row) => (
                          <tr key={row.id_movimientos}>
                            <td>{formatDate(row.fecha)}</td>
                            <td>{row.razon_social_empresa}</td>
                            <td>{row.nombre_banco}</td>
                            <td className='cuenta'>{row.cuenta_conf_cuenta}</td>
                            <td className='cuenta'>{row.desc_cuenta_conf_cuenta}</td>
                            <td>{row.moneda}</td>
                            <td>{row.descripcion}</td>
                            <td style={{ color: row.id_tipo === 1 ? '#008f39' : '#FF0000' }}>{row.descripcion_tipo}</td>
                            <td>{row.operacion}</td>
                            <td className='importe'>{formatNumberToCurrency(row)}</td>
                            <td>{row.referencia}</td>
                            <td>{row.utc}</td>
                            <td>{row.ruc}</td>

                          </tr>
                        ))
                    )
                  : (
                    <tr>
                      <td colSpan='6'>
                        {t['There is no data']}
                      </td>
                    </tr>
                    )}
              </tbody>
            </table>

          </div>
          <Stack spacing={2}>
            <div className='pagination'>
              <Typography>
                {t.Page} {page} {t.of} {Math.ceil(movement?.length / itemsPerPage)}
              </Typography>
              <Pagination
                count={Math.ceil(movement?.length / itemsPerPage)} // Calculate the total number of pages
                page={page}
                onChange={handleChangePage}
              />
            </div>
          </Stack>

        </div>
      )}

      <div>
        {requestError && <div className='errorMessage'> {requestError.message} </div>}
      </div>
    </>
  )
}
export default Movement
