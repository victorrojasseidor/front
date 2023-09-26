import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LimitedParagraph from '@/helpers/limitParagraf'
import { useRouter } from 'next/navigation' // Changed from 'next/navigation'
import { useAuth } from '@/Context/DataContext'
import { getProducts } from '@/helpers/auth'
import NavigationPages from '@/Components/NavigationPages'
import Loading from '@/Components/Atoms/Loading'

export default function Products () {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [product, setProduct] = useState({})
  const [requestError, setRequestError] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { session, setModalToken, logout } = useAuth()

  const router = useRouter()
  useEffect(() => {
    getProductscard()
  }, [session, empresa])

  async function getProductscard () {
    setIsLoading(true)
    try {
      const token = session.sToken
      const idEmpresa = empresa.id_empresa
      const responseData = await getProducts(idEmpresa, token)
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults

        setProduct(data)
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
    } finally {
      setIsLoading(false) // Ocultar el indicador de carga después de que la petición se complete
    }
  }

  const handleSelectChangeEmpresa = (event) => {
    const selectedValue = event.target.value
    const DataEmpresa = session.oEmpresa.find((empres) => empres.razon_social_empresa === selectedValue)

    if (DataEmpresa) {
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

  useEffect(() => {
    // Comprobar si hay una empresa seleccionada en el localStorage
    const storedEmpresa = localStorage.getItem('selectedEmpresa')
    if (storedEmpresa) {
      setEmpresa(JSON.parse(storedEmpresa))
    } else if (session.oEmpresa.length > 0) {
      // Si no hay una empresa en el localStorage, utiliza la primera empresa de session.oEmpresa
      setEmpresa(session.oEmpresa[0])
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

  const renderSelectedFilter = (status, time) => {
    const renderStatus = status
    if (renderStatus === 23) {
      /* si está configurado */
      return <span>{time.SExpires}</span>
    } else if (renderStatus === 28) {
      /* si está pendiente de configurar */
      return <span>{time.sEnabled}</span>
    } else if (renderStatus === 27) {
      /* si está pendiente de solicitud */
      return <span>{time.sNoAprob}</span>
    } else if (renderStatus === 31) {
      /* si no ha sido solicitado, estado free trial */
      return <span>{time.sUpdate}</span>
    } else {
      return <span>---</span>
    }
  }

  const renderButtons = (data) => {
    const handleLink = (ruta) => {
      router.push(ruta)
    }

    const status = data.iCodeStatus
    if (status === 28) {
      return (
        <button
          className='btn_primary'
          onClick={() => handleLink(`/product/product?type=configuration&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}
        >

          <span>     </span> Setup  <span>  </span>

        </button>
      )
    } else if (status === 23) {
      return (
        <button
          className='btn_primary'
          onClick={() => handleLink(`/product/product?type=configuration&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}
        >

          <span>     </span>  Edit <span>  </span>

        </button>
      )
    } else if (status === 27 || status === 31) {
      return (
        <button
          className='btn_secundary'
          onClick={() => handleLink(`/product/product?type=freetrial&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}
        >

          Free Trial

        </button>
      )
    } else {
      return (
        <Link href='#'>
          <p> View more</p>
        </Link>
      )
    }
  }

  return (
    <LayoutProducts menu='Product'>
      <div className='products'>
        <NavigationPages title='Digital employees'>
          <div>
            <Link href='/product'>
              <ImageSvg name='Products' />
            </Link>
          </div>
        </NavigationPages>

        <div className='perfil-select'>
          <p>
            <span className='welcomeSpan'> Welcome 👋, Digital employees to company: </span>

            {/* <Image src={carita} width={20} alt='carita' /> */}
          </p>
          <select value={empresa?.razon_social_empresa || ''} onChange={handleSelectChangeEmpresa}>
            {session?.oEmpresa.map((empres) => (
              <option key={empres.id_empresa} value={empres.razon_social_empresa}>
                {empres.razon_social_empresa}
              </option>
            ))}
          </select>
        </div>

        <div className='products_filterSearch'>
          <div className='filterButtons'>
            <button onClick={() => handleFilter(null)} className={selectedFilter === null ? 'active' : ''}>
              All
            </button>
            <button onClick={() => handleFilter(23)} className={selectedFilter === 23 ? 'active' : ''}>
              Configured
            </button>
            <button onClick={() => handleFilter(25)} className={selectedFilter === 25 || selectedFilter === 27 || selectedFilter === 28 ? 'active' : ''}>
              Pending
            </button>
            <button onClick={() => handleFilter(31)} className={selectedFilter === 31 ? 'active' : ''}>
              Not hired
            </button>
          </div>
          <div className='searchButton'>
            <input type='text' placeholder='Search...' value={searchQuery} onChange={handleInputChange} />
            <button onClick={handleSearch}>
              <ImageSvg name='Search' />
            </button>
          </div>
        </div>

        {isLoading && <Loading />}

        {searchResults.length > 0
          ? (
            <div className='products_cards'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h5> finance and administration to {empresa?.razon_social_empresa}</h5>

              </div>

              <ul>
                {searchResults.map((product) => (
                  <li key={product.iId} className={`card ${product.sDescStatus === 'Configured' ? 'configured' : ''} ${product.sDescStatus === 'Pending' || product.sDescStatus === 'Earring' ? 'pending' : ''}`}>
                    <div>
                      <span>
                        <ImageSvg name='Products' />
                      </span>

                      <h5> {product.sName}</h5>

                    </div>
                    <div>
                      <span>
                        Status:
                      </span>
                      <p>{product.sDescStatus}</p>
                      <span>
                        <ImageSvg name='Time' />
                        {renderSelectedFilter(product.iCodeStatus, product.jTime)}
                      </span>
                    </div>

                    <div>

                      {renderButtons(product)}

                    </div>
                  </li>
                ))}

                {/* productos añadidos por el momento */}

                <li className='card' style={{ display: selectedFilter == 31 || !selectedFilter ? 'block' : 'none' }}>
                  <div>
                    <span>
                      <ImageSvg name='Products' />
                    </span>
                    <Link href='#'>
                      <h5> Download SUNAT Tax Status Registers </h5>
                    </Link>
                  </div>
                  <div>
                    <span>
                      Status:
                    </span>
                    <p>Not hired</p>
                    <span>
                      <ImageSvg name='Time' />
                      <span> Update 3 months</span>
                    </span>
                  </div>

                  <div>
                    <Link href='https://www.innovativa.la/digitalemployee'>
                      View more
                    </Link>
                  </div>
                </li>

                <li className='card' style={{ display: selectedFilter == 31 || !selectedFilter ? 'block' : 'none' }}>
                  <div>
                    <span>
                      <ImageSvg name='Products' />
                    </span>
                    <Link href='#'>
                      <h5>Invoice register</h5>
                    </Link>
                  </div>
                  <div>
                    <span>
                      Status:
                    </span>
                    <p>Not hired</p>
                    <span>
                      <ImageSvg name='Time' />
                      <span> Update 1 months</span>
                    </span>
                  </div>

                  <div>
                    <Link href='https://www.innovativa.la/digitalemployee'>
                      View more
                    </Link>

                  </div>
                </li>

              </ul>
            </div>
            )
          : (
            <p>No results found</p>
            )}
      </div>

      {requestError && <p className='errorMessage'>{requestError.message}</p>}

    </LayoutProducts>
  )
}
