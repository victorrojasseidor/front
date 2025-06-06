import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import { validateFormCurrency } from '@/helpers/validateForms';
import ModalForm from '@/Components/Atoms/ModalForm';
import { useAuth } from '@/Context/DataContext';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { IconArrow, IconDate } from '@/helpers/report';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import { validateFormContract } from '@/helpers/validateForms';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@/Components/Modal';

const FormikTextField = ({ name, label }) => {
  const [field, meta] = useField(name);
  const isError = meta.touched && Boolean(meta.error);

  return <TextField {...field} fullWidth label={label} error={isError} helperText={isError ? meta.error : ''} variant="outlined" margin="normal" />;
};

const FormContract = ({ onAgregar, initialVal, datacontractFilter, setIinitialEdit, dataTypeChange, handleEditCurrency, setShowForm, typeOfChange }) => {
  const [selectedDays, setSelectedDays] = useState(initialVal?.dias_adicional || '1');
  const [valueState, setValueState] = useState(initialVal?.estado || '33');
  const [startDate, setStartDate] = useState(dayjs().subtract(0, 'day').format('DD/MM/YYYY'));
  const [endDate, setEndDate] = useState(dayjs().add(6, 'month').format('DD/MM/YYYY'));
  const [applyrangestartdate, setApplyRangeStartDate] = useState(false);
  const [applyrangeendate, setApplyRangeEndDate] = useState(false);
  const [showAplyRange, setShowApplyRange] = useState(false);

  const { l, idCountry } = useAuth();
  const t = l.Support;

  const formValues = {
    // numbercontract:"",
    // Reference: "",
  };

  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const [dataEnterprise, setDataEnterprise] = useState([]);

  // ✅ Cambiar estado del checkbox
  const handleCheckboxChange = (index) => {
    const updated = [...selectedSkills];
    updated[index].enabled = !updated[index].enabled;
    setSelectedSkills(updated);
  };

  // ✅ Cambiar fechas
  const handleDateChangeSkill = (index, field, value) => {
    const updated = [...selectedSkills];
    updated[index][field] = value ? value.format('YYYY-MM-DD') : null;
    setSelectedSkills(updated);
  };

  // ✅ Cambiar conexiones máximas (solo si aplica)
  const handleMaxConnectionsChange = (index, value) => {
    const updated = [...selectedSkills];
    updated[index].maxConnections = value;
    setSelectedSkills(updated);
  };

  const handleCompanyChange = (event) => {
    const selectCompanyValue = event.target.value;
    setSelectedCompany(selectCompanyValue);
    const selectedCompanyData = datacontractFilter?.oCompany.find((comp) => comp.id_company === Number(selectCompanyValue));
    if (selectedCompanyData) {
      setDataEnterprise(selectedCompanyData.oEmpresa);
    } else {
      setDataEnterprise([]);
    }
  };

  const handleEnterpriseChange = (event) => {
    const selectCompanyValue = event.target.value;
    setSelectedEnterprise(selectCompanyValue);
  };

  const handleChangeState = (event) => {
    setValueState(event.target.value);
  };

  const formatDate = (originalDate) => {
    const parsedDate = dayjs(originalDate, 'DD/MM/YYYY');
    const formattedDate = parsedDate.format('YYYY/MM/DD');
    return formattedDate;
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.format('DD/MM/YYYY'));
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('DD/MM/YYYY'));
  };

  const skillsList = [
    {
      name: 'Download automated bank extracts',
      key: 'downloadBankExtracts',
      id: 1,
      enabled: false,
      startDate: '2025-08-14',
      endDate: '2025-08-14',
      maxConnections: null,
    },
    {
      name: 'Exchange rate automation',
      key: 'exchangeRateAutomation',
      id: 2,
      enabled: false,
      startDate: '2025-08-14',
      endDate: '2025-08-14',
      maxConnections: null,
    },
    {
      name: 'Download SUNAT tax status records',
      key: 'downloadSunatTaxStatus',
      id: 3,
      enabled: false,
      startDate: '2025-08-14',
      endDate: '2025-08-14',
    },
    {
      name: 'Captcha resolution service',
      key: 'captchaResolution',
      id: 4,
      enabled: false,
      startDate: '2025-08-14',
      endDate: '2025-08-14',
      maxConnections: 30000,
    },
    {
      name: 'Download automated bank statements',
      key: 'downloadBankStatements',
      id: 5,
      enabled: false,
      startDate: null,
      endDate: null,
      maxConnections: null,
    },
    {
      name: 'Download withholdings',
      key: 'downloadWithholdings',
      id: 6,
      enabled: false,
      startDate: '2025-08-14',
      endDate: '2025-08-14',
    },
    {
      name: 'Supplier validation',
      key: 'supplierValidation',
      id: 7,
      enabled: false,
      startDate: null,
      endDate: null,
    },
    {
      name: 'Image text extraction service',
      key: 'imageTextExtraction',
      id: 8,
      enabled: false,
      startDate: null,
      endDate: null,
    },
    {
      name: 'AFP validation',
      key: 'afpValidation',
      id: 9,
      enabled: false,
      startDate: null,
      endDate: null,
    },
  ];
  const [selectedSkills, setSelectedSkills] = useState(skillsList);

  const transfTosHabilidad = (obj) => {
    const mapSkills = obj.map((skill) => {
      return {
        sNombreHabilidad: skill.name,
        sNumero: skill.id,
        sFechaInicio: skill.startDate,
        sFechaFin: skill.endDate,
        iMaxConexiones: skill.maxConnections,
        is_activo: skill.enabled,
        is_suspendido: false,
      };
    });
    return mapSkills;
  };

  return (
    <ModalForm
      close={() => {
        // setIinitialEdit(null);
        setShowForm(false);
        setSelectedEnterprise('');
        setSelectedCompany('');
        setSelectedSkills(skillsList);
      }}
    >
      <div className="conten-form-Curency">
        <h2 className="box">{initialVal ? t['Edit contract'] : t['Add contract']}</h2>

        <Formik
          initialValues={formValues}
          validate={(values) => validateFormContract(values)}
          onSubmit={(values, { resetForm }) => {
            if (initialVal) {
              handleEditCurrency({
                // country: parseInt(selectedCountry), // Usamos los valores iniciales si están disponibles
                // fuente: parseInt(selectedPortal),
                // coinOrigin: parseInt(selectedCoinOrigin),
                // coinDestiny: parseInt(selectedCoinDestiny),
                // days: parseInt(selectedDays),
                // state: valueState,
              });
            } else {
              onAgregar({
                iIdEmpresa: selectedEnterprise,
                sNumContrato: values.numbercontract,
                sReferencia: values.Reference,
                sFechaInicio: formatDate(startDate),
                sFechaFin: formatDate(endDate),
                iEstado: Number(valueState),
                oIdProdEnv: [selectedEnterprise],
                oHabilidad: transfTosHabilidad(selectedSkills),
              });
            }
            resetForm();
          }}
        >
          {({ isValid, setFieldValue }) => (
            <Form className="form-Curency contract-form">
              <div className="contract-form-content">
                <div className="content-filter">
                  <div className="content">
                    <div className="subtitle">
                      <h5 className="sub"> {t['Contract details']} </h5>
                    </div>

                    <div className="box-filter">
                      <div className="group">
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id="company-label">{t.Company}</InputLabel>
                          <Select labelId="company-label" value={selectedCompany} onChange={handleCompanyChange} IconComponent={IconArrow}>
                            <MenuItem value="">
                              {/* <em>{l.Reporting['All Companys']}</em> */}
                              <em>{l.Reporting['All Companys']}</em>
                            </MenuItem>
                            {datacontractFilter?.oCompany.map((comp) => (
                              <MenuItem key={Number(comp.ruc_company)} value={comp.id_company}>
                                <div> {comp.razon_social_company}</div>
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            <ErrorMessage name="selectedCompany" component="span" className="errorMessage" />
                          </FormHelperText>
                        </FormControl>

                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id="company-label">{t.Enterprise}</InputLabel>
                          <Select labelId="company-label" value={selectedEnterprise} onChange={handleEnterpriseChange} IconComponent={IconArrow}>
                            <MenuItem value="">
                              <em>{t.all}</em>
                            </MenuItem>
                            {dataEnterprise?.map((comp) => (
                              <MenuItem key={comp.razon_social_empresa} value={comp.id_empresa}>
                                <div> {comp.razon_social_empresa}</div>
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            <ErrorMessage name="selectedEnterprise" component="span" className="errorMessage" />
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div className="group">
                        <Box sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                          <FormikTextField name="numbercontract" label={t['Contract number']} />
                          <FormikTextField name="Reference" label={t.Reference} />
                        </Box>
                      </div>
                    </div>
                  </div>

                  <div className="content">
                    <div className="subtitle">
                      <h5 className="sub"> {t['Contract status']} </h5>
                    </div>
                    <FormControl>
                      <RadioGroup row aria-labelledby="demo-form-control-label-placement" name="position" value={valueState} onChange={handleChangeState}>
                        {datacontractFilter?.oEstado.map((state) => (
                          <FormControlLabel key={state.id_estado} value={state.id_estado} control={<Radio />} label={state.descripcion_estado} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="content">
                    <div className="subtitle">
                      <h5 className="sub"> {t['Dates']} </h5>
                    </div>

                    <div className="date ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={t['Contract start date']}
                          value={dayjs(startDate, 'DD/MM/YYYY')}
                          slotProps={{
                            textField: {
                              // helperText: t['Date start']
                            },
                          }}
                          onChange={handleStartDateChange}
                          format="DD/MM/YYYY"
                          components={{
                            OpenPickerIcon: IconDate,
                            CalendarIcon: IconDate,
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={t['Contract end date']}
                          value={dayjs(endDate, 'DD/MM/YYYY')}
                          slotProps={{
                            textField: {
                              // helperText: t['Date end']
                            },
                          }}
                          onChange={handleEndDateChange}
                          format="DD/MM/YYYY"
                          components={{
                            OpenPickerIcon: IconDate,
                            CalendarIcon: IconDate,
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>

                <div className=" content content-skills">
                  <div className="subtitle">
                    <h5 className="sub"> {t['Skills and services']} </h5>
                  </div>

                  <div className=" Skills and services">
                    <p>
                      {' '}
                      {t['Select the skills needed for this contract']}
                      <button className="btn_green" onClick={() => setShowApplyRange(true)}>
                        {t['Apply date range']}
                      </button>
                    </p>

                    <div>
                      <div className="skills">
                        {selectedSkills.map((skill, index) => (
                          <Accordion key={skill.key}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <div className="skills-header">
                                <Checkbox checked={skill.enabled} onChange={() => handleCheckboxChange(index)} inputProps={{ 'aria-label': 'controlled' }} size="small" />
                                <label>{t[skill.name]}</label>
                              </div>
                            </AccordionSummary>
                            <AccordionDetails>
                              {skill.enabled && (
                                <div className="box-filter ">
                                  <div className="group">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        label="Start Date"
                                        value={skill.startDate ? dayjs(skill.startDate) : null}
                                        components={{
                                          OpenPickerIcon: IconDate,
                                          CalendarIcon: IconDate,
                                        }}
                                        onChange={(newValue) => handleDateChangeSkill(index, 'startDate', newValue)}
                                      />
                                    </LocalizationProvider>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        label="End Date"
                                        components={{
                                          OpenPickerIcon: IconDate,
                                          CalendarIcon: IconDate,
                                        }}
                                        value={skill.endDate ? dayjs(skill.endDate) : null}
                                        onChange={(newValue) => handleDateChangeSkill(index, 'endDate', newValue)}
                                      />
                                    </LocalizationProvider>
                                  </div>

                                  {/* Campo adicional solo si aplica */}
                                  {skill.name.includes('Captcha') && (
                                    // <div>
                                    //   <input type="number" value={skill.maxConnections || ''} onChange={(e) => handleMaxConnectionsChange(index, e.target.value)} placeholder="Max Connections" />

                                    // </div>
                                    <Box sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                                      {/* <FormikTextField name={`maxConnections-${skill.id}`} label={t['Captcha connections']} onChange={(e) => handleMaxConnectionsChange(index, e.target.value)}  /> */}
                                      <TextField type="number" fullWidth label={t['Captcha connections']} value={skill.maxConnections || ''} onChange={(e) => handleMaxConnectionsChange(index, e.target.value)} placeholder={t['Max Connections']} variant="outlined" margin="normal" />
                                    </Box>
                                  )}
                                </div>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="submit-box">
                <button
                  type="submit"
                  className="btn_secundary small"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedSkills(skillsList);
                    setSelectedCompany('');
                    setSelectedEnterprise('');
                  }}
                >
                  {t.Cancel}
                </button>

                <button type="submit" className={`btn_primary small ${!isValid || selectedCompany == '' || selectedEnterprise === '' ? 'disabled' : ''}`} disabled={!isValid}>
                  {initialVal ? t.Update : t.Add}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {showAplyRange && (
        <Modal open={showAplyRange} close={() => setShowApplyRange(false)}>
          <div className="apply-range-modal">
            <h3>{t['Apply date range']}</h3>
            {/* <p>{t['Do you want to apply the date range to all skills?']}</p> */}
          </div>
        </Modal>
      )}
    </ModalForm>
  );
};

export default FormContract;
