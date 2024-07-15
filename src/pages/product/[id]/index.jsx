/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { componentsProduct } from '@/Components/CompProducts/componentsProduct';
import LayoutConfig from '@/Components/CompProducts/LayoutConfig';

export default function productId() {
  const [activeTab, setActiveTab] = useState(0);
  const [component, setComponent] = useState(null);
  const router = useRouter();
  const { iId, iIdProdEnv, type, pStatus, idEmpresa } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    const selectComponentes = componentsProduct?.find(
      (p) => p.iId === parseInt(iId)
    );
    setComponent(selectComponentes);

    // Establecer la pestaña activa basada en el tipo
    setActiveTab(getTypeValueTab(type));
  }, [router.isReady, iId, type, iIdProdEnv]); // Se ejecutará cuando cambie iId, type o iIdProdEnv

  function getTypeValueTab(typeTab) {
    switch (typeTab) {
      case 'freetrial':
        return 0;
      case 'configuration':
        return 1;
      case 'apiconfiguration':
        return 2;
      case 'documentation':
        return 3;
      default:
        return 3; // O cualquier valor adecuado
    }
  }

  return (
    <LayoutConfig
      id={iId}
      idEmpresa={Number(idEmpresa)}
      iIdProdEnv={parseInt(iIdProdEnv)}
      defaultTab={getTypeValueTab(type) ? getTypeValueTab(type) : activeTab}
    >
      {component?.configuration}
    </LayoutConfig>
  );
}
