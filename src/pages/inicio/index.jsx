import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lang from '@/Components/Atoms/Lang';
import LogoOscuro from '../../../public/img/logoOscuro.webp';
import logo from '../../../public/img/logoGift.gif';
import front from '../../../public/img/front.svg';
import ImageSvg from '@/helpers/ImageSVG';
import Counter from '@/Components/Atoms/Counter';
import { useRouter } from 'next/router';
import { useAuth } from '@/Context/DataContext';
import ButtonGradient from '@/Components/Atoms/ButtonGradient';
import flujoAri from '../../../public/img/flujoAri.gif';
import simple from '../../../public/img/simple.svg';
import conci from '../../../public/img/card-product/conci.svg';
import imgconci from '../../../public/img/card-product/imgconci.svg';
import estado from '../../../public/img/card-product/estado.svg';
// import imgestado from '../../../public/img/card-product/imgestado.svg';
import tipo from '../../../public/img/card-product/tipo.svg';
import imgtipo from '../../../public/img/card-product/imgtipo.svg';
import cap from '../../../public/img/card-product/cap.svg';
import imgcap from '../../../public/img/card-product/imgcap.svg';
import padro from '../../../public/img/card-product/padro.svg';
import imgpadro from '../../../public/img/card-product/imgpadro.svg';
import detra from '../../../public/img/card-product/detra.svg';
// import imgdetra from '../../../public/img/card-product/imgdetra.svg';
import vali from '../../../public/img/card-product/vali.svg';
// import imgvali from '../../../public/img/card-product/imgvali.svg';
import factu from '../../../public/img/card-product/factu.svg';
import imgfactu from '../../../public/img/card-product/imgfactu.svg';

import post1 from '../../../public/img/post/post1.svg';
import post2 from '../../../public/img/post/post2.svg';
import post3 from '../../../public/img/post/post3.svg';
import post4 from '../../../public/img/post/post4.svg';
import post5 from '../../../public/img/post/post5.svg';
import post6 from '../../../public/img/post/post6.svg';
import adama from '../../../public/img/logos/adama.webp';
import adeco from '../../../public/img/logos/adeco.webp';
import agrokasa from '../../../public/img/logos/agrokasa.webp';
import anglo from '../../../public/img/logos/anglo.webp';
import auna from '../../../public/img/logos/auna.webp';
import pacasmayo from '../../../public/img/logos/pacasmayo.webp';
import unacen from '../../../public/img/logos/unacen.webp';
import LayoutHome from '@/Components/LayoutHome';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

const SkillsCard = ({ cardSkills, setIsImageInView, setskillView }) => {
  return (
    <>
      {cardSkills.map((prod, index) => {
        // const [isImageInView, setIsImageInView] = useState(false);
        const imageRef = useRef(null);

        useEffect(() => {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setIsImageInView(true);
                  setskillView(prod);

                  // console.log(`Imagen en vista: ${prod.title}`);
                } else {
                  setIsImageInView(false);
                  // console.log(`Imagen fuera de vista: ${prod.title}`);
                }
              });
            },
            { threshold: 0.1 } // Ajusta el umbral según sea necesario
          );

          if (imageRef.current) {
            observer.observe(imageRef.current);
          }

          return () => {
            if (imageRef.current) {
              observer.unobserve(imageRef.current);
            }
          };
        }, [prod.title]); // Añadido prod.title como dependencia

        return (
          <div className="process" key={index} ref={imageRef}>
            <div className="process-description">
              <h3 className="gradient">
                <span>{prod.type}</span>
                {prod.title}
              </h3>
              <p>{prod.description}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};



