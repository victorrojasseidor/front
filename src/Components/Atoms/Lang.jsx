import React, from 'react'
import IconEN from '../../../public/icons/eeuu.svg'
import IconES from '../../../public/icons/spain.svg'
import Image from 'next/image'
import { useAuth } from '@/Context/DataContext'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Lang () {
  const router = useRouter()
  const { locale } = router
 
  return (
    <>

      <button className='btn_circle ' style={{cursor:'alias'}}>
        <Image src={locale === 'es' ? IconES : IconEN} width='10px' alt='imglanguage' />

      </button>

      <div className='languajes'>
        <Link href='' locale='en' className={locale === 'en' ? 'lang_active' : ''}>
          En

        </Link>

        <Link
          href=''
          locale='es'
          className={locale === 'es' ? 'lang_active' : ''}
        >
          Es
        </Link>
      </div>
    </>
  )
}
