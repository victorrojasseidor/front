import React from 'react';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';
import { useRouter } from 'next/router';

export default function Lang() {
  const { updateLanguage } = useAuth(); // Using updateLanguage from context

  const handleChangeLocale = (newLocale) => {
    updateLanguage(newLocale); // Update language in context
  };

  const router = useRouter();
  const initialLocale = router.locale || 'es';

  return (
    <>
      <ImageSvg name="Lang" />
      <div className="languajes">
        <button onClick={() => handleChangeLocale('en')} className={initialLocale === 'en' ? 'lang_active' : ''}>
          en
        </button>
        <button onClick={() => handleChangeLocale('es')} className={initialLocale === 'es' ? 'lang_active' : ''}>
          es
        </button>
      </div>
    </>
  );
}
