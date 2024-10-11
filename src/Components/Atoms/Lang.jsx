import React, { useState } from 'react';
import { useAuth } from '@/Context/DataContext';
import { useRouter } from 'next/router';
import ImageSvg from '@/helpers/ImageSVG';

export default function Lang() {
  const { updateLanguage } = useAuth();
  const router = useRouter();
  const initialLocale = router.locale || 'es';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLocale);

  const handleLanguageSelect = (newLocale) => {
    setSelectedLanguage(newLocale);
    updateLanguage(newLocale);
    setDropdownOpen(false); // Cerrar el dropdown al seleccionar un idioma
  };

  const handleMouseEnter = () => {
    setDropdownOpen(true); // Abrir el dropdown cuando el mouse esté sobre el contenedor
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false); // Cerrar el dropdown cuando el mouse esté fuera del contenedor
  };

  const options = [
    { value: 'en', label: 'En' },
    { value: 'es', label: 'Es' },
  ];

  const filteredOptions = options.filter((option) => option.value !== selectedLanguage);

  return (
    <div className="container-dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="dropdown-button">
        {selectedLanguage}
        <span className={`icon ${dropdownOpen ? 'open' : ''}`}>
          <ImageSvg name="Up" />
        </span>
      </button>
      <div className={`dropdown-options ${dropdownOpen ? 'open' : ''}`}>
        {filteredOptions.map((option) => (
          <div key={option.value} onClick={() => handleLanguageSelect(option.value)} className="language-option">
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
