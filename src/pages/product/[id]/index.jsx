/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import LayoutProducts from '@/Components/LayoutProducts'
import FreeTrial from '@/Components/FreeTrial'
import BackButton from '@/Components/BackButton'
import { getProducts } from '@/helpers/auth'
import { useAuth } from '@/Context/DataContext'

export default function productId () {
  const [product, setProduct] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()
  const { id } = router.query

  const { session, empresa, setModalToken } = useAuth()

  console.log("sesión",session);

  // useEffect(() => {
  //   const selectedProduct = dataProducts.find((p) => p.id === parseInt(id))
  //   setProduct(selectedProduct)
  // }, [id])

  if (!product) {
    getDataProduct()
    return <div>Cargando...</div>
  }

  // tabs
  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  async function getDataProduct () {
    try {
      const token = session.sToken
      const idEmpresa = empresa.id_empresa
      const responseData = await getProducts(idEmpresa, token)

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults
        setModalToken(false)
        setProduct(data)
       
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        setModalToken(true)
        console.log('errok, ', errorMessage)
       
        // setStatus(errorMessage);
      }
    } catch (error) {
      setModalToken(true)
      console.error('error', error)
   
      // setStatus("Service error");
    }
  }

  return (
    <LayoutProducts>
      <section className='idProduct'>

        <BackButton />
        <h2> {product.name} </h2>
        <div className='idProduct_container'>

          <div className='tabs-container'>

            <div className='tab-header'>
              <button className={activeTab === 0 ? 'active complete' : ''} onClick={() => handleTabClick(0)}>

                <h4> Documentatión</h4>
              </button>
              <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}>

                <h4>Free Trial</h4>
              </button>
              <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)} style={{ display: 'none' }}>

                <h4> API Configuration </h4>
              </button>

              <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}>

                <h4> Configuration </h4>
              </button>

            </div>

            <div className='tab-content'>
              {activeTab === 0 && (
                <div className='tabOne'>

                  {product.documentation}
                  <div />
                </div>
              )}

              {activeTab === 1 &&

                <FreeTrial iIdProd={id} />}

              {activeTab === 2 && (
                <div className='ApiConfiCurency'>
                  <h3>

                    Notifications
                  </h3>

                </div>
              )}
              {activeTab === 3 && (
                <div>

                  {product.configuration}

                </div>
              )}
            </div>

          </div>

        </div>

      </section>

    </LayoutProducts>

  )
}
