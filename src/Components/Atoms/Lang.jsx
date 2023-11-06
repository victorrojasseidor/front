import React, from 'react'
import IconEN from '../../../public/icons/eeuu.svg'
import IconES from '../../../public/icons/spain.svg'
import Image from 'next/image'
import { useAuth } from '@/Context/DataContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ImageSvg from '@/helpers/ImageSVG'

export default function Lang () {
  const router = useRouter();
  const { locale } = router;

  const handleChangeLocale = (newLocale) => {
    const { pathname, query } = router;
    router.push({ pathname, query }, undefined, { locale: newLocale });
  };

 
  return (
    <>
      {/* <button className='btn_circle ' style={{cursor:'alias'}}>
        <Image src={locale === 'es' ? IconES : IconEN} width='10px' alt='imglanguage' />

      </button> */}

    <ImageSvg name='Lang' />

      <div className="languajes">
      <button onClick={() => handleChangeLocale('en')} className={locale === 'en' ? 'lang_active' : ''}>
              En
            </button>
            <button onClick={() => handleChangeLocale('es')} className={locale === 'es' ? 'lang_active' : ''}>
              Es
            </button>
          </div>
    </>
  )
}
