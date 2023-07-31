import React from "react";
import { useState } from "react";
import ImageSvg from "@/helpers/ImageSVG";
import { useAuth } from "@/Context/DataContext";
import { fetchConTokenPost } from "@/helpers/fetch";
// import { refresToken } from "@/helpers/auth";


export default function EmailsForm({setHaveEmails,idproduct}) {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");

  const {session,setSession,empresa}=useAuth();
  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
    
  };



  
  const handleAddEmails = () => {
    const emailList = email.split(/[ ,;]+/); // Expresión regular para separar por espacios, comas y puntos y comas
    const validEmails = [];
    const invalidEmails = [];

    emailList?.forEach((singleEmail) => {
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
   
    setError(invalidEmails.length > 0 ? `The following emails are invalid: ${invalidEmails.join(", ")}` : "");
    setTimeout(function() {
      setError("");
    }, 10000);
  };

  const handleDelete = (index) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };

  // const handleSendEmails = () => {
  //   // Aquí puedes realizar la lógica para enviar los correos electrónicos al servidor
  //   console.log("Correos electrónicos enviados:", emails);
  //   sendEmails
  //   setHaveEmails(emails);

  // };

  async function handleSendEmails() {

    const listEmails = emails?.map(correo => {
      return { "sCorreo": correo };
    });

    console.log("Correos electrónicos enviados:", listEmails);

    let body = {
      oResults: {
        iIdExtBanc:1,
        iIdPais: 1,
        oCorreo:listEmails

      },
    };

    try {
      let token=session?.sToken;
    
      let responseData = await fetchConTokenPost("dev/BPasS/?Accion=RegistrarCorreoExtBancario", body, token);
      console.log("emailsrespon",responseData);

      if (responseData.oAuditResponse?.iCode === 1) {
        // const data= responseData.oResults;
        setHaveEmails(true);

      } 
      else {
      const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : "Error in sending the form";
      console.log("errok, ",errorMessage);
      // let refresh= await refresToken(token);
      // return refresh;
      }
    } catch (error) {
      console.error("error", error);

    }
  }



  return (
    <div className="emailsFormContainer">
      
      <form className="form-container" onSubmit={(e) => e.preventDefault()}>
        <div className="emailBox"> 
       
        <div className="input-box">
          
            <textarea
            value={email}
            onChange={handleChange}
            placeholder=''
            // placeholder="Introduce uno o varios correos electrónicos separados por espacios, comas o puntos y comas"
            rows={4} // Adjust the number of visible rows as needed
            cols={40} // Adjust the number of visible columns as needed
          />
          <label htmlFor=""> Add emails </label>
        </div>
      <div>
      <button type="button" className="btn_black" onClick={handleAddEmails}>
          + Add
        </button> 
      </div>
       
        </div>
     
     
        {error && <p className="errorMessage">{error}</p>}

      </form>
      {emails.length > 0 && (
        <div className="listEmails">
          <p>Added Emails:</p>
          
          <ul className="ListEmails">
            {emails?.map((email, index) => (
              <li key={index}>
                {email} <button  onClick={() => handleDelete(index)}> <ImageSvg name="Delete" /></button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {emails.length > 0 && <button  className="btn_primary" onClick={handleSendEmails}>Save and continue</button>}
    </div>
  );
}
