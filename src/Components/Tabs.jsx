import { FaCheck } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { Formik, Field, ErrorMessage } from 'formik'
import React, { useState } from 'react'
import { countryOptions } from '@/helpers/contry'
import Steps from './Steps'
import { SignupSchemaEN } from '@/helpers/validateForms'

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleSubmit = (values) => {
    // Realizar acción cuando el formulario es válido
    console.log('Formulario válido', values)
  }

  return (
    <div className='tabs-container'>
      <div className='tab-header'>
        <button className={activeTab === 0 ? 'active complete' : ''} onClick={() => handleTabClick(0)}>
          <FaCheck />
          <h4> Personal information</h4>
        </button>
        <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}>
          <FaCheck />
          <h4>Company</h4>
        </button>
        <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}>
          <FaCheck />
          <h4> Notifications </h4>
        </button>
      </div>
      <div className='tab-content'>
        {activeTab === 0 && (
          <div className='tabOne'>
            <h4>
              <FiUser />
              Personal information
            </h4>

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
                      <button className='buttonPrimarySmall' type='submit' disabled={isSubmitting}>
                        NEXT
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {activeTab === 1 &&
          <Steps />}
        {activeTab === 2 && <div>Contenido de la pestaña 3</div>}
      </div>
    </div>
  )
}

export default Tabs
