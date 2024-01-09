import React from 'react'
import ConfigCurrency from './Currency/ConfigCurrency'
import ConfigDowland from '@/Components/CompProducts/DowloandCurrency/ConfigDowland'
import DocDowland from './DowloandCurrency/DocDowland'
import ConfigPattern from './Pattern/ConfigPattern'

export const componentsProduct = [
  {
    iId: 1,
    sName: 'Downlaod automated Bank Statements',
    documentation: <DocDowland />,
    apiConfiguration: 'apiconfiguration Dowland',
    configuration: <ConfigDowland /> ? <ConfigDowland /> : 'configuration id 1'
  },
  {
    iId: 2,
    sName: 'Currency Exchange rates automation',
    documentation: 'hhhhhhhh',
    apiConfiguration: 'apiconfiguration currency',
    configuration: <ConfigCurrency />
  },
  {
    iId: 3,
    sName: 'Pattern',
    documentation: 'documentation 3',
    freeTrial: 'fretrial 3',
    apiConfiguration: 'apiconfiguration 3',
    configuration: <ConfigPattern />
  }
]
