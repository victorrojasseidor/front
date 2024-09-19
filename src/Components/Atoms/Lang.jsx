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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const options = [
    { value: 'en', label: 'En' },
    { value: 'es', label: 'Es' },
   
  ];

  // Filtrar la opción que no está seleccionada
  const filteredOptions = options.filter((option) => option.value !== selectedLanguage);

  return (
    <div className="container-dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        {selectedLanguage}
        <span className="icon">{dropdownOpen ? <ImageSvg name="Down" /> : <ImageSvg name="Up" />}</span>
      </button>
      {dropdownOpen && (
        <div className="dropdown-options">
          {filteredOptions.map((option) => (
            <div key={option.value} onClick={() => handleLanguageSelect(option.value)} className="language-option">
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
