import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { refresToken } from '@/helpers/auth';

function RefreshToken({tok}) {
  const [token, setToken] = useState(null);
  const [showModal, setShowModal] = useState(true);
  console.log("resfres",tok);

  // Función para manejar el clic en el botón de confirmación del modal
  const handleConfirmRefresh = async () => {
    try {
        
      const newToken = await refresToken(tok); // Llama a la función para refrescar el token
      setToken(newToken); // Actualiza el estado con el nuevo token refrescado
      setShowModal(false); // Cierra el modal después de obtener el nuevo token
       // Refresca la página para que las demás peticiones vuelvan a funcionar con el nuevo token
       window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      // Maneja el error si ocurre algún problema al refrescar el token
      // Puedes mostrar un mensaje de error al usuario, o tomar otras acciones apropiadas.
    }
  };

  useEffect(() => {
    // Verifica si el token está próximo a expirar cada vez que el componente se monta o el token cambia.
    if (token && isTokenAboutToExpire(token)) {
      setShowModal(true); // Abre el modal si el token está próximo a expirar
    }
  }, [token]);

  return (
    <div>
      {/* Renderiza el componente Modal solo cuando showModal es true */}
      {showModal && (
        <Modal>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
          <h2 >Your session is about to expire!</h2>

            <div>Please confirm to refresh your token and continue.</div>
            <button className="btn_primary"onClick={handleConfirmRefresh}>Confirm</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default RefreshToken;


//nataliaespin
//U2VydmljZVRva2VuLzIwMjMwNzMwMTkxMDAwMzY4MzIyMTcwLzQ4NjY0NDQyNTU1NA
//U2VydmljZVRva2VuLzIwMjMwNzMwMTkxMDAwMzY4MzIyMTcwLzQ4NjY0NDQyNTU1NA