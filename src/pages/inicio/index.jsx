import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lang from '@/Components/Atoms/Lang';
import LogoOscuro from '../../../public/img/logoOscuro.webp';
import front from '../../../public/img/front.png';
import ImageSvg from '@/helpers/ImageSVG';
import Counter from '@/Components/Atoms/Counter';
import { useRouter } from 'next/router';
import { useAuth } from '@/Context/DataContext';
import ButtonGradient from '@/Components/Atoms/ButtonGradient';
import flujoAri from '../../../public/img/flujoAri.gif';
import simple from '../../../public/img/simple.webp';
import postOne from '../../../public/img/post/post-one.webp';
import postTwo from '../../../public/img/post/post-two.webp';

import prod1 from '../../../public/img/card-product/prod1.png';
import prod2 from '../../../public/img//card-product/prod2.png';

import adama from '../../../public/img/logos/adama.webp';
import adeco from '../../../public/img/logos/adeco.webp';
import agrokasa from '../../../public/img/logos/agrokasa.webp';
import anglo from '../../../public/img/logos/anglo.webp';
import auna from '../../../public/img/logos/auna.webp';
import pacasmayo from '../../../public/img/logos/pacasmayo.webp';
import unacen from '../../../public/img/logos/unacen.webp';





const SkillsCard = ({ cardSkills }) => {
  return (
    <>
      {cardSkills.map((prod, index) => {
        const [isImageInView, setIsImageInView] = useState(false);
        const imageRef = useRef(null);

        useEffect(() => {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setIsImageInView(true);
                  console.log(`Imagen en vista: ${prod.title}`);
                } else {
                  setIsImageInView(false);
                  console.log(`Imagen fuera de vista: ${prod.title}`);
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
              <h3>
                <span>{prod.type}</span>
                {prod.title}
              </h3>
              <p>{prod.description}</p>
            </div>
            <figure  >
              <Image
                className="image-one"
                src={prod.imageone}
                width={200}
                height={200}
                alt={prod.title}
              />
              <Image
                className={`image-two ${isImageInView ? 'in-view' : 'out-of-view'}`}
                src={prod.imagetwo}
                width={200}
                height={200}
                alt={prod.title}
              />
            </figure>
          </div>
        );
      })}
    </>
  );
};







export default function index() {
  const { l } = useAuth();
  const t = l.home;
  const router = useRouter();

  const [isCounterSectionInView, setIsCounterSectionInView] = useState(false);

  // Referencia a la sección del contador
  const counterSectionRef = useRef(null);

  // Función para observar si la sección del contador está en vista
  useEffect(() => {
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
      { threshold: 0.1 } // El 10% de la sección debe estar visible para activar
    );

    if (counterSectionRef.current) {
      observer.observe(counterSectionRef.current);
    }

    // Cleanup al desmontar el componente
    return () => {
      if (counterSectionRef.current) {
        observer.unobserve(counterSectionRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    // Asegurarse de que esté en el cliente
    if (typeof window !== 'undefined') {
      const header = document.querySelector('header');

      // Verificar si el header existe en el DOM
      if (!header) return;

      const handleScroll = () => {
        if (window.scrollY > 0) {
          header.classList.add('scroll-header');
        } else {
          header.classList.remove('scroll-header');
        }
      };

      // Añadir el evento de scroll
      window.addEventListener('scroll', handleScroll);

      // Limpieza del evento
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const menuData = [
    {
      label: 'Insigths',
      link: '/login',
      submenus: [],
    },
  ];

  const cardAdventage = [
    {
      title: 'Extracción de información avanzada',
      icon: 'Extraction',
      description: 'Integra más de 3,800 fuentes en una sola plataforma, permitiendo a tu equipo automatizar sus procesos de conciliación de forma rápida.',
    },
    {
      title: 'Auditable, rastreable y seguro',
      icon: 'Security',
      description: 'Segregación de funciones, escriptación de datos y log de modificaciones, asegurando el cumplimiento con altos estándares.',
    },
    {
      title: 'Integración directa al ERP',
      icon: 'Integration',
      description: 'Reduce el trabajo manual y mejora la precisión, asegurando que los datos financieros se actualicen en tiempo real.',
    },
    {
      title: 'Reportes y Dashboards de información consolidada',
      icon: 'BarChart',
      description: 'Ofrece una vista interactiva y personalizable de métricas para un monitoreo eficiente y análisis detallados.',
    },
    {
      title: 'Notificaciones y alarmas de control',
      icon: 'Notification',
      description: 'Notifica a los usuarios sobre inconsistencias rápidamente, garantizando una resolución oportuna de problemas.',
    },
    {
      title: 'New! Coming Soon. Human Avatar',
      icon: 'Avatar',
      description: 'Pronto un digital Avatar podrá interactuar contigo para proporcionarte información de tus procesos de negocio.',
    },
  ];


  const cardSkills = [
    {
      title: 'Conciliación bancaria',
      type: 'Bancos',
      imageone:prod1,
      imagetwo:prod2,
      description: 'Diariamente extrae la información del tipo de cambio de la SBS para diferentes monedas, consolida la información para que puedan ver el histórico y fluctuaciones y luego se carga al ERP mediante un job para actualizar el tipo de cambio compra, venta y cierre (venta y compra). El proceso puede ser definido en el horario de 6pm hasta las 11:59pm o el conveniente para ti.',
    },
    {
      title: 'Actualización de padrones de SUNAT',
      type: 'Divisas',
      imageone:prod1,
      imagetwo:prod2,
      description: 'Diariamente realiza la revisión y descarga de los padrones de Sunat, tales como, buenos contribuyentes, agentes de retención, agentes de percepción, no habidos, no hallados, entre otros. La información de la fecha de actualización se podrá ver en la aplicación. Luego se carga al ERP SAP mediante un job para actualizar el estado de los Business Partner (Acreedores) y actualización de partidas abiertas', 

    },
    {
      title: 'IA Captcha Solver',
      type: 'Bancos',
      imageone:prod1,
      imagetwo:prod2,
      description: ' Diariamente utiliza este servicio para la resolución de capchas en cualquier página web. Puede resolver captchas simples, complejos, recaptcha V1 y recaptcha V2 , Viene incluido 30 mil conexiones para la utilización de la automatización. Los tipos de captchas tienen equivalencias en las conexiones. Este componente es crucial para automatizar sus procesos',
    },
    {
      title: 'Conciliación bancaria',
      type: 'Bancos',
      imageone:prod1,
      imagetwo:prod2,
      description: 'Diariamente extrae la información del tipo de cambio de la SBS para diferentes monedas, consolida la información para que puedan ver el histórico y fluctuaciones y luego se carga al ERP mediante un job para actualizar el tipo de cambio compra, venta y cierre (venta y compra). El proceso puede ser definido en el horario de 6pm hasta las 11:59pm o el conveniente para ti.',
    },
    {
      title: 'Descarga de facturas de servicios públicos',
      type: 'Bancos',
      imageone:prod1,
      imagetwo:prod2,
      description: 'Diariamente realiza la descarga de las facturas de servicios públicos, tales como, Agua, Luz, teléfono, de distintos operadores de servicios para luego consolidarlos, renombrarlos y almancenarlos en un repositorio de información segura de manera estructurada.',
    },
    
  ];





  const cardInsigths = [
    {
      title: 'IA Generativa se afianza en el backoffice financiero',
      autor: 'Menagen Muriagui',
      date: 'June 28, 2018',
      image: postOne,
      type: 'Financial services',
      description: 'La tecnología aumentará las capacidades de los agentes de seguros y ayudará a los clientes a realizar transacciones más sencillas por sí mismos.',
      link: '/insigths/post-ia-genativa',
    },
    {
      title: 'Los nuevos agentes digitales son una tendencia',
      autor: 'Jorge Pérez',
      date: 'September 10, 2020',
      image: postTwo,
      type: 'Innovation',
      description: 'La tecnología aumentará las capacidades de los agentes de seguros y ayudará a los clientes a realizar transacciones más sencillas por sí mismos.',
      link: '/insigths/post-agentes-digitales',
    },
    {
      title: 'Cómo aplicar la IA en las áreas de finanzas, contabilidad e impuestos',
      autor: 'Claudia Martín',
      date: 'March 15, 2021',
      image: postOne,
      type: 'Technologies',
      description: 'La tecnología aumentará las capacidades de los agentes de seguros y ayudará a los clientes a realizar transacciones más sencillas por sí mismos.',
      link: '/insigths/post-aplicar-ia-finanzas',
    },
    {
      title: 'Automatización en el análisis de riesgos con IA',
      autor: 'Laura Gómez',
      date: 'July 22, 2022',
      image: postOne,
      type: 'AI & Automation',
      description: 'El análisis de riesgos se vuelve más eficiente al automatizar procesos clave, reduciendo el margen de error humano.',
      link: '/insigths/post-automatizacion-analisis-riesgos',
    },
    {
      title: 'IA y el futuro del servicio al cliente',
      autor: 'Carlos Fernández',
      date: 'August 30, 2023',
      image: postOne,
      type: 'Customer Service',
      description: 'Los agentes virtuales impulsados por IA mejoran la experiencia del cliente, ofreciendo respuestas rápidas y precisas a consultas comunes.',
      link: '/insigths/post-ia-servicio-al-cliente',
    },
    {
      title: 'Blockchain e IA: Una alianza para la seguridad financiera',
      autor: 'Ana Rodríguez',
      date: 'November 5, 2023',
      image: postOne,
      type: 'Financial Security',
      description: 'La combinación de blockchain e IA está redefiniendo la seguridad en el sector financiero, mejorando la transparencia y la protección de datos.',
      link: '/insigths/post-blockchain-ia-seguridad',
    },
  ];

  const logoClient = [adama, adeco, agrokasa, anglo, auna, pacasmayo, unacen];





  return (
    <section className="home">
      <header className="home-nav">
        <ul>
          <Image src={LogoOscuro} width={100} height={100} alt="logooscuro" />
        </ul>

        <ul className="nav-buttons">
          <li className="languaje-white">
            <Lang />
          </li>

          {menuData.map((menu) => (
            <li className="languaje-white" key={menu.label}>
              <Link href={menu.link}>{menu.label}</Link>
            </li>
          ))}

          <li>
            <button className="btn_white" onClick={() => router.push('/login')}>
              <ImageSvg name="Profile" />
              Ingresar a la ARI
            </button>
          </li>

          <li>
            <button className="btn_white white" onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
              Solicitar demo
            </button>
          </li>
        </ul>
      </header>

      <section className="home-front">
        <div className="welcome">
          <div className="welcome-letter">
            <h1 className="letter-transition gradient">
              Tu <span>nuevo superpoder</span>
            </h1>
            <h1 className="letter-transition gradient">
              Asistentes <span>Digitales ARI</span>
            </h1>
          </div>

          <p className="text-description">
            {t['ARI Digital Employees, powered by AI']},&nbsp;
            <span>{t['automate repetitive tasks']},</span>&nbsp;
            {t['allowing finance teams to focus on more strategic and valuable activities']}.
          </p>
        </div>

        <button className="record">
          <ImageSvg name="Record" />
          Ver demo gratuita
        </button>

        <div className="image-dashboard">
          <Image src={front} width={1000} height={1000} alt="dashboard" />
        </div>

        <section className="home-counter" ref={counterSectionRef}>
          <ul className="box-counter">
            <li className="gradient">
              <span>{isCounterSectionInView ? <Counter initialValue={0} finalValue={5} /> : 5}</span>
              <p>{t['Digital Employees Automating Your Services']}</p>
            </li>
            <li className="gradient">
              <span>{isCounterSectionInView ? <Counter initialValue={8} finalValue={20} /> : 20}</span>
              <p>{t['Included Skills to Digital Employees']}</p>
            </li>
            <li className="gradient">
              <span>{isCounterSectionInView ? <Counter initialValue={70} finalValue={78} /> : 78} % </span>
              <p>{t['business agility']}</p>
            </li>
          </ul>
        </section>
      </section>

      <section className="home-flow">
        <ButtonGradient classButt="whiteButton">POR QUÉ ELEGIRNOS</ButtonGradient>

        <div className="title-home blacktext">
          <h2 className="title gradient">
            Ari <span> Conecta datos </span> financieros y comprende el comportamiento
          </h2>

          <p className=""> ARI es la mano de obra basada en software, impulsada por inteligencia artificial, que ejecuta de forma autónoma procesos de trabajo end-to-end utilizando un conjunto diverso de habilidades.</p>
        </div>

        <div className="box-flow">
          <Image src={flujoAri} width={500} height={500} alt="ari-flujo" loading="eager" unoptimized={true} />
        </div>
      </section>

      <section className="home-skills">
        <button className="record">
          <ImageSvg name="Record" />
          Digital Employess ass a service
        </button>
        <div className="title-home ">
          <h2 className="title gradient">
            Potencia tus operaciones con nuestras +8
            <span> habilidades avanzadas </span>
            de ARI Digital Employees
          </h2>

          <p className=""> Las habilidades avanzadas de ARI son tareas automatizadas realizadas por nuestros Digital Employees que simplifican procesos operativos en áreas como finanzas, comercial, recursos humanos y tecnología. Estas habilidades avanzadas permiten a los usuarios adaptar ARI a sus procesos de negocio, mejorando la eficiencia y liberando tiempo para enfocarse en actividades estratégicas.</p>
        </div>

        <ButtonGradient> qué hacemos </ButtonGradient>

        <div className="box-process">
       
{/* 
        {cardSkills.map((prod, index) => (
  <div className="process" key={index} >
    <div className="process-description">
      <h3>
        <span>{prod.type}</span>
        {prod.title}
      </h3>
      <p>{prod.description}</p>
    </div>
    <figure ref={imageRef}>
      <Image
        className="image-one"  
        src={prod.imageone}
        width={200}
        height={200}
        alt={prod.title}
      />
      <Image
        className={`image-two ${isImageInView ? 'in-view' : ''}`} 
        src={prod.imagetwo}
        width={200}
        height={200}
        alt={prod.title}
      />
    </figure>
  </div>
))} */}


    <SkillsCard cardSkills={cardSkills}/>
          
        </div>
      </section>


      <section className="home-advantages">
        <ButtonGradient classButt="whiteButton">CARACTERÍSTICAS </ButtonGradient>

        <div className="title-home blacktext">
          <h2 className="title gradient">
            Descubre el <span> potencial </span> de ARI Digital Employees
          </h2>

          <p> Fácil de usar, rápido de implementar y versátil para automatizar tus procesos de negocio.</p>
        </div>

        <div className="box-advantage">
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
        <figure>
          <Image src={simple} width={500} height={500} alt="img-simple" />
        </figure>

        <div className="simple-box">
          <div className="title-home blacktext">
            <h2 className="title gradient">
              Configura en <span> simples pasos</span> tus asistentes digitales con IA
            </h2>

            <p> Solicita una demo y podrás visualizar lo simple que es configurar las habilidades de tu empleado digital Ari, la automatización y la inteligencia artificial avanzadas ofrecen una gran experiencia al cliente a un precio accesible. </p>

            <ButtonGradient classButt="whiteButton"> SOLICITAR DEMO </ButtonGradient>

            <div className="simples-skills">
              <span>FINANZAS Y CONTABILIDAD</span>
              <span>RECURSOS HUMANOS</span>
              <span>TECNOLOGÍA</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-insigths">
        <div className="title-home ">
          {/* <h2 className="title gradient">
            Potencia tus operaciones con nuestras +8
            <span> habilidades avanzadas </span>
            de ARI Digital Employees
          </h2> */}

          <ButtonGradient> INSIGHTS </ButtonGradient>

          <p className=""> Análisis de expertos, pensamiento audaz y recopilación de datos para líderes que desean lograr lo extraordinario </p>
        </div>

        <div className="box-insigths">
          {cardInsigths.map((card, index) => (
            <article key={index} className="insigths">
              <figure className="insigths-image">
                <Image src={card.image} width={40} height={40} alt="insigths" />
                <span>{card.type}</span>
              </figure>

              <Link href="/ruta-ejemplo">
                {' '}
                <h3>{card.title}</h3>{' '}
              </Link>

              <div className="insigths-date">
                <span>{card.autor}</span>
                <span>{card.date}</span>
              </div>

              <p className="insigths-description">{card.description}</p>
              {/* <Link href="/ruta-ejemplo" className="insigths-link">
                Ver post
                <ImageSvg name="ArrowUp" />
              </Link> */}
            </article>
          ))}
        </div>
      </section>

      <section className="home-client">
        <ButtonGradient classButt="whiteButton">NUESTROS CLIENTES </ButtonGradient>

        <div className="title-home blacktext">
          <h2 className="title gradient">
            {' '}
            <span> Confian</span> en Ari
          </h2>
          <p> Empresas de clase mundial ya cuentan con nuestros empleados digitales</p>
        </div>

        <article key={index} className="box-client">
          {logoClient.map((logos, index) => (
            <figure className="client-image" key={index}>
              <Image src={logos} width={100} height={100} alt="clients" />
            </figure>
          ))}
        </article>
      </section>
    </section>
  );
}
