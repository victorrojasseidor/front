import React from 'react'
import DocCurrency from '@/Components/CompProducts/Currency/DocCurrency'
import ConfigCurrency from '@/Components/CompProducts/ConfigCurrency'
import ConfigDowland from '@/Components/CompProducts/DowloandCurrency/ConfigDowland'

export const componentsProduct = [
  {
    iId: 1,
    sName: 'Downlaod automated Bank Statements',
    documentation: 'documentación 1',
    apiConfiguration: 'apiconfiguration Dowland',
    configuration: <ConfigDowland /> ? <ConfigDowland /> : 'configuration id 1'
  },
  {
    iId: 4,
    sName: 'Currency Exchange rates automation',
    documentation: <DocCurrency />,
    apiConfiguration: 'apiconfiguration currency',
    configuration: <ConfigCurrency />
  },
  {
    iId: 3,
    sName: 'Pattern',
    documentation: 'documentation 3',
    freeTrial: 'fretrial 3',
    apiConfiguration: 'apiconfiguration 3',
    configuration: 'configuration id 3'
  }
]
