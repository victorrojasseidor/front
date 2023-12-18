import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Changed from 'next/navigation'
import { useAuth } from '@/Context/DataContext'
import { getProducts } from '@/helpers/auth'
import NavigationPages from '@/Components/NavigationPages'
import Loading from '@/Components/Atoms/Loading'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
// import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Products () {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [selectedFilterType, setSelectedFilterType] = useState(null)
  const [product, setProduct] = useState({})
  const [requestError, setRequestError] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hiredProduct, setHiredProduct] = useState('0')

  const { session, setModalToken, logout, l } = useAuth()

  // Nuevo estado para opciones de búsqueda de empresas
  const [companyOptions, setCompanyOptions] = useState([])

  // Nuevo estado para la empresa seleccionada
  const [selectedCompany, setSelectedCompany] = useState(null)

  useEffect(() => {
    // Actualiza las opciones de búsqueda de empresas cuando cambia la lista de empresas en session
    if (session?.oEmpresa) {
      setCompanyOptions(session.oEmpresa)
    }
  }, [session])

  const handleCompanyInputChange = (event, newValue) => {
    // Actualiza la empresa seleccionada
    if (newValue) {
      setSelectedCompany(newValue)
      const DataEmpresa = session?.oEmpresa.find((empres) => empres.razon_social_empresa === newValue.razon_social_empresa
      )
      const selectedEmpresa = {
        id_empresa: DataEmpresa.id_empresa,
        razon_social_empresa: DataEmpresa.razon_social_empresa,
        ruc_empresa: DataEmpresa.ruc_empresa
      }
      // Guardar la empresa seleccionada en el localStorage
      localStorage.setItem('selectedEmpresa', JSON.stringify(selectedEmpresa))
      setEmpresa(selectedEmpresa)
    }
  }

  const t = l.Products

  const router = useRouter()
  useEffect(() => {
    if (session) {
      getProductscard()
    }
  }, [session, empresa, l])

  async function getProductscard () {
    setIsLoading(true)
    try {
      const token = session?.sToken
      const idEmpresa = empresa.id_empresa
      const responseData = await getProducts(idEmpresa, token)
      console.log('getproduc', responseData)
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setProduct(data)
        setModalToken(false)
        setRequestError(null)

        const filterHiredProduct = responseData.oResults.filter(
          (product) =>
            product.iCodeStatus === 23 || product.iCodeStatus === 28
        )
        setHiredProduct(filterHiredProduct.length)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
        // setModalToken(true)
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
    } finally {
      setIsLoading(false) // Ocultar el indicador de carga después de que la petición se complete
    }
  }

  useEffect(() => {
    // Comprobar si hay una empresa seleccionada en el localStorage
    const storedEmpresa = localStorage.getItem('selectedEmpresa')
    if (storedEmpresa) {
      const selectedEmpresa = JSON.parse(storedEmpresa)
      setEmpresa(selectedEmpresa)
      setSelectedCompany(selectedEmpresa) // Inicializa selectedCompany con el valor
    } else if (session?.oEmpresa.length > 0) {
      // Si no hay una empresa en el localStorage, utiliza la primera empresa de session.oEmpresa
      const firstEmpresa = session?.oEmpresa[0]
      setEmpresa(firstEmpresa)
      setSelectedCompany(firstEmpresa) // Inicializa selectedCompany con el valor
    }
  }, [session])

  useEffect(() => {
    if (product && product.length > 0) {
      const filterResults = () => {
        let results = product

        if (selectedFilter !== null) {
          if (selectedFilter === 25) {
            results = results.filter(
              (product) =>
                product.iCodeStatus === 27 || product.iCodeStatus === 28
            )
          } else {
            results = results.filter(
              (product) =>
                product.iCodeStatus === selectedFilter
            )
          }
        }

        if (searchQuery) {
          results = results.filter((product) =>
            product.sName.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        setSearchResults(results)
      }

      filterResults()
    }
  }, [searchQuery, selectedFilter, product])

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleFilter = (filter) => {
    setSelectedFilter(filter)
  }

  const handleFilterType = (filter) => {
    setSelectedFilterType(filter)
  }

  const handleSearch = () => {
    setSearchQuery('')
    setSelectedFilter(null)
  }

  const imgProduct = (id) => {
    if (id === 1) {
      return 'IconEstractos'
    } else if (id === 2) {
      return 'IconTipo'
    } else if (id === 3) {
      return 'IconSunat'
    } else if (id === 4) {
      return 'IconInvoce'
    } else return 'IconCard'
  }

  function calcularDiasRestantes (day) {
    // Obtener la fecha actual en UTC
    const fechaActual = new Date()

    // Crear la fecha objetivo en UTC
    const fechaObjetivo = new Date(day)

    // Calcular la diferencia en milisegundos
    const diferenciaEnMilisegundos = fechaObjetivo - fechaActual

    // Calcular los días restantes
    const diasRestantes = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24))

    return diasRestantes
  }

  const renderButtons = (data) => {
    const handleLink = (ruta) => {
      router.push(ruta)
    }

    const dayLef = parseInt(calcularDiasRestantes(data.sDateEnd), 10)

    const status = data.iCodeStatus
    if (status === 28 && dayLef >= 0) {
      return (
        <button
          className='btn_primary'
          onClick={() => handleLink(`/product/product?type=configuration&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}
        >

          <span>     </span> {t.Setup} <span>  </span>

        </button>
      )
    } else if (status === 23 && dayLef >= 0) {
      return (
        <button
          className='btn_primary'
          onClick={() => handleLink(`/product/product?type=configuration&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}
        >

          <span>     </span>  {t.Edit} <span>  </span>

        </button>
      )
    } else if (status === 31) {
      return (
        <button
          className='btn_primary'
          onClick={() => handleLink(`/product/product?type=freetrial&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}
        >

          {t['Try free']}

        </button>
      )
    } else if (status === 27) {
      return (
        <p />
      )
    } else if (dayLef <= 0) {
      return (
        <>
          <button className='btn_primary' onClick={() => handleLink('https://www.innovativa.la/contacto')}>
            {t['Contact technical support']}
          </button>

        </>
      )
    } else {
      return <Link href='#'> <p>  </p> </Link>
    }
  }

  console.log('sesionprod', session)

  return (
    <LayoutProducts menu='Product'>

      {!session && <Loading />}

      <div className='products'>
        <NavigationPages title={t['Digital employees']}>

          <Link href='/product'>
            Home
          </Link>

        </NavigationPages>

        <div className='products_empresa'>

          <div className='box-empresa'>

            {/* Utiliza el componente Autocomplete en lugar del Select para el selector de empresas */}
            <Autocomplete
              value={selectedCompany}
              onChange={handleCompanyInputChange}
                  // sx={{ minWidth: 370 }}
              sx={{
                minWidth: 350, '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' }
              }}
              options={companyOptions}
              getOptionLabel={(option) => option.razon_social_empresa}
              renderInput={(params) => (
                <TextField {...params} label={t['To company:']} />
              )}
            />

          </div>

        </div>

        <div className='products_home'>

          <span className='outstanding-image' />

          <div className='welcome'>
            <h1> <span> {t.Welcome}
            </span>{empresa?.razon_social_empresa}
            </h1>
            <p>  {t['Our digital employees work to improve your productivity']}</p>

          </div>

          <div className='reporting-box'>

            <div className='report-content'>

              <div className='report blue'>

                <div className='report_icon  '>

                  <ImageSvg name='ReportDigital' />

                </div>

                <div className='report_data'>

                  <article>
                    {t['Digital employees']}

                  </article>
                  <h2> {hiredProduct}</h2>
                  <p> <ImageSvg name='ArrowUp' />  <span>  {t.working}  </span>    {t['for you']} </p>
                </div>

              </div>

              <div className='liner' />

              <div className='report green'>

                <div className='report_icon  '>

                  <ImageSvg name='ReportTime' />

                </div>

                <div className='report_data'>

                  <article>
                    {t['Time saved']}

                  </article>
                  <h2> 240 hrs </h2>
                  <p> <ImageSvg name='ArrowUp' />   <span>  2%  </span>    {t['this month']} </p>
                </div>

              </div>
              <div className='liner' />

              <div className='report red'>

                <div className='report_icon  '>

                  <ImageSvg name='ReportBussines' />

                </div>

                <div className='report_data'>

                  <article>
                    {t['Bussines agility']}

                  </article>
                  <h2> 79%</h2>
                  <p> <ImageSvg name='ArrowUp' />  <span> 4%  </span>    {t.more} </p>
                </div>

              </div>

            </div>

          </div>
        </div>
        {/* <div className='sub-title'>
          <h2> {t['Digital employees']} {empresa?.razon_social_empresa}</h2>
        </div> */}

        <div className='products_filter-types'>
          <button onClick={() => handleFilterType(null)} className={`btn_filter ${selectedFilterType === null ? 'active' : ''}`}>
            <ImageSvg name='All' />  <p> {t.All} </p>

          </button>
          <button onClick={() => handleFilterType(23)} className={`btn_filter ${selectedFilterType === 23 ? 'active' : ''}`}>
            <ImageSvg name='Financy' />  <p>{t['Finance and accounting']} </p>
          </button>
          <button onClick={() => handleFilterType(25)} className='btn_filter disabled'>

            <ImageSvg name='Tecnology' />  <p> {t.Technology}</p>

          </button>
          <button onClick={() => handleFilterType(31)} className='btn_filter disabled'>
            <ImageSvg name='Human' /> <p> {t['Human Resources']}
                                      </p>
          </button>
        </div>

        <div className='products_box-filterSearch'>
          <div className='searchButton'>
            <button onClick={handleSearch}>
              <ImageSvg name='Search' />
            </button>
            <input type='text' placeholder={t.Search} value={searchQuery} onChange={handleInputChange} />

          </div>

          <div className='filterButtons'>
            <button onClick={() => handleFilter(null)} className={`btn_filter ${selectedFilter === null ? 'active' : ''}`}>
              {t.All}
            </button>
            <button onClick={() => handleFilter(23)} className={`btn_filter ${selectedFilter === 23 ? 'active' : ''}`}>
              {t.Configured}
            </button>
            <button onClick={() => handleFilter(25)} className={`btn_filter ${selectedFilter === 25 || selectedFilter === 27 || selectedFilter === 28 ? 'active' : ''}`}>
              {t.Pending}
            </button>
            <button onClick={() => handleFilter(31)} className={`btn_filter ${selectedFilter === 31 ? 'active' : ''}`}>
              {t['Not hired']}
            </button>
          </div>

        </div>

        {isLoading && <Loading />}

        {searchResults.length > 0
          ? (
            <div className='products_cards'>

              <ul>
                {searchResults.map((product) => (
                  <li key={product.iId} className='card financy'>

                    <span className='card_type'>
                      {t['Finance and accounting']}

                      {session?.sPerfilCode == 'ADMIN' &&

                        <Link href={`/product/product?type=apiconfiguration&iIdProdEnv=${product.iIdProdEnv}&iId=${product.iId}&pStatus=${product.iCodeStatus}&idEmpresa=${empresa.id_empresa}`}> <p className='report blue  green admin'>  <ImageSvg name='Admin' />  </p> </Link>}

                    </span>

                    <div className='card_name'>
                      <h4> {product.sName}</h4>

                      {(product.iCodeStatus === 23 || product.iCodeStatus === 28)
                        ? (

                          <p className='dayLetf'>
                            {/* <ImageSvg name='Time' /> */}
                            {calcularDiasRestantes(product.sDateEnd) >= 0
                              ? <span style={{ color: '#7D86A2' }}>    {t['Days left:']} {calcularDiasRestantes(product.sDateEnd)}</span>
                              : (
                                <span className='' style={{ color: 'red' }}>   {t['Permit expired ago']}   {-1 * calcularDiasRestantes(product.sDateEnd)} {t.days} </span>)}
                          </p>)
                        : <p className='dayLetf' style={{ color: 'white' }}>.......</p>}

                    </div>

                    <div className='card_actions'>

                      <div className='box-img'>

                        <div className='type_icon'>

                          <ImageSvg name={imgProduct(product.iId)} />
                        </div>

                      </div>

                      <div className='status-box'>

                        <p>
                          {product.sDescStatus}
                        </p>

                        {renderButtons(product)}

                      </div>

                    </div>

                  </li>
                ))}

                {/* productos añadidos por el momento */}

                <li className='card financy' style={{ visibility: selectedFilter == 31 || !selectedFilter ? 'visible' : 'hidden' }}>

                  <span className='card_type'>
                    {t['Finance and accounting']}
                  </span>

                  <div className='card_name'>
                    <h4> {t['Download SUNAT Tax Status Registers']}</h4>

                    <p className='dayLetf'>
                      {/* <ImageSvg name='Time' /> */}
                      {/* {t['Days left:']} .. */}
                    </p>

                  </div>

                  <div className='card_actions'>

                    <div className='box-img'>
                      <div className='type_icon'>

                        <ImageSvg name={imgProduct(3)} />
                      </div>

                    </div>

                    <div className='status-box'>

                      <p>  {t['Not hired']}
                      </p>
                      <Link href='https://www.innovativa.la/digitalemployee'>
                        {t['View more']}
                      </Link>
                    </div>

                  </div>
                </li>

                <li className='card financy' style={{ visibility: selectedFilter == 31 || !selectedFilter ? 'visible' : 'hidden' }}>

                  <span className='card_type'>
                    {t['Finance and accounting']}
                  </span>

                  <div className='card_name'>
                    <h4> {t['Invoice register']}</h4>

                    <p className='dayLetf'>
                      {/* <ImageSvg name='Time' /> */}
                      {/* {t['Days left:']} .. */}
                    </p>

                  </div>

                  <div className='card_actions'>

                    <div className='box-img'>
                      <div className='type_icon'>

                        <ImageSvg name={imgProduct(4)} />
                      </div>

                    </div>

                    <div className='status-box'>

                      <p>  {t['Not hired']}
                      </p>
                      <Link href='https://www.innovativa.la/digitalemployee'>
                        {t['View more']}
                      </Link>
                    </div>

                  </div>
                </li>

                <li className='card financy' style={{ visibility: selectedFilter == 31 || !selectedFilter ? 'visible' : 'hidden' }}>

                  <span className='card_type'>
                    {t['Finance and accounting']}
                  </span>

                  <div className='card_name'>
                    <h4> {t['Download account statements']}</h4>

                    <p className='dayLetf'>
                      {/* <ImageSvg name='Time' /> */}
                      {/* {t['Days left:']} .. */}
                    </p>

                  </div>

                  <div className='card_actions'>

                    <div className='box-img'>
                      <div className='type_icon'>

                        <ImageSvg name={imgProduct(4)} />
                      </div>

                    </div>

                    <div className='status-box'>

                      <p>  {t['Not hired']}
                      </p>
                      <Link href='https://www.innovativa.la/digitalemployee'>
                        {t['View more']}
                      </Link>
                    </div>

                  </div>
                </li>
                <li className='card human' style={{ visibility: selectedFilter == 31 || !selectedFilter ? 'visible' : 'hidden' }}>

                  <span className='card_type'>
                    {t['Human Resources']}
                  </span>

                  <div className='card_name'>
                    <h4> {t['AFP validation']}</h4>

                    <p className='dayLetf'>
                      {/* <ImageSvg name='Time' /> */}
                      {/* {t['Days left:']} .. */}
                    </p>

                  </div>

                  <div className='card_actions'>

                    <div className='box-img'>
                      <div className='type_icon'>

                        <ImageSvg name={imgProduct(4)} />
                      </div>

                    </div>

                    <div className='status-box'>

                      <p>  {t['Not hired']}
                      </p>
                      <Link href='https://www.innovativa.la/digitalemployee'>
                        {t['View more']}
                      </Link>
                    </div>

                  </div>
                </li>

              </ul>
            </div>
            )
          : (
            <p>{t['No results found']}</p>
            )}
      </div>

      {requestError && <p className='errorMessage'>{requestError.message}</p>}

    </LayoutProducts>
  )
}
