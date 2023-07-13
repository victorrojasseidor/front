import React from 'react'
import { useRouter } from 'next/router';
import LayoutProducts from '@/Components/LayoutProducts';
import { useState,useEffect } from 'react';
import FreeTrial from '@/Components/FreeTrial';
import { dataProducts } from '@/helpers/products';
import BackButton from '@/Components/BackButton';



//🍎, 🍌, 🍇

export default function productId() {
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter();
  const { id } = router.query;


  useEffect(() => {
      const selectedProduct = dataProducts.find((p) => p.id === parseInt(id));
        setProduct(selectedProduct);
    }, [id]);

  console.log("🍎",product);


  if (!product) { 
    return <div>Cargando...</div>;
  }


    //tabs
    const handleTabClick = (index) => {
      setActiveTab(index)
    }



  return (
    <LayoutProducts>
      <section className='idProduct'>

      <BackButton/>
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
        
             {product.documentation}
            <div>
            
            </div>
          </div>
        )}

        {activeTab === 1 && 

      <FreeTrial/>
        
        }

        {activeTab === 2 && (
          <div className='ApiConfiCurency'>
            <h3>
       
              Notifications
            </h3>
        
                     
          </div>
        )}
         {activeTab === 3 && (
          <div >
         
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
