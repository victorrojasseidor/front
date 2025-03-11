import React, { useState, useEffect } from 'react';
import LayoutProducts from '@/Components/LayoutProducts';
import FreeTrial from '@/Components/FreeTrial';
import { useAuth } from '@/Context/DataContext';
import Link from 'next/link';
import ImageSvg from '@/helpers/ImageSVG';
import Apiconfiguration from '../Admi/Apiconfiguration';
import { formatDate } from '@/helpers/report';
import { useRouter } from 'next/navigation';

export default function LayoutConfig({ id, iIdProdEnv, defaultTab, children, idEmpresa }) {
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab || 0);
  const { session, setModalToken, l, logout, idCountry, getProducts, setModalDenied, modalDenied } = useAuth();
  const t = l.Products;
  const router = useRouter();

  useEffect(() => {
    getDataProduct();
  }, [id, idEmpresa, session, t]);

  const handleTabClick = (index) => {
    if (index === 0) {
      if (product.iCodeStatus === 27 || product.iCodeStatus === 31) {
        setActiveTab(index);
      }
    } else if (index === 1) {
      // Lógica para el tab 1
      // Si iCodeStatus es 28 o 23, se activa el tab 1
      if (session?.sPerfilCode === 'ADMIN' || product.iCodeStatus === 28 || product.iCodeStatus === 23) {
        setActiveTab(index);
      }
    } else if (index === 2) {
      // Lógica para el tab 2
      // Si iCodeStatus es igual a un valor específico, se activa el tab 2
      setActiveTab(index);
    } else {
      setActiveTab(index);
    }
  };

  async function getDataProduct() {
    try {
      const token = session.sToken;
      const responseData = await getProducts(idEmpresa, token, idCountry);
      if (responseData.oAuditResponse?.iCode === 1) {
        setModalToken(false);
        const data = responseData.oResults;
        const selectedProduct = data.find((p) => p.iId === parseInt(id));
        setProduct(selectedProduct);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 403) {
        setModalDenied(true);
        setTimeout(() => {
          setModalDenied(false);
          router.push('/product');
        }, 8000);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
        // setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setModalToken(true);
        console.log('error, ', errorMessage);
      }
    } catch (error) {
      setModalToken(true);
      console.error('error', error);
    }
  }

  const NameEmpresa = (id) => {
    const filterEmpresa = session?.oEmpresa.find((p) => p.id_empresa == id);
    return filterEmpresa?.razon_social_empresa;
  };

  return (
    <LayoutProducts menu="Product">
      <div className="idProduct-header">
        <div>
          <h3>{product?.sName}</h3>
          <p>
            <ImageSvg name="ReportExpenses" />
            {NameEmpresa(idEmpresa)}
          </p>
        </div>

        <div className="status">
          <p>
            <ImageSvg name="Time" /> {l.Download['Start service:']}: {formatDate(product?.sDateInit)}
          </p>
          <p>
            <ImageSvg name="Time" /> {l.Download['End service:']}: {formatDate(product?.sDateEnd)}
          </p>

          <p className="Active">
            <ImageSvg name="Admin" />
            {l.Download.State}: {product?.sDescStatus}
          </p>
        </div>
      </div>

      {product && (
        <section className="idProduct">
          <div className="idProduct_container">
            <div className="horizontalTabs">
              <div className="tab-header">
                <Link href={`/product/product?type=freetrial&iIdProdEnv=${iIdProdEnv}&iId=${id}&idEmpresa=${idEmpresa}`}>
                  <button className={activeTab === 0 ? 'active ' : ''} onClick={() => handleTabClick(0)}>
                    <h4> {t['Free Trial']}</h4>
                  </button>
                </Link>

                <Link href={`/product/product?type=configuration&iIdProdEnv=${iIdProdEnv}&iId=${id}&pStatus=${product?.iCodeStatus}&idEmpresa=${idEmpresa}`}>
                  <button
                    style={{
                      display: session?.sPerfilCode === 'ADMIN' ? 'block' : product.iCodeStatus === 23 || product.iCodeStatus === 28 ? 'block' : 'none',
                    }}
                    className={activeTab === 1 ? 'active ' : ''}
                    onClick={() => handleTabClick(1)}
                  >
                    <h4> {t.Configuration}</h4>
                  </button>
                </Link>

                <Link
                  href={`/product/product?type=apiconfiguration&iIdProdEnv=${iIdProdEnv}&iId=${id}&pStatus=${product?.iCodeStatus}&idEmpresa=${idEmpresa}`}
                  style={{
                    display: session?.sPerfilCode === 'ADMIN' ? 'block' : 'none',
                  }}
                >
                  <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}>
                    <h4> {t['Admin confuguratión']}</h4>
                  </button>
                </Link>
              </div>
              <div className="tab-content">
                {activeTab === 0 && (
                  <div className="tabOne">
                    <FreeTrial iIdProd={iIdProdEnv} nameProduct={product?.sName} />
                  </div>
                )}
                {activeTab === 1 && <div>{children}</div>}
                {activeTab === 2 && (
                  <div
                    style={{
                      visibility: session?.sPerfilCode === 'ADMIN' ? 'visible' : 'hidden',
                    }}
                  >
                    <Apiconfiguration nameEmpresa={NameEmpresa(idEmpresa)} product={product} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </LayoutProducts>
  );
}
