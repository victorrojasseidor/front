// pages/signup.js
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../../styles/styles.scss";
import { validateFormRegister } from "@/helpers/validateForms"; // Import the custom validation function
import { countryOptions } from "@/helpers/contry";
const ProgressRegister = () => {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    // You don't need to call validateFormRegister here since Formik automatically performs validation before submitting.
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  // datos personales
  const [options, setOptions] = useState([]);

  const handleAddOption = (values, { resetForm }) => {
    const newOption = values.selectedOption.trim();
    if (newOption !== "") {
      setOptions([...options, newOption]);
      resetForm();
    }
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  return (
    <div className="containerProgress">
      <div className="progressBar">
        <div
          className="progressBarFill"
          style={{ width: `${(step - 1) * 50}%` }} // 50% per step
        />
      </div>
      <div className="step">Paso {step}</div>
      <Formik
        initialValues={{
          corporateEmail: "menagenmurriagui@seidor.com",
          lastName: "",
          name: "Menagen Murriagui",
          countryCode: countryOptions[0], // Valor inicial de Perú
          phoneNumber: "",
        }}
        validate={validateFormRegister} // Use the custom validation function here
        onSubmit={(values) => {
          // Logic to submit the form data
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {step === 1 && (
              <div>
                <h4> Personal information</h4>

                <form className="formContainer">
                  <div>
                    <Field type="text" name="name" placeholder=" " />
                    <label htmlFor="name">Username</label>
                    <ErrorMessage className="errorMessage" name="name" component="div" />
                  </div>

                  <div>
                    <Field type="text" name="lastName" placeholder=" " />
                    <label htmlFor="lastName">Last Name</label>
                    <ErrorMessage className="errorMessage" name="lastName" component="div" />
                  </div>

                  <div className="phone-field">
                    <div>
                      <Field as="select" id="countryCode" name="countryCode">
                        {countryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                    </div>

                    <div>
                      <Field type="text" id="phoneNumber" name="phoneNumber" placeholder=" " />
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <ErrorMessage className="errorMessage" name="phoneNumber" component="div" />
                    </div>
                  </div>

                  <div>
                    <Field type="email" name="corporateEmail" placeholder=" " />
                    <label htmlFor="corporateEmail">Company email</label>
                    <ErrorMessage className="errorMessage" name="corporateEmail" component="div" />
                  </div>

                  <div className="actions">
                    <button className="btn_primary small" type="submit" onClick={handleNextStep} >
                      NEXT
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div>
                





                <button type="button" className="previous" onClick={handlePreviousStep}>
                  Previous
                </button>
                <button type="button" onClick={handleNextStep}>
                  Next
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                


                
                <button type="button" className="previous" onClick={handlePreviousStep}>
                  Previous
                </button>
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProgressRegister;
