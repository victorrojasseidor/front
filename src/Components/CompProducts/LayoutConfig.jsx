import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import LayoutProducts from '@/Components/LayoutProducts'
import FreeTrial from '@/Components/FreeTrial'
import BackButton from '@/Components/BackButton'
import { getProducts } from '@/helpers/auth'
import { useAuth } from '@/Context/DataContext'
import { componentsProduct } from '@/Components/CompProducts/componentsProduct'

export default function LayoutConfig ({ id, iIdProdEnv, defaultTab, children }) {
  const [product, setProduct] = useState(null)
  const [activeTab, setActiveTab] = useState(defaultTab || 0)
  const [component, setComponent] = useState(null)
  const router = useRouter()

  const { session, empresa, setModalToken } = useAuth()

  useEffect(() => {
    const selectComponentes = componentsProduct.find((p) => p.iId === parseInt(id))
    setComponent(selectComponentes)
  }, [id])

  useEffect(() => {
    getDataProduct()
  }, [id])

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  async function getDataProduct () {
    try {
      const token = session.sToken
      const idEmpresa = empresa.id_empresa
      const responseData = await getProducts(idEmpresa, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false)
        const data = responseData.oResults
        const selectedProduct = data.find((p) => p.iIdProdEnv === parseInt(iIdProdEnv))
        setProduct(selectedProduct)
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

  return (
    <LayoutProducts>
      {product &&
        <section className='idProduct'>
          <BackButton />
          <h4> {product?.sName} </h4>
          <div className='idProduct_container'>
            <div className='tabs-container'>
              <div className='tab-header'>
                <button className={activeTab === 0 ? 'active ' : ''} onClick={() => handleTabClick(0)}>
                  <h4>Free Trial</h4>
                </button>
                <button className={activeTab === 1 ? 'active ' : ''} onClick={() => handleTabClick(1)}>
                  <h4> Configuration </h4>
                </button>
                <button className={activeTab === 2 ? 'active' : ''} style={{ display: 'none' }} onClick={() => handleTabClick(2)}>
                  <h4> API Configuration </h4>
                </button>
                <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}>
                  <h4> Documentation </h4>
                </button>
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
                    {/* {component?.configuration} */}

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
