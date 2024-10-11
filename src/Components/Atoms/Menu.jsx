import React, { useState } from 'react';
import ImageSvg from '@/helpers/ImageSVG';
import { useRouter } from 'next/router'; 


export default function Menu({ label, submenus = [], link }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter(); // Inicializa el router

  const handleMouseEnter = () => {
    setDropdownOpen(true); // Abrir el dropdown cuando el mouse esté sobre el contenedor
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false); // Cerrar el dropdown cuando el mouse esté fuera del contenedor
  };

  const handleMenuClick = () => {
    if (submenus.length > 0) {
      // Si hay submenús, no hacer nada
    } else {
      router.push(link); // Dirigir al link del menú
    }
  };


  return (
    <div className="container-dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="dropdown-button" className="dropdown-button" onClick={handleMenuClick} >
        {label}
        <span className={`icon ${dropdownOpen ? 'open' : ''}`}>
        {submenus.length > 0 && <ImageSvg name="Up" /> }
        </span>
      </button>
      {submenus.length > 0 && (
        <div className={`dropdown-options ${dropdownOpen ? 'open' : ''}`}>
          {submenus.map((submenu) => (
            <button key={submenu.key} className="dropdown-option" onClick={()=>router.push(submenu.link)}>
              {submenu.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
