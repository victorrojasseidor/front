import React, { createContext, useContext, useState } from "react";
import en from "../../lang/en.json";
import es from "../../lang/es.json";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  // data user

  const dataClient = {
    name: "Agustin",
    years: 27,
  };

  // lang

  const locale = "en";
  const t = locale === "en" ? en : es;
  //  console.log(t);

  //loading
  const [loading, setLoading] = useState(true);

  return (
    <DataContext.Provider
      value={{
        dataClient,
        loading,
        t,
      }}
    >
      {loading ? children : `Loading...`}
      {/* { children } */}
    </DataContext.Provider>
  );
};
