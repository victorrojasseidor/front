import React, { useState, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/Context/DataContext';
import LogoOscuro from '../../public/img/logoOscuro.webp';

import Lang from './Atoms/Lang';
import ImageSvg from '@/helpers/ImageSVG';

export default function LayoutHome({ children }) {
  const { l } = useAuth();
  const t = l.home;
  const router = useRouter();

  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const toggleMenuMobile = () => {
    setIsOpenMobile(!isOpenMobile);
  };

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
      label: 'Insights',
      link: '/#insights',
      submenus: [],
    },
  ];

  const menuMovil = [
    {
      label: t['Home'],
      link: '/#front',
      submenus: [],
    },

    {
      label: t['What we do'],
      link: '/#skills',
      submenus: [],
    },
    {
      label: t['WHY CHOOSE US'],
      link: '/#flow',
      submenus: [],
    },

    {
      label: 'Insights', 
      link: '/#insights',
      submenus: [],
    },

    // {
    //   label: 'Clientes',
    //   link: '/#client',
    //   submenus: [],
    // }
  ];

  return (
    <section className="home">
      <header className="home-nav">
        <ul className="logo-img">
          <Link href='/#front'>
          <Image src={LogoOscuro} width={100} height={100} alt="logooscuro" />
          </Link>
      
        </ul>

        <ul className="nav-menu">
          <li className="languaje-white">
            <Lang />
          </li>

          {menuData.map((menu) => (
            <li className="languaje-white" key={menu.label}>
              <Link href={menu.link} scroll={false}>
                {menu.label}
              </Link>
            </li>
          ))}

          <li>
            <button className="btn_white" onClick={() => router.push('/login')}>
              <ImageSvg name="Profile" />
              {t['Log in to ARI']}
            </button>
          </li>

          <li>
            <button className="btn_white white" onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
              {t['Request demo']}
            </button>
          </li>
        </ul>

        <ul className="nav-movil">
          <li className="hamburgerMenu">
            <button onClick={toggleMenuMobile}>
              <ImageSvg name={isOpenMobile ? 'MenuClose' : 'MenuOpen'} />
            </button>
          </li>

          <div className={`movil-options ${isOpenMobile ? 'openMovil' : ''}`}>
            {menuMovil?.map((menu) => (
              <li className="languaje-white list-options" key={menu.label}>
                <Link href={menu.link} scroll={false} onClick={() => setIsOpenMobile(!isOpenMobile)}>
                  {' '}
                  {menu.label}
                </Link>
              </li>
            ))}

            <div className="box-buttons-movil">
              <button className="btn_white" onClick={() => router.push('/login')}>
                <ImageSvg name="Profile" />
                {t['Log in to ARI']}
              </button>

              <button className="btn_white white" onClick={() => router.push('https://www.seidor.com/es-pe/contacto')}>
                {t['Request demo']}
              </button>

              <li className="languaje-white">
                <Lang />
              </li>
            </div>
          </div>
        </ul>
      </header>

      {children}

      <footer className="home-footer">
        <div className="home-footer-info">
          <div className="footer-message gradient">
            <p className="message">
              "{t['True success in the era of artificial intelligence lies in collaborating with technology to']}
              <span> {t['transform limitations into opportunities']} </span>
              {t['and release the extraordinary in each one']}".
            </p>
            <p>— Menagen Murriagui, {t['Ari CEO']}</p>
          </div>

          <div className="footer-menu">
            {/* <h4> A cerca de :</h4> */}
            {menuMovil.map((menu) => (
              <li className="languaje-white list-options" key={menu.label}>
                <Link href={menu.link} scroll={false}>
                  {menu.label}
                </Link>
              </li>
            ))}
          </div>

          <div className="footer-social">
            <p>
              <ImageSvg name="Location" /> Vittore Carpaccio 250, San Borja, Lima , Perú
            </p>
            <p>
              <ImageSvg name="Message" /> info.pe@seidor.com
            </p>
          </div>
        </div>

        <div className="home-footer-logo">
          <div className="logo-footer">
            <Image src={LogoOscuro} width={100} height={100} alt="logo" loading="eager" />
            <p>© 2024 ARI Digital Employees. All Rights Reserved</p>
          </div>
          <div className="footer-privacy">
            <p>{t['Privacy Policy']}</p>

            <p>{t['Terms of Use']}</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
