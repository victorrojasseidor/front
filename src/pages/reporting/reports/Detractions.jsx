import React, { useState, useEffect } from 'react';
import { useAuth } from '@/Context/DataContext';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import { fetchConTokenPost } from '@/helpers/fetch';
import { formatDate } from '@/helpers/report';

const Detracctions = () => {
  const { session, setModalToken, logout, l } = useAuth();
  const [requestError, setRequestError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPadrones, setDataPadrones] = useState(null);
  const [itemsPerPage] = useState(25);
  const [page, setPage] = useState(1);

  const t = l.Captcha;

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    GetReportePadrones();
  }, []);

  async function GetReportePadrones() {
    setIsLoading(true);
    const body = {
      oResults: {},
    };

    try {
      const token = session.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=GetReportePadrones', body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;
        setDataPadrones(data);
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

  return (
    <>
      <section className="">
        {isLoading && <LoadingComponent />}

        {requestError && <div className="errorMessage"> {requestError.error}</div>}
        <div className="box-tabs">
          <div className="tab-content">
            detractions
            <div className="tabOne">
              <div className="contaniner-tables">
                <div className="box-search">
                  <div>
                    <h3> {t['Sunat register report']}</h3>
                    <p> {l.Pattern['Result obtained from the SUNAT portal']} </p>
                  </div>
                </div>

                <div className="boards">
                  <div className="tableContainer">
                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th>{t.Standards} </th>
                          <th> {t['Update date']}</th>
                        </tr>
                      </thead>
                      <tbody className="rowTable">
                        {dataPadrones?.length > 0 ? (
                          dataPadrones
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage) // Slice the array based on the current page
                            .map((row) => (
                              <tr key={row.id_padrones}>
                                <td>{row.nombre_documento}</td>
                                <td>{formatDate(row.fecha_padron)}</td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="2">{l.Reporting['There is no data']}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Stack spacing={2}>
                    <div className="pagination">
                      <Typography>
                        {l.Reporting.Page} {page} {t.of} {Math.ceil(dataPadrones?.length / itemsPerPage)}
                      </Typography>
                      <Pagination
                        count={Math.ceil(dataPadrones?.length / itemsPerPage)} // Calculate the total number of pages
                        page={page}
                        onChange={handleChangePage}
                      />
                    </div>
                  </Stack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Detracctions;
