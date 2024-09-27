import React from 'react';
import ConfigCurrency from './Currency/ConfigCurrency';
import ConfigDowland from '@/Components/CompProducts/DowloandCurrency/ConfigDowland';
import ConfigPattern from './Pattern/ConfigPattern';
import ConfigDetracciones from './Detracciones/ConfigDetracciones';

export const componentsProduct = [
  {
    iId: 1,
    sName: 'Downlaod automated Bank Statements',
    documentation: 'DOCU 1',
    apiConfiguration: 'apiconfiguration Dowland',
    configuration: <ConfigDowland getBank="GetExtBancario" registerBank="RegistrarExtBancario" updateBank="ActualizarExtBancario" deleteBank="EliminarBancoCredencialExtBancario" registerAccount="RegistrarCuentaExtBancario" updateAccount="ActualizarCuentaExtBancario" deleteAccount="EliminarCuentaExtBancario" />,
  },
  {
    iId: 2,
    sName: 'Currency Exchange rates automation',
    documentation: 'DOC 2',
    apiConfiguration: 'apiconfiguration currency',
    configuration: <ConfigCurrency />,
  },
  {
    iId: 3,
    sName: 'Pattern',
    documentation: 'documentation 3',
    apiConfiguration: 'apiconfiguration 3',
    // configuration: <ConfigPattern />,
    configuration: <ConfigPattern />,
  },
  {
    iId: 4,
    sName: 'captcha',
    documentation: 'documentation 4',
    apiConfiguration: 'apiconfiguration 4',
    configuration: 'config captcha',
  },

  {
    iId: 5,
    sName: 'Download account statements',
    documentation: 'documentation 5',
    apiConfiguration: 'apiconfiguration 5',
    configuration: <ConfigDowland getBank="GetEstBancario" registerBank="RegistrarEstBancario" updateBank="ActualizarEstBancario" deleteBank="EliminarBancoCredencialEstBancario" registerAccount="RegistrarCuentaEstBancario" updateAccount="ActualizarCuentaEstBancario" deleteAccount="EliminarCuentaEstBancario" confirConfig="ConfirmarConfiguracionEst" />,
  },
  {
    iId: 6,
    sName: 'Detracciones',
    documentation: 'documentation 6',
    apiConfiguration: 'apiconfiguration 6',
    configuration: <ConfigDetracciones />,
  },
];
