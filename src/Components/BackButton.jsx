import React from 'react';
import { useRouter } from 'next/router';
import ImageSvg from '@/helpers/ImageSVG';

const BackButton = () => {
  const router = useRouter();

  const goBackToProduct = () => {
    window.location.href = '/product';
  };

  return (
    <div className="back">
      <button onClick={goBackToProduct}>
        <ImageSvg name="Back" />
        Back
      </button>
    </div>
  );
};

export default BackButton;
