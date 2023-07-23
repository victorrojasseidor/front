import React from "react";
import { useState } from "react";

export default function EmailsForm() {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleAddEmails = () => {
    const emailList = email.split(/[ ,;]+/); // Expresión regular para separar por espacios, comas y puntos y comas
    const validEmails = [];
    const invalidEmails = [];

    emailList.forEach((singleEmail) => {
      const trimmedEmail = singleEmail.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@ñ]+$/i;

      if (emailRegex.test(trimmedEmail)) {
        if (!emails.includes(trimmedEmail)) {
          validEmails.push(trimmedEmail);
        }
      } else {
        invalidEmails.push(trimmedEmail);
      }
    });

    setEmails([...emails, ...validEmails]);
    setEmail("");
    setError(invalidEmails.length > 0 ? `Los siguientes correos electrónicos no son válidos: ${invalidEmails.join(", ")}` : "");
  };

  const handleDelete = (index) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };

  const handleSendEmails = () => {
    // Aquí puedes realizar la lógica para enviar los correos electrónicos al servidor
    console.log("Correos electrónicos enviados:", emails);
  };

  return (
    <div className="emailsFormContainer">
      
      <form className="formContainer" onSubmit={(e) => e.preventDefault()}>
        <div className=" emaildiv"> 

       
        <div>
          <input
          className="inputnew"
            type="text"
            value={email}
            onChange={handleChange}
            placeholder=" "
            // placeholder="Introduce uno o varios correos electrónicos separados por espacios, comas o puntos y comas"
          />
          <label htmlFor=""> Add emails </label>
        </div>
      <div>
      <button type="button" className="btn_black" onClick={handleAddEmails}>
          + Add
        </button> 
      </div>
       
        </div>
     
     
        {error && <p style={{ color: "red" }}>{error}</p>}

      </form>
      {emails.length > 0 && (
        <div>
          <p>Added Emails</p>
          <ul>
            {emails?.map((email, index) => (
              <li key={index}>
                {email} <button onClick={() => handleDelete(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {emails.length > 0 && <button onClick={handleSendEmails}>Enviar Correos Electrónicos</button>}
    </div>
  );
}
