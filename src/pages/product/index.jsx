/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProducts from '@/Components/LayoutProducts';
import ImageSvg from '@/helpers/ImageSVG';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Changed from 'next/navigation'
import { useAuth } from '@/Context/DataContext';
import NavigationPages from '@/Components/NavigationPages';
import Loading from '@/Components/Atoms/Loading';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { fetchConTokenPost } from '@/helpers/fetch';
import Counter from '@/Components/Atoms/Counter';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedFilterType, setSelectedFilterType] = useState(null);
  const [product, setProduct] = useState({});
  const [requestError, setRequestError] = useState('');
  // const [empresa, setEmpresa] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [hiredProduct, setHiredProduct] = useState('0');
  const [clasTrans, setClasTrans] = useState('');
  const [dataCabecera, setDataCabecera] = useState(null);
  const { session, setModalToken, logout, l, empresa, setEmpresa, idCountry, getProducts } = useAuth();

  // Nuevo estado para opciones de búsqueda de empresas
  const [companyOptions, setCompanyOptions] = useState([]);

  const t = l.Products;

  const router = useRouter();
  useEffect(() => {
    if (session && empresa) {
      getProductscard();
      ConsultaCabeceraEmpresa();
    }
  }, [session, empresa, l, selectedFilterType]);

  async function getProductscard() {
    setIsLoading(true);
    try {
      const token = session?.sToken;
      const idEmpresa = empresa.id_empresa;
      const responseData = await getProducts(idEmpresa, token, idCountry);

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;
        if (selectedFilterType === 'CLA_01' || selectedFilterType === 'CLA_02' || selectedFilterType === 'CLA_03') {
          const filtertypeProduct = data.filter((product) => product.sCodeClasificacion === String(selectedFilterType));

          setProduct(filtertypeProduct);
        } else {
          setProduct(data);
        }

        setModalToken(false);
        setRequestError(null);

        const filterHiredProduct = responseData.oResults.filter((product) => product.iCodeStatus === 23 || product.iCodeStatus === 28);
        setHiredProduct(filterHiredProduct.length);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
        // setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);
        console.log('error', errorMessage);
        setTimeout(() => {
          setRequestError(null);
        }, 1000);
      }
    } catch (error) {
      console.error('error', error);
      setModalToken(true);
      setRequestError(error);
    } finally {
      setIsLoading(false); // Ocultar el indicador de carga después de que la petición se complete
    }
  }

  async function ConsultaCabeceraEmpresa() {
    setIsLoading(true);

    const idEmpresa = empresa.id_empresa;

    const body = {
      oResults: {
        iIdEmpresa: idEmpresa,
      },
    };

    try {
      const token = session?.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=ConsultaCabeceraEmpresa', body, token);
      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;
        setDataCabecera(data);
        setModalToken(false);
        setRequestError(null);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
        // setModalToken(true)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);
        console.log('error', errorMessage);
        setTimeout(() => {
          setRequestError(null);
        }, 1000);
      }
    } catch (error) {
      console.error('error', error);
      setModalToken(true);
      setRequestError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Actualiza las opciones de búsqueda de empresas cuando cambia la lista de empresas en session
    if (session?.oEmpresa) {
      setCompanyOptions(session?.oEmpresa);
    }

    setTimeout(() => {
      setClasTrans('style-transparent');
    }, 3000);
  }, [session]);

  const handleCompanyInputChange = (event, newValue) => {
    // Actualiza la empresa seleccionada
    if (newValue) {
      // setEmpresa(newValue)
      const DataEmpresa = session?.oEmpresa.find((empres) => empres.razon_social_empresa === newValue.razon_social_empresa);

      const selectedEmpresa = {
        id_empresa: DataEmpresa.id_empresa,
        razon_social_empresa: DataEmpresa.razon_social_empresa,
        ruc_empresa: DataEmpresa.ruc_empresa,
      };
      // Guardar la empresa seleccionada en el localStorage
      localStorage.setItem('selectedEmpresa', JSON.stringify(selectedEmpresa));
      setEmpresa(selectedEmpresa);
    }
  };

  useEffect(() => {
    // Comprobar si hay una empresa seleccionada en el localStorage
    const storedEmpresa = localStorage.getItem('selectedEmpresa');
    if (storedEmpresa) {
      const selectedEmpresa = JSON.parse(storedEmpresa);
      setEmpresa(selectedEmpresa);
    } else {
      const firstEmpresa = session?.oEmpresa[0];
      setEmpresa(firstEmpresa);
    }
  }, []);

  useEffect(() => {
    const filterResults = () => {
      let results = product;
      if (selectedFilter !== null) {
        if (selectedFilter === 25) {
          results = results.filter((product) => product.iCodeStatus === 27 || product.iCodeStatus === 28);
        } else {
          results = results?.filter((product) => product.iCodeStatus === selectedFilter);
        }
      }

      if (searchQuery) {
        results = results.filter((product) => product.sName.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      setSearchResults(results);
    };

    filterResults();
  }, [searchQuery, selectedFilter, product, selectedFilterType]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handleFilterType = (filter) => {
    setSelectedFilterType(filter);
  };

  const handleSearch = () => {
    setSearchQuery('');
    setSelectedFilter(null);
  };

  const imgProduct = (id) => {
    if (id === 1) {
      return 'IconEstractos';
    } else if (id === 2) {
      return 'IconTipo';
    } else if (id === 3) {
      return 'IconSunat';
    } else if (id === 5) {
      return 'IconInvoce';
    } else if (id === 4) {
      return 'IconCaptcha';
    } else if (id === 6) {
      return 'IconImage';
    } else if (id === 7) {
      return 'IconMass';
    } else if (id === 8) {
      return 'IconSupplier';
    } else return 'IconCard';
  };

  function calcularDiasRestantes(day) {
    // Obtener la fecha actual en UTC
    const fechaActual = new Date();

    // Crear la fecha objetivo en UTC
    const fechaObjetivo = new Date(day);

    // Calcular la diferencia en milisegundos
    const diferenciaEnMilisegundos = fechaObjetivo - fechaActual;

    // Calcular los días restantes
    const diasRestantes = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    return diasRestantes;
  }

  const handleLink = (ruta) => {
    router.push(ruta);
  };

  const renderButtons = (data) => {
    const dayLef = parseInt(calcularDiasRestantes(data.sDateEnd), 10);

    const status = data.iCodeStatus;

    if (status === 28 && dayLef >= 0) {
      return (
        <button className="btn_primary" onClick={() => handleLink(`/product/product?type=configuration&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}>
          <span> </span> {t.Setup} <span> </span>
        </button>
      );
    } else if (status === 23 && dayLef >= 0) {
      return (
        <button className="btn_primary" onClick={() => handleLink(`/product/product?type=configuration&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}>
          <span> </span> {t.Edit} <span> </span>
        </button>
      );
    } else if (status === 31) {
      return (
        <button className="btn_primary" onClick={() => handleLink(`/product/product?type=freetrial&iIdProdEnv=${data.iIdProdEnv}&iId=${data.iId}&pStatus=${data.iCodeStatus}&idEmpresa=${empresa.id_empresa}`)}>
          {t['Try free']}
        </button>
      );
    } else if (status === 27) {
      return <p />;
    } else if (dayLef <= 0) {
      return (
        <>
          <button className="btn_primary" onClick={() => handleLink('https://www.innovativa.la/contacto')}>
            {t['Contact technical support']}
          </button>
        </>
      );
    } else {
      return (
        <Link href="#">
          {' '}
          <p> </p>{' '}
        </Link>
      );
    }
  };

  return (
    <LayoutProducts menu="Product">
      {!session && <Loading />}

      <div className="products">
        <NavigationPages title={t['Digital employees']}>
          <Link href="/product">{t.Home}</Link>
        </NavigationPages>

        <div className="products_empresa">
          <div className="box-empresa">
            {/* Utiliza el componente Autocomplete en lugar del Select para el selector de empresas */}
            <Autocomplete
              value={empresa}
              onChange={handleCompanyInputChange}
              // sx={{ minWidth: 370 }}
              sx={{
                minWidth: 255,
                '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' },
              }}
              options={companyOptions}
              getOptionLabel={(option) => option.razon_social_empresa}
              renderInput={(params) => <TextField {...params} label={t['To company:']} />}
              isOptionEqualToValue={(option, value) => option.id_empresa === value.id_empresa}
            />
          </div>
        </div>

        <div className="products_home">
          <span className="outstanding-image" />

          <div className="welcome">
            <h2>
              {t.Welcome},<span className="text"> {empresa?.razon_social_empresa} </span>
            </h2>
            <p> {t['Our digital employees work to improve your productivity']}</p>
          </div>

          <div className={`reporting-box slider ${clasTrans}`}>
            <div className="report-content">
              <div className="report blue">
                <div className="report_icon  ">
                  <ImageSvg name="ReportDigital" />
                </div>

                <div className="report_data">
                  <article>{t['Digital employees']}</article>
                  <h2> {hiredProduct} </h2>

                  <p>
                    <ImageSvg name="ArrowUp" /> <span> {t.working} </span> {t['for you']}{' '}
                  </p>
                </div>
              </div>

              <div className="liner" />

              <div className="report green">
                <div className="report_icon  ">
                  <ImageSvg name="ReportTime" />
                </div>

                <div className="report_data">
                  <article>{t['Time saved']}</article>
                  <h2>{dataCabecera && dataCabecera.tiempo ? <Counter initialValue={0} finalValue={dataCabecera.tiempo} /> : dataCabecera?.tiempo} hrs</h2>

                  <p>
                    <ImageSvg name="ArrowUp" /> <span> {dataCabecera?.porcentaje} % </span> {t['this month']}{' '}
                  </p>
                </div>
              </div>
              <div className="liner" />

              <div className="report red">
                <div className="report_icon  ">
                  <ImageSvg name="ReportBussines" />
                </div>

                <div className="report_data">
                  <article>{t['Bussines agility']}</article>
                  <h2>{dataCabecera && dataCabecera?.agilidad ? <Counter initialValue={10} finalValue={dataCabecera?.agilidad} /> : dataCabecera?.agilidad} %</h2>
                  <p>
                    <ImageSvg name="ArrowUp" /> <span> {dataCabecera?.porcentaje_agilidad} %</span> {t.more}{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="products_filter-types">
          <button onClick={() => handleFilterType(null)} className={`btn_filter ${selectedFilterType === null ? 'active' : ''}`}>
            <ImageSvg name="All" /> <p> {t.All} </p>
          </button>
          <button onClick={() => handleFilterType('CLA_01')} className={`btn_filter ${selectedFilterType === 'CLA_01' ? 'active' : ''}`}>
            <ImageSvg name="Financy" /> <p>{t['Finance and accounting']} </p>
          </button>

          <button onClick={() => handleFilterType('CLA_02')} className={`btn_filter ${selectedFilterType === 'CLA_02' ? 'active' : ''}`}>
            <ImageSvg name="Tecnology" /> <p> {t.Technology}</p>
          </button>
          <button onClick={() => handleFilterType('CLA_03')} className={`btn_filter ${selectedFilterType === 'CLA_03' ? 'active' : ''}`}>
            <ImageSvg name="Human" /> <p> {t['Human Resources']}</p>
          </button>
        </div>

        <div className="products_box-filterSearch">
          <div className="searchButton">
            <button onClick={handleSearch}>
              <ImageSvg name="Search" />
            </button>
            <input type="text" placeholder={t.Search} value={searchQuery} onChange={handleInputChange} />
          </div>

          <div className="filterButtons">
            <button onClick={() => handleFilter(null)} className={`btn_filter ${selectedFilter === null ? 'active' : ''}`}>
              {t.All}
            </button>
            <button onClick={() => handleFilter(23)} className={`btn_filter ${selectedFilter === 23 ? 'active' : ''}`}>
              {t.Configured}
            </button>
            <button onClick={() => handleFilter(25)} className={`btn_filter ${selectedFilter === 25 || selectedFilter === 27 || selectedFilter === 28 ? 'active' : ''}`}>
              {t.Pending}
            </button>
            <button onClick={() => handleFilter(31)} className={`btn_filter ${selectedFilter === 31 ? 'active' : ''}`}>
              {t['Not hired']}
            </button>
          </div>
        </div>

        {isLoading && <Loading />}

        <div className="products_cards">
          <ul>
            {searchResults.length > 0 &&
              searchResults.map((product) => (
                <li key={product.iId} className={`card ${product.sCodeClasificacion === String('CLA_01') ? 'financy' : product.sCodeClasificacion === String('CLA_02') ? 'tecnology' : product.sCodeClasificacion === String('CLA_03') ? 'human' : ''}`}>
                  <span className="card_type">
                    {product.sClasificacion}

                    {session?.sPerfilCode === 'ADMIN' && (
                      <Link href={`/product/product?type=apiconfiguration&iIdProdEnv=${product.iIdProdEnv}&iId=${product.iId}&pStatus=${product.iCodeStatus}&idEmpresa=${empresa.id_empresa}`}>
                        {' '}
                        <p className="admin">
                          {' '}
                          <ImageSvg name="Admin" />{' '}
                        </p>{' '}
                      </Link>
                    )}
                  </span>

                  <div className="card_name">
                    <h4> {product.sName}</h4>

                    {product.iCodeStatus === 23 || product.iCodeStatus === 28 ? (
                      <p className="dayLetf">
                        {/* <ImageSvg name='Time' /> */}
                        {calcularDiasRestantes(product.sDateEnd) >= 0 ? (
                          <span style={{ color: '#7D86A2' }}>
                            {' '}
                            {t['Days left:']} {calcularDiasRestantes(product.sDateEnd)}
                          </span>
                        ) : (
                          <span className="" style={{ color: 'red' }}>
                            {' '}
                            {t['Permit expired ago']} {-1 * calcularDiasRestantes(product.sDateEnd)} {t.days}{' '}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="dayLetf" style={{ color: 'white' }}>
                        .......
                      </p>
                    )}
                  </div>

                  <div className="card_actions">
                    <div className="box-img">
                      <div className="type_icon">
                        <ImageSvg name={imgProduct(product.iId)} />
                      </div>
                    </div>

                    <div className="status-box">
                      <p>{product.sDescStatus}</p>

                      {product.iId == 4 && (product.iCodeStatus === 23 || product.iCodeStatus === 28) ? (
                        <button className="btn_primary" onClick={() => handleLink('/reporting/tecnology/1')}>
                          <span> {l.Reporting.Reporting} </span>
                        </button>
                      ) : (
                        renderButtons(product)
                      )}
                    </div>
                  </div>
                </li>
              ))}

            {/* productos añadidos por el momento */}

            <li
              className="card financy"
              style={{
                display: (selectedFilter === 31 || !selectedFilter) && (selectedFilterType === 'CLA_01' || !selectedFilterType) && searchQuery == '' ? 'flex' : 'none',
              }}
            >
              <span className="card_type">{t['Finance and accounting']}</span>

              <div className="card_name">
                <h4> {t['Utility Bill Registration']}</h4>

                <p className="dayLetf">
                  {/* <ImageSvg name='Time' /> */}
                  {/* {t['Days left:']} .. */}
                </p>
              </div>

              <div className="card_actions">
                <div className="box-img">
                  <div className="type_icon">
                    <ImageSvg name={imgProduct(3)} />
                  </div>
                </div>

                <div className="status-box">
                  <p> {t['Not hired']}</p>
                  <Link href="https://www.innovativa.la/digitalemployee">{t['View more']}</Link>
                </div>
              </div>
            </li>

            <li
              className="card financy"
              style={{
                display: (selectedFilter === 31 || !selectedFilter) && (selectedFilterType === 'CLA_01' || !selectedFilterType) && searchQuery == '' ? 'flex' : 'none',
              }}
            >
              <span className="card_type">{t['Finance and accounting']}</span>

              <div className="card_name">
                <h4> {t['Mass update of deduction records']}</h4>

                <p className="dayLetf">
                  {/* <ImageSvg name='Time' /> */}
                  {/* {t['Days left:']} .. */}
                </p>
              </div>

              <div className="card_actions">
                <div className="box-img">
                  <div className="type_icon">
                    <ImageSvg name={imgProduct(7)} />
                  </div>
                </div>

                <div className="status-box">
                  <p> {t['Not hired']}</p>
                  <Link href="https://www.innovativa.la/digitalemployee">{t['View more']}</Link>
                </div>
              </div>
            </li>

            <li
              className="card financy"
              style={{
                display: (selectedFilter === 31 || !selectedFilter) && (selectedFilterType === 'CLA_01' || !selectedFilterType) && searchQuery == '' ? 'flex' : 'none',
              }}
            >
              <span className="card_type">{t['Finance and accounting']}</span>

              <div className="card_name">
                <h4> {t['Supplier validation']}</h4>

                <p className="dayLetf">
                  {/* <ImageSvg name='Time' /> */}
                  {/* {t['Days left:']} .. */}
                </p>
              </div>

              <div className="card_actions">
                <div className="box-img">
                  <div className="type_icon">
                    <ImageSvg name={imgProduct(8)} />
                  </div>
                </div>

                <div className="status-box">
                  <p> {t['Not hired']}</p>
                  <Link href="https://www.innovativa.la/digitalemployee">{t['View more']}</Link>
                </div>
              </div>
            </li>

            <li
              className="card tecnology"
              style={{
                display: (selectedFilter === 31 || !selectedFilter) && (selectedFilterType === 'CLA_02' || !selectedFilterType) && searchQuery == '' ? 'flex' : 'none',
              }}
            >
              <span className="card_type">{t.Technology}</span>

              <div className="card_name">
                <h4> {t['Image text extraction Service']}</h4>

                <p className="dayLetf" />
              </div>

              <div className="card_actions">
                <div className="box-img">
                  <div className="type_icon">
                    <ImageSvg name={imgProduct(6)} />
                  </div>
                </div>

                <div className="status-box">
                  <p> {t['Not hired']}</p>
                  <Link href="https://www.innovativa.la/digitalemployee">{t['View more']}</Link>
                </div>
              </div>
            </li>

            <li
              className="card human"
              style={{
                display: (selectedFilter === 31 || !selectedFilter) && (selectedFilterType === 'CLA_03' || !selectedFilterType) && searchQuery == '' ? 'flex' : 'none',
              }}
            >
              <span className="card_type">{t['Human Resources']}</span>

              <div className="card_name">
                <h4> {t['AFP validation']}</h4>

                <p className="dayLetf">
                  {/* <ImageSvg name='Time' /> */}
                  {/* {t['Days left:']} .. */}
                </p>
              </div>

              <div className="card_actions">
                <div className="box-img">
                  <div className="type_icon">
                    <ImageSvg name={imgProduct(5)} />
                  </div>
                </div>

                <div className="status-box">
                  <p> {t['Not hired']}</p>
                  <Link href="https://www.innovativa.la/digitalemployee">{t['View more']}</Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* )
          : (
            <p>{t['No results found']}</p>
            )} */}
      </div>

      {requestError && <p className="errorMessage">{requestError.message}</p>}
    </LayoutProducts>
  );
}
