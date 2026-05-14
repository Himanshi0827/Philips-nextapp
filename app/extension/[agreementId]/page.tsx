'use client';

import { useEffect, useState } from "react";
import {  useParams , useSearchParams } from "next/navigation";

import { getAgreementById, updateAgreement } from "../../../src/api/api";
import "../../../src/CSS/AgreementExtension.css";
import { updatePriceList } from "../../../src/api/PriceList";

export default function AgreementExtension() {
const { agreementId } = useParams();   
const location = useSearchParams();
const id =
  agreementId ||                      
  location.state?.agreementId ||  
  null;
 
if (!id) {
  console.error("Agreement ID not found in URL or state");
}

  const [agreement, setAgreement] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [reason, setReason] = useState("");
  const [isValidityScreen, setIsValidityScreen] = useState(false);

const statusesToConsiderValidity = ["In Authoring","In Signatures"];

  useEffect(() => {
    loadAgreement();
  }, []);

  const loadAgreement = async () => {

    const data = await getAgreementById(id);
console.log("data",data);
    setAgreement(data[0]);
    
    setEndDate(data[0].ContractEndDate);

    const validity =
      statusesToConsiderValidity.includes(data[0].StatusCategory)&& data[0].APTS_Agreement_Inserted_Successfully_c===false  ;


    setIsValidityScreen(validity);
console.log("valid",validity);
console.log("valid3",data[0].StatusCategory);

      setStartDate(data[0].ContractStartDate);

  };

  const handleSave = async () => {

    const today = new Date().toISOString().split("T")[0];

    if (!reason) {
      alert("Extension Reason cannot be blank");
      return;
    }

    if (endDate <= today) {
      alert("The new Expiry Date cannot be earlier than today");
      return;
    }

    const oldEndDate = agreement.ContractEndDate;
  const priceListId = agreement.PriceList.Id;
  console.log("price",priceListId)
    let priceListPayload = null;
let payload = {
 
  APTS_Extension_Reason_c: reason,
 StatusCategory: agreement.StatusCategory,
};
console.log("endDate",endDate);
console.log("oldEndDate",oldEndDate);
// VALIDITY
if (isValidityScreen) {
if(startDate>=endDate){
     alert("Effective Date can not be Equal or Greater than Expiration Date");
     return;
  }
    payload = {
    ...payload,
    ContractEndDate: endDate,
    ContractStartDate:startDate
};
// Prepare Price List Sync (Formatting to ISO for API)
        priceListPayload = {
          EffectiveDate: `${startDate}T23:59:59Z`,
          ExpirationDate: `${endDate}T23:59:59Z`
        };
  }

// EXTENSION
else if (endDate > oldEndDate) {
console.log("EXTENSION");
  payload = {
    ...payload,
    ContractEndDate: endDate,
    APTS_Extend_post_Save_action_c: "E",
   
    Status: "Being Extended",

    APTS_Extension_SAP_Status_c: "In Progress",
    APTS_Last_Extended_on_Date_c: new Date().toISOString().split("T")[0]
   
  };
priceListPayload = {
          ExpirationDate: `${endDate}T23:59:59Z`
        };
}

// PREPONEMENT
else if (endDate < oldEndDate) {
console.log("PREPONEMENT");
  payload = {
    ...payload,
    ContractEndDate: endDate,
    APTS_Extend_post_Save_action_c: "P",
  
    Status: "Being Preponed",
    ApprovalStatus: "Approval Required",
    APTS_Proposed_Preponement_Date_c: endDate
   
  };

}
    try {
console.log("final",payload);
if (priceListPayload && priceListId) {
        await updatePriceList(priceListId, priceListPayload);
      }

      // 2. Update Agreement
      await updateAgreement(id, payload);

      alert("Agreement updated successfully");
 window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`;

    } catch (err) {

      console.error(err);
      alert("Error updating agreement");

    }
  };

  if (!agreement) return <div>Loading...</div>;
return (
  <div className="agreement-page">
<div className="top-header">
        <div className="header-left">
          <span className="brand">Agreement Extension</span>
         
       
        </div>

        <div className="header-actions">
          <button className="btn primary" onClick={handleSave}>Save</button>
        <button className="btn" onClick={() => window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`}>Cancel</button>
      
        </div>
      </div>

    <div className="section">

      <div className="section-header">
        <span className="arrow">▾</span>
        <span>Extension Details</span>
      </div>

      <div className="form-container">

        {!isValidityScreen && (
          <div className="form-row">
            <label>Effective Date</label>
            <input
              type="date"
              value={startDate || ""}
              disabled
            />
          </div>
        )}
       

        {isValidityScreen && (
          <div className="form-row">
            <label>Effective Date</label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) =>  setStartDate(e.target.value)}
            />
          </div>
        )}
       
        <div className="form-row">
          <label>Expiration Date</label>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Extension Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="bottom-buttons">
          <button className="btn primary" onClick={handleSave}>Save</button>
          <button className="btn" onClick={() => window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`}>Cancel</button>
        </div>

      </div>
    </div>
  </div>
);

}