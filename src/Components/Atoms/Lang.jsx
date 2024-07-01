import React from 'react';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';

export default function Lang() {
  const { locale, updateLanguage } = useAuth(); // Using updateLanguage from context

  const handleChangeLocale = (newLocale) => {
    updateLanguage(newLocale); // Update language in context
  };

  return (
    <>
      <ImageSvg name='Lang' />
      <div className="languajes">
        <button onClick={() => handleChangeLocale('en')} className={locale === 'en' ? 'lang_active' : ''}>
          en
        </button>
        <button onClick={() => handleChangeLocale('es')} className={locale === 'es' ? 'lang_active' : ''}>
          es
        </button>
      </div>
    </>
  );
}
