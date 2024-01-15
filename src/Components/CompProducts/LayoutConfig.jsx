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
import Apiconfiguration from '../Admi/Apiconfiguration'

export default function LayoutConfig ({ id, iIdProdEnv, defaultTab, children, NameAcount, idEmpresa }) {
  const [product, setProduct] = useState(null)
  const [activeTab, setActiveTab] = useState(defaultTab || 0)
  const [component, setComponent] = useState(null)

  const { session, setModalToken, l, logout } = useAuth()

  const router = useRouter()

  const t = l.Products

  useEffect(() => {
    const selectComponentes = componentsProduct.find((p) => p.iId === parseInt(id))
    setComponent(selectComponentes)
  }, [id])

  useEffect(() => {
    getDataProduct()
    const t = l.Products
  }, [id, idEmpresa, session, t])

  const handleTabClick = (index) => {
    if (index === 0) {
      if (product.iCodeStatus === 27 || product.iCodeStatus === 31) {
        setActiveTab(index)
      }
    } else if (index === 1) {
      // Lógica para el tab 1
      // Si iCodeStatus es 28 o 23, se activa el tab 1
      if (session?.sPerfilCode === 'ADMIN' || product.iCodeStatus === 28 || product.iCodeStatus === 23) {
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
      // console.log({ responseData })
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const data = responseData.oResults
        const selectedProduct = data.find((p) => p.iId === parseInt(id))
        setProduct(selectedProduct)
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true)
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout()
        // setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        setModalToken(true)
        console.log('errok, ', errorMessage)
      }
    } catch (error) {
      setModalToken(true)
      console.error('error', error)
    }
  }

  const NameEmpresa = (id) => {
    const filterEmpresa = session?.oEmpresa.find((p) => p.id_empresa == id)
    return filterEmpresa?.razon_social_empresa
  }

  return (
    <LayoutProducts menu='Product'>

      <NavigationPages title={t['Digital employees']}>

        <ImageSvg name='Products' />
        <Link href='/product'>
          Home
          <ImageSvg name='Navegación' />
          <p>

            {idEmpresa && NameEmpresa(idEmpresa)}
          </p>
        </Link>

        <ImageSvg name='Navegación' />

        <span>
          {product?.sName}
        </span>

      </NavigationPages>
      {product &&
        <section className='idProduct'>

          <div className='idProduct_container'>
            <div className='horizontalTabs'>
              <div className='tab-header'>
                <Link href={`/product/product?type=freetrial&iIdProdEnv=${iIdProdEnv}&iId=${id}&idEmpresa=${idEmpresa}`}>
                  <button className={activeTab === 0 ? 'active ' : ''} onClick={() => handleTabClick(0)}>

                    <h4> {t['Free Trial']}</h4>

                  </button>
                </Link>

                <Link
                  href={`/product/product?type=configuration&iIdProdEnv=${iIdProdEnv}&iId=${id}&pStatus=${product?.iCodeStatus}&idEmpresa=${idEmpresa}`}
                >
                  <button
                    // style={{
                    //   display: product.iCodeStatus === 23 || product.iCodeStatus === 28 ? 'block' : 'none'
                    // }}
                    style={{ display: session?.sPerfilCode === 'ADMIN' ? 'block' : product.iCodeStatus === 23 || product.iCodeStatus === 28 ? 'block' : 'none' }}
                    className={activeTab === 1 ? 'active ' : ''} onClick={() => handleTabClick(1)}
                  >
                    <h4> {t.Configuration}</h4>
                  </button>
                </Link>

                <Link
                  href={`/product/product?type=apiconfiguration&iIdProdEnv=${iIdProdEnv}&iId=${id}&pStatus=${product?.iCodeStatus}&idEmpresa=${idEmpresa}`}
                  style={{ visibility: session?.sPerfilCode === 'ADMIN' ? 'visible' : 'hidden' }}
                >
                  <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}>
                    <h4> {t['Admin confuguratión']}</h4>

                  </button>
                </Link>

                <Link href={`/product/product?type=documentation&iIdProdEnv=${iIdProdEnv}&iId=${id}&pStatus=${product?.iCodeStatus}&idEmpresa=${idEmpresa}`} style={{ display: 'none' }}>
                  <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}>

                    <h4> {t.Documentation}</h4>

                  </button>
                </Link>
              </div>
              <div className='tab-content'>
                {activeTab === 0 && (
                  <div className='tabOne'>
                    <FreeTrial iIdProd={iIdProdEnv} nameProduct={product?.sName} />
                  </div>
                )}
                {activeTab === 1 && (
                  <div>

                    {children}
                  </div>
                )}
                {activeTab === 2 && (
                  <div style={{ visibility: session?.sPerfilCode === 'ADMIN' ? 'visible' : 'hidden' }}>

                    <Apiconfiguration nameEmpresa={NameEmpresa(idEmpresa)} product={product} />
                  </div>
                )}
                {activeTab === 3 && <div>
                  {/* {component?.documentation} */}

                </div>}
              </div>
            </div>

          </div>
        </section>}

    </LayoutProducts>
  )
}
