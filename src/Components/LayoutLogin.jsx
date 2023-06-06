import React from "react";
import Image from "next/image";
import imgRegister from "../../public/img/register.jpg";
import logo from "../../public/img/logoseidor.png";
import { useContext } from "react";
import { DataContext } from "@/Context/DataContext";
import Link from "next/link";

export default function LayoutLogin({ children }) {
  const { t } = useContext(DataContext);

  return (
    <section className="layoutLogin">
      <div className="layoutLogin_image">
        {/* <Image src={imgRegister} width={600} alt="imgRegister"></Image> */}
      </div>
      <section>
        <nav>
          <Image src={logo} width={120} alt="imgRegister"></Image>
          <ul>
            <li className="Question">
           
                {t.signup["Have an account?"]}
            
            </li>
            <li className="link">
              <Link href="/register">
                {t.signup["Log in"]}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="register">
          register
          {children}
        </div>
      </section>
    </section>
  );
}
