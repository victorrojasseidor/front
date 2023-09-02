import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LimitedParagraph from '@/helpers/limitParagraf'
import { useRouter } from 'next/navigation' // Changed from 'next/navigation'
import { useAuth } from '@/Context/DataContext'
import { getProducts } from '@/helpers/auth'

export default function Products () {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [product, setProduct] = useState({})
  const [requestError, setRequestError] = useState('')
  const { session, empresa, setModalToken, logout } = useAuth()

  const router = useRouter()
  useEffect(() => {
    getProductscard()
  }, [session, empresa])

  if (!session) {
    router.push('/login')
  }

  async function getProductscard () {
    try {
      const token = session.sToken
      const idEmpresa = empresa.id_empresa
      console.log('idEmpresaProduct', idEmpresa)
      const responseData = await getProducts(idEmpresa, token)
      console.log(responseData)

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
    }
  }

  // useEffect(() => {
  //   if (product && product.length > 0) { // Added check for product length
  //     const filterResults = () => {
  //       let results = product
  //       console.log('selectedFilter', selectedFilter)

  //       if (selectedFilter === 25) {
  //         results = results.filter(
  //           (product) =>
  //             product.iCodeStatus === 27 || product.iCodeStatus === 28
  //         )
  //       } else {
  //         results = results.filter(
  //           (product) =>
  //             product.iCodeStatus === selectedFilter
  //         )
  //       }

  //       if (searchQuery) {
  //         results = results.filter((product) =>
  //           product.sName.toLowerCase().includes(searchQuery.toLowerCase())
  //         )
  //       }

  //       setSearchResults(results)
  //     }

  //     filterResults()
  //   }
  // }, [searchQuery, selectedFilter, product])
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

  console.log('result', searchResults)

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
    if (status === 23 || status === 28) {
      return (
        <button
          className='btn_primary'
          onClick={() => handleLink(`/product/product?type=configuration&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}`)}
        >
          {data.sDescStatus || 'Configure'}
        </button>
      )
    } else if (status === 27 || status === 31) {
      return <button className='btn_secundary' onClick={() => handleLink(`/product/product?type=freetrial&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}`)}>Free trial</button>
    } else {
      return <span> </span>
    }
  }

  return (
    <LayoutProducts menu='Product'>
      <div className='products'>
        <div className='navegación'>
          <Link href='/product'>
            <ImageSvg name='Products' />
          </Link>
          Digital employes
          <span>
            {empresa?.razon_social_empresa}
          </span>
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
            <input type='text' placeholder='Search...' value={searchQuery} onChange={() => handleInputChange} />
            <button onClick={handleSearch}>
              <ImageSvg name='Search' />
            </button>
          </div>
        </div>

        {searchResults.length > 0
          ? (
            <div className='products_cards'>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h5> Finanzas & Administración </h5>
              </div>
              {/* <p> {selectedFilter}</p> */}
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
                      <p>{product.sDescStatus}</p>
                      <span>
                        <ImageSvg name='Time' />
                        {renderSelectedFilter(product.iCodeStatus, product.jTime)}
                      </span>
                    </div>

                    <div>
                      <LimitedParagraph text={product.sDescription} limit={40} />
                    </div>

                    <div>

                      <Link href={`/product/product?type=documentation&iIdProdEnv=${product.iIdProdEnv}&iId=${product.iId}&pStatus=${product.iCodeStatus}`}>
                        <p> View more</p>
                      </Link>
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
                      <h5> Pattern</h5>
                    </Link>
                  </div>
                  <div>
                    <p>Not hired</p>
                    <span>
                      <ImageSvg name='Time' />
                      <span> Update 3 months</span>
                    </span>
                  </div>

                  <div>
                    <LimitedParagraph text='Create your list of patterns, you can add more than one' limit={40} />
                  </div>

                  <div>
                    <Link href='/product'>
                      <p> View more</p>
                    </Link>

                    <button className='btn_secundary'>Free trial</button>
                  </div>
                </li>

                {/* <li className='card'>
                  <div>
                    <span>
                      <ImageSvg name='Products' />
                    </span>
                    <Link href='#'>
                      <h5> Currency Exchange rates automation</h5>
                    </Link>
                  </div>
                  <div>
                    <p>Not hired</p>
                    <span>
                      <ImageSvg name='Time' />
                      <span> Update 1 months</span>
                    </span>
                  </div>

                  <div>
                    <LimitedParagraph text='Settings for Daily exchange rate' limit={40} />
                  </div>

                  <div>
                    <Link href='/product'>
                      <p> View more</p>
                    </Link>

                    <button className='btn_secundary'>Free trial</button>
                  </div>
                </li> */}

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
                    <p>Not hired</p>
                    <span>
                      <ImageSvg name='Time' />
                      <span> Update 1 months</span>
                    </span>
                  </div>

                  <div>
                    <LimitedParagraph text='Settings for Daily exchange rate' limit={40} />
                  </div>

                  <div>
                    <Link href='/product'>
                      <p> View more</p>
                    </Link>

                    <button className='btn_secundary'>Free trial</button>
                  </div>
                </li>

              </ul>
            </div>
            )
          : (
            <p>No results found</p>
            )}
      </div>
      {requestError && <div className='errorMessage'>
        {requestError}
                       </div>}
    </LayoutProducts>
  )
}
