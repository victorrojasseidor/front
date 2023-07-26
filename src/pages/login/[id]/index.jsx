import React, { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import Login from "..";
import ImageSvg from "@/helpers/ImageSVG";
import { useRouter } from "next/router";
import { fetchConTokenPost } from "@/helpers/fetch";
import Loading from "@/Components/Atoms/Loading";
import { refresToken } from "@/helpers/auth";


function LoginConfirmed(props) {
  const router = useRouter();

  // Capturar el valor del token desde la ruta actual
  const [isOpen, setIsOpen] = useState(true);
  const [isEmail, setIsEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isconfirmed, setIsconfirmed] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(email, token) {
    let body = {
      oResults: {
        sEmail: email,
      },
    };

    try {
      let responseData = await fetchConTokenPost("dev/General/?Accion=RegistrarUsuarioPendConf", body, token);

      console.log("💻", responseData.oAuditResponse);

      if (responseData.oAuditResponse.iCode == 29 || responseData.oAuditResponse.iCode == 1) {
        setIsconfirmed(true);
        setError(null);
        setTimeout(() => {
          setIsOpen(false);
        }, 10000);
      
      } else {
        let message = responseData?.oAuditResponse.sMessage;
        // const mensajeAntesDeComa = message.substring(0, message.indexOf(","));
        setError(message);
        let refresh= await refresToken(token);
        return refresh;

      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Hubo un error en la operación asincrónica.");
    }
  }



  if (isOpen) {
    setTimeout(() => {
      const tok = router.query.token;
      const correo = router.query.correo;
      if (correo && tok) {
        setIsLoading(false);
        setIsEmail(correo);
      }

      handleSubmit(correo, tok);
    }, 1000);
  }

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <section>
      <Login />
      <Modal open={isOpen}>
        {isconfirmed ? (
          <div>
            <ImageSvg name="Check" />

            <p>Your email</p>
            <h2>{isEmail}</h2>
            <p>
              was verified <span>&nbsp;successfully</span>
            </p>

            <div className="actions">
              <button className="btn_primary small" onClick={() => setIsOpen(false)}>
                NEXT
              </button>
            </div>
          </div>
        ) : (
          <div>
            <ImageSvg name="ErrorMessage" />
            <p className="errorMessage">{error}</p>
          </div>
        )}
      </Modal>
    </section>
  );
}

export default LoginConfirmed;
