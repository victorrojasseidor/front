import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import user1 from '../../../public/img/testimonials/user1.png'
import user2 from '../../../public/img/testimonials/user2.png'
import user3 from '../../../public/img/testimonials/user3.png'
import user4 from '../../../public/img/testimonials/user4.png'
import user5 from '../../../public/img/testimonials/user5.png'
import YouTube from 'react-youtube'
import Link from 'next/link'
import Lang from '@/Components/Atoms/Lang'
import logo from '../../../public/img/logoGiftSF.gif'
import ImageSvg from '@/helpers/ImageSVG'
import finance from '../../../public/img/home-finance.png'
import rrhh from '../../../public/img/home-rrhh.png'
import support from '../../../public/img/home-support.png'
import cloud from '../../../public/img/testimonials/cloud.png'
import drive from '../../../public/img/testimonials/drive.png'
import uipath from '../../../public/img/testimonials/uipath.png'
import sap from '../../../public/img/testimonials/sap.png'
import ftp from '../../../public/img/testimonials/ftp.png'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { validateFormRegister } from '@/helpers/validateForms'
import { useAuth } from '@/Context/DataContext'
import Modal from '@/Components/Modal'
import { motion, useAnimation } from 'framer-motion'

const AnimatedSection = ({ children }) => {
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset

      // Ajusta estos valores según la posición en la página que desees para activar la animación
      const triggerPosition = 500
      const fadeOutDistance = 100

      // Calcula la opacidad en función de la posición de desplazamiento
      const opacity = Math.max(0, 1 - (scrollY - triggerPosition) / fadeOutDistance)

      // Ajusta el desplazamiento en el eje x
      const randomX = Math.floor(Math.random() * 30) - 50

      controls.start({ opacity, x: randomX })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [controls])

  return (
    <motion.section initial={{ opacity: 1, x: 0 }} animate={controls} transition={{ duration: 0.5 }}>
      {children}
    </motion.section>
  )
}

