import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';

function RefreshToken() {
  const { setModalToken, modalToken, l, refresToken, logout } = useAuth();
  const t = l.Modal;

  const handleConfirmRefresh = async () => {
    try {
      const respToken = await refresToken();
      if (respToken.oAuditResponse.iCode == 1) {
        setModalToken(false); 
        window.location.reload(); 
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


