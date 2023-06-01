import React from "react";
import Link from "next/link";
import Image from "next/image";
import imgRegister from "../../public/img/register.jpg";


export default function Register() {
  return (
    <div className="register" >
      <h1> pagina de Register </h1>
      <Image src={imgRegister} width={800} alt="imgRegister"></Image>
    </div>
  );
}
