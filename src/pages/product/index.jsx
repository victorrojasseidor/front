// import "../../../styles/styles.scss";
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

  const { session, empresa, setModalToken } = useAuth()

  const router = useRouter()
  useEffect(() => {
    if (!session) {
      router.push('/login')
    } else {
      getProductscard()
    }
  }, [session, empresa])

  async function getProductscard () {
    try {
      const token = session.sToken
      const idEmpresa = empresa.id_empresa
      const responseData = await getProducts(idEmpresa, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setProduct(data)
        setModalToken(false)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse
          ? responseData.oAuditResponse.sMessage
          : 'Error in sending the form'
        console.log('error', errorMessage)
      }
    } catch (error) {
      console.error('error', error)
      setModalToken(true)
    }
  }

  console.log('product', product)

  useEffect(() => {
    if (product && product.length > 0) { // Added check for product length
      const filterResults = () => {
        let results = product
        if (selectedFilter) {
          results = results.filter(
            (product) =>
              product.sDescStatus.toLowerCase().includes(selectedFilter.toLowerCase())
          )
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
    if (status === 'Configured') {
      return <span>Expires in {time.SExpires} ago</span>
    } else if (status === 'Pending') {
      return <span>{time.sEnabled}</span>
    } else if (status === 'Not hired') {
      return <span>Updated {time.sUpdate} ago</span>
    } else {
      return <span>---</span>
    }
  }

  const renderButtons = (data) => {
    const handleLink = () => {
      router.push(`/product/product?iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}`)
    }

    const status = data.sDescStatus
    if (status === 'Configured') {
      return <span> </span>
    } else if (status === 'Pending') {
      return (
        <button className='btn_primary' onClick={handleLink}>
          Configurations
        </button>
      )
    } else if (status === 'Not hired') {
      return <button className='btn_secundary' onClick={handleLink}>Free trial</button>
    } else {
      return <span> </span>
    }
  }

  return (
    <LayoutProducts>
      <div className='products'>
        <div className='products_filterSearch'>
          <div className='filterButtons'>
            <button onClick={() => handleFilter(null)} className={selectedFilter === null ? 'active' : ''}>
              All
            </button>
            <button onClick={() => handleFilter('Configured')} className={selectedFilter === 'Configured' ? 'active' : ''}>
              Configured
            </button>
            <button onClick={() => handleFilter('Pending')} className={selectedFilter === 'Pending' ? 'active' : ''}>
              Pending
            </button>
            <button onClick={() => handleFilter('Not hired')} className={selectedFilter === 'Not hired' ? 'active' : ''}>
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

        {searchResults.length > 0
          ? (
            <div className='products_cards'>
              <p> {selectedFilter}</p>
              <ul>
                {searchResults.map((product) => (
                  <li key={product.iId} className={`card ${product.sDescStatus === 'Configured' ? 'configured' : ''} ${product.sDescStatus === 'Pending' || product.sDescStatus === 'Earring' ? 'pending' : ''}`}>
                    <div>
                      <span>
                        <ImageSvg name='Products' />
                      </span>
                      <Link href={`/product/product?iIdProdEnv=${product.iIdProdEnv}&iId=${product.iId}`}>
                        <h5> {product.sName}</h5>
                      </Link>
                    </div>
                    <div>
                      <p>{product.sDescStatus}</p>
                      <span>
                        <ImageSvg name='Time' />
                        {renderSelectedFilter(product.sDescStatus, product.jTime)}
                      </span>
                    </div>

                    <div>
                      <LimitedParagraph text={product.sDescription} limit={40} />
                    </div>

                    <div>
                      <Link href={`/product/product?iIdProdEnv=${product.iIdProdEnv}&iId=${product.iId}`}>
                        <p> View more</p>
                      </Link>
                      {renderButtons(product)}

                    </div>
                  </li>
                ))}

                {/*productos añadidos por el momento*/}

                <li className='card'>
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

                <li className='card'>
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
                </li>

                <li className='card'>
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
    </LayoutProducts>
  )
}
