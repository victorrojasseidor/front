import React, { useState } from 'react';
import imgfree from '../../../public/img/contactanos.webp';
import Image from 'next/image';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { useAuth } from '@/Context/DataContext';
import { fetchConTokenPost } from '@/helpers/fetch';
import Loading from '@/Components/Atoms/Loading';
import LayoutProducts from '@/Components/LayoutProducts';
import ImageSvg from '@/helpers/ImageSVG';
import Modal from '@/Components/Modal';

function Support() {
  const [error, SetError] = useState(null);
  const [confirm, SetConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { session, empresa, setModalToken, logout, l } = useAuth();

  const t = l.Support;

  async function handleSubmit(values, { setSubmitting, resetForm }) {
    const body = {
      oResults: {
        sEmailOrigen: values.corporateEmail,
        sTitulo: values.title,
        sTelefono: values.phoneNumber ? values.phoneNumber : '999999999',
        sMensaje: values.message,
      },
    };

    try {
      const token = session?.sToken;

      setIsLoading(true);
      const responseData = await fetchConTokenPost('BPasS/?Accion=EnvioCorreoSoporteSmtp', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        SetError(null);
        setModalToken(false);
        SetConfirm(true);
        setSubmitting(true);
        setTimeout(() => {
          SetConfirm(false);
          resetForm();
        }, 3000);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        console.log('error, ', errorMessage);
        setSubmitting(false);
        SetConfirm(false);
        SetError(errorMessage);
        setTimeout(() => {
          SetError(null);
        }, 1000);
      }
    } catch (error) {
      console.error('error', error);
      SetConfirm(false);
      SetError(error);
      setTimeout(() => {
        SetError(null);
      }, 1000);
      setSubmitting(false);
    } finally {
      setIsLoading(false); // Ocultar el indicador de carga después de que la petición se complete
    }
  }

  return (
    <LayoutProducts menu="Support">
      {isLoading && <Loading />}
      <div className="freetrial">
        <div className="freetrial_description">
          <h2> {t['Contact us']} </h2>

          <div>
            {/* <h4> Your satisfaction is our top priority!</h4> */}
            <p>{t['If you have any questions, comments or requests,']}</p>
            <p>
              {' '}
              {t['please do not']} <span> {t['hesitate to contact us']} </span>
              {t['through the form at our technical support']}
            </p>
          </div>

          <Image src={imgfree} width={800} alt="imgfreetrial" />
          <div className="message-support">
            {t['Your satisfaction']}

            <p>
              {t['is our top']}
              <span> {t.priority} </span>!
            </p>
          </div>
        </div>
        <div className="freetrial_contact">
          <Formik
            initialValues={{
              corporateEmail: session.sCorreo,
              title: '',
              phoneNumber: session.sPhoneNumber ? session.sPhoneNumber : '',
              message: '',
            }}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="form-container">
                <div className="input-box">
                  <Field type="email" name="corporateEmail" placeholder="" readOnly />
                  <label htmlFor="corporateEmail"> {t['Company email']}</label>
                  <ErrorMessage className="errorMessage" name="corporateEmail" component="div" />
                </div>

                <div className="input-box">
                  <Field type="text" name="title" placeholder="" />
                  <label htmlFor="title"> {t.Title} </label>
                  <ErrorMessage className="errorMessage" name="title" component="div" />
                </div>

                <div className="input-box">
                  <Field type="tel" id="phoneNumber" name="phoneNumber" placeholder="" />
                  <label htmlFor="phoneNumber">{t['Phone Number']}</label>
                  <ErrorMessage className="errorMessage" name="phoneNumber" component="div" />
                </div>

                <div className="input-box">
                  <Field
                    as="textarea" // Usa "textarea" como tipo de campo
                    id="message"
                    name="message" // Asegúrate de que el atributo "name" coincida con initialValues
                    placeholder=""
                    rows={4}
                    cols={40}
                    style={{ height: 'auto', minHeight: '4rem' }}
                  />

                  <label htmlFor="message"> {t.Message}</label>
                  <ErrorMessage className="errorMessage" name="message" component="div" />
                </div>

                <div className="containerButton">
                  <button className={`btn_primary ${values.message && values.title ? '' : 'disabled'}`} type="submit" disabled={!values.message || !values.title}>
                    {t.Send}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {error && <p className="errorMessage">{error} </p>}

          {confirm && (
            <Modal
              close={() => {
                SetConfirm(false);
              }}
            >
              <ImageSvg name="Check" />

              <h2>{t['Your request was sent successfully']}</h2>

              <p> {t['We will contact you soon']} </p>
            </Modal>
          )}
        </div>
      </div>
    </LayoutProducts>
  );
}

export default Support;
