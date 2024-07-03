import { FaCheck } from 'react-icons/fa'
import { Formik, Field, ErrorMessage } from 'formik'
import React, { useState } from 'react'
import { countryOptions } from '@/helpers/contry'
// import Steps from './Steps'
import { SignupSchemaEN } from '@/helpers/validateForms'
import Company from './Company'
import { MdPerson } from 'react-icons/md'
import Link from 'next/link'

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleSubmit = (values) => {
    // Realizar acción cuando el formulario es válido

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
            <h3>
              {/* <FiUser /> */}
              <MdPerson />
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
                  <form className='form-container'>
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

        {activeTab === 1 && <Company />}

        {activeTab === 2 && (
          <div className='container-notificatión'>
            <h3>
              <MdPerson />
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
  )
}

export default Tabs
