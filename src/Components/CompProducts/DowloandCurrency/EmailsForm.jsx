import React, { useEffect, useState } from 'react';
import ImageSvg from '@/helpers/ImageSVG';
import { useAuth } from '@/Context/DataContext';
import Modal from '@/Components/Modal';
import { useRouter } from 'next/router';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import { fetchConTokenPost } from '@/helpers/fetch';

export default function EmailsForm({ dataEmails, setUpdateEmails, sProduct, get, setGet }) {
  const [haveEmails, setHaveEmails] = useState(false); // hay correos ?
  const [valueEmailTo, setValueEmailTo] = useState('');
  const [valueEmailCco, setValueEmailCco] = useState('');
  const [emailsTo, setEmailsTo] = useState([]);
  const [emailsCco, setEmailsCco] = useState([]);
  const [modalConfirmationEmail, setModalConfirmationEmail] = useState(false);
  const [isLoadingComponent, setIsLoadingComponent] = useState(false);
  const [errorTo, setErrorTo] = useState('');
  const [errorCco, setErrorCco] = useState('');

  const router = useRouter();
  const iIdProdEnv = router.query.iIdProdEnv;
  const { session, setModalToken, logout, l, idCountry } = useAuth();
  const t = l.Currency;

  useEffect(() => {
    if (dataEmails?.length > 0) {
      const filterEmailsTo = dataEmails.filter((eml) => eml.correo_estado == 'CORREO');
      const arrayDeCorreos = filterEmailsTo.map((item) => item.correo);
      setEmailsTo(arrayDeCorreos);

      const filterEmailsCco = dataEmails.filter((eml) => eml.correo_estado == 'CORREO_CC');
      const arrayDeCorreosCC = filterEmailsCco.map((item) => item.correo);
      setEmailsCco(arrayDeCorreosCC);
      setHaveEmails(true);
      setUpdateEmails(false);
    } else {
      setHaveEmails(false);
    }
  }, [dataEmails]);

  // TO

  const handleChangeTo = (e) => {
    setValueEmailTo(e.target.value);
    setErrorTo('');
  };

  const handleAddEmailsTo = () => {
    const emailList = valueEmailTo.split(/[ ,;\n]+/); // Expresión regular para separar por espacios, comas, puntos y comas y saltos de línea
    const validEmails = [];
    const invalidEmails = [];

    emailList?.forEach((singleEmail) => {
      const trimmedEmail = singleEmail.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@ñ]+$/i;

      if (emailRegex.test(trimmedEmail)) {
        if (!emailsTo.includes(trimmedEmail)) {
          validEmails.push(trimmedEmail);
        }
      } else {
        invalidEmails.push(trimmedEmail);
      }
    });

    setEmailsTo([...emailsTo, ...validEmails]);
    setValueEmailTo('');

    setErrorTo(invalidEmails.length > 0 ? `${t['The following emails are invalid']}: ${invalidEmails.join(', ')}` : '');
    setTimeout(function () {
      setErrorTo('');
    }, 10000);
  };

  const handleDeleteTo = (index) => {
    const updatedEmails = [...emailsTo];
    updatedEmails.splice(index, 1);
    setEmailsTo(updatedEmails);
  };

  // CCo

  const handleChangeCco = (e) => {
    setValueEmailCco(e.target.value);
    setErrorCco('');
  };

  const handleAddEmailsCco = () => {
    const emailList = valueEmailCco.split(/[ ,;\n]+/); // Expresión regular para separar por espacios, comas, puntos y comas y saltos de línea
    const validEmails = [];
    const invalidEmails = [];

    emailList?.forEach((singleEmail) => {
      const trimmedEmail = singleEmail.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@ñ]+$/i;

      if (emailRegex.test(trimmedEmail)) {
        if (!emailsCco.includes(trimmedEmail)) {
          validEmails.push(trimmedEmail);
        }
      } else {
        invalidEmails.push(trimmedEmail);
      }
    });

    setEmailsCco([...emailsCco, ...validEmails]);
    setValueEmailCco('');

    setErrorCco(invalidEmails.length > 0 ? `${t['The following emails are invalid']}: ${invalidEmails.join(', ')}` : '');
    setTimeout(function () {
      setErrorCco('');
    }, 10000);
  };

  const handleDeleteCco = (index) => {
    const updatedEmails = [...emailsCco];
    updatedEmails.splice(index, 1);
    setEmailsCco(updatedEmails);
  };

  async function handleSendEmails() {
    const listEmailsTO = emailsTo.map((correo) => {
      return { sCorreo: correo, sTipoCorreo: 'CORREO' };
    });

    const listEmailsCCo = emailsCco.map((correo) => {
      return { sCorreo: correo, sTipoCorreo: 'CORREO_CC' };
    });

    setIsLoadingComponent(true);

    const body = {
      oResults: {
        sProd: sProduct,
        iIdProdEnv: parseInt(iIdProdEnv),
        iIdPais: idCountry, // id pais
        oCorreo: listEmailsTO.concat(listEmailsCCo),
      },
    };
 

    try {
      const token = session?.sToken;
      const responseData = await fetchConTokenPost('BPasS/?Accion=RegistrarCorreoProducto', body, token);
      console.log('correo', body, { responseData });

      if (responseData.oAuditResponse?.iCode === 1) {
        setGet(!get);
        setModalConfirmationEmail(true);
        setUpdateEmails(true);
        setModalToken(false);
        setTimeout(function () {
          setHaveEmails(true);
          setModalConfirmationEmail(false);
        }, 1000);
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form';
        console.log('errok, ', errorMessage);
        setModalToken(true);
        setModalConfirmationEmail(false);
      }
    } catch (error) {
      console.error('error', error);
      // setModalToken(true)
      setModalConfirmationEmail(false);
    } finally {
      setIsLoadingComponent(false);
    }
  }

  return (
    <>
      <div className="container-emails">
        {modalConfirmationEmail && (
          <Modal close={() => setModalConfirmationEmail(false)}>
            <ImageSvg name="Check" />

            <div>
              <h2>{t['Emails were added successfully']}</h2>
              <p />
            </div>
          </Modal>
        )}

        {haveEmails ? (
          <div className="box-emails-show">
            <h3 className="title-Config">{t['Emails for notifications']}</h3>

            <div className="contaniner-tables">
              <div className="box-edit">
                <p> {t['Traceability information will be sent to the following emails']}:</p>
                <button className="btn_crud" onClick={() => setHaveEmails(false)}>
                  <ImageSvg name="Edit" />
                </button>
              </div>

              <div className="emails">
                <h4> {t.To}: </h4>
                {dataEmails
                  ?.filter((eml) => eml.correo_estado == 'CORREO')
                  ?.slice(0, 6)
                  .map((email) => (
                    <p key={email.id_correo_eb}>{email.correo}</p>
                  ))}
                <span>...</span>
              </div>

              <div className="emails">
                <h4> {t.Cco}: </h4>

                {dataEmails
                  ?.filter((eml) => eml.correo_estado == 'CORREO_CC')
                  ?.slice(0, 6)
                  .map((email) => (
                    <p key={email.id_correo_eb}>{email.correo}</p>
                  ))}
                <span>...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="box-emails-update">
            <h3 className="title-Config"> {t['Register emails']} </h3>

            <p className="description">{t['Please tell us which email addresses we should send our digital employee traceability reports to']}</p>

            <div className="contaniner-tables">
              <h4 className="title-Config"> {t.To}: </h4>

              <form className="form-container" onSubmit={(e) => e.preventDefault()}>
                <p> {t['Enter one or more emails either separated by spaces, commas or semicolons']}</p>

                <div className="form-emailTo">
                  <div className="input-box">
                    <textarea
                      value={valueEmailTo}
                      onChange={handleChangeTo}
                      placeholder=""
                      rows={4}
                      style={{ height: '4rem' }} // Adjust the number of visible rows as needed
                      cols={60}
                    />
                    <label htmlFor=""> {t['Add emails']} </label>
                  </div>

                  <div className="box-add">
                    <button
                      type="button"
                      className="btn_primary black"
                      onClick={() => {
                        handleAddEmailsTo();
                      }}
                    >
                      + {t.Add}
                    </button>
                  </div>
                </div>

                {errorTo && <p className="errorMessage">{errorTo}</p>}
              </form>
              {emailsTo.length > 0 && (
                <div className="emails">
                  <span>{t['Added Emails']}:</span>

                  <ul className="emails">
                    {emailsTo?.map((email, index) => (
                      <li key={index}>
                        {email}{' '}
                        <button className="btn_crud" onClick={() => handleDeleteTo(index)}>
                          {' '}
                          <ImageSvg name="Delete" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="contaniner-tables">
              <h4 className="title-Config"> {t.Cco}: </h4>

              <form className="form-container" onSubmit={(e) => e.preventDefault()}>
                {/* <p> {t['Enter one or more emails either separated by spaces, commas or semicolons']}</p> */}

                <div className="form-emailTo">
                  <div className="input-box">
                    <textarea
                      value={valueEmailCco}
                      onChange={handleChangeCco}
                      placeholder=""
                      // placeholder="Ingresa uno o varios correos electrónicos ya sea separados por espacios, comas o puntos y comas"
                      rows={4}
                      style={{ height: '4rem' }} // Adjust the number of visible rows as needed
                      cols={60}
                    />
                    <label htmlFor=""> {t['Add emails']} </label>
                  </div>

                  <div className="box-add">
                    <button type="button" className="btn_primary black " onClick={handleAddEmailsCco}>
                      + {t.Add}
                    </button>
                  </div>
                </div>

                {errorCco && <p className="errorMessage">{errorCco}</p>}
              </form>
              {emailsCco.length > 0 && (
                <div className="emails">
                  <span>{t['Added Emails']}:</span>

                  <ul className="emails">
                    {emailsCco?.map((email, index) => (
                      <li key={index}>
                        {email}{' '}
                        <button className="btn_crud" onClick={() => handleDeleteCco(index)}>
                          {' '}
                          <ImageSvg name="Delete" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {emailsCco.length > 0 || emailsTo.length > 0 ? (
              <div className="box-buttons">
                <button
                  className="btn_primary  small black"
                  onClick={() => {
                    handleSendEmails();
                  }}
                >
                  {t.Save}
                </button>

                <button
                  className="btn_primary small white "
                  onClick={() => {
                    setHaveEmails(true);
                  }}
                >
                  {t.Cancel}
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        )}

        {isLoadingComponent && <LoadingComponent />}
      </div>
    </>
  );
}
