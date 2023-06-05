import React from "react";
import Link from "next/link";
import Image from "next/image";
import imgRegister from "../../public/img/register.jpg";
import { useContext } from "react";
import { DataContext } from "@/Context/DataContext";


export default function Register() {
  const {dataClient,t} =useContext(DataContext);

  return (
    <div className="register" >
      <h1> pagina de Register </h1>
      <p> {dataClient.name}</p>
      <h2>{t.signup["Have an account?"]}</h2>
      
      <Image src={imgRegister} width={800} alt="imgRegister"></Image>
    </div>
  );
}
