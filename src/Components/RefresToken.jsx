import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';

function RefreshToken() {
  const { session, setModalToken, modalToken, l, refresToken, logout } = useAuth();
  const t = l.Modal;

  const handleConfirmRefresh = async () => {
    try {
      const respToken = await refresToken(session.sToken);
      console.log({respToken})
      if (respToken.oAuditResponse.iCode == 1) {
        setModalToken(false); // Cierra el modal después de obtener el nuevo token
        window.location.reload(); // Refresca la página para que las demás peticiones vuelvan a funcionar con el nuevo token
      } else {
        setModalToken(true);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
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

              <button className="btn_primary" onClick={() => handleConfirmRefresh()}>
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


