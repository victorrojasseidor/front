import { useAuth } from '@/Context/DataContext';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState, useEffect } from 'react';
import ImageSvg from '@/helpers/ImageSVG';
import { formatDate } from '@/helpers/report';
import LoadingComponent from '../Atoms/LoadingComponent';
import { fetchConTokenPost } from '@/helpers/fetch';
import { validateCaptcha } from '@/helpers/validateForms';

export default function CaptchaConfig() {
  const { session, setModalToken, logout, l, idCountry } = useAuth();
  const t = l.Captcha;
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState(null);
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();
  // const iIdProdEnv = router.query.iIdProdEnv
  // const iId = router.query.iId
  const idEmpresa = router.query.idEmpresa;

  useEffect(() => {
    GetCaptcha();
  }, [updateData]);

  async function GetCaptcha() {
    setIsLoading(true);

    const body = {
      oResults: {
        iIdEmpresa: Number(idEmpresa),
        iIdPais: idCountry,
      },
    };

    try {
      const token = session?.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetCaptcha', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        setData(responseData.oResults[0]);
        setModalToken(false);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);

        setTimeout(() => {
          setRequestError(null);
        }, 5000);
      }
    } catch (error) {
      console.error('error', error);
      setRequestError(error.message);
      setTimeout(() => {
        setRequestError(null);
      }, 3000);
    } finally {
      setIsLoading(false); // Ocultar señal de carga
    }
  }

  async function ActualizarServicioCaptcha(values, { resetForm }) {
    setIsLoading(true);

    const body = {
      oResults: {
        iIdEmpresa: Number(idEmpresa),
        sClaveApi: values?.api,
        sUser: values?.user,
        sPassword: values?.password,
        iConexion: values?.connection,
        sRpaDesc: values?.descripcion,
      },
    };

    try {
      const token = session?.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=ActualizarServicioCaptcha', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        setUpdateData(!updateData);
        setModalToken(false);
        setTimeout(() => {
          resetForm();
        }, 10000);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);
        setTimeout(() => {
          setRequestError(null);
          // setSubmitting(false)

          resetForm();
        }, 8000);
      }
    } catch (error) {
      console.error('error', error);
      setRequestError(error.message);
      setTimeout(() => {
        setRequestError(null);
      }, 3000);
    } finally {
      setIsLoading(false); // Ocultar señal de carga
    }
  }

  return (
    <div className="admin-captcha">
      <div className="">
        <h3 className="sub"> {t['Captcha solver settings']} </h3>
        <p className="description"> {t['Configure the captcha solver']} </p>
        {isLoading && <LoadingComponent />}

        {requestError && <div className="requestError"> {requestError}</div>}

        <div className="reporting-box ">
          <div className="report-content">
            <div className="report blue">
              <div className="report_icon  ">
                <ImageSvg name="Bank" />
              </div>

              <div className="report_data">
                <article>{t['Available balance']}</article>
                <h4> {data?.saldo_disponible} $ </h4>

                <p>
                  {' '}
                  {t['Update date']}: <span>{formatDate(data?.fecha)}</span>{' '}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <Formik
            initialValues={{
              api: data?.api_key_2captcha || '',
              user: data?.usuario || '',
              password: null,
              // balance: data?.saldo_disponible || '',
              connection: data?.conexiones_maximas || '',
              descripcion: data?.rpa_conectados || '',
            }}
            validateOnChange
            validate={validateCaptcha}
            onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
              // same shape as initial values
              ActualizarServicioCaptcha(values, {
                setSubmitting,
                setStatus,
                resetForm,
              });
            }}
            enableReinitialize
          >
            {({ isValid, isSubmitting, status, resetForm, values }) => (
              <Form className="form-container ">
                <div className="group">
                  <div className="input-box">
                    <Field type="text" id="api" name="api" placeholder=" " autoComplete="off" disabled={isSubmitting} />
                    <label htmlFor="api">{t['API key']}</label>
                    <ErrorMessage className="errorMessage" name="api" component="span" />
                  </div>

                  <div className="input-box">
                    <Field type="text" name="user" id="user" placeholder=" " disabled={isSubmitting} />
                    <label htmlFor="user">{t.User}</label>
                    <ErrorMessage className="errorMessage" name="user" component="span" />
                  </div>

                  <div className="input-box">
                    <span className="iconPassword" onClick={togglePasswordVisibility}>
                      <ImageSvg name={showPassword ? 'ShowPassword' : 'ClosePassword'} />
                    </span>
                    <Field type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder=" " disabled={isSubmitting} />
                    <label htmlFor="password">{t['Update password']}</label>
                    <ErrorMessage className="errorMessage" name="password" component="span" />
                  </div>

                  <div className="input-box">
                    <Field type="number" name="connection" id="connection" placeholder=" " />
                    <label htmlFor="connection">{t['Maximum connections']}</label>
                    <ErrorMessage className="errorMessage" name="connection" component="span" />
                  </div>
                </div>

                <div className="input-box">
                  <Field type="text" name="descripcion" id="descripcion" placeholder=" " />
                  <label htmlFor="descripcion">
                    {t['Connected RPA - description']} ({t.optional}){' '}
                  </label>

                  <ErrorMessage className="errorMessage" name="descripcion" component="span" />
                </div>

                {data?.usuario == values.user && data?.api_key_2captcha == values.api && !values.password && data?.conexiones_maximas == values.connection && data?.rpa_conectados == values.descripcion ? (
                  <p> </p>
                ) : (
                  <div className="box-buttons">
                    <button type="button" className={isValid ? 'btn_secundary' : 'btn_secundary disabled'} onClick={() => resetForm(false)}>
                      {t.Cancel}
                    </button>

                    <button type="submit" className={isValid ? 'btn_primary' : 'btn_primary disabled'}>
                      {isSubmitting ? `${t.Update}${'....'}` : t.Update}
                    </button>
                  </div>
                )}

                <div className="contentError">
                  <div className="errorMessage">{status}</div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
