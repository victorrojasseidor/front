import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gif1 from '../../../public/img/video/gif1.gif'
import gif2 from '../../../public/img/video/gif2.gif'
import gif3 from '../../../public/img/video/gif3.gif'
import Link from 'next/link'
import Lang from '@/Components/Atoms/Lang'
import LogoOscuro from '../../../public/img/logoOscuro.webp'
import flujoAri from '../../../public/img/flujoAri.gif'
import ImageSvg from '@/helpers/ImageSVG'
import finance from '../../../public/img/home-finance.webp'
import rrhh from '../../../public/img/home-rrhh.webp'
import support from '../../../public/img/home-support.webp'
import drive from '../../../public/img/testimonials/drive.webp'
import uipath from '../../../public/img/testimonials/uipath.webp'
import sap from '../../../public/img/testimonials/sap.webp'
import microsoftLogo from '../../../public/img/testimonials/Microsoft-Logo.webp'
import awsLogo from '../../../public/img/testimonials/aws-icon.webp'
import card1 from '../../../public/img/card-product/card1.webp'
import card2 from '../../../public/img/card-product/card2.webp'
import card3 from '../../../public/img/card-product/card3.webp'
import card4 from '../../../public/img/card-product/card4.webp'
import card5 from '../../../public/img/card-product/card5.webp'
import card6 from '../../../public/img/card-product/card6.webp'
import card7 from '../../../public/img/card-product/card7.webp'
import card8 from '../../../public/img/card-product/card8.webp'
import mundo from '../../../public/img/mundo.webp'
import asistente from '../../../public/img/asistente.webp'
import telefonoWEB from '../../../public/img/telefono.webp'
import reporting from '../../../public/img/reporting.webp'
import front from '../../../public/img/front.webp'
import SphereCanvas from '@/Components/Grafics/SphereCanvas'
import giftMovil from '../../../public/img/video/giftMovil.gif'
import { useAuth } from '@/Context/DataContext'
import AOS from 'aos' // Importa AOS aquí
import 'aos/dist/aos.css'
import Counter from '@/Components/Atoms/Counter'
import { useRouter } from 'next/router'

