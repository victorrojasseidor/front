import React from 'react';
import Lang from './Atoms/Lang';
import ImageSvg from '@/helpers/ImageSVG';
import { useAuth } from '@/Context/DataContext';

export default function NavigationPages({ title, children , product }) {
  const { session } = useAuth();

  const NameEmpresa = (id) => {
    const filterEmpresa = session?.oEmpresa.find((p) => p.id_empresa == id);
    return filterEmpresa?.razon_social_empresa;
  };




  return (
  

     <p>
  <span>{product?.sName}</span>
     </p>

  );
}
