import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import user1 from '../../../public/img/testimonials/user1.png'
import user2 from '../../../public/img/testimonials/user2.png'
import user3 from '../../../public/img/testimonials/user3.png'
import user4 from '../../../public/img/testimonials/user4.png'
import user5 from '../../../public/img/testimonials/user5.png'
import gif1 from '../../../public/img/video/gif1.gif'
import gif2 from '../../../public/img/video/gif2.gif'
import gif3 from '../../../public/img/video/gif3.gif'
import Link from 'next/link'
import Lang from '@/Components/Atoms/Lang'
import LogoOscuro from '../../../public/img/logoOscuro.png'
import logoGift from '../../../public/img/logoGift.gif'
import iphones from '../../../public/img/iphones.png'
import ImageSvg from '@/helpers/ImageSVG'
import finance from '../../../public/img/home-finance.png'
import rrhh from '../../../public/img/home-rrhh.png'
import support from '../../../public/img/home-support.png'
import cloud from '../../../public/img/testimonials/cloud.png'
import drive from '../../../public/img/testimonials/drive.png'
import uipath from '../../../public/img/testimonials/uipath.png'
import sap from '../../../public/img/testimonials/sap.png'
import ftp from '../../../public/img/testimonials/ftp.png'
import card1 from '../../../public/img/card-product/card1.png'
import card2 from '../../../public/img/card-product/card2.png'
import card3 from '../../../public/img/card-product/card3.png'
import card4 from '../../../public/img/card-product/card4.png'
import card5 from '../../../public/img/card-product/card5.png'
import card6 from '../../../public/img/card-product/card6.png'
import card7 from '../../../public/img/card-product/card7.png'
import card8 from '../../../public/img/card-product/card8.png'
import linea from '../../../public/img/linea.png'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { validateFormRegister } from '@/helpers/validateForms'
import { useAuth } from '@/Context/DataContext'
import Modal from '@/Components/Modal'
import { motion, useAnimation } from 'framer-motion'
import AOS from 'aos' // Importa AOS aquí
import 'aos/dist/aos.css'
import Counter from '@/Components/Atoms/Counter'
import { useRouter } from 'next/router'

