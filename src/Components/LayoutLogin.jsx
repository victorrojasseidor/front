import React from "react";

export default function LayoutLogin({ children }) {
  return (
    <section className='layoutLogin'>
      <div className='layoutLogin_image'> </div>
      <section>{children}</section>
    </section>
  )
}
