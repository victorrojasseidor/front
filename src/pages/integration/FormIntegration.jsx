import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Select from 'react-select';
import { useAuth } from '@/Context/DataContext';
import { fetchConTokenPost } from '@/helpers/fetch';
import { useRouter } from 'next/router';
import { validateFormAddAccount } from '@/helpers/validateForms';
import ModalForm from '@/Components/Atoms/ModalForm';

const FormIntegration = ({ onAgregar, initialVal, setIinitialEdit, setShowForm, showForm, showcomponent }) => {
  const [fileTypeOptions, setFileTypeOptions] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(initialVal?.moneda);

  const router = useRouter();

  const { session, setModalToken, l, idCountry } = useAuth();
  const t = l.Integration;

  useEffect(() => {
    if (session) {
    }
  }, [session, showForm, initialVal, l]);

  const initialValues = {
    Name: initialVal?.cuenta || '',
    Protocol: initialVal?.descripcion_cuenta || '',
    Server: initialVal?.empresa || '',
    Port: initialVal?.port || '',
    AccessMode: initialVal?.descripcion_empresa || '',
    Archive: initialVal?.ruc || '',
    User: initialVal?.user || '',
  };

  return (
    <ModalForm
      close={() => {
        setShowForm(false);
      }}
    >
      <div className="Form-listCredential integration-forms">
        <h2 className="box">{initialVal ? t['Edit record'] : t['Add Configuration Information Delivery']}</h2>

        <Formik
          initialValues={initialValues}
          //   validate={(values) => validateFormAddAccount(values, initialVal, showcomponent)}
          onSubmit={(values, { resetForm }) => {
            if (initialVal) {
              // handleEditListAccount(values);
            } else {
              onAgregar(values);
            }
            resetForm();
          }}
        >
          {({ values, isValid, setFieldValue }) => (
            <Form className="form-container formCredential">
              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 1. {t['Select the protocol and name']} </h5>
                </div>

                <div className="group">
                  <div className="input-box">
                    <Field type="text" name="Name" placeholder=" " />
                    <label htmlFor="Name">{t['Name']}</label>
                    <ErrorMessage name="Name" component="span" className="errorMessage" />
                  </div>

                  <div className="input-box">
                    <Field type="text" name="Protocol" placeholder=" " />
                    <label htmlFor="Protocol">{t['Protocol']}</label>
                    <ErrorMessage name="Protocol" component="span" className="errorMessage" />
                  </div>
                </div>
              </div>

              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 2. {t['Add access mode']} </h5>
                </div>
                <div className="group">
                  <div className="input-box">
                    <Field type="text" name="Server" placeholder=" " />
                    <label htmlFor="Server">{t['Server']}</label>
                    <ErrorMessage name="Server" component="span" className="errorMessage" />
                  </div>

                  <div className="input-box">
                    <Field type="text" name="Port" placeholder=" " />
                    <label htmlFor="Port">{t['Port(optional)']}</label>
                    <ErrorMessage name="Port" component="span" className="errorMessage" />
                  </div>

                  <div className="input-box">
                    <Field type="text" name="AccessMode" placeholder=" " />
                    <label htmlFor="AccessMode">{t['Access mode']}</label>
                    <ErrorMessage name="AccessMode" component="span" className="errorMessage" />
                  </div>

                  <div className="input-box">
                    <Field type="text" name="User" placeholder=" " />
                    <label htmlFor="User">{t['User']}</label>
                    <ErrorMessage name="User" component="span" className="errorMessage" />
                  </div>
                </div>
              </div>

              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 3. {t['Archive']} </h5>
                </div>

                <div className="input-box">
                  <Field type="text" name="Archive" placeholder=" " />
                  <label htmlFor="Archive">{t['Archive']}</label>
                  <ErrorMessage name="Archive" component="span" className="errorMessage" />
                </div>
              </div>

              <div className="submit-box">
                <button
                  type="submit"
                  className="btn_secundary small"
                  onClick={() => {
                    setShowForm(false);
                  }}
                >
                  {t.Cancel}
                </button>

                <button type="submit" className={`btn_primary small ${!isValid ? 'disabled' : ''}`} disabled={!isValid}>
                  {initialVal ? t.Update : t.Add}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ModalForm>
  );
};

export default FormIntegration;
