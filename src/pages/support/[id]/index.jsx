import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { useAuth } from '@/Context/DataContext';
import { fetchConTokenPost } from '@/helpers/fetch';
import Loading from '@/Components/Atoms/Loading';
import LayoutProducts from '@/Components/LayoutProducts';
import ImageSvg from '@/helpers/ImageSVG';
import Modal from '@/Components/Modal';
import Contract from '../Contract';
import { useRouter } from 'next/router';

function Support() {
  const [error, SetError] = useState(null);
  const [confirm, SetConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { session, empresa, setModalToken, logout, l } = useAuth();
  const [tabData, setTabData] = useState(null);

  const router = useRouter();
  const { id } = router.query;
  const t = l.Support;

  // async function handleSubmit(values, { setSubmitting, resetForm }) {
  //   const body = {
  //     oResults: {
  //       sEmailOrigen: values.corporateEmail,
  //       sTitulo: values.title,
  //       sTelefono: values.phoneNumber ? values.phoneNumber : '999999999',
  //       sMensaje: values.message,
  //     },
  //   };

  //   try {
  //     const token = session?.sToken;

  //     setIsLoading(true);
  //     const responseData = await fetchConTokenPost('BPasS/?Accion=EnvioCorreoSoporteSmtp', body, token);
  //     if (responseData.oAuditResponse?.iCode === 1) {
  //       SetError(null);
  //       setModalToken(false);
  //       SetConfirm(true);
  //       setSubmitting(true);
  //       setTimeout(() => {
  //         SetConfirm(false);
  //         resetForm();
  //       }, 3000);
  //     } else if (responseData.oAuditResponse?.iCode === 27) {
  //       setModalToken(true);
  //     } else if (responseData.oAuditResponse?.iCode === 4) {
  //       await logout();
  //     } else {
  //       const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
  //       console.log('error, ', errorMessage);
  //       setSubmitting(false);
  //       SetConfirm(false);
  //       SetError(errorMessage);
  //       setTimeout(() => {
  //         SetError(null);
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     console.error('error', error);
  //     SetConfirm(false);
  //     SetError(error);
  //     setTimeout(() => {
  //       SetError(null);
  //     }, 1000);
  //     setSubmitting(false);
  //   } finally {
  //     setIsLoading(false); // Ocultar el indicador de carga después de que la petición se complete
  //   }
  // }

  const handleTabClick = (index, data) => {
    router.push(data.path); // Usar la ruta de la pestaña en lugar del índice
  };

  useEffect(() => {
    const activeTabFromId = tabs.filter((tab) => tab.idTab == id);
    if (activeTabFromId.length > 0) {
      setTabData(activeTabFromId[0]);
    }
  }, [id, router]);

  const tabs = [
    {
      idTab: 1,
      title: t.Contracts,
      path: '/support/1',
      component: <Contract />,
      type: l.header['Finance and accounting'],
    },
    // {
    //   idTab: 2,
    //   title: t.Movement,
    //   path: '/reporting/finance/2',
    //   component: <Movement />,
    //   type: l.header['Finance and accounting'],
    // },
  ];

  return (
    <LayoutProducts menu="Support">
      {isLoading && <Loading />}

      <section className="layoutReporting">
        <div className="horizontalTabs">
          <div className="tab-header">
            {tabs.map((tab, index) => (
              <button key={index} className={tabData?.idTab === tab.idTab ? 'active' : ''} onClick={() => handleTabClick(index, tab)}>
                <h4>{tab.title}</h4>
              </button>
            ))}
          </div>
          <div className="tab-content">{tabData?.component}</div>
        </div>
      </section>
    </LayoutProducts>
  );
}

export default Support;
