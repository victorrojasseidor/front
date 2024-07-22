import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import Login from '..';
import ImageSvg from '@/helpers/ImageSVG';
import { useRouter } from 'next/router';
import { fetchConTokenPost } from '@/helpers/fetch';
import Loading from '@/Components/Atoms/Loading';
import { useAuth } from '@/Context/DataContext';

function LoginConfirmed() {
  const router = useRouter();

  // Capturar el valor del token desde la ruta actual
  const [isEmail, setIsEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isconfirmed, setIsconfirmed] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(true);

  const { l, refresToken } = useAuth();

  const t = l.login;

  async function handleSubmit(email, token) {
    const body = {
      oResults: {
        sEmail: email,
      },
    };

    try {
      const responseData = await fetchConTokenPost('General/?Accion=RegistrarUsuarioPendConf', body, token);
      if (responseData.oAuditResponse.iCode == 29 || responseData.oAuditResponse.iCode == 1) {
        setIsconfirmed(true);
        setError(null);
        setTimeout(() => {
          setShow(false);
        }, 10000);
      } else {
        const message = responseData?.oAuditResponse.sMessage;
        setError(message);
        const refresh = await refresToken(token);
        return refresh;
      }
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Hubo un error en la operación asincrónica.');
    }
  }

  useEffect(() => {
    if (show) {
      const tok = router.query.token;
      const correo = router.query.correo;
      if (correo && tok) {
        setIsLoading(false);
        setIsEmail(correo);
      }

      handleSubmit(correo, tok);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleCloseModal = () => {
    setShow(!show);
  };

  return (
    <section>
      <Login />
      {show && (
        <Modal close={() => setShow(false)}>
          {isconfirmed ? (
            <>
              <ImageSvg name="Check" />
              <div>
                {t['Your email']} {isEmail}
                <h2>
                  {t['was verified']} {t.successfully}
                </h2>
                <div className="actions">
                  <button className="btn_primary small" onClick={handleCloseModal}>
                    {t.Next}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <ImageSvg name="ErrorMessage" />

              <div>
                <p className="errorMessage">{error}</p>
              </div>
            </>
          )}
        </Modal>
      )}
    </section>
  );
}

export default LoginConfirmed;
