import React from "react";
import { DataContextProvider } from "@/Context/DataContext";

export default function LayoutLogin({ children }) {
  return (
    <DataContextProvider>
      <section className='layoutLogin'>
        <div className='layoutLogin_image'> </div>
        <section>{children}</section>
      </section>
    </DataContextProvider>
  );
}
