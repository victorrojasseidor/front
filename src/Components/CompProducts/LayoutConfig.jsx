import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import LayoutProducts from '@/Components/LayoutProducts'
import FreeTrial from '@/Components/FreeTrial'
import { getProducts } from '@/helpers/auth'
import { useAuth } from '@/Context/DataContext'
import { componentsProduct } from '@/Components/CompProducts/componentsProduct'
import Link from 'next/link'
import ImageSvg from '@/helpers/ImageSVG'
import NavigationPages from '../NavigationPages'

export default function LayoutConfig ({ id, iIdProdEnv, defaultTab, children, NameAcount, idEmpresa }) {
  const [product, setProduct] = useState(null)
  const [activeTab, setActiveTab] = useState(defaultTab || 0)
  const [component, setComponent] = useState(null)
  const router = useRouter()

  const { session, setModalToken } = useAuth()

  useEffect(() => {
    const selectComponentes = componentsProduct.find((p) => p.iId === parseInt(id))
    setComponent(selectComponentes)
  }, [id])

  useEffect(() => {
    getDataProduct()
  }, [id, idEmpresa, session])

  const handleTabClick = (index) => {
    if (index === 0) {
      if (product.iCodeStatus === 27 || product.iCodeStatus === 31) {
        setActiveTab(index)
      }
    } else if (index === 1) {
      // Lógica para el tab 1
      // Si iCodeStatus es 28 o 23, se activa el tab 1
      if (product.iCodeStatus === 28 || product.iCodeStatus === 23) {
        setActiveTab(index)
      }
    } else if (index === 2) {
      // Lógica para el tab 2
      // Si iCodeStatus es igual a un valor específico, se activa el tab 2
      setActiveTab(index)
    } else {
      setActiveTab(index)
    }
  }

  async function getDataProduct () {
    try {
      const token = session.sToken
      const responseData = await getProducts(idEmpresa, token)
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const data = responseData.oResults
        const selectedProduct = data.find((p) => p.iIdProdEnv === parseInt(iIdProdEnv))
        setProduct(selectedProduct)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        setModalToken(true)
        console.error('errok, ', errorMessage)
      }
    } catch (error) {
      setModalToken(true)
      console.error('error', error)
    }
  }

  const NameEmpresa = (id) => {
    const filterEmpresa = session.oEmpresa.find((p) => p.id_empresa == id)
    return filterEmpresa.razon_social_empresa
  }

  return (
    <LayoutProducts menu='Product'>

      <NavigationPages title='Digital employees'>

        <Link href='/product'>
          <ImageSvg name='Products' />
          <p>
            {/* {empresa?.razon_social_empresa} */}
            {NameEmpresa(idEmpresa)}
          </p>
        </Link>

        <ImageSvg name='Navegación' />

        <Link href={`/product/product?type=configuration&iIdProdEnv=${iIdProdEnv}&iId=${id}&idEmpresa=${idEmpresa}`}>
          {NameAcount ? <p> {product?.sName} </p> : <span>  {product?.sName}</span>}

        </Link>

        <span>
          {NameAcount ? <span> <ImageSvg name='Navegación' /> {NameAcount} </span> : ''}
        </span>

      </NavigationPages>
      {product &&
        <section className='idProduct'>

          <div className='idProduct_container'>
            <div className='horizontalTabs'>
              <div className='tab-header'>
                <Link href={`/product/product?type=freetrial&iIdProdEnv=${iIdProdEnv}&iId=${id}&idEmpresa=${idEmpresa}`}>
                  <button className={activeTab === 0 ? 'active ' : ''} onClick={() => handleTabClick(0)}>
                    {/* <h4>Free Trial</h4> */}

                    <h4> Free Trial</h4>

                  </button>
                </Link>

                <Link
                  href={`/product/product?type=configuration&iIdProdEnv=${iIdProdEnv}&iId=${id}&pStatus=${product?.iCodeStatus}}&idEmpresa=${idEmpresa}`}
                >
                  <button
                    style={{
                      display: product.iCodeStatus === 23 || product.iCodeStatus === 28 ? 'block' : 'none'
                    }}
                    className={activeTab === 1 ? 'active ' : ''} onClick={() => handleTabClick(1)}
                  >
                    <h4> Configuration</h4>
                  </button>
                </Link>

                <Link href={`/product/product?type=apiconfiguration&iIdProdEnv=${iIdProdEnv}&iId=${id}&pStatus=${product?.iCodeStatus}}&idEmpresa=${idEmpresa}`}>
                  <button className={activeTab === 2 ? 'active' : ''} style={{ display: 'none' }} onClick={() => handleTabClick(2)}>
                    <h4> API Configuration</h4>

                  </button>
                </Link>
                <Link href={`/product/product?type=documentation&iIdProdEnv=${iIdProdEnv}&iId=${id}&pStatus=${product?.iCodeStatus}}&idEmpresa=${idEmpresa}`}>
                  <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}>

                    <h4> Documentation</h4>

                  </button>
                </Link>
              </div>
              <div className='tab-content'>
                {activeTab === 0 && (
                  <div className='tabOne'>
                    <FreeTrial iIdProd={iIdProdEnv} />
                    {/* ... */}
                  </div>
                )}
                {activeTab === 1 && (
                  <div>

                    {children}
                  </div>
                )}
                {activeTab === 2 && (
                  <div className='ApiConfiCurency'>
                    <h3>apiconfuguración</h3>
                  </div>
                )}
                {activeTab === 3 && <div>{component?.documentation}</div>}
              </div>
            </div>
          </div>
        </section>}

    </LayoutProducts>
  )
}
