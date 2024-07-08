'use client'
import Head from 'next/head'
import { useAuth } from '@/Context/DataContext'
import Principal from './inicio'

export default function Inicio () {
  const { l } = useAuth()

  const t = l.home

  return (
    <>
      <Head>
        
        <meta name='description' content={t['Ari is a platform to automate processes and free up time for your employees. Get digital employees for finance, accounting, technology, and human resources. Solutions include: downloading bank statements, automating exchange rates, SUNAT tax records, invoice registration, text extraction from images, captcha resolution, and AFP validation, click here!']} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        <title>{t['Ari - Leader in Automated Processes']}</title>

        {/* Open Graph Meta Tags */}
        <meta property='og:site_name' content={t['Ari - process automation']} />
        <meta property='og:title' content={t['Ari - process automation']} />
        <meta property='og:description' content={t['Digital employees to automate your finance and accounting processes, click here!']} />
        <meta property='og:image' content='/asistente.png' />
        <meta property='og:url' content='https://www.ariapp.ai/' />
        <meta property='og:type' content='website' />

        {/* Keywords Meta Tag */}
        <meta name='keywords' content={t['Process Automation, Digital Employees, RPA (Robotic Process Automation), Digital Transformation, Technological Innovation at Work, Reduction of Operational Costs, System Integration, Artificial Intelligence Applied to Processes']} />

        {/* Favicon and Icons */}
        <link rel='apple-touch-icon' sizes='152x152' href='/asistente.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
        <meta name="google-site-verification" content="itaBlndKny_4x9v8etJviXHwNkS1MOoY2AaMq_li898" />
        

        {/* Fonts */}
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' rel='stylesheet' />

        {/* Canonical Link */}
        <link rel='canonical' href='https://www.ariapp.ai/' />

        {/* Favicon */}
        <link rel='shortcut icon' type='image/x-icon' href='/favicon-32x32.png' />


 {/* Google Tag Manager */}
 <script async src="https://www.googletagmanager.com/gtag/js?id=G-SBM1Y8E69G"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-SBM1Y8E69G');
              `,
            }}
          />
      </Head>
    
      <body>
        <Principal />
      </body>
    </>
  )
}
