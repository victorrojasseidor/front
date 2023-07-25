import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Select from 'react-select';

const countryData = [
  {
    label: 'Perú',
    value: 'Perú',
    banks: [
      { value: 'bank1', label: 'Banco 1' },
      { value: 'bank2', label: 'Banco 2' },
      { value: 'bank3', label: 'Banco 3' },
    ],
  },
  {
    label: 'Argentina',
    value: 'Argentina',
    banks: [
      { value: 'bank4', label: 'Banco 4' },
      { value: 'bank5', label: 'Banco 5' },
      { value: 'bank6', label: 'Banco 6' },
    ],
  },
  {
    label: 'Brazil',
    value: 'Brazil',
    banks: [
      { value: 'bank7', label: 'Banco 7' },
      { value: 'bank8', label: 'Banco 8' },
      { value: 'bank9', label: 'Banco 9' },
    ],
  },
  // Agrega más países y sus bancos aquí...
];


const FormularioAgregado = ({ onAgregar, initialVal, onSubmit }) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [country, setCountry] = useState(null);


  useEffect(() => {
        // Cargar las opciones del país en el estado usando useEffect
    setCountryOptions(countryData.map((country) => ({ value: country.value, label: country.label })));
  }, []);

  useEffect(() => {
    // Cargar las opciones de banco según el país seleccionado
    if (country) {
      const selectedCountryData = countryData.find((c) => c.value === country.value);
      setBankOptions(selectedCountryData.banks);
    } else {
      setBankOptions([]);
    }
  }, [country]);

  

  console.log("camposeditables", initialVal);

  return (
    <div>
      <h2>{initialVal? "Editar Registro" : "Agregar Nuevo Registro"}</h2>
      <Formik
        initialValues={initialVal? 
          {
            name: 'editar',
            principalUser: "editar",
            bank: null,
            country: null,
            state: 'Active',
          }:
         {
          name: '',
          principalUser: '',
          bank: null,
          country: null,
          state: 'Active',
        }}
        onSubmit={(values, { resetForm }) => {
          if (initialVal) {
            // Si initialValues existe, significa que estamos editando
            // En este caso, llamamos a la función onSubmit y pasamos los valores editados
            onSubmit(values);
          } else {
            // Si no hay initialValues, estamos agregando un nuevo registro
            onAgregar(values);
          }
          resetForm();
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="form-container">
            <div className='input-box'>
              <Field type="text" name="name" placeholder=" " />
              <label htmlFor="name">Name</label>
              <ErrorMessage name="name" component="span" className="errorMessage" />
            </div>

            <div className='input-box'>
              <Field type="text" name="principalUser" placeholder=" " />
              <label htmlFor="name">Principal User</label>
              <ErrorMessage name="principalUser" component="span" className="errorMessage" />
            </div>

            <div>
              <label htmlFor="country">Select a country</label>
              <Select
                options={countryOptions}
                name="country"
                placeholder="Select a country"
                isClearable
                value={country}
                onChange={(selectedOption) => {
                  setCountry(selectedOption);
                  setFieldValue('country', selectedOption);
                  setFieldValue('bank', null); // Resetear el banco seleccionado cuando se cambia el país
                }}
              />
            </div>

            <div>
              <label htmlFor="bank">Select a bank</label>
              <Select
                options={bankOptions}
                name="bank"
                placeholder="Select a bank"
                isClearable
                value={values.bank}
                onChange={(selectedOption) => {
                  setFieldValue('bank', selectedOption);
                }}
                isDisabled={!country} // Deshabilitar el campo hasta que se seleccione un país
              />
            </div>

            <div>
              <label>State: </label>
              <div>
                <label>
                  <Field type="radio" name="state" value="Active" />
                  Activo
                </label>
                <label>
                  <Field type="radio" name="state" value="Disabled" />
                  Desactivado
                </label>
              </div>
            </div>

            <button type="submit" className="btn_primary">Agregar</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormularioAgregado;