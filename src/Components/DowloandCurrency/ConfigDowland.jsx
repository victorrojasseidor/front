import React, { useState } from "react";
import EmailsForm from "./EmailsForm";
import ImageSvg from "@/helpers/ImageSVG";
import FormularioAgregado from "./formaddConfigDowland";

export default function ConfigDowland() {
  const [haveEmails, setHaveEmails] = useState(false);//hay correos ?
  const [initialEdit, setIinitialEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(null);

  const [data, setData] = useState([
    // Datos ficticios iniciales
    {
      id: 1,
      name: 'John Doe',
      principalUser: 'user1',
      bank: { value: 'bank7', label: 'Banco 7' },
      country:{ value: 'EUU', label: 'Banco 7' },
      state: 'Disabled',
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


  const handleEdit = (user) => {
    console.log("handledit",user);
    setIinitialEdit(user);

     setIsEditing(true);
  };

  console.log("user",initialEdit);

  const handleEliminar = (id) => {
    
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  const handleUpdate = (updatedRecord) => {
    // Actualiza el estado 'data' con el registro editado
    setData((prevData) =>
      prevData.map((row) => (row.id === updatedRecord.id ? updatedRecord : row))
    );
    setCurrentRecord(null);
    setIsEditing(false);
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
                <button  className="btn_crud">
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
                    {data?.map((row) => (
                      <tr key={row.id}>
                        <td>{row.name}</td>
                        <td >{row.principalUser}</td>
                        <td >{row.bank.value}</td>
                        <td>{row.country.value}</td>
                        <td >
                          <span className={row.state === 'Active' ? "status-active" : 'status-disabled'}>
                          {row.state}
                            </span>
                          </td>
                        <td className="box-actions">
                        <button className="btn_crud" onClick={() => handleEdit(row)}>   <ImageSvg name="Edit" /> </button>
                        <button  className="btn_crud" onClick={() => handleEliminar(row.id)}> <ImageSvg name="Delete" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <FormularioAgregado
             onAgregar={handleAgregar}
             
             initialVal={isEditing?initialEdit:null}
              onSubmit={handleUpdate} // Pasa la función handleUpdate para la edición
            />
            </div>
          </div>
        </div>
      ) : (
        <div className="config-Automated--emails">
          <h3> Register emails</h3>
          <div className="description">
            
            Add the emails to notify to  <b> Download automated Bank Statements </b>
            
          
          </div>
          <EmailsForm setHaveEmails={setHaveEmails} />
        </div>
      )}
    </section>
  );
}