import React, { useState, useEffect } from 'react';
import LayoutProducts from '@/Components/LayoutProducts';
import ImageSvg from '@/helpers/ImageSVG';
import Link from 'next/link';
import { useAuth } from '@/Context/DataContext';
import LineChart from '@/Components/Grafics/BarChart';
import { useRouter } from 'next/navigation';
import { fetchConTokenPost } from '@/helpers/fetch';
import { format, startOfMonth } from 'date-fns';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';

function Tecnology() {
  const { session, setModalToken, logout, l } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState();
  const [dataInitialSelect, setInitialDataselect] = useState([]);
  const [todaytype, setTodaytype] = useState(null);

  const t = l.Reporting;
  const router = useRouter();

  useEffect(() => {
    getBalancesInitial();
    GetTipoCambioToday();
  }, []);

  async function getBalancesInitial() {
    const idcompany = session?.jCompany.id_company;
    const idEmpresa = session?.oEmpresa.map((em) => em.id_empresa);

    setIsLoading(true);
    const body = {
      oResults: {
        iIdCompany: idcompany,
        oIdEmpresa: idEmpresa,
      },
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetTotalBanco', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        const dataInit = responseData.oResults;
        setInitialDataselect(dataInit);
        setModalToken(false);
        setRequestError(null);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        setRequestError(errorMessage);
        setTimeout(() => {
          setRequestError(null);
        }, 2000);
      }
    } catch (error) {
      console.error('error', error);
      setModalToken(true);
      setRequestError(error);
      setTimeout(() => {
        setRequestError(null);
      }, 1000);
    } finally {
      setIsLoading(false); // Ocultar señal de carga
    }
  }

  async function GetTipoCambioToday() {
    const currentDate = new Date();

    //  fecha actual
    const dateToday = format(currentDate, 'dd/MM/yyyy');

    // Obtener la fecha del primero de este mes
    const firstDayOfMonth = startOfMonth(currentDate);

    // Formatear la fecha del primero de este mes en el formato deseado
    const formattedFirstDayOfMonth = format(firstDayOfMonth, 'dd/MM/yyyy');

    setIsLoading(true);
    const body = {
      oResults: {
        sFechaDesde: formattedFirstDayOfMonth,
        sFechaHasta: dateToday,
        iMoneda: 2, // solar
      },
    };

    const tok = session?.sToken;
    try {
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetTipoCambioRate', body, tok);

      if (responseData.oAuditResponse.iCode == 1) {
        setRequestError(null);
        const data = responseData.oResults;
        const dataOrderTODate = data?.sort((a, b) => b.fecha_tipo_cambio.localeCompare(a.fecha_tipo_cambio));
        setTodaytype(dataOrderTODate[0]);
        setModalToken(false);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else {
        const message = responseData?.oAuditResponse.sMessage;
        setRequestError(message);
        setModalToken(false);
        setTimeout(() => {
          setRequestError(null);
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Hubo un error en la operación asincrónica.');
    } finally {
      setIsLoading(false);
    }
  }

  function formatearFecha(fecha) {
    const fechaParseada = new Date(fecha);
    const dia = fechaParseada.getUTCDate().toString().padStart(2, '0');
    const mes = (fechaParseada.getUTCMonth() + 1).toString().padStart(2, '0');
    const anio = fechaParseada.getUTCFullYear().toString();
    return `${dia}/${mes}/${anio}`;
  }

  return (
    <LayoutProducts menu="Reporting">
        <section className="reporting">
        <div className="reporting-head">
          <div className="reporting-menu">
            <h3> {t.Reporting} </h3>

            <div className="menu-list">
              <button className="box-option financy" onClick={() => router.push('/reporting/finance/1')}>
                <div className="report">
                  <ImageSvg name="IconEstractos" />
                  <h4> {t['Bank balances']} </h4>
                </div>
              </button>

              <button className="box-option financy" onClick={() => router.push('/reporting/finance/2')}>
                <div className="report">
                  <ImageSvg name="IconEstractos" />
                  <h4> {t['Banking transactions']} </h4>
                </div>
              </button>

              <button className="box-option financy " onClick={() => router.push('/reporting/finance/3')}>
                <div className="report">
                  <ImageSvg name="IconSunat" />
                  <h4> {l.Pattern['SUNAT patterns']} </h4>
                </div>
              </button>

              <button className="box-option financy" onClick={() => router.push('/reporting/finance/4')}>
                <div className="report">
                  <ImageSvg name="IconDetraccion" />
                  <h4> {l.Reporting['Detractions report']} </h4>
                </div>
              </button>

              <button className="box-option tecnology" onClick={() => router.push('/reporting/tecnology/1')}>
                <div className="report">
                  <ImageSvg name="IconCaptcha" />
                  <h4> {l.Captcha['Captcha Solver']} </h4>
                </div>
              </button>

             


            </div>
          </div>

          <div className="reporting-box  reporting_dashboard">
            <div className="report-content">
              <div className="report red">
                <div className="report_icon  ">
                  <ImageSvg name="Bank" />
                </div>

                <div className="report_data">
                  <article>{t['Total Banks']}</article>
                  <h2> {dataInitialSelect?.iBanco} </h2>
                  <p>
                    {' '}
                    <ImageSvg name="ArrowUp" /> {t['for the companies']}{' '}
                  </p>
                </div>
              </div>

              <div className="liner" />

              <div className="report green ">
                <div className="report_icon  ">
                  <ImageSvg name="Account" />
                </div>

                <div className="report_data">
                  <article>{t['Total Accounts']}</article>
                  <h2>{dataInitialSelect?.iConfCuenta} </h2>
                  <p>
                    {' '}
                    <ImageSvg name="ArrowUp" /> {t['for the companies']}{' '}
                  </p>
                </div>
              </div>
              <div className="liner" />

              <div className="report  blue">
                <div className="report_icon  ">
                  <ImageSvg name="IconTipo" />
                </div>

                <div className="report_data">
                  <article>
                    {t['Exchange rate']} ({t.Selling})
                  </article>
                  <h2> {todaytype?.tipo_cambio_venta}</h2>
                  <p>
                    {' '}
                    <span> {todaytype && formatearFecha(todaytype?.fecha_tipo_cambio)} </span> USD <ImageSvg name="ArrowLeft" /> PEN{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading && <LoadingComponent />}

        {requestError && <div className="errorMessage"> {requestError} </div>}

        <div className="reporting_rates">
          <div className="reporting_rates-exchange">
            <LineChart />
          </div>
        </div>
      </section>
    </LayoutProducts>
  );
}

// index.propTypes = {

// }

export default Tecnology;