const DigitalProfile = ({ title, image, description, relatedItems, demo }) => {
  const { l } = useAuth()
  const t = l.home
  const router = useRouter()

  return (
    <div className='digital-content'>
      <div className='digital-description'>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className='digital-list'>
          <h4>{t.Skills}</h4>
          <ul>
            {relatedItems.map((item, index) => (
              <li key={index} className='digital-item'>
                <ImageSvg name='CheckFill' />

                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {demo && (
          <button
            className='btn_primary small'
            onClick={() => {
              router.push('/product')
            }}
          >
            Demo
          </button>
        )}
      </div>

      <div className='digital-image'>
        <svg xmlns='http://www.w3.org/2000/svg' width='230' height='229' fill='none' viewBox='0 0 230 229'>
          <ellipse cx='114.541' cy='114.5' fill='#C0D8FF' fillOpacity='.2' rx='114.541' ry='114.5' />
          <ellipse cx='114.701' cy='110.51' fill='#C2D9FF' fillOpacity='.3' rx='78.795' ry='78.594' />
          <path fill='#C0D8FF' fillOpacity='.75' d='M169.059 110.112c0 29.525-24.092 53.46-53.811 53.46s-53.81-23.935-53.81-53.46c0-29.525 24.091-53.46 53.81-53.46s53.811 23.935 53.811 53.46Z' />
        </svg>

        <figure>
          <Image src={image} alt={title} />
        </figure>
      </div>
    </div>
  )
}

const Principal = () => {

  const [isGifSectionInView, setIsGifSectionInView] = useState(false)
  const [currentGif, setCurrentGif] = useState(0)
  const gifs = [gif1, gif2, gif3]
  const gifRef = useRef(null)
  const router = useRouter()

  const slides = [
    {
      image: asistente,
      text: 'Texto corto 1'
    },
    {
      image: reporting,
      text: 'Texto corto 2'
    },
    {
      image: front,
      text: 'Texto corto 3'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [slides.length])

  // para cambiar los gifts
  useEffect(() => {
    // Verifica si window está definido antes de agregar el event listener
    if (typeof window !== undefined) {
      const handleScroll = () => {
        if (gifRef.current) {
          const rect = gifRef.current.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight && rect.bottom >= 0
          setIsGifSectionInView(isVisible)
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // Inicializa AOS solo si window está definido
    if (typeof window !== undefined) {
      AOS.init({
        duration: 15000
      })
    }
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isGifSectionInView) {
        setCurrentGif((prevGif) => (prevGif + 1) % gifs.length)
      }
    }, 20000) // Cambia cada 6 segundos

    return () => clearInterval(intervalId)
  }, [isGifSectionInView, gifs.length])

  const { l } = useAuth()
  const t = l.home

  const demoSectionRef = useRef(null)


  const [activeTab, setActiveTab] = useState('finance')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const digitals = [
    {
      title: t['Ari Accounting and Finance'],
      image: finance,
      description: t['The responsibilities of the Administration and Finance Coordinator include bank reconciliation, updating the exchange rate, expense distribution, third-party payments, adjustment entries, support in the financial closing, and declarations to Sunat'],
      relatedItems: [t['Download Bank Statements'], t['Daily Exchange Rate Automation'], t['Download SUNAT tax Status Registers'], t['Download Bank State']]
    },
    {
      title: t['Ari Technology'],
      image: support,
      description: t['The responsibilities of the Technology and Support Coordinator include program installation, server reboots, backups, email and VPN configuration, and account management'],
      relatedItems: [t['Image text extraction Service'], t['Captcha resolution service']]
    },
    {
      title: t['Ari Human Resources'],
      image: rrhh,
      description: t['The responsibilities of the Human Resources Coordinator include onboarding, vacation management, health and wellness benefits, and support in performance reviews'],
      relatedItems: [t['AFP validation']]
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('nav')
      if (window.scrollY > 0) {
        header.classList.add('header-colored')
      } else {
        header.classList.remove('header-colored')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const imagesHome = [
    asistente,
    telefonoWEB
    // Agrega más rutas de imágenes aquí
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesHome.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const quantity = 15

  return (
    <body className='home'> 
      <header className='home-principal'>
        
          <nav>
            <ul className='logoAri' />

            <ul>
              <li className='languajes-box'>
                <Lang />
              </li>

              <li>
                <Link className='li-login' href='/login'>
                  {t.Login}
                </Link>
              </li>

              <li>
                <button className='btn_black' onClick={() => router.push('/register')}>
                  {t['Sign up']}
                </button>
              </li>
            </ul>
          </nav>
        

        <section className='home-principal-front'>
          <div className='welcome'>
            <div className='letter-container'>
              <h1 className='letter text-gradient'>{t['Your new superpower']} </h1>
              <h1 className='letter text-gradient'>{t['ARI Digital Employees']}</h1>
            </div>

            <p>
              {t['ARI Robotic Assistants free your employees from']}
              <span>&nbsp;{t['repetitive tasks']}&nbsp;</span>
              {t['so they can focus on what']}&nbsp;
              {t['really matters']}.
            </p>

            <div className='welcome-actions'>
              <button className='btn_secundary small' onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
                {t['Try free trial']}
              </button>
              <button className='record' onClick={() => demoSectionRef.current.scrollIntoView({ behavior: 'smooth' })}>
                <ImageSvg name='Record' />

                {t['View Demo']}
              </button>
            </div>

            <div className='account'>
              {t["You still don't have an account?"]} <Link href='/register'> {t['Sign up']}</Link>
            </div>
          </div>

          <div data-aos='zoom-in-left' className='image-container'>
            <div className='image-mundo'>

              <SphereCanvas />

              <Image src={mundo} width={500} height={500} alt='ari mundo' loading='eager'   priority  /> 

              
            </div>

            <div className='image-container'>
              {imagesHome.map((image, index) => (
                <Image key={index} src={image} className={`${'image-home'} ${index === currentImageIndex ? 'visible' : 'hidden'}`} alt={`Slide ${index + 1}`} priority />
              ))}
            </div>
          </div>
          <div className='custom-shape-divider-bottom-1719330810'>
            <svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'>
              <path d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z' className='shape-fill' />
            </svg>
          </div>
        </section>
      </header>

      <main className='main-home '>
        <section className='home-why container'>
          <div className='title-why'>
            <h2 className='subtitle'> {t['Why Choose Us']}</h2>
            <p>{t['Automate and optimize your financial management securely and scalably']}</p>
          </div>
          <div className='container-advantages'>
            <div className='box-advantage'>
              <div className='advantage end-direction' data-aos='zoom-out-up'>
                <ImageSvg name='Integration' />

                <h3>{t['Integration and Connectivity']}</h3>

                <p className='advantage-description'>{t['Connection with multiple data sources (Bank accounts, SUNAT, SBS, among others) and integration with different ERPs']}</p>
              </div>
              <div className='advantage end-direction' data-aos='zoom-out-up'>
                <ImageSvg name='Security' />
                <h3>{t['Security and Control']}</h3>

                <p className='advantage-description'>

                  {t['Advanced security, encrypted passwords, secure access management, exclusive database per client, segregated roles and functions']}
                </p>
              </div>
            </div>

            <Image className='gift-advantage' src={giftMovil} alt='giftMoil' width={320} height={320} loading='eager' />
            <div className='box-advantage' data-aos='zoom-out-down'>
              <div className='advantage'>
                <ImageSvg name='Efficiency' />
                <h3>{t['Efficiency and Productivity']}</h3>

                <p className='advantage-description'>{t['24/7 operation, error reduction, business agility, and cost savings. Lower TCO compared to traditional RPA projects']}</p>
              </div>
              <div className='advantage' data-aos='zoom-out-down'>
                <ImageSvg name='Adaptability' />
                <h3>{t['Adaptability and Growth']}</h3>

                <p className='advantage-description'>{t['Adaptable solution with quick configuration and homologated processes with extensive industry knowledge']}</p>
              </div>
            </div>
          </div>
          <section className='home-account '>
            <ul className='box-account'>
              <li>
                <h2>{isGifSectionInView ? <Counter initialValue={0} finalValue={5} /> : 5}</h2>

                <p>{t['Digital Employees Automating Your Services']}</p>
              </li>

              <li>
                <h2>{isGifSectionInView ? <Counter initialValue={8} finalValue={20} /> : 20}</h2>

                <p>{t['Included Skills to Digital Employees']}</p>
              </li>

              <li>
                <h2>{isGifSectionInView ? <Counter initialValue={70} finalValue={78} /> : 78} %</h2>

                <p>{t['business agility']}</p>
              </li>
            </ul>
          </section>
        </section>

        <section ref={gifRef} className='home-how  background-colored' data-aos='fade-up-right'>
          <div className='home-how-description'>
            <div className='discover'>
              <div className='title-how'>
                <span >Discover our automation process</span>
                <h2 className='subtitle'> {t['How do we do it?']}</h2>
              </div>

              <p> {t['Ari executes her automation activities in 3 steps']}: </p>
            </div>
            <div className='home-how-steps'>


              <div className='steps-container'>
                <div className={`step ${currentGif === 0 ? 'active' : ''}`}>
                  <div className='box-circle'>
                    <button aria-label='Step 1: Customize your process' onClick={() => setCurrentGif(0)}>
                      <ImageSvg name='Admin' />
                    </button>
                    <span>1</span>
                  </div>
                  <button className='process' aria-label='Step 1' onClick={() => setCurrentGif(0)}>
                    <div className='text'>
                      <h3>{t['Customize your process']}</h3>
                      <p>{t['Access the Ari.app application easily and securely, configure your digital employees']}</p>
                    </div>
                  </button>
                </div>

                <div className={`step ${currentGif === 1 ? 'active' : ''} step-second`}>
                  <div className='box-circle'>
                    <button aria-label='Step 2: Automated process' onClick={() => setCurrentGif(1)}>
                      <ImageSvg name='Account' />
                    </button>
                    <span>2</span>
                  </div>
                  <button className='process' aria-label='Step 2' onClick={() => setCurrentGif(1)}>
                    <div className='text'>
                      <h3>{t['Automated process']}</h3>
                      <p>{t['This employee processes the information, manages it, and performs all tasks automatically every day according to the schedule you have set']}</p>
                    </div>
                  </button>
                </div>

                <div className={`step ${currentGif === 2 ? 'active' : ''}`}>
                  <div className='box-circle'>
                    <button aria-label='Step 3: Work delivered' onClick={() => setCurrentGif(2)}>
                      <ImageSvg name='BarChart' />
                    </button>
                    <span>3</span>
                  </div>
                  <button className='process' aria-label='Step 3' onClick={() => setCurrentGif(2)}>
                    <div className='text'>
                      <h3>{t['Work delivered']}</h3>
                      <p>{t['Consolidated information provided through management dashboards, so you always have your information visible and easy to process']}</p>
                    </div>
                  </button>
                </div>
              </div>


            </div>

          </div>

          <figure className='home-how-steps-gift' ref={demoSectionRef}>
            <Image src={gifs[currentGif]} alt={`gif${currentGif + 1}`} loading='eager' />
          </figure>

        </section>

        <section className='home-gift '>
          <Image src={flujoAri} width={500} height={500} alt='ari flujo' loading='eager' />

          <div className='description-gift' data-aos='fade-left'>
            <h2 className='subtitle'> {t['Connect financial data and understand behavior']}</h2>

            <p>
              {t['ARI is the software-based workforce powered by']} <span> {t['artificial intelligence']} </span> , {t['that autonomously executes end-to-end work processes using a diverse set of skills']}
            </p>
          </div>

          <div className='sombra'>
            <ImageSvg name='SombraHome' />
          </div>
        </section>

        <section className='home-process container' data-aos='fade-up-right'>
          <div className='title'>
            <p className='text-blue'>Discover our automation process</p>
            <h2 className='subtitle' style={{ textAlign: 'left' }}>
              Digital employees
            </h2>
          </div>

          <div className='ari-tabs-container'>
            <div className='ari-tabs-menu'>
              <div className={`ari-tab-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => handleTabClick('finance')}>
                Ari Finance
              </div>
              <div className={`ari-tab-item ${activeTab === 'it-support' ? 'active' : ''}`} onClick={() => handleTabClick('it-support')}>
                Ari IT Support
              </div>
              <div className={`ari-tab-item ${activeTab === 'hr' ? 'active' : ''}`} onClick={() => handleTabClick('hr')}>
                Ari HR
              </div>
            </div>
            <div className='ari-tabs-content'>
              <div className={`ari-tab-content ${activeTab === 'finance' ? 'active' : ''}`}>
                <div className='row-order'>
                  <DigitalProfile title={digitals[0].title} demo image={digitals[0].image} description={digitals[0].description} relatedItems={digitals[0].relatedItems} />

                  <DigitalProfile title={digitals[1].title} image={digitals[1].image} description={digitals[1].description} relatedItems={digitals[1].relatedItems} />
                </div>
              </div>
              <div className={`ari-tab-content ${activeTab === 'it-support' ? 'active' : ''}`}>
                <div className='row-order'>
                  <DigitalProfile title={digitals[1].title} demo image={digitals[1].image} description={digitals[1].description} relatedItems={digitals[1].relatedItems} />
                  <DigitalProfile title={digitals[2].title} image={digitals[2].image} description={digitals[2].description} relatedItems={digitals[2].relatedItems} />
                </div>
              </div>
              <div className={`ari-tab-content ${activeTab === 'hr' ? 'active' : ''}`}>
                <div className='row-order'>
                  <DigitalProfile title={digitals[2].title} demo image={digitals[2].image} description={digitals[2].description} relatedItems={digitals[2].relatedItems} />
                  <DigitalProfile title={digitals[0].title} image={digitals[0].image} description={digitals[0].description} relatedItems={digitals[0].relatedItems} />
                </div>
              </div>
            </div>
            <div className='sombra'>
              <ImageSvg name='SombraHome' />
            </div>
          </div>
        </section>

        <section className='home-enables container' data-aos='flip-right'>
          <h2 className='subtitle'> Tech Stack </h2>

          <div className='box-enables' data-aos='zoom-in'>
            <button>
              <Image src={uipath} width='1000' alt='uipath' loading='eager' />
            </button>

            <button>
              <Image src={awsLogo} width='1000' alt='awsLogo' loading='eager' />
            </button>

            <button>
              <Image src={sap} width='1000' alt='sap' loading='eager' />
            </button>


            <button>
              <Image src={microsoftLogo} width='1000' alt='cloud' loading='eager' />
            </button>

            <button>
              <Image src={drive} width='1000' alt='drive' loading='eager' />
            </button>




          </div>
        </section>
      </main>

      <footer>
        <section className='home-contact'>
          {Array.from({ length: quantity }).map((_, i) => (
            <div key={i} className='firefly' />
          ))}
          <div className='slider'>
            <div className='slide-track'>
              <div className='slide'>
                <Image src={finance} width='1000' alt='logo_oscuro' loading='eager' />
              </div>
              <div className='slide'>
                <Image src={card1} width='400' alt='logo_oscuro' loading='eager' />
              </div>

              <div className='slide'>
                <Image src={card2} width='400' alt='logo_oscuro' loading='eager' />
              </div>
              <div className='slide'>
                <Image src={card3} width='400' alt='logo_oscuro' loading='eager' />
              </div>
              <div className='slide'>
                <Image src={card4} width='400' alt='logo_oscuro' loading='eager' />
              </div>

              <div className='slide'>
                <Image src={card5} width='1000' alt='logo_oscuro' loading='eager' />
              </div>

              <div className='slide'>
                <Image src={support} width='1000' alt='logo_oscuro' loading='eager' />
              </div>

              <div className='slide'>
                <Image src={card6} width='1000' alt='logo_oscuro' loading='eager' />
              </div>

              <div className='slide'>
                <Image src={card7} width='400' alt='logo_oscuro' loading='eager' />
              </div>

              <div className='slide'>
                <Image src={rrhh} width='1000' alt='logo_oscuro' loading='eager' />
              </div>

              <div className='slide'>
                <Image src={card8} width='400' alt='logo_oscuro' loading='eager' />
              </div>

              <div className='slide'>
                <Image src={finance} width='1000' alt='logo_oscuro' loading='eager' />
              </div>
            </div>
          </div>

          <div className='contact-message'>
            <h2 className=''> {t['Contact us']}</h2>

            <p style={{ marginBottom: '1rem' }}>{t['Find out which AUTOMATION SOLUTIONS can help you']}</p>

            <button className='btn_black' onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
              {t.Contact}
            </button>
          </div>

        </section>

        <section className='home-social '>
          <div className='home-social-info'>
            <div className='logo-footer'>
              <Image src={LogoOscuro} width={100} height={100} alt='logo' loading='eager' />

              {/* <p>{t['Terms and Conditions']}</p> */}

              <p>
                <ImageSvg name='Location' /> Vittore Carpaccio 250, San Borja, Lima , Perú
              </p>
            </div>

            <div className='social-media'>
              <h3>{t['Follow us!']}</h3>
              <div className='follow'>
                <button
                  onClick={() => router.push('https://www.youtube.com/channel/UC1mpIQbKvI37sLlDsxmcyeA')}
                  className='btn_circle'
                  aria-label='Follow us on YouTube'
                >
                  <ImageSvg name='Youtube' />
                </button>

                <button
                  onClick={() => router.push('https://www.linkedin.com/company/seidorperu/?originalSubdomain=pe')}
                  className='btn_circle'
                  aria-label='Follow us on LinkedIn'
                >
                  <ImageSvg name='Linkedin' />
                </button>

                <button
                  onClick={() => router.push('https://www.instagram.com/seidorperu/')}
                  className='btn_circle'
                  aria-label='Follow us on Instagram'
                >
                  <ImageSvg name='Instagram' />
                </button>
              </div>

            </div>
          </div>

          <div className='home-social-copy'>
            <p>Copyright © 2024 ARI Digital Employees</p>
          </div>
        </section>
      </footer>
      </body>
  )
}

export default Principal
