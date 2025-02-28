import React, { useState, useRef, useEffect } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/Context/DataContext';
import { fetchNoTokenPost } from '@/helpers/fetch';
import ImageSvg from '@/helpers/ImageSVG';
import Modal from '@/Components/Modal';
import { countryOptionContact } from '@/helpers/contry';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ButtonGradient from './Atoms/ButtonGradient';
import LoadingComponent from './Atoms/LoadingComponent';

function Contact() {
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [codePhone, setCodePhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { l } = useAuth();

  const t = l.Support;

  const validationSchema = Yup.object({
    name: Yup.string().required(l.validation['Name is required']),
    lastName: Yup.string().required(l.validation['Last Name is required']),
    email: Yup.string().email(l.validation['Invalid email']).required(t['Email is required']),
    company: Yup.string().required(l.validation['Company is required']),
    phone: Yup.string().matches(/^[+\d\s()-]+$/, l.validation['Invalid phone number']),
    country: Yup.string().required(l.validation['Country is required']),
    message: Yup.string().required(l.validation['Message is required']),
  });

  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Restablece la altura para evitar crecimiento infinito
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura al contenido
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Resetear altura inicial
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Ajustar altura
    }
  }, []);

  async function handleSubmit(values, { setSubmitting, resetForm, setFieldValue }) {
    const body = {
      oResults: {
        sMensaje: values.message,
        sNombre: values.name,
        sApellido: values.lastName,
        sEmail: values.email,
        sEmpresa: values.company,
        sPais: values.country,
        sTelefono: values.phone,
        oEmail: ['luis.delaflor@seidor.com', 'menagen.murriagui@seidor.com', 'natalia.espinoza@seidor.com'],
      },
    };

    try {
      setIsLoading(true);
      const responseData = await fetchNoTokenPost('BPasS/?Accion=ContactanosSmtp', body);
      console.log(body, responseData)
      if (responseData.oAuditResponse?.iCode === 1) {
        setError(null);
        setConfirm(true);
        setTimeout(() => {
          setConfirm(false);
          resetForm();
          setFieldValue('message', ''); // Borra manualmente el mensaje
        }, 5000);
        // } else if (responseData.oAuditResponse?.iCode === 27) {
        //   setModalToken(true);
        // } else if (responseData.oAuditResponse?.iCode === 4) {
        //   await logout();
      } else {
        const errorMessage = responseData.oAuditResponse?.sMessage || 'Error in sending the form';
        setSubmitting(false);
        setConfirm(false);
        setError(errorMessage);
        setTimeout(() => {
          setError(null);
        }, 10000);
      }
    } catch (error) {
      setConfirm(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 1000);
      setSubmitting(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-contact">
      <h2>{t['Contact Us']}</h2>

      <Formik
        initialValues={{
          name: '',
          lastName: '',
          email: '',
          company: '',
          phone: `${codePhone.value ? codePhone.value : ' '}`,
          country: countryOptionContact[17].value, // País por defecto
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="form-container">
            <div className="group">
              <div className="input-box">
                <Field type="text" name="name" placeholder="" />
                <label htmlFor="name">{t['Name']}</label>
                <ErrorMessage className="errorMessage" name="name" component="div" />
              </div>
              <div className="input-box">
                <Field type="text" name="lastName" placeholder="" />
                <label htmlFor="lastName">{t['Last Name']}</label>
                <ErrorMessage className="errorMessage" name="lastName" component="div" />
              </div>
            </div>
            <div className="group">
              <div className="input-box">
                <Field type="email" name="email" placeholder="" />
                <label htmlFor="email">{t['Email']}</label>
                <ErrorMessage className="errorMessage" name="email" component="div" />
              </div>
              <div className="input-box">
                <Field type="text" name="company" placeholder="" />
                <label htmlFor="company">{t['Company']}</label>
                <ErrorMessage className="errorMessage" name="company" component="div" />
              </div>
            </div>
            <div className="group box-phone">
              <div className="box-filter">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="country-label">{t['Country']}</InputLabel>
                  <Select
                    labelId="country-label"
                    value={values.country}
                    onChange={(event) => {
                      const selected = countryOptionContact.find((c) => c.value === event.target.value);
                      setFieldValue('country', selected.value);
                      setFieldValue('phone', selected.value);
                      setCodePhone(selected);
                    }}
                    className="delimite-text"
                  >
                    {countryOptionContact.map((comp) => (
                      <MenuItem key={comp.value} value={comp.value}>
                        {comp.country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="input-box">
                <Field type="text" name="phone" placeholder="" />
                <label htmlFor="phone">{t['Phone']}</label>
                <ErrorMessage className="errorMessage" name="phone" component="div" />
              </div>
            </div>

            <div className="input-box">
              <Field
                as="textarea"
                name="message"
                placeholder=""
                rows={2}
                cols={40}
                innerRef={textareaRef}
                style={{
                  minHeight: '3rem',
                  overflowY: 'hidden',
                  resize: 'none',
                  wordWrap: 'break-word', // Rompe palabras largas para que no desborden
                  whiteSpace: 'pre-wrap', // Mantiene los saltos de línea y ajusta el contenido
                }}
                onInput={handleInput}
              />
              <label htmlFor="message">{t.Message}</label>
              <ErrorMessage className="errorMessage" name="message" component="div" />
            </div>

            <div className="contact-conditions">
              <p>{t['By submitting the form, you authorize SEIDOR Innovativa Peru SAC to use your data to respond to inquiries.']}</p>
            </div>

            <div className= {`container-send  ${values.message && values.name ? '' : 'disabled-gd'}`}>
              <ButtonGradient classButt="whiteButton" type="submit" disabled={!values.message || !values.name || !values.email}>
                {t['Send']}
              </ButtonGradient>
            </div>
          </Form>
        )}
      </Formik>
      {error && <p className="errorMessage">{error}</p>}
      {isLoading && <LoadingComponent />}
      {confirm && (
        <Modal close={() => setConfirm(false)}>
          <div className="message">
            <ImageSvg name="Check" />

            <h2>{t['Your request was sent successfully']}</h2>
            <p style={{ textAlign: 'center' }}>{t['We will contact you soon']}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Contact;