const Home = () => {
  const [selectImage, setSelectImage] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [message, setMessage] = useState(null)
  const [showM, setShowM] = useState(false)
  const [isGifSectionInView, setIsGifSectionInView] = useState(false)
  const [currentGif, setCurrentGif] = useState(0)
  const gifs = [gif1, gif2, gif3]
  const gifRef = useRef(null)
  const router = useRouter()

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
        duration: 1000
      })
    }
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isGifSectionInView) {
        setCurrentGif((prevGif) => (prevGif + 1) % gifs.length)
      }
    }, 17000) // Cambia cada 6 segundos

    return () => clearInterval(intervalId)
  }, [isGifSectionInView, gifs.length])

  const { l } = useAuth()
  const t = l.home

  const demoSectionRef = useRef(null)

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

  return (
    <div className='home'>
      <header>
        <nav>
          <ul>
            <div className='logo' data-aos='zoom-in'>
              <Image src={LogoOscuro} width='500' alt='logoOscuro' priority />
            </div>
          </ul>

          <ul>
            <div className='languajes-box'>
              <Lang />
            </div>

            <li>
              <Link href='/login'>{t.Login}</Link>
            </li>

            <li>
              <button className='btn_black' onClick={() => router.push('/register')}>
                {t['Sign up']}
              </button>
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
              <button className='btn_secundary small' onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
                {' '}
                {t['Try free trial']}{' '}
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
            {' '}
          </div>
        </section>

        <section className='home-client'>
          <div>
            <h1 className='subtitle' style={{ textAlign: 'right' }}>
              {' '}
              {t['What our client think about us?']}{' '}
            </h1>
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

        <section ref={gifRef} className='home-how container'>
          <div className='home-how-description'>
            <div className='discover'>
              <div className='title-how'>
                <p className='text-blue'>Discover our automation process</p>
                <h1 className='subtitle'> {t['How do we do it?']}</h1>
              </div>

              <p>{t['ARI is software-based labor leveraging artificial intelligence, including machine learning, to autonomously execute tasks within complex end-to-end processes']}</p>
            </div>
            <figure className='steps-gift' ref={demoSectionRef}>
              <Image src={gifs[currentGif]} alt={`gif${currentGif + 1}`} />
            </figure>
          </div>

          <div className='home-how-steps'>
            <div className='steps-container'>
              <div className={`step ${currentGif === 0 ? 'active' : ''}`}>
                <div className='box-circle'>
                  <button className='circle' onClick={() => setCurrentGif(0)}>
                    <ImageSvg name='Admin' />
                  </button>
                  <span>1</span>
                </div>

                <button className='process' onClick={() => setCurrentGif(0)}>
                  <div className='text'>
                    <h3> {t['Customize your process']}</h3>
                    <p>{t['Access the Ari.app application easily and securely, configure your digital employees']}</p>
                  </div>
                </button>
              </div>

              <div className={`step ${currentGif === 1 ? 'active' : ''} step-second `}>
                <div className='box-circle'>
                  <button className='circle' onClick={() => setCurrentGif(1)}>
                    <ImageSvg name='Account' />
                  </button>
                  <span>2</span>
                </div>

                <button className='process' onClick={() => setCurrentGif(1)}>
                  <div className='text'>
                    <h3> {t['Automated process']} </h3>
                    <p>{t['This employee processes the information, manages it, and performs all tasks automatically every day according to the schedule you have set']}</p>
                  </div>
                </button>
              </div>

              <div className={` step ${currentGif === 2 ? 'active' : ''}   `}>
                <div className='box-circle'>
                  <button className='circle' onClick={() => setCurrentGif(2)}>
                    <ImageSvg name='BarChart' />
                  </button>
                  <span>3</span>
                </div>

                <button className='process' onClick={() => setCurrentGif(2)}>
                  <div className='text'>
                    <h3> {t['Work delivered']} </h3>
                    <p>{t['After processing the information, the digital employee provides you with reports, charts, etc., so that your information is ready']}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className='home-account container'>
          <ul className='box-account' data-aos='zoom-in'>
            <li>
              <h1>{isGifSectionInView ? <Counter initialValue={0} finalValue={5} /> : 5}</h1>

              <p>{t['Digital Employees Automating Your Services']}</p>
            </li>

            <li>
              <h1>{isGifSectionInView ? <Counter initialValue={8} finalValue={20} /> : 20}</h1>

              <p>{t['Included Skills to Digital Employees']}</p>
            </li>

            <li>
              <h1>{isGifSectionInView ? <Counter initialValue={70} finalValue={78} /> : 78} %</h1>

              <p>{t['business agility']}</p>
            </li>
          </ul>
        </section>

        <section className='home-digitals  container '>
          <div className='description'>
            <h1> {t['Ari finance']}</h1>

            <p> {t['The technology and support coordinator facilitates platform and operation processes, including purchasing and installing software, server reboot, backup, and email configuration. They also handle VPN setup, printer configuration, password reset, and account termination for departures']}</p>
          </div>

          <div data-aos='fade-up' className='digital-image'>
            <Image src={finance} width='1000' alt='finance' priority />
          </div>
        </section>

        <section className='home-digitals container hr'>
          <div data-aos='zoom-out-left' className='digital-image'>
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

          <div data-aos='fade-up' data-aos-anchor-placement='bottom-bottom' className='digital-image'>
            <Image src={support} width='1000' alt='finance' priority />
          </div>
        </section>

        <section className='home-enables container'>
          <h1> {t['Our enablers']}</h1>

          <div className='box-enables' data-aos='zoom-in'>
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

      <section className='home-contact ' data-aos='fade-up'>
        <div className='contact-message'>
          <h1 className='subtitle'> {t['Contact us']}</h1>

          <p>{t['Find out which AUTOMATION SOLUTIONS can help you']}</p>

          <button className='btn_black' onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
            {t.Contact}
          </button>
        </div>

        <div className='slider' data-aos='zoom-in-up'>
          <div className='slide-track'>
            <div className='slide'>
              <Image src={finance} width='1000' alt='logo_oscuro' />
            </div>
            <div className='slide'>
              <Image src={card1} width='400' alt='logo_oscuro' />
            </div>

            <div className='slide'>
              <Image src={card2} width='400' alt='logo_oscuro' />
            </div>
            <div className='slide'>
              <Image src={card3} width='400' alt='logo_oscuro' />
            </div>
            <div className='slide'>
              <Image src={card4} width='400' alt='logo_oscuro' />
            </div>


           


            <div className='slide'>
              <Image src={card5} width='1000' alt='logo_oscuro' />
            </div>


            <div className='slide'>
              <Image src={support} width='1000' alt='logo_oscuro' />
            </div>

            <div className='slide'>
              <Image src={card6} width='1000' alt='logo_oscuro' priority />
            </div>

            <div className='slide'>
              <Image src={card7} width='400' alt='logo_oscuro' />
            </div>


            <div className='slide'>
              <Image src={rrhh} width='1000' alt='logo_oscuro' />
            </div>


            <div className='slide'>
              <Image src={card8} width='400' alt='logo_oscuro' />
            </div>

            <div className='slide'>
              <Image src={finance} width='1000' alt='logo_oscuro' />
            </div>
           
          </div>
        </div>
      </section>

      <footer>
        <section className='home-social container'>
          <div className='home-social-info'>
            <div className='logo'>
              <Image src={logoGift} width='100' alt='logo' priority />

              <p>{t['Terms and Conditions']}</p>
              <p>Vittore Carpaccio 250, San Borja, Lima , Perú</p>
            </div>

            <div className='social-media'>
              <h4>{t['Follow us!']}</h4>

              <div className='follow'>
                <button onClick={() => router.push('https://www.youtube.com/channel/UCY6CjtB2fq-UlHYzDa5A_Ug/videos?view=0&sort=da')} className='btn_circle social_green'>
                  <ImageSvg name='Youtube' />
                </button>

                <button onClick={() => router.push('https://www.linkedin.com/company/innovativa-la/')} className='btn_circle social_green'>
                  <ImageSvg name='Linkedin' />
                </button>

                <button onClick={() => router.push('https://www.instagram.com/innovativa.la/')} className='btn_circle social_green'>
                  <ImageSvg name='Instagram' />
                </button>
              </div>
            </div>
          </div>

          <div className='home-social-copy'>
            <p>Copyright © 2024 Innovativa lab</p>
          </div>
        </section>
      </footer>
    </div>
  )
}

export default Home
