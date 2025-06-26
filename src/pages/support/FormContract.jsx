import React, { useState, useEffect } from 'react';
import { Formik, Form, ErrorMessage, useField } from 'formik';
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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import { validateFormContract } from '@/helpers/validateForms';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@/Components/Modal';
import utc from 'dayjs/plugin/utc';

const FormikTextField = ({ name, label }) => {
  const [field, meta] = useField(name);
  const isError = meta.touched && Boolean(meta.error);

  return <TextField {...field} fullWidth label={label} error={isError} helperText={isError ? meta.error : ''} variant="outlined" margin="normal" />;
};

const FormContract = ({ onAgregar, initialVal, datacontractFilter, handleEditCurrency, setShowForm, setDataAction }) => {
  dayjs.extend(utc);
  const formatearFechaUTC = (fecha) => initialVal && dayjs.utc(fecha).format('DD/MM/YYYY');

  const [valueState, setValueState] = useState(initialVal?.estado || '33');
  const [startDate, setStartDate] = useState(formatearFechaUTC(initialVal?.fecha_inicio) || dayjs().subtract(0, 'day').format('DD/MM/YYYY'));
  const [endDate, setEndDate] = useState(formatearFechaUTC(initialVal?.fecha_fin) || dayjs().add(6, 'month').format('DD/MM/YYYY'));
  const [applyrangestartdate, setApplyRangeStartDate] = useState(false);
  const [applyrangeendate, setApplyRangeEndDate] = useState(false);
  const [showAplyRange, setShowApplyRange] = useState(false);

  const { l } = useAuth();
  const t = l.Support;

  const formValues = {
    numbercontract: initialVal?.id_contrato,
    Reference: initialVal?.referencia,
  };

  const [selectedCompany, setSelectedCompany] = useState(initialVal?.id_company || '');
  const [selectedEnterprise, setSelectedEnterprise] = useState(initialVal?.id_empresa || '');
  const [dataEnterprise, setDataEnterprise] = useState([]);

  useEffect(() => {
    if (initialVal) {
      const selectedCompanyData = datacontractFilter?.oCompany.find((comp) => comp.id_company === Number(initialVal?.id_company));
      setDataEnterprise(selectedCompanyData ? selectedCompanyData.oEmpresa : []);
    }
  }, [initialVal]);

  const handleCheckboxChange = (index) => {
    const updated = [...selectedSkills];
    updated[index].enabled = !updated[index].enabled;
    setSelectedSkills(updated);
  };

  const handleDateChangeSkill = (index, field, value) => {
    const updated = [...selectedSkills];
    updated[index][field] = value ? value.format('DD-MM-YYYY') : null;
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

  const formatDateYYYYMMDD = (originalDate) => {
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

  const verificarIsActive = (code) => {
    if (initialVal?.habilidad && Array.isArray(initialVal.habilidad)) {
      const skill = initialVal.habilidad.find((skill) => String(skill.codigo_habilidad) === String(code));
      return skill?.is_activo === 1;
    }
    return false;
  };

  const checkDateSkillStart = (code) => {
    if (initialVal?.habilidad && Array.isArray(initialVal.habilidad)) {
      const skill = initialVal.habilidad.find((skill) => String(skill.codigo_habilidad) === String(code));
      return formatearFechaUTC(skill?.fecha_inicio_habilidad);
    }
    return dayjs(startDate, 'DD/MM/YYYY');
  };

  const checkDateSkillEnd = (code) => {
    if (initialVal?.habilidad && Array.isArray(initialVal.habilidad)) {
      const skill = initialVal.habilidad.find((skill) => String(skill.codigo_habilidad) === String(code));
      return formatearFechaUTC(skill?.fecha_fin_habilidad);
    }
    return dayjs(endDate, 'DD/MM/YYYY');
  };

  let skillsList = [
    {
      name: 'Download automated bank extracts',
      key: 'EXT_BANC',
      id: 1,
      enabled: verificarIsActive('EXT_BANC'),
      startDate: checkDateSkillStart('EXT_BANC'),
      endDate: checkDateSkillEnd('EXT_BANC'),
      is_suspendido: false,
    },
    {
      name: 'Exchange rate automation',
      key: 'TIP_CAMB',
      id: 2,
      enabled: verificarIsActive('TIP_CAMB'),
      startDate: checkDateSkillStart('TIP_CAMB'),
      endDate: checkDateSkillEnd('TIP_CAMB'),
      is_suspendido: false,
    },
    {
      name: 'Download SUNAT tax status records',
      key: 'PADRONES',
      id: 3,
      enabled: verificarIsActive('PADRONES'),
      startDate: checkDateSkillStart('PADRONES'),
      endDate: checkDateSkillEnd('PADRONES'),
      is_suspendido: false,
    },
    {
      name: 'Captcha resolution service',
      key: 'CAPTCHA',
      id: 4,
      enabled: verificarIsActive('CAPTCHA'),
      startDate: checkDateSkillStart('CAPTCHA'),
      endDate: checkDateSkillEnd('CAPTCHA'),
      is_suspendido: false,
    },
    {
      name: 'Download automated bank statements',
      key: 'EST_BANC',
      id: 5,
      enabled: verificarIsActive('EST_BANC'),
      startDate: checkDateSkillStart('EST_BANC'),
      endDate: checkDateSkillEnd('EST_BANC'),
      is_suspendido: false,
    },
    {
      name: 'Download withholdings',
      key: 'DETRAC',
      id: 6,
      enabled: verificarIsActive('DETRAC'),
      startDate: checkDateSkillStart('DETRAC'),
      endDate: checkDateSkillEnd('DETRAC'),
      is_suspendido: false,
    },
    // {
    //   name: 'Supplier validation',
    //   key: 'SV', //ejemplo
    //   id: 7,
    //   enabled: false,
    //   startDate: null,
    //   endDate: null,
    // },
    // {
    //   name: 'Image text extraction service',
    //   key: 'ITS', //ejemplo
    //   id: 8,
    //   enabled: false,
    //   startDate: null,
    //   endDate: null,
    // },
    // {
    //   name: 'AFP validation',
    //   key: 'AFP', //ejemplo
    //   id: 9,
    //   enabled: false,
    //   startDate: null,
    //   endDate: null,
    // },
  ];
  const [selectedSkills, setSelectedSkills] = useState(skillsList);

  const transfTosHabilidad = (obj) => {
    const mapSkills = obj.map((skill) => {
      return {
        sNombreHabilidad: skill.name,
        sCodigoHabilidad: skill.key,
        sNumero: skill.id,
        sFechaInicio: formatDateYYYYMMDD(skill.startDate),
        sFechaFin: formatDateYYYYMMDD(skill.endDate),
        is_activo: skill.enabled,
        is_suspendido: false,
      };
    });
    return mapSkills;
  };

  const arrayIdHability = (dataSelect) => {
    const habilidades = dataSelect?.habilidad.map((arr) => arr.id_habilidad);
    return habilidades;
  };

  const checkIsActiveSkill = () => {
    const skills = transfTosHabilidad(selectedSkills);
    const verifyIsActive = skills.some((value) => value.is_activo === true);
    return verifyIsActive;
  };

  const isbFlagSoloContrato = () => {
    const objinitial = initialVal?.habilidad.map((value) => ({
      codigo_habilidad: value.codigo_habilidad,
      fecha_inicio_habilidad: formatearFechaUTC(value.fecha_inicio_habilidad),
      fecha_fin_habilidad: formatearFechaUTC(value.fecha_fin_habilidad),
      is_suspendido: value.is_suspendido == 1,
      is_activo: value.is_activo == 1,
    }));

    const objSkill = selectedSkills?.map((value) => ({
      codigo_habilidad: value.key,
      fecha_inicio_habilidad: value.startDate,
      fecha_fin_habilidad: value.endDate,
      is_suspendido: value.is_suspendido,
      is_activo: value.enabled,
    }));

    if (objinitial?.length !== objSkill.length) return false;

    for (let i = 0; i < objinitial?.length; i++) {
      const obj1 = objinitial[i];
      const obj2 = objSkill[i];

      for (let key in obj1) {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    }
    return true;
  };

  const reduceEndDateByOneMonth = (date) => {
    const parsedDate = dayjs(date, 'DD/MM/YYYY');
    const newEndDate = parsedDate.subtract(1, 'month');
    const formattedDate = newEndDate.format('YYYY/MM/DD');
    return formattedDate;
  };

  return (
    <ModalForm
      close={() => {
        setShowForm(false);
        setSelectedEnterprise('');
        setSelectedCompany('');
        setDataAction(null);
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
                iIdEmpresa: selectedEnterprise,
                sNumContrato: values.numbercontract,
                sReferencia: values.Reference,
                iIdContrato: initialVal.id_contrato,
                sFechaInicio: formatDateYYYYMMDD(startDate),
                sFechaFin: formatDateYYYYMMDD(endDate),
                sFechaContractual: reduceEndDateByOneMonth(endDate),
                iEstado: Number(valueState),
                oIdProdEnv: [selectedEnterprise],
                oHabilidad: transfTosHabilidad(selectedSkills),
                oIdHabilidadEliminar: arrayIdHability(initialVal),
                bFlagSoloContrato: isbFlagSoloContrato(),
              });
            } else {
              onAgregar({
                iIdEmpresa: selectedEnterprise,
                sNumContrato: values.numbercontract,
                sReferencia: values.Reference,
                sFechaInicio: formatDateYYYYMMDD(startDate),
                sFechaFin: formatDateYYYYMMDD(endDate),
                iEstado: Number(valueState),
                oIdProdEnv: [selectedEnterprise],
                oHabilidad: transfTosHabilidad(selectedSkills),
                sFechaContractual: reduceEndDateByOneMonth(endDate),
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
                        <FormControl sx={{ m: 0, minWidth: 100 }}>
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

                        <FormControl sx={{ m: 0, minWidth: 120 }}>
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
                        <Box
                          sx={{
                            width: 'auto',
                            mx: 0,
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                          }}
                        >
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
                    <p>{t['Select the skills needed for this contract']}</p>

                    {/* <p>
                      {' '}
                    
                      <button className="btn_green" onClick={() => setShowApplyRange(true)}>
                        {t['Apply date range']}
                      </button>
                    </p> */}

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
                                        format="DD/MM/YYYY"
                                        value={dayjs(skill?.startDate, 'DD/MM/YYYY')}
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
                                        format="DD/MM/YYYY"
                                        components={{
                                          OpenPickerIcon: IconDate,
                                          CalendarIcon: IconDate,
                                        }}
                                        value={dayjs(skill?.endDate, 'DD/MM/YYYY')}
                                        onChange={(newValue) => handleDateChangeSkill(index, 'endDate', newValue)}
                                      />
                                    </LocalizationProvider>
                                  </div>
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
                    setDataAction(null);
                    setSelectedEnterprise('');
                  }}
                >
                  {t.Cancel}
                </button>

                <button type="submit" className={`btn_primary small ${!isValid || selectedCompany == '' || !checkIsActiveSkill() || selectedEnterprise === '' ? 'disabled' : ''}`} disabled={!isValid}>
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
