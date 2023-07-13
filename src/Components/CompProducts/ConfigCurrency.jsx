import PropTypes from 'prop-types'
import React, { useState } from "react";

import { Formik, Field, ErrorMessage } from "formik";
import { SignupSchemaEN } from "@/helpers/validateForms";
import { countryOptions } from '@/helpers/contry';


import Link from 'next/link'


function ConfigCurrency(props) {

  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleSubmit = (values) => {
    // Realizar acción cuando el formulario es válido
    console.log('Formulario válido', values)
  }



  return (
    <div className='Currency_configurations' >
    
     <div className='tabs-container'>
      <div className='tab-header'>
        <button className={activeTab === 0 ? 'active complete' : ''} onClick={() => handleTabClick(0)}>
     
          <h3> General</h3>
        </button>
        <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}>
  
          <h4>Daily exchange rate</h4>
        </button>
        <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}>

          <h4>Monthly exchange rate</h4>
        </button>
      </div>
      <div className='tab-content'>
        {activeTab === 0 && (
          <div className='tabOne'>
            <h3>
       
              Personal informations
            </h3>

            <div>
              <Formik
                initialValues={{
                  corporateEmail: 'menagenmurriagui@seidor.com',
                  lastName: '',
                  name: 'Menagen Murriagui',
                  countryCode: countryOptions[0], // Valor inicial de Perú
                  phoneNumber: ''
                }}
                validationSchema={SignupSchemaEN}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <form className='formContainer'>
                    <div>
                      <Field type='text' name='name' placeholder=' ' />
                      <label htmlFor='name'>Username</label>
                      <ErrorMessage className='errorMessage' name='name' component='div' />
                    </div>

                    <div>
                      <Field type='text' name='lastName' placeholder=' ' />
                      <label htmlFor='lastName'>Last Name</label>
                      <ErrorMessage className='errorMessage' name='lastName' component='div' />
                    </div>

                    <div className='phone-field'>
                      <div>
                        <Field as='select' id='countryCode' name='countryCode'>
                          {countryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div>
                        <Field type='text' id='phoneNumber' name='phoneNumber' placeholder=' ' />
                        <label htmlFor='phoneNumber'>Phone Number</label>
                        <ErrorMessage className='errorMessage' name='phoneNumber' component='div' />
                      </div>
                    </div>

                    <div>
                      <Field type='email' name='corporateEmail' placeholder=' ' />
                      <label htmlFor='corporateEmail'>Company email</label>
                      <ErrorMessage className='errorMessage' name='corporateEmail' component='div' />
                    </div>

                    <div className='actions'>
                      <button className='btn_primary small' type='submit' disabled={isSubmitting}>
                        NEXT
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {activeTab === 1 && <h3>
          
          Ndiv 2 
        </h3>}

        {activeTab === 2 && (
          <div className='notificatión'>
            <h3>
          
              Notifications
            </h3>
            <p>Select how you want to be notified</p>
            <ul>
              <div>
                <input type='checkbox' className='checkboxId' />
                <label className='checkbox'> Notifications in Bpass</label>
              </div>

              <div>
                <input type='checkbox' className='checkboxId' />
                <label className='checkbox'> Email notifications</label>
              </div>
            </ul>
            <div className='actionsButtons'>
              <button className='btn_primary smallBack' type='submit'>
                BACK
              </button>

              
              <button className='btn_primary small' type='submit'>
              
               <Link href='/product'>  NEXT  </Link>
               </button>
              
               
            
              <div />
            </div>
          </div>
        )}
      </div>
    </div>
   

      
    </div>
  )
}

// ConfigCurrency.propTypes = {

// }

export default ConfigCurrency

