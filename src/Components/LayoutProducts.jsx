import { useState, useEffect } from 'react';
import ImageSvg from '@/helpers/ImageSVG';
import Link from 'next/link';
import logo from '../../public/img/logoGift.gif';
import ari from '../../public/img/ari.webp';
import Image from 'next/image';
import Modal from './Modal';
import RefreshToken from './RefresToken';
import { useRouter } from 'next/router';
import { useAuth } from '@/Context/DataContext';
import Lang from './Atoms/Lang';

const LayoutProducts = ({ children, menu }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [margen, setMargen] = useState('0rem');
  const [titlePage, setTitlePage] = useState('');
  const [submenuOpen, setSubmenuOpen] = useState({
    Product: menu === 'Product',
    Reporting: menu == 'Reporting',
  });
  const [activeSubmenu, setActiveSubmenu] = useState('');

  const { session, modalToken, logout, l, setSession, isLogout, setIsLogout, isMenuLateralOpen, setMenuLateralOpen } = useAuth();
  const { asPath } = useRouter();
  const t = l.header;
  const router = useRouter();

  const toggleSubmenu = (menuItem) => {
    setSubmenuOpen((prevState) => ({
      ...prevState,
      [menuItem]: !prevState[menuItem],
    }));
  };

  const toggleMenu = () => {
    setMenuLateralOpen(!isMenuLateralOpen);
  };

  const toggleMenuMobile = () => {
    setIsOpenMobile(!isOpenMobile);
  };

  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    if (isMobile) {
      setMargen('0rem');
    } else {
      setMargen(isMenuLateralOpen ? '14rem' : '5rem');
    }

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, [isMobile, isMenuLateralOpen]);

  useEffect(() => {
    const storedSessionLayput = localStorage.getItem('session');
    setSession(JSON.parse(storedSessionLayput));
  }, []);

  useEffect(() => {
    Object.keys(menuItems).forEach((menuItem) => {
      const menuPath = menuItems[menuItem].path;

      if (asPath.startsWith(menuPath)) {
        if (menuItems[menuItem].submenus.length > 0) {
          menuItems[menuItem].submenus.forEach((submenuItem) => {
            const submenuPath = submenuItem.path;
            if (asPath === submenuPath) {
              setActiveSubmenu(submenuPath);
            }
            if (menuPath === '/product' || asPath.startsWith('/product/product')) {
              setActiveSubmenu('/product');
            }
          });
        }
      }
    });
  }, [asPath]);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    setTitlePage(menu === 'Product' ? t['Digital employees'] : t[menu]);
  }, [menu]);

  const menuItems = {
    Product: {
      label: t['Digital employees'],
      icon: 'Products',
      path: '/product',

      submenus: [
        // { label: t.Home, path: '/product' }
        // { label: t['Finance and accounting'], path: '/product/#' }
        // { label: t.Technology, path: '/product/Tecnology' },
        // { label: t['Human Resources'], path: '/product/Human' }
      ],
    },
    Reporting: {
      label: t.Reporting,
      icon: 'Reporting',
      path: '/reporting',
      submenus: [
        { label: t.All, path: '/reporting' },
        { label: t['Finance and accounting'], path: '/reporting/finance/1' },
        { label: t.Technology, path: '/reporting/tecnology/1' },
      ],
    },
    Profile: {
      label: t.Profile,
      icon: 'Users',
      path: '/profile',
      submenus: [],
    },
    chatbot: {
      label: 'Chatbot',
      icon: 'ChatBot',
      path: 'https://seidor.mensajea.chat/',
      submenus: [],
    },

    // Integration: {
    //   label: t.Integration,
    //   icon: 'Integration',
    //   path: '/integration',
    //   submenus: [],
    // },
  };

  return (
    <section className="layoutProducts">
      <section
        className={`menu ${isMenuLateralOpen ? '' : 'menu-close '}`}
        style={{
          visibility: isMobile ? (isOpenMobile ? 'visible' : 'hidden') : 'visible',
        }}
      >
        <div className="menu_Account">
          <div className="imgPerfil">
            <div className="imgPerfil_logo" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
              <Image src={isMenuLateralOpen ? logo : ari} width={isMenuLateralOpen ? 500 : 80} alt="logo" priority />
            </div>
          </div>

          <div className="box-name">
            <div className="box-name_person">
              <ImageSvg name="Person" />
            </div>
            <div className="box-name_name">
              <p>{session?.sPerfilCode === 'ADMIN' ? session?.sPerfilCode : session?.jCompany.razon_social_company}</p>

              <span>{session?.sCorreo}</span>
              {session?.sPerfilCode === 'ADMIN' && <p> Ari v1.2</p>}
            </div>
          </div>

          <div className="lang-box">
            <Lang />
          </div>

          <div>
            <button className="action-open-close" onClick={toggleMenu}>
              <ImageSvg name={isMenuLateralOpen ? 'CloseMenu' : 'OpenMenu'} />
            </button>
          </div>
        </div>

        <nav
          className="menu_nav"
          style={{
            minHeight: isMobile ? '8rem' : '16rem',
            justifyContent: 'flex-start',
          }}
        >
          {Object.keys(menuItems).map((menuItem, index) => (
            <ul className="list-content" key={index}>
              {menuItems[menuItem].submenus.length > 0 ? (
                <li className={`${asPath.startsWith(menuItems[menuItem].path) ? 'activeIcon' : ''}`}>
                  <button onClick={() => toggleSubmenu(menuItem)}>
                    <ImageSvg name={menuItems[menuItem].icon} />
                    <h5>{menuItems[menuItem].label}</h5>
                    {menuItems[menuItem].submenus.length > 0 && (
                      <div className="img-down">
                        <ImageSvg name={submenuOpen[menuItem] ? 'Down' : 'Up'} />
                      </div>
                    )}
                  </button>

                  {menuItems[menuItem].submenus.length > 0 && (
                    <div className="submenu" style={{ display: submenuOpen[menuItem] ? 'flex' : 'none' }}>
                      <ul className="list-content ">
                        {menuItems[menuItem].submenus.map((submenuItem, subIndex) => (
                          <li key={subIndex} className={`${asPath === submenuItem.path || activeSubmenu === submenuItem.path || (menuItems[menuItem] === 'Product' && asPath.startsWith(submenuItem.path)) ? 'active' : ''}`}>
                            <span className="pellet"> </span>
                            <Link href={submenuItem.path}>
                              <h5>{submenuItem.label}</h5>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li key={index} className={`${asPath.startsWith(menuItems[menuItem].path) ? 'active' : ''}`}>
                  <Link href={menuItems[menuItem].path}>
                    <ImageSvg name={menuItems[menuItem].icon} />
                    <h5>{menuItems[menuItem].label}</h5>
                  </Link>
                </li>
              )}
            </ul>
          ))}
        </nav>

        <nav className="menu_nav  menu_profile">
          <div className="box-name ">
            <div className="box-name_person fondoPerfil">
              <ImageSvg name="Users" />
            </div>
            <div className="box-name_name fondoPerfil_color">
              <p>{session?.sUserName}</p>
              <span>{session?.sLastName}</span>
            </div>
          </div>

          <ul className="list-content">
            <li>
              <button onClick={() => handleLogout()}>
                <ImageSvg name="SignOut" />
                <h5>{t['Sign Out']}</h5>
              </button>
            </li>
          </ul>
        </nav>
      </section>

      <section className="menu_children" style={{ marginLeft: margen, width: isMobile ? '100%' : '85%' }}>
        <div className="childrenTilte">
          <div className="titleMenu">
            <div>
              <h3>{titlePage}</h3>
            </div>
            <div className="company">{session?.jCompany.razon_social_company}</div>
          </div>
          <div className="logo-oscuro">
            <Image src={logo} width="100" alt="logoOscuro" priority />
          </div>

          <nav className="menu-header">
            <ul>
              <li className="hamburgerMenu">
                <button className="btn_crud" onClick={toggleMenuMobile}>
                  <ImageSvg name={isOpenMobile ? 'MenuClose' : 'MenuOpen'} />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <section className={`children ${isOpenMobile ? 'children_after' : 'children'}`}>{children}</section>
      </section>

      <div>{modalToken && session && <RefreshToken />}</div>

      {isLogout && (
        <Modal close={() => setIsLogout(false)}>
          <div className="message">
            <ImageSvg name="SignOut" />
          </div>

          <h3> {t['Closing session']} </h3>
        </Modal>
      )}
    </section>
  );
};

export default LayoutProducts;
