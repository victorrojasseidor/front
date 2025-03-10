import React, { useState } from 'react';
import Image from 'next/image';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { useAuth } from '@/Context/DataContext';
import { fetchConTokenPost } from '@/helpers/fetch';
import Loading from '@/Components/Atoms/Loading';
import LayoutProducts from '@/Components/LayoutProducts';
import ImageSvg from '@/helpers/ImageSVG';
import Link from 'next/link';
import Modal from '@/Components/Modal';
import FormIntegration from './FormIntegration';

function Integration() {
  const [error, SetError] = useState(null);
  const [confirm, SetConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialEdit, setIinitialEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { session, empresa, setModalToken, logout, l } = useAuth();

  const t = l.Integration;

  async function handleAgregar(values, { setSubmitting, resetForm }) {
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
        console.log('errok, ', errorMessage);
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
    <LayoutProducts menu="Integration">
      {isLoading && <Loading />}

      <div className="integration">
        <div className="integration-table ">
          <div className="contaniner-tables">
            <h3> {t['Delivery of information']} </h3>

            <p>{t['Configure how you want to receive information from your digital employees reports']}</p>

            <button className="btn_black" style={{ display: initialEdit !== null ? 'none' : 'block' }} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'close' : t.Add}
            </button>

            <div className="boards">
              <div className="tableContainer ">
                <table className="dataTable ">
                  <thead>
                    <tr>
                      <th>{t['Integration']}</th>
                      <th>{t['Actions']}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>servicenjksakndksnkddnn yuegsugdueueue uusueueu</td>
                      <td className="box-actions">
                        <button className="btn_crud">
                          <ImageSvg name="Edit" />
                        </button>
                        <button className="btn_crud">
                          <ImageSvg name="Delete" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <FormIntegration
            onAgregar={handleAgregar}
            // dataUser={data}
            // initialVal={isEditing ? initialEdit : null}
            // setIinitialEdit={setIinitialEdit}
            setShowForm={setShowForm}
            showForm={showForm}
          />
        )}
      </div>
    </LayoutProducts>
  );
}

export default Integration;
