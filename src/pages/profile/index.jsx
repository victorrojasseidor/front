/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import LayoutProducts from '@/Components/LayoutProducts';
import { useAuth } from '@/Context/DataContext';
import NavigationPages from '@/Components/NavigationPages';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { countryOptions } from '@/helpers/contry';
import { validateFormprofilestart } from '@/helpers/validateForms';
import { fetchConTokenPost, fetchNoTokenPost, decodeText } from '@/helpers/fetch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Link from 'next/link';
import Button from '@mui/material/Button';
import ImageSvg from '@/helpers/ImageSVG';
import Loading from '@/Components/Atoms/Loading';
import { IconArrow } from '@/helpers/report';

export default function Profile() {
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [country, setCountrySelect] = useState('');
  const [requestError, setRequestError] = useState('');

  // Nuevo estado para la empresa seleccionada
  const [selectedCompanies, setSelectedCompanies] = useState();

  const { session, setSession, setModalToken, logout, l, refresToken } = useAuth();

  const t = l.profile;
  const router = useRouter();

  const handleCountryChange = (event) => {
    const valueSelect = event.target.value;
    setCountrySelect(valueSelect);
  };

  useEffect(() => {
    setSelectedCompanies(session?.oEmpresa);
  }, []);

  // enviar formulario
  async function handleSumbit(values, { setSubmitting, setStatus }) {
    const transfOempresa = selectedCompanies.map((company) => {
      return {
        iIdEmpresa: company.id_empresa,
        sRucEmpresa: company.ruc_empresa,
      };
    });

    setIsLoading(true);

    const body = {
      oResults: {
        sEmail: session.sCorreo,
        sUserName: values.name,
        sLastName: values.lastName,
        sCodePhone: values.countryCode.value,
        sPhone: Number(values.phoneNumber),
        bCodeNotEmail: values.emailNotifications,
        bCodeNotBpas: values.notificationsInBpass,
        oEmpresa: transfOempresa,
      },
    };

    const tok = session?.sToken;

    try {
      const responseData = await fetchConTokenPost('General/?Accion=ActualizarDatosUsuario', body, tok);
      if (responseData.oAuditResponse.iCode == 30 || responseData.oAuditResponse.iCode == 1) {
        const secretPasw = await decodeText(responseData.oResults.password);
        login(body.oResults.sEmail, secretPasw.oResults);
        setStatus(null);
        setModalToken(false);
        setEdit(false);
        setSession();
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else {
        const message = responseData?.oAuditResponse.sMessage;
        setStatus(message);
        setSubmitting(false);
        setModalToken(false);
      }
    } catch (error) {
      console.error('Error:', error);

      throw new Error('Hubo un error en la operación asincrónica.');
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email, password) {
    const dataRegister = {
      oResults: {
        sEmail: email,
        sPassword: password,
      },
    };
    try {
      const responseData = await fetchNoTokenPost('BPasS/?Accion=ConsultaUsuario', dataRegister && dataRegister);
      if (responseData.oAuditResponse?.iCode === 1) {
        const userData = responseData.oResults;
        router.push('/profile');
        setSession(userData);
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);
      }
    } catch (error) {
      console.error('error', error);
      setRequestError('Service error');
    }
  }

  function eliminarDuplicadosPorPropiedad(array, propiedad) {
    const setUnicos = new Set();
    const arrayResultado = array?.filter((elemento) => {
      const valorPropiedad = elemento[propiedad];
      if (!setUnicos.has(valorPropiedad)) {
        setUnicos.add(valorPropiedad);
        return true;
      }
      return false;
    });
    return arrayResultado;
  }

  const empresasofcompaniTotal = eliminarDuplicadosPorPropiedad(session?.oEmpresaTotal, 'id_empresa');

  function validarExistenciaEmpresa(option, selectCompany) {
    return selectCompany.some((company) => option.id_empresa === company.id_empresa && option.ruc_empresa === company.ruc_empresa);
  }

  return (
    <LayoutProducts menu="Profile">
      <NavigationPages title={t.Profile}>
        <Link href="/product">{t.Home}</Link>
      </NavigationPages>

      <div className="profile">
        {isLoading && <Loading />}

        <div className="profile-perfil">
          <div>
            {edit ? (
              <div className="edit-profile style-container">
                <h2> {t['Edit profile']} </h2>

                <Formik
                  initialValues={{
                    name: session?.sUserName,
                    lastName: session?.sLastName,
                    countryCode: countryOptions[0], // Valor inicial de Perú
                    phoneNumber: session?.sPhone,
                    notificationsInBpass: session?.bCodeNotBpas,
                    emailNotifications: session?.bCodeNotEmail,
                    companies: [],
                  }}
                  onSubmit={(values, { setSubmitting, setStatus }) => {
                    setFormValues(values);
                    handleSumbit(values, { setSubmitting, setStatus });
                  }}
                  enableReinitialize
                >
                  {({ isSubmitting, status, values, setFieldValue, resetForm }) => (
                    <Form className="form-container">
                      <div className="form-container_editProfile">
                        <div>
                          <h3> {t['Personal information']}</h3>
                          <div className="box-forms">
                            <div className="input-box">
                              <Field type="text" name="name" placeholder=" " readOnly />
                              <label htmlFor="name">{t.Username}</label>
                            </div>

                            <div className="input-box">
                              <Field type="text" name="lastName" placeholder=" " />
                              <label htmlFor="lastName">{t['Last Name']}</label>
                              <ErrorMessage className="errorMessage" name="lastName" component="div" />
                            </div>

                            <div className="box-phone">
                              <div className="box-filter">
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                  <InputLabel id="company-label">{t.Code}</InputLabel>
                                  <Select labelId="company-label" value={country || countryOptions[0]?.value} onChange={handleCountryChange} className="delimite-text" IconComponent={IconArrow}>
                                    {countryOptions?.map((comp) => (
                                      <MenuItem key={comp.value} value={comp.value}>
                                        <div> {comp.label}</div>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>

                              <div className="input-box">
                                <Field type="text" id="phoneNumber" name="phoneNumber" placeholder=" " />
                                <label htmlFor="phoneNumber">{t['Phone Number']}</label>
                                <ErrorMessage className="errorMessage" name="phoneNumber" component="div" />
                              </div>
                            </div>

                            <div className="input-box">
                              <Field type="email" name="corporateEmail" placeholder=" " value={session?.sCorreo || ''} readOnly />
                              <label htmlFor="corporateEmail">{t['Company email']}</label>
                            </div>
                          </div>
                        </div>

                        <div className="companies-container">
                          <h3> {t['Company profile']} </h3>

                          <div>
                            <div>
                              <p>
                                {t.Corporation}: <span>{session?.jCompany.razon_social_company}</span>
                              </p>
                            </div>

                            <div>
                              <p>{t['Select the Profile to company']}:</p>
                            </div>

                            <div className="companies">
                              {empresasofcompaniTotal?.map((option) => (
                                <div className={`box-companies ${validarExistenciaEmpresa(option, selectedCompanies) ? 'selected' : ''}`} key={option.id_empresa}>
                                  <div className="card">
                                    <span className="initial">{option.razon_social_empresa.match(/\b\w/g).join('').slice(0, 2)}</span>
                                  </div>
                                  <label htmlFor={`companies[${option.id_empresa}]`}>{option.razon_social_empresa}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="notification-container">
                          <h3>{t.Notifications}</h3>
                          <p>{t['Select how you want to be notified']}</p>
                          <ul>
                            <div className="box-notification">
                              <Field type="checkbox" className="checkboxId" name="notificationsInBpass" />
                              <label htmlFor="notificationsInBpass">{t['Notifications in ARI']}</label>
                            </div>

                            <div className="box-notification">
                              <Field type="checkbox" className="checkboxId" name="emailNotifications" />
                              <label htmlFor="emailNotifications">{t['Email notifications']}</label>
                            </div>
                          </ul>
                        </div>

                        <div className="box-buttons">
                          <button
                            type="submit"
                            className="btn_secundary small"
                            onClick={() => {
                              resetForm(); // Reset the form to its initial values
                              setEdit(false);
                            }}
                          >
                            {t.Cancel}
                          </button>

                          <button type="submit" className="btn_primary small" disabled={isSubmitting}>
                            {t.Update}
                          </button>
                        </div>
                      </div>

                      <div className="contentError">
                        <div className="errorMessage">{status || requestError}</div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            ) : (
              <div className="data-profile">
                <div className="info-personal style-container">
                  <div className="box-name">
                    <div className="box-img">
                      <span className="img">
                        {' '}
                        <ImageSvg name="Person" />
                      </span>

                      <h3>
                        {' '}
                        {session?.sUserName} {session?.sLastName}{' '}
                      </h3>
                      <p>{session?.sPerfilCode}</p>
                    </div>

                    <ul className="list-personal">
                      <li>
                        <h2> 1</h2>
                        <p>{t.Corporation} </p>
                      </li>

                      <li>
                        <h2> {session?.oEmpresa.length}</h2>
                        <p>{t.Companies} </p>
                      </li>
                    </ul>
                  </div>

                  <div className="info-companies style-container">
                    <h3> {t['Company profile']}</h3>

                    <ul className="info-container">
                      <li className="card-perfil">
                        <span>{t.Corporation}</span>
                        <p> {session?.jCompany.razon_social_company || 'Admin'}</p>
                      </li>

                      <li className="card-perfil">
                        <span>{t.Estatus}</span>
                        <p> {session?.sDescription}</p>
                      </li>
                    </ul>

                    <ul>
                      <li className="card-perfil companies">
                        <span>{t.Companies}</span>

                        <div className="">
                          {session?.oEmpresa.map((em, index) => (
                            <p key={em.id_empresa}>{em.razon_social_empresa}</p>
                          ))}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="box-companies">
                  <div className="box-information style-container">
                    <div className="profile-action">
                      <h3> {t['Personal information']}</h3>
                      <button className="btn_primary small" onClick={() => setEdit(!edit)}>
                        {t['Edit profile']}
                      </button>
                    </div>
                    <ul className="list-information">
                      <li className="card-perfil">
                        <span>{t.Username}</span>
                        <p> {session?.sUserName}</p>
                      </li>

                      <li className="card-perfil">
                        <span>{t['Last Name']}</span>
                        <p> {session?.sLastName}</p>
                      </li>

                      <li className="card-perfil">
                        <span>{t['Phone Number']}</span>
                        <p> {session?.sPhone}</p>
                      </li>
                    </ul>
                  </div>

                  <div className="info-notifi style-container">
                    <h3> {t.Notifications}</h3>

                    <ul>
                      {session?.bCodeNotBpas && <li>{t['Notifications in ARI']}</li>}
                      {session?.bCodeNotEmail && <li>{t['Email notifications']}</li>}
                    </ul>
                  </div>

                  <div className="data-profile style-container">
                    <div className="profile-action">
                      <h3> {t['About the account']} </h3>

                      <button className="btn_primary small" onClick={() => router.push('/profile/changepassword')}>
                        {t['Update password']}
                      </button>
                    </div>
                    <ul className="list-information">
                      <li className="card-perfil">
                        <span>{t['Company email']}</span>
                        <p> {session?.sCorreo}</p>
                      </li>

                      <li className="card-perfil">
                        <span>{t.Password}</span>
                        <p> ************</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="profile-perfil" />
      </div>
    </LayoutProducts>
  );
}
