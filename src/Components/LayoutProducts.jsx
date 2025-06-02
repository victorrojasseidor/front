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
import ModalAccess from './ModalAccess';

const LayoutProducts = ({ children, menu }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [withMenu, setWithMenu] = useState('200px');

  const [titlePage, setTitlePage] = useState('');
  const [submenuOpen, setSubmenuOpen] = useState({
    Product: menu === 'Product',
    Reporting: menu == 'Reporting',
  });
  const [activeSubmenu, setActiveSubmenu] = useState('');

  const { session, modalToken, logout, l, setSession, isLogout, setIsLogout, isMenuLateralOpen, setMenuLateralOpen, modalDenied } = useAuth();
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
      setWithMenu('0rem');
    } else {
      setWithMenu(isMenuLateralOpen ? '200px' : '100px');
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
      icon: 'Profile',
      path: '/profile',
      submenus: [],
    },
    // chatbot: {
    //   label: 'Chatbot',
    //   icon: 'ChatBot',
    //   path: 'https://seidor.mensajea.chat/',
    //   submenus: [],
    // },

    Support: {
      label: t.Support,
      icon: 'Support',
      path: '/support/1',
      submenus: [],
    },
  };

  const menuMovil = [
    // {
    //   label: 'Ari',
    //   link: '/#front',
    //   submenus: [],
    // },

    {
      label: t['Digital employees'],
      link: '/product',
      submenus: [],
    },
    {
      label: t.Reporting,
      link: '/reporting',
      submenus: [
        { label: t.All, link: '/reporting' },
        { label: t['Finance and accounting'], link: '/reporting/finance/1' },
        { label: t.Technology, link: '/reporting/tecnology/1' },
      ],
    },

    {
      label: t.Profile,
      link: '/profile',
      submenus: [],
    },

    {
      label: 'Chatbot',
      link: 'https://seidor.mensajea.chat/',
      submenus: [],
    },

    {
      label: t.Support,
      link: '/support',
      submenus: [],
    },
  ];

  return (
    <>
      <section className="layout-product">
        <div className="navigation-box">
          <div className={`menu_Account ${isMenuLateralOpen ? '' : 'menu_Account-close '}`}>
            <div className="imgPerfil">
              <div className="imgPerfil_logo" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
                <Image src={isMenuLateralOpen ? logo : ari} width={isMenuLateralOpen ? 500 : 80} alt="logo" priority />
              </div>
            </div>

            <div className="titlePage">
              <Link className="navegation" href={'/product'}>
                {router.asPath == '/product' ? '' : <ImageSvg name="Return" />} {t.Home}
              </Link>

              <div>
                <h4 className="navegation_title"> {titlePage}</h4>
              </div>
            </div>
          </div>

          <div className="profile-box">
            <div className="languajes-box">
              <Lang />
            </div>

            <div className="box-name">
              <div className="box-name_person">
                <ImageSvg name="Person" />
              </div>
              <div className="box-name_name">
                <p>
                  {session?.sPerfilCode === 'ADMIN' ? session?.sPerfilCode : session?.jCompany.razon_social_company} - {session?.sPerfilCode === 'ADMIN' && 'Ari:v2'}
                </p>

                <span style={{ textTransform: 'capitalize' }}>
                  {session?.sUserName} {session?.sLastName}
                </span>
              </div>
            </div>
          </div>

          <div className="movil-content">
            <ul>
              <li className="hamburgerMenu">
                <button className="btn_crud" onClick={toggleMenuMobile}>
                  <ImageSvg name={isOpenMobile ? 'MenuClose' : 'MenuOpen'} />
                </button>
              </li>
              <div className="nav-movil">
                <div className={`movil-options ${isOpenMobile ? 'openMovil' : ''}`}>
                  <div className="content-personal">
                    <div className="box-name">
                      <div className="box-name_person">
                        <ImageSvg name="Person" />
                      </div>

                      <div className="box-name_name">
                        <p>
                          {session?.sPerfilCode === 'ADMIN' ? session?.sPerfilCode : session?.jCompany.razon_social_company} - {session?.sPerfilCode === 'ADMIN' && 'Ari:v2'}
                        </p>
                        <span style={{ textTransform: 'capitalize' }}>
                          {session?.sUserName} {session?.sLastName}
                        </span>
                      </div>
                    </div>

                    <div className="languajes-box">
                      <Lang />
                    </div>
                  </div>

                  {menuMovil?.map((menu) => (
                    <li className="languaje-white list-options" key={menu.label}>
                      <Link href={menu.link} scroll={false} onClick={() => setIsOpenMobile(!isOpenMobile)} className={`${titlePage == menu.label ? 'active' : ''}`}>
                        {menu.label}
                      </Link>

                      {menu.submenus.length > 0 && (
                        <div className="submenu">
                          {menu.submenus.map((sub, index) => (
                            <Link href={sub.link} key={index} scroll={false} onClick={() => setIsOpenMobile(!isOpenMobile)} className={router.asPath.startsWith(sub.link) ? 'active' : ''}>
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}

                  <li className="signOut-movil">
                    <button onClick={() => handleLogout()}>
                      <ImageSvg name="SignOut" />
                      <h5>{t['Sign Out']}</h5>
                    </button>
                  </li>
                </div>
              </div>
            </ul>
          </div>
        </div>

        <section className="layoutProducts">
          <section
            className={`menu ${isMenuLateralOpen ? '' : 'menu-close '}`}
            style={{
              visibility: isMobile ? (isOpenMobile ? 'visible' : 'hidden') : 'visible',
              width: withMenu,
            }}
          >
            <nav
              className="menu_nav"
              style={{
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
              <div className="toogle-button">
                <button className="action-open-close" onClick={toggleMenu}>
                  <ImageSvg name={isMenuLateralOpen ? 'CloseMenu' : 'OpenMenu'} />
                </button>
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

          <section className="menu_children">
            <section className={`children`} style={{ marginLeft: withMenu, width: `calc(100% - ${withMenu})` }}>
              {children}
            </section>
          </section>

          <div>{modalToken && session && <RefreshToken />}</div>
          <div>{modalDenied && session && <ModalAccess />}</div>

          {isLogout && (
            <Modal close={() => setIsLogout(false)}>
              <div className="message">
                <ImageSvg name="SignOut" />
              </div>

              <h3> {t['Closing session']} </h3>
            </Modal>
          )}
        </section>
      </section>
    </>
  );
};

export default LayoutProducts;