const Home = () => {
  const [selectImage, setSelectImage] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [message, setMessage] = useState(null)
  const [showM, setShowM] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)

  const videos = [
    'r8e364WkJZI',
    'YCpyaj5MAsM',
    'SxYz2wPT18Y'
  ]

  const videoRef = useRef()
  useEffect(() => {
    // Puedes utilizar este hook para ejecutar código después de que el componente ha sido montado.
    // Por ejemplo, puedes reproducir el video aquí.
    videoRef.current?.internalPlayer.playVideo()
  }, [currentVideo])

  const changeVideo = (index) => {
    setCurrentVideo(index)
  }
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const { l } = useAuth()
  const t = l.home

  const testimonials = [
    {
      id: 1,
      name: 'Ana Perez',
      position: 'CEO',
      testimony: 'Incredible service! I am very satisfied with the customer service and the quality of the products.',
      image: user1
    },
    {
      id: 2,
      name: 'Carlos Gomez',
      position: 'Senior Developer',
      testimony: 'Ari Seidor has exceeded my expectations. Their professional team truly knows how to provide effective solutions.',
      image: user2
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      position: 'Graphic Designer',
      testimony: 'I have tried several similar services, but Ari Seidor stands out for its innovation and efficiency.',
      image: user3
    },
    {
      id: 4,
      name: 'Juan Lopez',
      position: 'Data Analyst',
      testimony: 'Personalized attention and quick delivery make Ari Seidor the best option in the market.',
      image: user4
    },
    {
      id: 5,
      name: 'Laura Fernandez',
      position: 'Marketing Manager',
      testimony: 'My experience with Ari Seidor has been exceptional. I will definitely recommend their services to my friends.',
      image: user5
    }
  ]

  const changeImage = () => {
    const nextIndex = (selectImage ? selectImage.id : 0) % testimonials.length
    setSelectImage(testimonials[nextIndex])
    setRotation(rotation + 360 / testimonials.length)
  }

  const handleChangemessage = (event) => {
    setMessage(event.target.value)
  }

  useEffect(() => {
    const intervalId = setInterval(changeImage, 2000)

    return () => clearInterval(intervalId)
  }, [selectImage, rotation, testimonials])

  async function handleSubmit (values, { setSubmitting, setStatus, resetForm }) {
    const dataRegister = {
      oResults: {
        sUserName: values.name,
        sEmail: values.corporateEmail,
        sPassword: values.confirmPassword
      }
    }

    // try {
    //   const responseData = await fetchNoTokenPost('General/?Accion=RegistrarUsuarioInit', dataRegister && dataRegister)
    //   if (responseData.oAuditResponse?.iCode === 1) {
    //     setData(dataRegister)
    //     setShowM(true)
    //     setStatus(null)
    //     setTimeout(() => {
    //       resetForm()
    //     }, 10000)
    //   } else {
    //     const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
    //     setShowM(false)
    //     setStatus(errorMessage)
    //     setSubmitting(false)
    //     setEmailFieldEnabled(true)
    //     setTimeout(() => {
    //       resetForm()
    //     }, 100000)
    //   }
    // } catch (error) {
    //   console.error('error', error)
    //   setStatus('Service error')
    //   setTimeout(() => {
    //     resetForm()
    //   }, 60000)
    // }
  }

  return (
    <div className='home'>
      <header>
        <nav>
          <ul>
            <div className='logo'>
              <Image src={logo} width='40' alt='logo' priority />
            </div>
          </ul>

          <ul>
            <div className='languajes-box'>
              <Lang />
            </div>

            <li>
              <Link href='/'>{t.Login}</Link>
            </li>

            <li>
              <button className='btn_black'>{t['Sing in']}</button>
            </li>
          </ul>
        </nav>
      </header>

      <main className='box-home container'>
        <section className='home-front'>
          <div className='welcome'>
            <h1 className='subtitle'>{t['Optimize your Business Efficiency']}</h1>
            <p> {t['Discover the Power of ARI, the Software-Based Workforce with Artificial Intelligence']}</p>

            <div className='welcome-actions'>
              <button className='btn_secundary small'> {t['Try free trial']} </button>
              <button className='record'>
                <ImageSvg name='Record' />

                {t['View Demo']}
              </button>
            </div>

            <div className='account'>
              {' '}
              {t["You still don't have an account?"]} <Link href='/register'> {t['Sign In']}</Link>
            </div>
          </div>

          <div className='image-container'> </div>
        </section>

        <section className='home-client'>
          <div className='subtitle'>
            <h1> {t['What our client think about us?']} </h1>
          </div>
          <div className='testimonials-container'>
            <div className='container-img' style={{ transform: `rotate(${rotation}deg)` }}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className='image-container'
                  style={{
                    transform: `rotate(${index * (360 / testimonials.length) + rotation}deg) translateX(150px) translateY(-50%)`,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'center center',
                    width: '100px',
                    height: '100px',
                    marginLeft: '-50px',
                    marginTop: '-50px',
                    transition: 'transform 1s ease'
                  }}
                >
                  <button onClick={() => setSelectImage(testimonial)}>
                    <Image className={selectImage && selectImage.id === testimonial.id ? 'active' : ''} src={testimonial.image} alt={testimonial.name} width={100} height={100} />
                  </button>
                </div>
              ))}
            </div>

            {selectImage && (
              <div className='testimony'>
                <div className='testimony-img'>
                  <button>
                    <Image className='active' src={selectImage.image} alt={selectImage.name} width={100} height={100} />
                  </button>
                </div>
                <div className='testimony-message'>
                  <p>{selectImage.testimony}</p>
                  <h3>{selectImage.name}</h3>
                  <span>{selectImage.position}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className='home-how container'>
          <div className='home-how-description'>
            <div className='discover'>
              <p>{t['Discover our automation process']}</p>

              <h1 className='subtitle'>{t['How do we do it?']}</h1>

              <p>{t['ARI is software-based labor leveraging artificial intelligence, including machine learning, to autonomously execute tasks within complex end-to-end processes']}</p>

              <button className='btn_primary'>{t['Get Started']}</button>
            </div>
          </div>

          <div className='home-how-steps'>
            <div className='steps-container'>
              <div className='step'>
                <div className='box-circle'>
                  <button className='circle' onClick={() => changeVideo(0)} />
                </div>

                <div className='process'>
                  <span>1</span>

                  <div className='text'>
                    <h3> {t['Customize your process']}</h3>
                    <p>{t['Access the Ari.app application easily and securely, configure your digital employees']}</p>
                  </div>
                </div>
              </div>

              <div className='step'>
                <div className='box-circle'>
                  <button className='circle' onClick={() => changeVideo(1)} />
                </div>

                <div className='process'>
                  <span>2</span>

                  <div className='text'>
                    <h3> {t['Automated process']} </h3>
                    <p>{t['This employee processes the information, manages it, and performs all tasks automatically every day according to the schedule you have set']}</p>
                  </div>
                </div>
              </div>

              <div className='step'>
                <div className='box-circle'>
                  <button className='circle' onClick={() => changeVideo(2)} />
                </div>

                <div className='process'>
                  <span>3</span>

                  <div className='text'>
                    <h3> {t['Work delivered']} </h3>
                    <p>{t['After processing the information, the digital employee provides you with reports, charts, etc., so that your information is ready']}</p>
                  </div>
                </div>
              </div>
            </div>

            <figure className='steps-image'>
              {/* <div className='container-image'>

                {videos[currentVideo] && (
                  <YouTube videoId={videos[currentVideo]} opts={opts} ref={videoRef} />
                )}
              </div> */}
            </figure>
          </div>
        </section>

        <section className='home-account container'>
          <ul className='box-account'>
            <li>
              <h1> 5</h1>

              <p>{t['Digital Employees Automating Your Services']}</p>
            </li>

            <li>
              <h1> 20</h1>

              <p>{t['Included Skills to Digital Employees']}</p>
            </li>

            <li>
              <h1> 78%</h1>

              <p>{t['business agility']}</p>
            </li>
          </ul>
        </section>

        <section className='home-digitals  container '>
          <div className='description'>
            <h1> {t['Ari finance']}</h1>

            <p> {t['The technology and support coordinator facilitates platform and operation processes, including purchasing and installing software, server reboot, backup, and email configuration. They also handle VPN setup, printer configuration, password reset, and account termination for departures']}</p>
          </div>

          <div className='digital-image'>
            <Image src={finance} width='1000' alt='finance' priority />
          </div>
        </section>

        <section className='home-digitals container hr'>
          <div className='digital-image'>
            <Image src={rrhh} width='1000' alt='finance' priority />
          </div>
          <div className='description'>
            <h1> {t['Ari HR']}</h1>

            <p> {t['The human resources coordinator facilitates administrative processes such as onboarding, vacation management and health plans, resolving benefits problems and supporting performance reviews.']}</p>
          </div>
        </section>

        <section className='home-digitals container'>
          <div className='description'>
            <h1> {t['Ari it support']}</h1>

            <p> {t['The Technology and Support Coordinator facilitates processes such as purchasing and installing programs, restarting servers, backup, setting up mail, VPN, printers, resetting passwords, and deleting accounts.']}</p>
          </div>

          <div className='digital-image'>
            <Image src={support} width='1000' alt='finance' priority />
          </div>
        </section>

        <section className='home-enables container'>
          <h1> {t['Our enablers']}</h1>

          <div className='box-enables'>
            <button>
              <Image src={cloud} width='1000' alt='cloud' priority />
            </button>

            <button>
              <Image src={drive} width='1000' alt='drive' priority />
            </button>

            <button>
              <Image src={uipath} width='1000' alt='uipath' priority />
            </button>
            <button>
              <Image src={sap} width='1000' alt='sap' priority />
            </button>
            <button>
              <Image src={ftp} width='1000' alt='ftp' priority />
            </button>
          </div>
        </section>
      </main>

      <footer>
        <section className='home-contact container'>
          <div className='contact-message'>
            <h1 className='subtitle'> {t['Contact us']}</h1>

            <p>{t['Find out which AUTOMATION SOLUTIONS can help you.']}</p>

            <div className='social-media'>
              <div className='report blue'>
                <div className='report_icon  '>
                  <ImageSvg name='ReportDigital' />
                </div>

                <div className='report_data'>
                  <article>{t['Digital employees']}</article>

                  <p>
                    {' '}
                    <ImageSvg name='ArrowUp' /> <span> {t.working} </span> {t['for you']}{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='contact-form'>
            <h2> {t['Send email']}</h2>
            <p> {t['Please enter your information in the contact form and we will contact you as soon as possible']} </p>

            <Formik
              initialValues={{
                corporateEmail: '',
                message: '',
                firstName: '',
                company: '',
                position: ''
              }}
              // validate={(values) => validateFormRegister(values, l.validation)}
              onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
                // same shape as initial values
                // handleSubmit(values, { setSubmitting, setStatus, resetForm })
                setShowM(true)
              }}
              enableReinitialize
            >
              {({ isValid, isSubmitting, status }) => (
                <Form className='form-container'>
                  <div className='input-box'>
                    <Field type='email' name='corporateEmail' id='corporateEmail' placeholder=' ' disabled={isSubmitting} />
                    <label htmlFor='corporateEmail'>{t.Email}</label>
                    <ErrorMessage className='errorMessage' name='corporateEmail' component='span' />
                  </div>

                  <div className='group'>
                    <div className='input-box'>
                      <Field type='text' name='firstName' id='firstName' placeholder=' ' disabled={isSubmitting} />
                      <label htmlFor='firstName'>{t['First Name']}</label>
                      <ErrorMessage className='errorMessage' name='firstName' component='span' />
                    </div>

                    <div className='input-box'>
                      <Field type='text' name='lastName' id='lastName' placeholder=' ' disabled={isSubmitting} />
                      <label htmlFor='lastName'>{t['Last Name']}</label>
                      <ErrorMessage className='errorMessage' name='lastName' component='span' />
                    </div>

                    <div className='input-box'>
                      <Field type='text' name='company' id='company' placeholder=' ' disabled={isSubmitting} />
                      <label htmlFor='company'>{t.Company}</label>
                      <ErrorMessage className='errorMessage' name='company' component='span' />
                    </div>

                    <div className='input-box'>
                      <Field type='text' name='position' id='position' placeholder=' ' disabled={isSubmitting} />
                      <label htmlFor='position'>{t.Position}</label>
                      <ErrorMessage className='errorMessage' name='position' component='span' />
                    </div>
                  </div>

                  <div className='input-box'>
                    <textarea value={message} onChange={handleChangemessage} placeholder='' rows={4} cols={40} style={{ height: 'auto', minHeight: '3rem' }} />
                    <label htmlFor='message'> {t.Message} </label>
                  </div>
                  <div className='box-buttons'>
                    <button className={isValid ? 'btn_primary' : 'btn_primary disabled'} onClick={() => console.log('vonnn')} disabled={isSubmitting}>
                      {t.Send}
                    </button>
                  </div>

                  <div className='contentError'>
                    <div className='errorMessage'>{status}</div>
                  </div>
                </Form>
              )}
            </Formik>

            {showM && (
              <Modal close={() => setShowM(false)}>
                <ImageSvg name='Check' />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>{t['Message sent succesfully']}</div>
              </Modal>
            )}
          </div>
        </section>
      </footer>
    </div>
  )
}

export default Home
