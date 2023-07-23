import React from "react";
import { useState } from "react";
import EmailsForm from "./EmailsForm";

export default function ConfigDowland() {
  const [haveEmails, setHaveEmails] = useState(true);

  return (
    <section className="downlaodAutomated">
      {haveEmails ? (
        <div className="downlaodAutomated_emails">
            <h3> Register emails</h3>
            <p> Add the emails to notify to  <b> Download automated Bank Statements </b></p>
          <EmailsForm />
        </div>
      ) : (
        <div>configurations section</div>
      )}
    </section>
  );
}
