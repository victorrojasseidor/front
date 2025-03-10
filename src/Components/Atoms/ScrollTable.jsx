import React, { useRef, useState, useEffect } from 'react';
import ImageSvg from '@/helpers/ImageSVG';

const ScrollableTable = ({ tableRef }) => {
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // Ref para el contenedor de la tabla
  const tableContainerRef = tableRef;
  // Función para verificar si hay desbordamiento
  const checkOverflow = () => {
    if (tableContainerRef.current) {
      const { scrollWidth, clientWidth } = tableContainerRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  // Ejecuta la comprobación de desbordamiento cuando se monta el componente o cambia el tamaño de la ventana
  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  // Función para desplazar la tabla
  const scrollTable = (direction) => {
    if (tableContainerRef.current) {
      const scrollAmount = 100; // Cantidad de desplazamiento
      tableContainerRef.current.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount;
    }
  };

  return (
    <div className="scrollWrapper">
      <div className="scrollButtons" style={{ display: showScrollButtons ? 'flex' : 'none' }}>
        {/* <ScrollableTable />  */}

        <div className="scrollButton left" onClick={() => scrollTable('left')}>
          {/* <ImageSvg name="CloseMenu" /> */}

          <ImageSvg name="Left" />
        </div>

        <div className="scrollButton right" onClick={() => scrollTable('right')}>
          {/* <ImageSvg name="OpenMenu" /> */}
          <ImageSvg name="Rigth" />
        </div>
      </div>
    </div>
  );
};

export default ScrollableTable;
