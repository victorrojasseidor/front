import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lang from '@/Components/Atoms/Lang';
import LogoOscuro from '../../../public/img/logoOscuro.webp';
import flujoAri from '../../../public/img/flujoAri.gif';
import ImageSvg from '@/helpers/ImageSVG';
import drive from '../../../public/img/testimonials/drive.webp';
import uipath from '../../../public/img/testimonials/uipath.webp';
import sap from '../../../public/img/testimonials/sap.webp';
import microsoftLogo from '../../../public/img/testimonials/Microsoft-Logo.webp';
import awsLogo from '../../../public/img/testimonials/aws-icon.webp';
import card1 from '../../../public/img/card-product/card1.webp';
import card2 from '../../../public/img/card-product/card2.webp';
import card3 from '../../../public/img/card-product/card3.webp';
import card4 from '../../../public/img/card-product/card4.webp';
import card5 from '../../../public/img/card-product/card5.webp';
import card6 from '../../../public/img/card-product/card6.webp';
import card7 from '../../../public/img/card-product/card7.webp';
import card8 from '../../../public/img/card-product/card8.webp';
import mundo from '../../../public/img/mundo.webp';
import asistente from '../../../public/img/asistente.webp';
import telefonoWEB from '../../../public/img/telefono.webp';
import SphereCanvas from '@/Components/Grafics/SphereCanvas';
import Orbita from '@/Components/Grafics/Orbita';
import giftMovil from '../../../public/img/video/giftMovil.gif';
import { useAuth } from '@/Context/DataContext';
import AOS from 'aos'; // Importa AOS aquí
import 'aos/dist/aos.css';
import Counter from '@/Components/Atoms/Counter';
import { useRouter } from 'next/router';

export default function index() {
  const { l } = useAuth();
  const t = l.home;
  const router = useRouter();

  return (
    <section className="home">
      <header className="home-nav">
        <ul>
          <Image src={LogoOscuro} width={100} height={100} alt="logooscuro" />
        </ul>

        <ul>
          <li className="languaje-white">
            <Lang />
          </li>

          <li>
            <Link className="li-login" href="/register">
              ingresar a ari
            </Link>
          </li>

          <li>
            <button className="btn_black" onClick={() => router.push('/login')}>
              login
            </button>
          </li>
        </ul>
      </header>
      <section className="home-front">
        <div className="welcome">
          <div className="welcome-letter">
            <h1 className="letter-transition  gradient">
            
              Tu <span>new superpower</span>
            </h1>
            <h1 className=" letter-transition gradient">
              Asistentes <span> Digital ARI</span>
            </h1>
          </div>

          <p>
            {t['ARI Digital Employees, powered by AI']},&nbsp;
            <span>{t['automate repetitive tasks']},</span> &nbsp;
            {t['allowing finance teams to focus on more strategic and valuable activities']}.
          </p>

          
        </div>

       
      </section>
      inicio
    </section>
  );
}
