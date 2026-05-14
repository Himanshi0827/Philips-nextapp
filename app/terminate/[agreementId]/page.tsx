'use client';

import { useState, useEffect } from "react";
import { getAgreementById, updateAgreement,SubmitForApproval } from "../../../src/api/api";
import {useParams, useSearchParams } from "next/navigation";
import "../../../src/CSS/AgreementExtension.css";

export default function TerminateAgreement() {

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
  const [terminationReason, setTerminationReason] = useState("");

  useEffect(() => {
      const loadAgreement = async () => {
    const data = await getAgreementById(id);
    setAgreement(data[0]);
  };

    loadAgreement();
  }, []);


  const handleTerminate = async () => {

  if (!terminationReason) {
    alert("Termination Reason is required");
    return;
  }

  const payload = {
    TerminationComments: terminationReason,
    StatusCategory: "In Effect",
    Status: "Being Terminated",
    ApprovalStatus: "Approval Required"
  };

  const approvalPayload = {
    ObjectId: id,
    ObjectType: "Agreement",
    Comments: terminationReason
  };

  try {

    // Update Agreement
    await updateAgreement(id, payload);

    //  Submit for Approval
    await SubmitForApproval(approvalPayload);

  alert("Agreement termination submitted for approval");
  
    window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`;
    

  } catch (err) {

    console.error(err);
  alert("Error terminating agreement");
  

  }
};

  if (!agreement) return <div>Loading...</div>;

  return (
    <div className="agreement-page">
<div className="top-header">
        <div className="header-left">
          <span className="brand">Terminate Agreement</span>
         
       
        </div>

        <div className="header-actions">
         <button className="btn primary" onClick={handleTerminate}>
            Continue
          </button>

          <button className="btn"  onClick={() => window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`}>
            Cancel
          </button>
        </div>
      </div>
     

      <div className="section">

        <div className="section-header">
          <span className="arrow">▾</span>
          <span>Termination Details</span>
        </div>

        <div className="form-container">

          <div className="form-row">
            <label>Termination Reason</label>

            <textarea
              value={terminationReason}
              onChange={(e) => setTerminationReason(e.target.value)}
              required
            />
          </div>

          <div className="bottom-buttons">
            <button className="btn primary" onClick={handleTerminate}>
              Continue
            </button>

            <button className="btn"  onClick={() => window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`}>
              Cancel
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}