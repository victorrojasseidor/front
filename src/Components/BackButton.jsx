import React from 'react'
import { useRouter } from 'next/router';

const BackButton = () => {
    const router = useRouter();

    const goBackToProduct = () => {
        window.location.href = '/product';
      };

    return (
        <div>
          <button onClick={goBackToProduct}>Regresar a Product</button>
      </div>
    );
  };

export default BackButton

