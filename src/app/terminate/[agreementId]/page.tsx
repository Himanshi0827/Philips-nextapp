'use client';

import { AuthGuard } from "@/components/auth-guard";
import { useState, useEffect } from "react";
import { getAgreementById, updateAgreement,submitForApproval } from "@/lib/api/services/agreement.service";
import {useParams, useSearchParams } from "next/navigation";
import "@/styles/AgreementExtension.css";

export default function TerminateAgreement() {

const params = useParams();
const agreementId = params?.agreementId as string;   
const location = useSearchParams();
const id =
  agreementId ||                      
  location.state?.agreementId ||    
  null;
 
if (!id) {
  console.error("Agreement ID not found in URL or state");
}

  const [agreement, setAgreement] = useState<any>(null);
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
    await submitForApproval(approvalPayload);

  alert("Agreement termination submitted for approval");
  
    window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`;
    

  } catch (err) {

    console.error(err);
  alert("Error terminating agreement");
  

  }
};

  return (
    <AuthGuard>
    {!agreement ? <div>Loading...</div> : <div className="agreement-page">
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
              onChange={(e: any) => setTerminationReason(e.target.value)}
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

    </div>}
    </AuthGuard>
  );
}