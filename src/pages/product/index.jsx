import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Changed from 'next/navigation'
import { useAuth } from '@/Context/DataContext'
import { getProducts } from '@/helpers/auth'
import NavigationPages from '@/Components/NavigationPages'
import Loading from '@/Components/Atoms/Loading'
import imgEstractos from '../../../public/img/prod-estractos.jpg'
import imgInvoice from '../../../public/img/prod-invoice.jpg'
import imgTipo from '../../../public/img/prod-tipo.jpg'
import imgSunat from '../../../public/img/prod-sunat.jpg'
import imgProd from '../../../public/img/prod-default.jpg'
import Image from 'next/image'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
// import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Products () {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [product, setProduct] = useState({})
  const [requestError, setRequestError] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    console.log({ newValue })
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
  }, [])

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

  const handleSearch = () => {
    setSearchQuery('')
    setSelectedFilter(null)
  }

  const imgProduct = (id) => {
    if (id === 1) {
      return imgEstractos
    } else if (id === 2) {
      return imgTipo
    } else if (id === 3) {
      return imgSunat
    } else if (id === 4) {
      return imgProd
    } else return imgProd
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
          className='btn_secundary'
          onClick={() => handleLink(`/product/product?type=freetrial&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}
        >

          {t['Try free']}

        </button>
      )
    } else if (dayLef <= 0) {
      return (
        <>
          <Link href='https://www.innovativa.la/contacto'> {t['Contact technical support']} </Link>
        </>
      )
    } else {
      return <Link href='#'> <p>  </p> </Link>
    }
  }

  // autocomplete

  return (
    <LayoutProducts menu='Product'>

      {!session && <Loading />}

      <div className='products'>
        <NavigationPages title={t['Digital employees']}>

          <Link href='/product'>
            Home
          </Link>

        </NavigationPages>

        <div className='products_home'>

          <div className='welcome'>
            <h1> {t.Welcome} {session?.sPerfilCode == 'ADMIN' ? session?.sPerfilCode : session?.jCompany.razon_social_company}</h1>
            <p>  {t['Our digital employees work to improve your productivity']}</p>

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
                  <h2> 2</h2>
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
              <div className='sub-title'>
                <h3> {t['ARI Finance to']} {empresa?.razon_social_empresa}</h3>
              </div>

              <ul>
                {searchResults.map((product) => (
                  <li key={product.iId} className='card'>

                    <div className='card-title'>

                      <div className='box-img'>
                        <Image src={imgProduct(product.iId)} width={500} alt='imgProducts' />
                        {session?.sPerfilCode == 'ADMIN' &&

                          <Link href={`/product/product?type=apiconfiguration&iIdProdEnv=${product.iIdProdEnv}&iId=${product.iId}&pStatus=${product.iCodeStatus}&idEmpresa=${empresa.id_empresa}`}> <p className='report blue  green admin'>  <ImageSvg name='Admin' /> Admin </p> </Link>}

                      </div>

                      <div className='box-name'>
                        <h4> {product.sName}</h4>

                        {(product.iCodeStatus === 23 || product.iCodeStatus === 28)
                          ? (

                            <p className='dayLetf'>
                              <ImageSvg name='Time' />
                              {calcularDiasRestantes(product.sDateEnd) >= 0
                                ? <span style={{ color: 'blue' }}>    {t['Days left:']} {calcularDiasRestantes(product.sDateEnd)}</span>
                                : (
                                  <span className='' style={{ color: 'red' }}>   {t['Permit expired ago']}   {-1 * calcularDiasRestantes(product.sDateEnd)} {t.days} </span>)}
                            </p>)
                          : <p className='dayLetf' style={{ color: 'white' }}>.......</p>}

                      </div>

                    </div>

                    <div className='card-actions'>
                      <div className='card-status'>

                        <p className={`btn_filter ${product.iCodeStatus === 23 ? 'configured' : (product.iCodeStatus === 28 ? 'pending' : 'not-hired')}`}>
                          {product.sDescStatus}
                        </p>

                      </div>
                      {renderButtons(product)}
                    </div>

                  </li>
                ))}

                {/* productos añadidos por el momento */}

                <li className='card' style={{ gap: '1rem', visibility: selectedFilter == 31 || !selectedFilter ? 'visible' : 'hidden' }}>

                  <div className='card-title'>
                    <div className='box-img'>
                      <Image src={imgProduct(3)} width={1000} alt='imgProducts' />

                    </div>

                    <div className='box-name'>
                      <h4> {t['Download SUNAT Tax Status Registers']}</h4>

                      <p className='dayLetf'>
                        <ImageSvg name='Time' />
                        {t['Days left:']} ..
                      </p>

                    </div>

                  </div>

                  <div className='card-actions'>
                    <div className='card-status'>

                      <p className='btn_filter not-hired'>  {t['Not hired']}
                      </p>

                    </div>
                    <Link href='https://www.innovativa.la/digitalemployee'>
                      {t['View more']}
                    </Link>
                  </div>
                </li>

                <li className='card' style={{ visibility: selectedFilter == 31 || !selectedFilter ? 'visible' : 'hidden' }}>

                  <div className='card-title'>

                    <div className='box-img'>
                      <Image src={imgProduct(4)} width={1000} alt='imgProducts' />

                    </div>

                    <div className='box-name'>
                      <h4> {t['Invoice register']} </h4>

                      <p className='dayLetf'>
                        <ImageSvg name='Time' />
                        {t['Days left:']} ..
                      </p>

                    </div>

                  </div>

                  <div className='card-actions'>
                    <div className='card-status'>

                      <p className='btn_filter not-hired'>  {t['Not hired']}
                      </p>

                    </div>

                    <Link href='https://www.innovativa.la/digitalemployee'>
                      {t['View more']}
                    </Link>

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
