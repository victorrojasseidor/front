import React from 'react';
import Image from 'next/image';
import logoOscuro from '../../public/img/logoOscuro.webp';
import { useRouter } from 'next/router';

export default function LayoutLogin({ children }) {
  const router = useRouter();
  return (
    <section className="layoutLogin">
      <div className="layoutLogin_image" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
        <Image src={logoOscuro} width={200} alt="logo" priority />
      </div>
      <section className="layoutLogin_form">
        <div className="layout-children">{children}</div>
      </section>
    </section>
  );
}
