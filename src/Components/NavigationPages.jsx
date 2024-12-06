import React from 'react';
import Lang from './Atoms/Lang';
import ImageSvg from '@/helpers/ImageSVG';
import { useAuth } from '@/Context/DataContext';

export default function NavigationPages({ title, children }) {
  const { session } = useAuth();

  return (
    // <div className="navigation-box">
      
    //     <div className="titlePage">
    //       <div className="navegation">{children}</div>
    //       <div>
    //         <h2 className="navegation_title">{title}</h2>
    //       </div>
    //     </div>

    //     <div className="profile-box">
    //       <div className="languajes-box">
    //         <Lang />
    //       </div>

    //       <div className="box-name">
    //         <div className="box-name_person">
    //           <ImageSvg name="Person" />
    //         </div>
    //         <div className="box-name_name">
    //           <p>{session?.sPerfilCode === 'ADMIN' ? session?.sPerfilCode : session?.jCompany.razon_social_company}</p>

    //           <span>{session?.sCorreo}</span>
    //           {session?.sPerfilCode === 'ADMIN' && <p> Ari v1.2</p>}
    //         </div>
    //       </div>
    //     </div>
    
    // </div>

    <p>   </p>

  );
}
