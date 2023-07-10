import React from 'react'
import { useRouter } from 'next/router';
import LayoutProducts from '@/Components/LayoutProducts';
import { useState,useEffect } from 'react';
import FreeTrial from '@/Components/FreeTrial';
import { dataProducts } from '@/helpers/products';
import BackButton from '@/Components/BackButton';


//🍎, 🍌, 🍇

export default function productId() {
    
  const router = useRouter();
  const { productId } = router.query;
  // console.log("🍎",productId);

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(0)


  // useEffect(() => {
  //   const selectedProduct = dataProducts.find((p) => p.id === parseInt(productId));
  //   setProduct(selectedProduct);
  // }, [productId]);



  // if (!product) {
  //   return <div>Cargando...</div>;
  // }



    //tabs
    const handleTabClick = (index) => {
      setActiveTab(index)
    }


  return (
    <LayoutProducts>
      <section className='idProduct'>

      <BackButton/>
     <h2> Currency Exchange rates automation </h2> 
      <div className='idProduct_container'>
    
      <div className='tabs-container'>

      <div className='tab-header'>
        <button className={activeTab === 0 ? 'active complete' : ''} onClick={() => handleTabClick(0)}>
         
          <h4> Documentatión</h4>
        </button>
        <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}>
         
          <h4>Free Trial</h4>
        </button>
        <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}>
       
          <h4> API Configuration </h4>
        </button>

        <button className={activeTab === 3? 'active' : ''} onClick={() => handleTabClick(3)}>
       
       <h4> Configuration </h4>
     </button>

      </div>

      <div className='tab-content'>
        {activeTab === 0 && (
          <div className='tabOne'>
            <h3>
       
              Personal informations
            </h3>

            <div>
            
            </div>
          </div>
        )}

        {activeTab === 1 && 

      <FreeTrial/>
        
        }

        {activeTab === 2 && (
          <div className='notificatión'>
            <h3>
       
              Notifications
            </h3>
        
                     
          </div>
        )}
         {activeTab === 3 && (
          <div className='notificatión'>
            <h3>
       
              tab 4
            </h3>
        
           
           
          </div>
        )}
      </div>

    </div>

    </div>
      </section>
 

    </LayoutProducts>
    
 
  )
}
