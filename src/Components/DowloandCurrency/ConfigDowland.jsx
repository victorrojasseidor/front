import React from "react";
import { useState } from "react";
import EmailsForm from "./EmailsForm";

export default function ConfigDowland() {
  const [haveEmails, setHaveEmails] = useState(false);

  return (
    <section className="downlaodAutomated">
      {haveEmails ? (
        <div>configurations section</div>
      ) : (
        
        <div className="downlaodAutomated_emails">
            <h3> Register emails</h3>
            <p> Add the emails to notify to <br/>{ } <b> Download automated Bank Statements </b></p>
          <EmailsForm  setHaveEmails={setHaveEmails} />
        </div>
      )}
    </section>
  );
}
