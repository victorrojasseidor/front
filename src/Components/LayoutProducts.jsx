import { useState, useEffect } from "react";
import ImageSvg from "@/helpers/ImageSVG";
import Link from "next/link";
// import "../../styles/_styles.scss";
import logo from "../../public/img/logoseidor.png";
import Image from "next/image";
import perfil from "../../public/img/perfil.jpg";
import IconEN from "../../public/icons/eeuu.svg";
import IconES from "../../public/icons/spain.svg";
import { BsDisplay } from "react-icons/bs";
// import { DataContextProvider } from "@/Context/DataContext";

import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/DataContext";

const LayoutProducts = ({ children }) => {
  const [isMenuLateralOpen, setMenuLateralOpen] = useState(true);
  const [isSpanish, setIsSpanish] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [margen, setMargen] = useState("0rem");

  const toggleMenu = () => {
    setMenuLateralOpen(!isMenuLateralOpen);
  };

  const { session, setSession, logout, empresa, setEmpresa } = useAuth();

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    
    // Buscar la empresa seleccionada en el array oEmpresa por su razón social
    const selectedEmpresa = session.oEmpresa.find((empres) => empres.razon_social_empresa === selectedValue);
    
    // Verificar si se encontró la empresa
    if (selectedEmpresa) {
      // Guardar tanto la razón social como el ID en el almacenamiento local
      localStorage.removeItem("selectedEmpresa");
      localStorage.setItem("selectedEmpresa", JSON.stringify(selectedEmpresa));
      
      // Actualizar el estado 'empresa' con el objeto que contiene la razón social y el ID
      setEmpresa({ 
        id_empresa:selectedEmpresa.id_empresa,
        razon_social_empresa:selectedEmpresa.razon_social_empresa,
        ruc_empresa:selectedEmpresa.ruc_empresa});
    }
  };



  const toggleMenuMobile = () => {
    setIsOpenMobile(!isOpenMobile);
  };

  //detectar que la pantalla estpa en modo
  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    if (isMobile) {
      setMargen("0rem");
    } else {
      if (isMenuLateralOpen) {
        setMargen("13rem");
      } else {
        setMargen("7rem");
      }
    }

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, [isMobile, isMenuLateralOpen]);

  const handleClickLanguaje = () => {
    setIsSpanish(!isSpanish);
    // Aquí puedes realizar acciones adicionales según el idioma seleccionado
  };



  const handleLogout = () => {
    console.log("log out");
    setSession(null);
    localStorage.removeItem("session");
    localStorage.removeItem("selectedEmpresa");
    // router.push("/login");
  };

  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
   
    // setTimeout(() => {
    //   getProducts();
    // }, 100);
    
  }, [session]); 

  return (
    <section className="layoutProducts">
      <section className={`menu ${isMenuLateralOpen ? " " : "menu-close "}`} style={{ top: isMobile ? "58px" : "6px", marginLeft: isMobile ? "0,5rem" : "0rem", display: isMobile ? (isOpenMobile ? "block" : "none") : "block" }}>
        <div className="menu_Account">
          <div className="imgPerfil">
            <Image src={perfil} width={100} alt="Robot" />
            <button onClick={toggleMenu}>
              <ImageSvg name={isMenuLateralOpen ? "CloseMenu" : "OpenMenu"} />
            </button>
          </div>

          <div className="gradientSelect">
            <select value={empresa} onChange={handleSelectChange}>
              {/* <option value="">Seleccione una empresa</option> */}
              {session?.oEmpresa.map((empres) => (
                <option key={empres.id_empresa} value={empres.razon_social_empresa}>
                  {empres.razon_social_empresa}
                </option>
              ))}
            </select>
          </div>

          <h5>
            <p>{session?.jCompany.razon_social_company}</p>
          </h5>
          <button>
            <ImageSvg name="Edit" />
            <h5> Edit profile</h5>
          </button>
        </div>

        <nav className="menu_nav">
          <ul>
            <li>
              <ImageSvg name="Products" />
              <Link href="/product">Digital employees</Link>
            </li>
            <li>
              <ImageSvg name="Users" />
              <Link href="/Users">Users</Link>
            </li>
            <li>
              <ImageSvg name="Dashboard" />
              <Link href="/Dashboard">Dashboard</Link>
            </li>
            <li>
              <ImageSvg name="APIS" />
              <Link href="/APIS">APIS</Link>
            </li>

            <li>
              <ImageSvg name="Schedule" />
              <Link href="/Schedule">Schedule </Link>
            </li>

            <li>
              <ImageSvg name="Support" />
              <Link href="/Support">Support </Link>
            </li>
          </ul>
        </nav>

        <div className="menu_logo">
          <Image src={logo} width={isMenuLateralOpen ? 100 : 70} alt="logo" priority={true} />
        </div>
      </section>

      <section className="menu_children" style={{ marginLeft: margen }}>
        <nav className="menu-header">
          <ul>
            <li className="hamburgerMenu">
              <button className="btn_icons hamburger" onClick={toggleMenuMobile}>
                <ImageSvg name={isOpenMobile ? "MenuClose" : "MenuOpen"} />
              </button>

              {/* <button className='btn_icons' onClick={toggleMenuMobile} >
          <ImageSvg name={isMenuOpen? "MenuOpen":"MenuClose"} />
        </button> */}
            </li>

            <li>
              <button className="btn_icons">
                <ImageSvg name="Notifications" />
              </button>
            </li>

            <li>
              <button onClick={handleClickLanguaje} className="btn_icons">
                <Image src={isSpanish ? IconES : IconEN} width={30} alt="imglanguage" />
                <h5>{isSpanish ? "EN" : "ES"}</h5>

                <ImageSvg name="Change" />
              </button>
            </li>
            <li>
              <button className="btn_icons" onClick={handleLogout}>
                <ImageSvg name="SignOut" />
              </button>
            </li>
          </ul>
        </nav>

        <div className="childrenTilte">
          <h2>Products</h2>
          <p>
            Welcome, <span> {empresa?.razon_social_empresa} 👋 </span>{" "}
          </p>
        </div>

        {children}
      </section>
    </section>
  );
};

export default LayoutProducts;
