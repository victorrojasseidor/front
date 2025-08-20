/* eslint-disable prettier/prettier */
import React from 'react'

export default function SftpUiPath() {

    const sendToUiPathQueue = async () => {
    try {
      const response = await fetch(
        'https://cloud.uipath.com/seidovnzrjnf/Tenant_DEV_Pruebas/odata/Queues/UiPathODataSvc.AddQueueItem',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-UIPATH-OrganizationUnitId': '384752',
            Authorization:
              'Bearer rt_1947F15FEB1A620BE8D972AB24FCC13E99E708F72B223DA05136488D6BE60AA2-1',
          },
          body: JSON.stringify({
            itemData: {
              Name: 'test2',
              SpecificContent: {
                'Name@odata.type': '#String',
                Name: 'Leonardo Dorado',
                Age: 24,
                Status: false,
              },
              Reference: 'Demo',
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Error:', error);
        alert('❌ Error al enviar item');
        return;
      }

      const data = await response.json();
      console.log('✅ Respuesta exitosa:', data);
      alert('✅ Enviado correctamente a UiPath');
    } catch (err) {
      console.error('❌ Error de red:', err);
      alert('Error de red al conectar con UiPath');
    }
  };

  return (
    <div className="">
      <h2 >Componente SFTP UiPath</h2>
      <button
        onClick={() => sendToUiPathQueue()}
        className="btn_primary"
      >
        Enviar a UiPath 
      </button>
    </div>
  );
};

