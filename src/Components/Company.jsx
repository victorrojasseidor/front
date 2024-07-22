import { FiTrash2 } from 'react-icons/fi';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import React, { useState } from 'react';
import { MdPerson } from 'react-icons/md';

export default function Company() {
  const [options, setOptions] = useState([]);

  const handleAddOption = (values, { resetForm }) => {
    const newOption = values.selectedOption.trim();
    if (newOption !== '') {
      setOptions([...options, newOption]);
      resetForm();
    }
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  return (
    <div className="tabOne">
      <h3>
        <MdPerson />
        Company
      </h3>

      <div className="companyForm">
        <Formik
          initialValues={{
            companyCode: '',
            selectedOption: '',
          }}
          onSubmit={handleAddOption}
        >
          <Form>
            <div>
              <label>Company name:</label>
              <Field as="select" name="companyCode">
                <option value="">SEIDOR COMPANY</option>
                <option value="code1">Company 2</option>
                <option value="code2">Company 3</option>
                <option value="code3">Company 4</option>
              </Field>
              <ErrorMessage name="companyCode" component="div" />
            </div>

            <div>
              <label>Add business unit or associated company:</label>
              <Field as="select" name="selectedOption">
                <option value="">SELECT</option>
                <option value="INNOVATIVA S.A.C - RUC 20517426726">INNOVATIVA S.A.C - RUC 20517426726</option>
                <option value="option 3">Option 3</option>
                <option value="option 4">Option 4</option>
              </Field>
              <ErrorMessage name="selectedOption" component="div" />
            </div>

            <button type="submit" className="btn_icons black">
              + Add company
            </button>
          </Form>
        </Formik>

        <div className="preview">
          <p>Profile created for the following companies: </p>
          {options.length === 0 ? (
            <p>No options selected.</p>
          ) : (
            <ul>
              {options.map((option, index) => (
                <li key={index}>
                  <p> {option}</p>
                  <button onClick={() => handleDeleteOption(index)}>
                    {' '}
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="actionsButtons">
        <button className="btn_primary smallBack" type="submit">
          BACK
        </button>
        <button className="btn_primary small" type="submit">
          NEXT
        </button>
        <div />
      </div>
    </div>
  );
}
