import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import ModalForm from '@/Components/Atoms/ModalForm';
import { useAuth } from '@/Context/DataContext';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import { IconArrow } from '@/helpers/report';

const FormPatters = ({ onAgregar, dataPadrones, setShowForm }) => {
  const [selectedCountry, setSelectedCountry] = useState(1 || '');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [registerDuplicate, setRegisterDuplicate] = useState(false);

  const { l } = useAuth();
  const t = l.Pattern;

  const formValues = {
    country: parseInt(selectedCountry), // Usamos los valores iniciales si están disponibles
    Pattern: parseInt(selectedPattern),
  };

  useEffect(() => {
    // verificar duplicados
    const dataPadronesTrans =
      dataPadrones &&
      dataPadrones.oPadrones.map((regis) => ({
        country: regis.id_pais,
        Pattern: regis.id_documento,
      }));

    const isIncluded = dataPadronesTrans?.some((arr) => JSON.stringify(arr) === JSON.stringify(formValues));

    if (isIncluded) {
      setRegisterDuplicate(true);
    } else {
      setRegisterDuplicate(false);
    }
  }, [formValues]);

  const handleCountryChange = (event) => {
    const selectValue = event.target.value;
    setSelectedCountry(selectValue);
    setSelectedPattern('');
  };

  const handlePatternChange = (event) => {
    const selectValue = event.target.value;
    setSelectedPattern(selectValue);
  };

  // const handleStateChange = (event) => {
  //   setValueState(event.target.value)
  // }

  return (
    <ModalForm
      close={() => {
        setShowForm(false);
        setSelectedCountry('');
        setSelectedPattern('');
      }}
    >
      <div className="content-form-padrones">
        <h2 className="box">{t['Add patterns']}</h2>

        <Formik
          initialValues={formValues}
          onSubmit={(values, { resetForm }) => {
            onAgregar({
              country: parseInt(selectedCountry), // Usamos los valores iniciales si están disponibles
              Pattern: parseInt(selectedPattern),
              // state: valueState
            });

            resetForm();
          }}
        >
          {({ setFieldValue }) => (
            <Form className="form-Curency">
              <div className="content">
                <div className="subtitle">
                  <h5 className="sub"> 1. {t['Select the type of pattern']} </h5>
                  <p className="description">{t['Add the bank']}</p>
                </div>
                <div className="group">
                  <div className="box-filter">
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                      <InputLabel id="country" name="country">
                        {t.Country}
                      </InputLabel>

                      <Select
                        labelId="country"
                        name="country" // Make sure this matches the Field name
                        value={selectedCountry}
                        IconComponent={IconArrow}
                        onChange={(values) => {
                          handleCountryChange(values);
                          setFieldValue('country', values.target.value);
                        }}
                      >
                        {dataPadrones?.oPais.map((country) => (
                          <MenuItem key={country.id_pais} value={country.id_pais}>
                            {country.descripcion_pais}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText> {selectedCountry ? '' : t.Select} </FormHelperText>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 180 }}>
                      <InputLabel id="fuente">{t.Pattern}</InputLabel>
                      <Select
                        labelId="fuente"
                        value={selectedPattern}
                        IconComponent={IconArrow}
                        onChange={(values) => {
                          handlePatternChange(values);
                          setFieldValue('Pattern', values.target.value);
                        }}
                      >
                        {dataPadrones?.oDocumento.map((option) => (
                          <MenuItem key={option.id_documento} value={option.id_documento}>
                            {option.nombre}
                          </MenuItem>
                        ))}
                      </Select>

                      <FormHelperText> {selectedPattern ? '' : t.Select} </FormHelperText>
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* <div className='content'>
                <div className='subtitle'>
                  <h5 className='sub'> 2. {t.State} </h5>
                  <p className='description'>{t['Enable or disable exchange rate']}</p>
                </div>

                <div className='content'>

                  <FormControl sx={{ m: 1 }}>

                    <RadioGroup
                      row
                      aria-labelledby='demo-form-control-label-placement'
                      name='state'
                      value={valueState}
                      onChange={(values) => { handleStateChange(values); setFieldValue('state', values.target.value) }}
                    >

                      <FormControlLabel
                        value='Active'
                        control={<Radio />}
                        label={t.Active}
                      />

                      <FormControlLabel
                        value='Disabled'
                        control={<Radio />}
                        label={t.Disabled}
                      />

                    </RadioGroup>

                  </FormControl>

                </div>

              </div> */}

              {registerDuplicate && (
                <div className="error ">
                  <p className="errorMessage">{t['These patterns already exist, select another']}</p>
                </div>
              )}

              <div className="submit-box">
                <button
                  type="button"
                  className="btn_secundary small"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedCountry('');
                    setSelectedPattern('');
                  }}
                >
                  {t.Close}
                </button>

                <button type="submit" className={`btn_primary small ${!selectedPattern || registerDuplicate ? 'disabled' : ''}`} disabled={registerDuplicate}>
                  {t.Add}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ModalForm>
  );
};

export default FormPatters;
