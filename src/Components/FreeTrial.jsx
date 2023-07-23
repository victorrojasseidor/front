import React, { useState } from "react";
import PropTypes from "prop-types";
import imgfree from "../../public/img/freetrial.png";
import Image from "next/image";
import { Formik, Field, ErrorMessage } from "formik";
import { validateFormRegister } from "@/helpers/validateForms";
import ImageSvg from "@/helpers/ImageSVG";

function FreeTrial(props) {

 

  const handleSubmit = (values) => {
    // Realizar acción cuando el formulario es válido
    console.log("Formulario válido", values);
  };

  return (
    <div className="freetrial">
      <div className="freetrial_description">
        <p>
          {" "}
          The fastest and
          <span> safest </span>
          way to have the exchange rate registered in your ERP
          <span> every day </span>.
        </p>
        <p>An expert will contact you</p>

        <Image src={imgfree} width={200} alt="imgfreetrial" />
      </div>
      <div className="freetrial_contact">
        <Formik
          initialValues={{
            corporateEmail: "menagenmurriagui@seidor.com",
            password: "",
            confirmPassword: "",
            name: "I am interested Currency Exchange rates automation",
            acceptTerms: false,
            phoneNumber: "982 354 738",
          }}
          validationSchema={validateFormRegister}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <form className="form-container">
              <div className="input-box">
                <Field type="email" name="corporateEmail" placeholder=" " />
                <label htmlFor="corporateEmail">Company email</label>
                <ErrorMessage className="errorMessage" name="corporateEmail" component="div" />
              </div>

              <div className="input-box">
                <Field type="text" name="title" placeholder=" " value="I am interested Currency Exchange rates automation" />
                <label htmlFor="title"> Title </label>
                <ErrorMessage className="errorMessage" name="title" component="div" />
              </div>

              <div className="input-box">
                <Field type="text" id="phoneNumber" name="phoneNumber" placeholder=" " value={"972 354 278"} />
                <label htmlFor="phoneNumber">Phone Number</label>
                <ErrorMessage className="errorMessage" name="phoneNumber" component="div" />
              </div>

              <div className="input-box">
                <Field type="text" name="name" placeholder="" value=" I am ...." />
                <label htmlFor="name"> Message</label>
                <ErrorMessage className="errorMessage" name="message" component="div" />
              </div>

              <div className="send">
                <button className="btn_primary small" type="submit" disabled={isSubmitting}>
                  SEND
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

FreeTrial.propTypes = {};

export default FreeTrial;
