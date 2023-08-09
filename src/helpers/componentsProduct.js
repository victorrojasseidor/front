import React from 'react'
import DocCurrency from '@/Components/CompProducts/Currency/DocCurrency'
import ConfigCurrency from '@/Components/CompProducts/ConfigCurrency'
import ConfigDowland from '@/Components/DowloandCurrency/ConfigDowland'

export const componentsProduct = [
  {
    iIdProdEnv: 5,
    Sname: 'Descargar extractos bancarios automatizados.',
    documentation: 'documentación  de estractos bancarios',
    configuration: <ConfigDowland /> ? <ConfigDowland /> : 'configuration id 5'
  },
  {
    iIdProdEnv: 4,
    name: 'Currency Exchange rates automation',
    documentation: <DocCurrency />,
    apiConfiguration: 'apiconfiguration currency 5',
    configuration: <ConfigCurrency />
  },
  {
    iIdProdEnv: 3,
    name: 'Pattern',
    documentation: 'Pattern documentation 3',
    apiConfiguration: 'apiconfiguration 3',
    configuration: 'configuration id 3'
  }

  // id: 6,
  // name: 'Real-Time Weather Data API',
  // status: 'Not hired',
  // contry: 'Perú',
  // time: {
  //   update: '3 months ',
  //   enabled: '',
  //   expires: ' '
  // },
  // description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate',
  // documentation: 'documentation 6',
  // freeTrial: 'fretrial 6',
  // apiConfiguration: 'apiconfiguration 6',
  // configuration: 'configuration id 6'

]
