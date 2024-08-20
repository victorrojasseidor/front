import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';

function RefreshToken() {
  const [setToken] = useState(null);

  const { session, setModalToken, modalToken, l, refresToken, logout } = useAuth();
  const t = l.Modal;

  const handleConfirmRefresh = async () => {
    try {
      const newToken = await refresToken(session.sToken); // Llama a la función para refrescar el token
      // setToken(newToken); // Actualiza el estado con el nuevo token refrescado
      if (newToken.oAuditResponse.iCode === 1) {
        setModalToken(false); // Cierra el modal después de obtener el nuevo token
        // Refresca la página para que las demás peticiones vuelvan a funcionar con el nuevo token
        window.location.reload();
      } else {
        setModalToken(true); // Cierra el modal después de obtener el nuevo token
      }
    } catch (error) {
      console.log('Error:', error);
      // Maneja el error si ocurre algún problema al refrescar el token
      // Puedes mostrar un mensaje de error al usuario, o tomar otras acciones apropiadas.
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {/* Renderiza el componente Modal solo cuando showModal es true */}
      {modalToken && (
        <Modal close={() => setModalToken(false)}>
          <div>
            <ImageSvg name="Refresh" />
          </div>
          <div className="actions">
            <h2>{t['Your session is about to expire!']}</h2>
            <div>{t['Please confirm to refresh your token and continue']}</div>

            <div className="box-buttons">
              <button className="btn_secundary" onClick={() => handleLogout()}>
                {l.header['Sign Out']}
              </button>
              <button className="btn_primary" onClick={handleConfirmRefresh}>
                {t.Confirm}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default RefreshToken;

// nataliaespin
// U2VydmljZVRva2VuLzIwMjMwNzMwMTkxMDAwMzY4MzIyMTcwLzQ4NjY0NDQyNTU1NA
// U2VydmljZVRva2VuLzIwMjMwNzMwMTkxMDAwMzY4MzIyMTcwLzQ4NjY0NDQyNTU1NA
