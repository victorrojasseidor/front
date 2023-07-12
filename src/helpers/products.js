import React from 'react';
import DocCurrency from '@/Components/CompProducts/Currency/DocCurrency';

export const dataProducts = [
  { 
    id: 1, 
    name: "Downlaod automated Bank Statements", 
    status: "Configured", 
    contry: "Perú",
    time: {
      update: " ",
      enabled: " ",
      expires: "4 days"
    },
    description: "Download the daily bank statement of any bank without token",
    documentation: "documentación 1",
    freeTrial: 'fretrial 1',
    apiConfiguration:'apiconfiguration 1',
    configuration:'configuration id 1'
  },
  { 
    id: 2, 
    name: "Currency Exchange rates automation", 
    status: "Earring", 
    contry: "Perú",
    time: {
      update: " ",
      enabled: "3 months",
      expires: " "
    },
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate",
    documentation: <DocCurrency />,
    freeTrial: 'fretrial 2',
    apiConfiguration:'apiconfiguration 2',
    configuration:'configuration id 2'
  },
  { 
    id: 3, 
    name: "Pattern", 
    status: "Configured", 
    contry: "Perú",
    time: {
      update: " ",
      enabled: " ",
      expires: "4 days"
    },
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate",
    documentation: 'documentation 3',
    freeTrial: 'fretrial 3',
    apiConfiguration:'apiconfiguration 3',
    configuration:'configuration id 3'
  },
  { 
    id: 4, 
    name: "Pattern IOP", 
    status: "Not hired", 
    contry: "Perú",
    time: {
      update: "3 months ",
      enabled: "",
      expires: " "
    },
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate",
    documentation: 'documentation 4',
    freeTrial: 'fretrial 4',
    apiConfiguration:'apiconfiguration 4',
    configuration:'configuration id 4'
  },
  { 
    id: 5, 
    name: "Exchange Rates Data API", 
    status: "Not hired", 
    contry: "Perú",
    time: {
      update: "3 months ",
      enabled: "",
      expires: " "
    },
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate",
    documentation: 'documentation 5',
    freeTrial: 'fretrial 5',
    apiConfiguration:'apiconfiguration 5',
    configuration:'configuration id 5'
  },
  { 
    id: 6, 
    name: "Real-Time Weather Data API", 
    status: "Not hired", 
    contry: "Perú",
    time: {
      update: "3 months ",
      enabled: "",
      expires: " "
    },
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate",
    documentation: 'documentation 6',
    freeTrial: 'fretrial 6',
    apiConfiguration:'apiconfiguration 6',
    configuration:'configuration id 6'
  },
];
