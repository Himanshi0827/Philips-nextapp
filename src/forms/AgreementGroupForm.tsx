'use client';

import { useState,useEffect } from "react";
import LookupTypeAhead from "../components/LookupTypeAhead";
import { searchLookupRecords } from "../api/SearchLookup";

function AgreementGroupForm({ data,onChange,onComplete }) {
  
 const agreementId=sessionStorage.getItem("agreementId");
 
  const [form, setForm] = useState({
    agreementGroup: "",
    AgreementLineItemName:""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    onChange({
      [e.target.name]:e.target.value,
    });
    setForm({
      ...form,
      [e.target.name]:[e.target.value]
    });
  };

  const handleNext = () => {
    //const { agreementGroup } = form;

    if (!data.agreementGroup ) {
      setError("Please fill the fields before proceeding.");
      return;
    }

    setError("");
    onComplete(); // mark tab completed & move to next tab
  };

  return (
    <div className="form-card">
      <table className="form-table">
        <tbody>

          <tr>
            <td className="label">AgreementLineItem Name:</td>
            <td>
             <div className="field">
            <input name="AgreementLineItemName" 
                      onChange={handleChange} 
                      value={data.AgreementLineItemName} 
                      type="text" />
              </div>
            </td>
          </tr>
          <tr>
  <td className="label">Agreement Group</td>
  <td>
    <LookupTypeAhead
      field={{
        DisplayName: "Agreement Group",
        LookupObjectName: "APTS_Agreement_Groups_c",
        AgreementId:agreementId
      }}
      value={data.agreementGroup}   // { Id, Name }
      onChange={(record) =>
        
        onChange({
          agreementGroup: record,        // store full object
          agreementGroupId: record?.Id   // store Id separately if needed
        })
      }
      searchFn={searchLookupRecords}
    />
  </td>
</tr>

         

        </tbody>
      </table>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default AgreementGroupForm;