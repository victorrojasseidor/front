import React, { useState } from "react";
import EmailsForm from "./EmailsForm";
import ImageSvg from "@/helpers/ImageSVG";
import FormularioAgregado from "./formaddConfigDowland";

export default function ConfigDowland() {
  const [haveEmails, setHaveEmails] = useState(true);

  const [data, setData] = useState([
    // Datos ficticios iniciales
    {
      id: 1,
      name: 'John Doe',
      principalUser: 'user1',
      bank: { value: 'bank7', label: 'Banco 7' },
      country:{ value: 'EUU', label: 'Banco 7' },
      state: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      principalUser: 'user2',
      bank: { value: 'bank7', label: 'Banco 7' },
      country: { value: 'canada', label: 'Banco 7' },
      state: 'Active',
    },
  ]);

  const handleAgregar = (values) => {
    const newRow = {
      id: data.length + 1,
      ...values,
    };
    setData((prevData) => [...prevData, newRow]);
  };

  const handleEditar = (id, values) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, ...values } : row))
    );
  };

  const handleEliminar = (id) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  return (
    <section className="config-Automated">
      {haveEmails ? (
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
              <h5>Correos notificactions</h5>
              <div className="card--emails">
                <div>
                  nespinozabar@gmail.com , nataliaespin@gmail.com,
                  absibdjbdd@gmail.com, estimatipns@hdid.com ....show more
                </div>
                <ImageSvg name="Edit" />
              </div>
            </div>
          </div>
          <div className="contaniner-tables">
            <div className="box-search">
              <h2>List Bank Credential</h2>
              <div>Search</div>
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
                    {data?.map((row) => (
                      <tr key={row.id}>
                        <td>{row.name}</td>
                        <td>{row.principalUser}</td>
                        <td>{row.bank.value}</td>
                        <td>{row.country.value}</td>
                        <td>{row.state}</td>
                        <td>
                          <button onClick={() => handleEditar(row.id, row)}>Edit</button>
                          <button onClick={() => handleEliminar(row.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <FormularioAgregado onAgregar={handleAgregar} />
            </div>
          </div>
        </div>
      ) : (
        <div className="config-Automated--emails">
          <h3> Register emails</h3>
          <p>
            Add the emails to notify to <br /> <b> Download automated Bank Statements </b>
          </p>
          <EmailsForm setHaveEmails={setHaveEmails} />
        </div>
      )}
    </section>
  );
}