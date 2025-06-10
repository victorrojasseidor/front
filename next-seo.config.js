// next-seo.config.js
const SEO = {
  title: 'ARI Digital Employees - Automatización Financiera con IA para Tareas Repetitivas',
  description: 'Soluciones de automatización para tareas financieras como conciliación bancaria diaria, descarga de estados, validación de proveedores y más.',
  canonical: 'https://www.ariapp.ai',
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://www.ariapp.ai',
    site_name: 'ARI Digital Employees',
    title: 'Automatización Financiera con IA - Conciliación Bancaria y Más | ARI Digital Employees',
    description: 'Automatiza tareas financieras como conciliación bancaria diaria, descarga de estados de cuenta, validación SUNAT, y más con ARI Digital Employees.',
    images: [
      {
        url: 'https://collection.cloudinary.com/diwel1yye/25beeb0a245a6ff88beb3b7493a25602',
        width: 1200,
        height: 630,
        alt: 'ARI Digital Employees - Optimización Inteligente de Procesos Financieros',
      },
    ],
  },
  twitter: {
    handle: '@ariapp_ai',
    site: '@ariapp_ai',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      property: 'keywords',
      content: 'automación financiera, conciliación bancaria, validación de proveedores, tipo de cambio, SUNAT, IA, optimización de procesos, soluciones financieras, ERP',
    },
    {
      property: 'robots',
      content: 'index, follow',
    },
  ],
};

export default SEO;
