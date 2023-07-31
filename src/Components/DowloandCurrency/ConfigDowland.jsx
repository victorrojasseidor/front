import React, { useState, useEffect } from "react";
import EmailsForm from "./EmailsForm";
import ImageSvg from "@/helpers/ImageSVG";
import AddCredentials from "./AddCredentials";
import { useAuth } from "@/Context/DataContext";
import { fetchConTokenPost } from "@/helpers/fetch";

export default function ConfigDowland() {
  const [haveEmails, setHaveEmails] = useState(true); //hay correos ?
  const [initialEdit, setIinitialEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [emails, setEmails] = useState([]);
  const [data, setData] = useState(null);

  const { session, setSession, empresa } = useAuth();
  console.log(session);

  const handleAgregar = (values) => {
    const newRow = {
      id: data.length + 1,
      ...values,
    };
    setData((prevData) => [...prevData, newRow]);
  };

  const handleEdit = (user) => {
    console.log("handledit", user);
    setIinitialEdit(user);

    setIsEditing(true);
  };

  // console.log("user",initialEdit);

  const handleEliminar = (id) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  const handleUpdate = (updatedRecord) => {
    // Actualiza el estado 'data' con el registro editado
    setData((prevData) => prevData.map((row) => (row.id === updatedRecord.id ? updatedRecord : row)));
    setCurrentRecord(null);
    setIsEditing(false);
  };

  useEffect(() => {
    if (session) {
      setTimeout(() => {
        getDataConfigured();
      }, 100);
    }
  }, [session]);

  async function getDataConfigured() {
    let body = {
      oResults: {
        iIdExtBanc: 1,
        iIdPais: 1,
      },
    };

    console.log("bodyconsultarproducto", body);

    try {
      let token = session.sToken;

      let responseData = await fetchConTokenPost("dev/BPasS/?Accion=GetExtBancario", body, token);
      console.log("data", responseData);

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;
        setData(data);
        // setEmails(oCorreoEB);
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : "Error in sending the form";
        console.log("errok, ", errorMessage);
        // setStatus(errorMessage);
      }
    } catch (error) {
      console.error("error", error);
      // setStatus("Service error");
    }
  }

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  return (
    <section className="config-Automated">
      {haveEmails && data?.oCorreoEB.length >= 3 ? (
        <div className="config-Automated--tables">
          <div className="container-status">
            <div className="status-config">
              <ul>
                <li>
                  <p>Start service :</p>
                  <p>17/06/2023</p>
                </li>
                <li>
                  <p>End service :</p>
                  <p>23/09/2023</p>
                </li>
                <li>
                  <p>State :</p>
                  <p className="Active">Active</p>
                </li>
              </ul>
            </div>
            <div className="box-emails">
              <h5>Emails for notifications</h5>
              <div className="card--emails">
                <div>
                  {data?.oCorreoEB.map((email) => (
                    <p key={email.correo_cc}>{email.correo_cc}</p>
                  ))}
                </div>
                <button className="btn_crud" onClick={() => setHaveEmails(false)}>
                  <ImageSvg name="Edit" />
                </button>
              </div>
            </div>
          </div>
          <div className="contaniner-tables">
            <div className="box-search">
              <h3>List Bank Credential</h3>
              {/* <div>Search</div> */}
              <button className="btn_black">+ Add Bank</button>
            </div>
            <div className="boards">
              <div className="tableContainer">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Principal user</th>
                      <th>Bank</th>
                      <th>Country</th>
                      <th>State</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.oListBancoCredendicial?.map((row) => (
                      <tr key={row.id_banco_credencial}>
                        <td>{row.nombre}</td>
                        <td>{row.usuario}</td>
                        <td>{row.id_banco}</td>
                        <td>{"Perú"}</td>
                        { console.log(row.estado_c)}
                        <td>
                          <span className={row.estado_c == "23" ? "status-active" : "status-disabled"}>{row.estado_c == "23" ? "Active" : "Disabled"}</span>
                        </td>
                        <td className="box-actions">
                          <button className="btn_crud" onClick={() => handleEdit(row)}>
                            {" "}
                            <ImageSvg name="Edit" />{" "}
                          </button>
                          <button className="btn_crud" onClick={() => handleEliminar(row.id_banco_credencial)}>
                            {" "}
                            <ImageSvg name="Delete" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AddCredentials
                onAgregar={handleAgregar}
                dataUser={data}
                initialVal={isEditing ? initialEdit : null}
                onSubmit={handleUpdate} // Pasa la función handleUpdate para la edición
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="config-Automated--emails">
          <h3> Register emails</h3>
          <div className="description">
            Add the emails to notify to <b> Download automated Bank Statements </b>
          </div>
          <EmailsForm setHaveEmails={setHaveEmails} idproduct={1} />
        </div>
      )}
    </section>
  );
}
