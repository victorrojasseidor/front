import React from 'react';
import Modal from './Modal';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';
import { useRouter } from 'next/navigation';

function ModalAccess() {
  const { setModalDenied, modalDenied, l, logout } = useAuth();
  const t = l.Modal;
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleReturnHome = () => {
    setModalDenied(false);
    router.push('/product');
  };

  return (
    modalDenied && (
      <Modal close={() => setModalDenied(false)}>
        <div>
          <ImageSvg name="ClosePassword" />
        </div>
        <div className="actions">
          <h2>{t['Access denied']}</h2>
          <div>{t['You do not have permission to view this page with this account']}</div>

          <div className="box-buttons">
            <button className="btn_secundary" onClick={handleLogout}>
              {l.header['Sign Out']}
            </button>

            <button className="btn_primary" onClick={handleReturnHome}>
              {t['Return to Home']}
            </button>
          </div>
        </div>
      </Modal>
    )
  );
}

export default ModalAccess;
