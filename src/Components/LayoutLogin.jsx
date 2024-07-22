import React from 'react';
import Image from 'next/image';
import logoOscuro from '../../public/img/logoOscuro.webp';

export default function LayoutLogin({ children }) {
  return (
    <section className="layoutLogin">
      <div className="layoutLogin_image">
        <Image src={logoOscuro} width={200} alt="logo" priority />
      </div>
      <section className="layoutLogin_form">
        <div className="layout-children">{children}</div>
      </section>
    </section>
  );
}
