import React, { createContext } from 'react'
import en from '../../lang/en.json'
import es from '../../lang/es.json'

export const DataContext = createContext()

export const DataContextProvider = ({ children }) => {
  // data user
  const dataClient = {
    name: 'Agustin',
    years: 27,
    tilte: 'dataclienttt'
  }

  // lang
  const locale = 'en'
  const t = locale === 'en' ? en : es

  return (
    <DataContext.Provider
      value={{
        dataClient,
        locale,
        t
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