export default function index({blogs}) {
  const { l } = useAuth();
  const t = l.home;
  const router = useRouter();


  const [isCounterSectionInView, setIsCounterSectionInView] = useState(false);
  const [isImageInView, setIsImageInView] = useState(false);
  const [skillView, setskillView] = useState(null);
 

  async function getDatastrapi() {
    // Hacemos la petición a la API de Strapi
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/blogs?populate=*`);
    const data = await res.json();
      console.log("data", data);
  
    if (!data || !data.data) {
      return {
        notFound: true, // Si no hay datos, mostramos una página 404
      };
    }
  
    const blogs = data.data; // Aquí están los datos de los blogs
    
    return blogs;
  }
  


  // Animaciones AOS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({
        offset: -2, // Inicia la animación inmediatamente cuando la sección está visible
        duration: 500, // Duración de las animaciones
        // once: true, // Evitar que las animaciones se repitan
        // easing: 'ease-out', // Añadir un suavizado en la animación
      });
    }
  }, []);

  // Referencia a la sección del contador
  const counterSectionRef = useRef(null);

  // Función para observar si la sección del contador está en vista
  useEffect(() => {
    getDatastrapi();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCounterSectionInView(true);
          } else {
            setIsCounterSectionInView(false);
          }
        });
      },
      { threshold: 0.001 } // Disparar la animación cuando el 10% de la sección sea visible
    );

    const currentRef = counterSectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup al desmontar el componente
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);


  const cardAdventage = [
    {
      title: t['Advanced Information Extraction'],
      icon: 'Extraction',
      description: t['Integrates over 25 sources into a single platform, allowing your team to automate their reconciliation processes quickly.'],
    },
    {
      title: t['Auditable, Traceable, and Secure'],
      icon: 'Security',
      description: t['Segregation of duties, data encryption, and modification logs ensure compliance with high standards.'],
    },
    {
      title: t['Direct ERP Integration'],
      icon: 'Integration',
      description: t['Reduces manual work and improves accuracy, ensuring financial data is updated in real-time.'],
    },
    {
      title: t['Consolidated Information Reports and Dashboards'],
      icon: 'BarChart',
      description: t['Provides an interactive and customizable view of metrics for efficient monitoring and detailed analysis.'],
    },
    {
      title: t['Control Notifications and Alarms'],
      icon: 'Notification',
      description: t['Quickly notifies users about inconsistencies, ensuring timely resolution of issues.'],
    },
    {
      title: t['New! Coming Soon. Human Avatar'],
      icon: 'Avatar',
      description: t['Soon a digital Avatar will be able to interact with you to provide information about your business processes.'],
    },
  ];

  const cardSkills = [
    {
      title: t['Daily Bank Reconciliation'],
      type: t['Banks'],
      imageone: conci,
      imagetwo: imgconci,
      description: t['Downloads bank statements from financial institutions daily (e.g. BCP, BBVA, Interbank, Caja Huancayo, BCP Miami, Pichincha, Banco de la Nación, among many others), consolidating information to obtain a daily cash position, stores files in folders, and exposes or uploads to ERP for job compensation (match) of bank entries.'],
    },
    {
      title: t['Account Statement Download'],
      type: t['Banks'],
      imageone: estado,
      imagetwo: imgconci,
      description: t['Downloads account statements monthly (e.g. BCP, BBVA, Interbank, Banco de la Nación, Pichincha, Caja Huancayo, BCP Miami, among many others), renames the document, and creates an organized folder structure for safe information repository.'],
    },
    {
      title: t['Daily Exchange Rate Update'],
      type: t['FOREIGN EXCHANGE MARKET'],
      imageone: tipo,
      imagetwo: imgtipo,
      description: t['Extracts exchange rate information daily from SBS for different currencies, consolidates the information for historical view and fluctuations, and then uploads it to ERP via job to update buying, selling, and closing exchange rates. The process can be scheduled between 6 PM to 11:59 PM or a convenient time for you.'],
    },
    {
      title: t['AI Captcha Solver'],
      type: t['Artificial Intelligence'],
      imageone: cap,
      imagetwo: imgcap,
      description: t['Uses this service daily to solve captchas on any website. Can solve simple, complex, reCAPTCHA V1, and reCAPTCHA V2. Includes 30,000 connections for automation use. The types of captchas have equivalencies in connections. This component is crucial for automating your processes.'],
    },
    {
      title: t['Update SUNAT Registries'],
      type: 'SUNAT',
      imageone: padro,
      imagetwo: imgpadro,
      description: t['Reviews and downloads SUNAT registries daily, such as good taxpayers, withholding agents, perception agents, absent, not found, among others. The update date will be visible in the application. Then uploads to SAP ERP via job to update the status of Business Partners (Creditors) and update open entries.'],
    },
    {
      title: t['Download Detraction Receipts'],
      type: 'SUNAT',
      imageone: detra,
      imagetwo: imgpadro,
      description: t['Accesses SUNAT Online Operations (SOL) daily to download the report of deductions made, obtaining the deduction receipt number, date, and other important data. This file is consolidated, renamed, and stored in a secure information repository in a structured manner.'],
    },
    {
      title: t['Validation of Suppliers (Creditors)'],
      type: 'SUNAT',
      imageone: vali,
      imagetwo: imgpadro,
      description: t['Daily takes the XML of payment receipts issued by your suppliers and performs online validation of the document’s authenticity, also validating whether it is a withholding agent, good taxpayer, if it is present or not, among other data, finally leaving a validation log and stored securely and structured in a folder.'],
    },
    {
      title: t['Download Public Utility Invoices'],
      type: t['Public Utilities'],
      imageone: factu,
      imagetwo: imgfactu,
      description: t['Downloads invoices for public utilities daily, such as water, electricity, and telephone from various service operators, then consolidates, renames, and stores them in a secure information repository in a structured manner.'],
    },
  ];

  const cardInsights = [
    {
      title: t['Generative AI Strengthens Financial Back Office'],
      author: t['Menagen Muriagui'],
      date: t['June 28, 2018'],
      image: post1,
      type: t['Financial Services'],
      description: t['Our AI automates financial processes, optimizing management and reducing time in back office tasks'],
      link: '/insights/post-generative-ai',
    },
    {
      title: t['New Digital Agents are a Trend'],
      author: t['Jorge Pérez'],
      date: t['September 10, 2020'],
      image: post2,
      type: t['Innovation'],
      description: t['Digital agents enhance efficiency in financial transactions, offering quick and personalized solutions for your accounting needs'],
      link: '/insights/post-digital-agents',
    },
    {
      title: t['How to Apply AI in Finance, Accounting, and Taxes'],
      author: t['Claudia Martín'],
      date: t['March 15, 2021'],
      image: post3,
      type: t['Technologies'],
      description: t['Automate financial management with AI to increase accuracy and simplify complex tasks in accounting and taxes'],
      link: '/insights/post-apply-ai-finance',
    },
    {
      title: t['Automation in Risk Analysis with AI'],
      author: t['Laura Gómez'],
      date: t['July 22, 2022'],
      image: post4,
      type: t['AI & Automation'],
      description: t['Risk analysis becomes more efficient by automating key processes, reducing human error margins.'],
      link: '/insights/post-automation-risk-analysis',
    },
    {
      title: t['AI and the Future of Customer Service'],
      author: t['Carlos Fernández'],
      date: t['August 30, 2023'],
      image: post5,
      type: t['Customer Service'],
      description: t['AI-powered virtual agents improve customer experience by providing quick and accurate responses to common inquiries.'],
      link: '/insights/post-ai-customer-service',
    },
    {
      title: t['Blockchain and AI: An Alliance for Financial Security'],
      author: t['Ana Rodríguez'],
      date: t['November 5, 2023'],
      image: post6,
      type: t['AI & Automation'],
      description: t['The combination of blockchain and AI is redefining security in the financial sector, improving transparency and data protection.'],
      link: '/insights/post-blockchain-ai-security',
    },
  ];

  const logoClient = [adama, adeco, agrokasa, anglo, auna, pacasmayo, unacen];

  return (

    <LayoutHome >
   
      <section className="home-front" id="front">
        <div className="welcome">
          <div className="welcome-letter">
            <h1 className="letter-transition gradient">
              {t['Your new']}
              <span> {t['superpower']}</span>
            </h1>
            <h1 className="letter-transition gradient">
              {t['Assistants']}
              <span> {t['digital ARI']} </span>
            </h1>
          </div>

          <p className="text-description">{t['ARI Digital Employees automates repetitive tasks with artificial intelligence, freeing finance teams to focus on strategic and high-value activities. Optimize your processes, reduce costs and transform your business with our solution']}</p>
        </div>

        <button className="record" onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
          <ImageSvg name="Record" />
          {t['View free demo']}
        </button>

        <div className="image-dashboard" data-aos="fade-down">
          <Image src={front} width={1000} height={1000} alt="dashboard" />
        </div>

        <section className="home-counter" ref={counterSectionRef} data-aos="fade-up">
          <ul className="box-counter">
            <li className="">
              <span>{isCounterSectionInView ? <Counter initialValue={0} finalValue={5} /> : 5}</span>
              <p>{t['Digital Employees Automating Your Services']}</p>
            </li>
            <li className="">
              <span>{isCounterSectionInView ? <Counter initialValue={8} finalValue={20} /> : 20}</span>
              <p>{t['Included Skills for Digital Employees']}</p>
            </li>
            <li className="">
              <span>{isCounterSectionInView ? <Counter initialValue={70} finalValue={78} /> : 78} % </span>
              <p>{t['business agility']}</p>
            </li>
          </ul>
        </section>
      </section>

      <section className="home-flow" id="flow">
        <ButtonGradient classButt="whiteButton">{t['WHY CHOOSE US']}</ButtonGradient>

        <div className="title-home blacktext" data-aos="zoom-in">
          <h2 className="title gradient">
            {t['Ari']} <span> {t['Connects financial']} </span> {t['data and understands behavior']}
          </h2>

          <p className="">{t['ARI is the software-based workforce powered by artificial intelligence that autonomously executes end-to-end workflows using a diverse set of skills.']}</p>
        </div>

        <div className="box-flow" data-aos="zoom-in-up">
          <Image src={flujoAri} width={500} height={500} alt="ari-flow" loading="eager" unoptimized={true} />
        </div>
      </section>

      <section className="home-skills" id="skills">
        <button className="record">
          <ImageSvg name="Avatar" />
          Digital Employees as a Service
        </button>
        <div className="title-home " data-aos="zoom-in">
          <h2 className="title gradient">
            {t['Empower your operations with our']} +8
            <span> {t['advanced skills']} </span>
            {t['of ARI Digital Employees']}
          </h2>

          <p className="">{t['The advanced skills of ARI are automated tasks performed by our Digital Employees that simplify operational processes in areas such as finance, sales, human resources, and technology. These advanced skills allow users to adapt ARI to their business processes, improving efficiency and freeing up time to focus on strategic activities.']}</p>
        </div>

        <ButtonGradient>{t['Skills']}</ButtonGradient>

        <div className="container-process">
          <div className="box-process">
            <SkillsCard cardSkills={cardSkills} setskillView={setskillView} setIsImageInView={setIsImageInView} />
          </div>

          <article className="box-images">
            <figure>
              <Image className="image-one" src={skillView?.imageone} width={200} height={200} alt="example" />
              <Image className={`image-two ${isImageInView ? 'in-view' : 'out-of-view'}`} src={skillView?.imagetwo} width={200} height={200} alt="example" />
            </figure>
          </article>
        </div>
      </section>

      <section className="home-advantages" id="advantages">
        <ButtonGradient classButt="whiteButton">{t['FEATURES']}</ButtonGradient>

        <div className="title-home blacktext" data-aos="zoom-in">
          <h2 className="title gradient">
            {t['Discover the']} <span> {t['potential']} </span> {t['of ARI Digital Employees']}
          </h2>

          <p>{t['Easy to use, quick to implement, and versatile to automate your business processes.']}</p>
        </div>

        <div className="box-advantage" data-aos="fade-up">
          {cardAdventage.map((card, index) => (
            <article key={index} className="advantage">
              <ImageSvg name={card.icon} />
              <h3>{card.title}</h3>
              <p className="advantage-description">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-simple">
        <figure data-aos="fade-right">
          <Image src={simple} width={500} height={500} alt="img-simple" />
        </figure>

        <div className="simple-box">
          <div className="title-home blacktext" data-aos="zoom-in">
            <h2 className="title gradient">
              {t['Set up your digital assistants with AI in']} <span> {t['simple steps']} </span>
            </h2>

            <p>{t['Digital technologies, automation, and advanced artificial intelligence provide a great customer experience at an accessible price.']}</p>

            <ButtonGradient classButt="whiteButton" onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
              {t['REQUEST DEMO']}
            </ButtonGradient>

            <div className="simples-skills">
              <span>{t['FINANCE AND ACCOUNTING']}</span>
              <span>{t['HUMAN RESOURCES']}</span>
              <span>{t['TECHNOLOGY']}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-insigths" id="insights">
        <div className="title-home" data-aos="fade-up">
          <ButtonGradient>{t['INSIGHTS']}</ButtonGradient>

          <p className="">{t['Expert analysis, bold thinking, and data gathering for leaders who want to achieve the extraordinary.']}</p>
        </div>

        <div className="box-insigths">
          {cardInsights.map((card, index) => (
            <article key={index} className="insigths">
              <figure className="insigths-image gradient">
                <Image src={card.image} width={40} height={40} alt="insights" />
                <div className="title">
                  <span>{card.type}</span>
                  <Link href="">
                    <h3>{card.title}</h3>{' '}
                  </Link>
                </div>
              </figure>

              <div className="box-description">
                <div className="insigths-date">
                  <span>{card.autor}</span>
                  <span>{card.date}</span>
                </div>
                <p className="insigths-description">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-client" id="client">
        <ButtonGradient classButt="whiteButton">{t['OUR CLIENTS']} </ButtonGradient>

        <div className="title-home blacktext" data-aos="zoom-in">
          <h2>{t['Our customers believe in us']}</h2>
          <p>{t['They have discovered the benefits of automating their financial processes with ARI.']}</p>
        </div>

        <article key={index} className="box-client" data-aos="flip-left">
          {logoClient.map((logos, index) => (
            <figure className="client-image" key={index}>
              <Image src={logos} width={100} height={100} alt="clients" />
            </figure>
          ))}
        </article>
      </section>

      
    </ LayoutHome >
  );
}
