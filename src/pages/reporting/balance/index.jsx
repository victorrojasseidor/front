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
import DateRange from '@/Components/Atoms/DateRange'

const Balance = () => {
  const { session, empresa, setModalToken, logout, setEmpresa } = useAuth()

  // Funciones para manejar los cambios en las fechas de inicio y final

  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [accountOptions, setAccountOptions] = useState([]) // Para almacenar las opciones de cuenta

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
            </Select>
            <FormHelperText>Select a company</FormHelperText>
          </FormControl>
        </div>

        <div className='box-filter'>

          <DateRange />

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
                  <th>Group</th>
                  <th>Company</th>
                  <th>Bank</th>
                  <th>Account</th>
                  <th>Currency</th>
                  <th>Balance</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr key='jdjjd'>
                  <td>Seidor</td>
                  <td>Innovativa</td>
                  <td>Banco</td>
                  <td>194-23044-223</td>
                  <td>PEN</td>
                  <td>1000</td>
                  <td>1/08/2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayouReport>
  )
}

export default Balance
