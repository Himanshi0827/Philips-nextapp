'use client';

import { useState, useEffect } from "react";
import { getAgreementById, getAmendAgreement, createAgreementGroup, createAgreementLineItem, updateAgreement } from "../../../src/api/api";
import { queryAgreementLineItemsByAgreement, queryAgreementGroupByAgreement } from "../../../src/api/queryAgreementLineItemsByAgreement";
import { useParams, useSearchParams } from "next/navigation";
import "../../../src/CSS/AgreementExtension.css";
import { toast } from "react-toastify";
 
export default function AgreementAmendAddendum() {
 
 
    const { agreementId } = useParams();   //  from URL
    const location = useSearchParams();
 
    const id =
        agreementId ||                      //  FIRST priority (URL)
        location.state?.agreementId ||     // fallback (navigation)
        null;
 
    if (!id) {
        console.error("Agreement ID not found in URL or state");
    }
 
    const [agreement, setAgreement] = useState(null);
    const [agreementType, setAgreementType] = useState("Amendment");
    const [pppValue, setPppValue] = useState("");
    const [isDealAgreement, setIsDealAgreement] = useState(false);
 
    useEffect(() => {
        loadAgreement();
    }, []);
    const getErrorMessage = (err) => {
        if (!err) return "Unknown error";
 
        if (typeof err === "string") return err;
 
        if (err.message) return err.message;
 
        if (err.Errors && err.Errors.length > 0) {
            return err.Errors[0].Message;
        }
 
        if (err.error) return err.error;
 
        try {
            return JSON.stringify(err);
        } catch {
            return "Unexpected error occurred";
        }
    };
    const loadAgreement = async () => {
        const data = await getAgreementById(id);
 
        const agr = data[0];
 
        setAgreement(agr);
 
        // Deal agreement check (same as Apex)
        if (agr.RecordType === "Deal") {
            setIsDealAgreement(true);
            setPppValue(agr.SpecialTerms || "");
        }
    };
 
    const handleContinue = async () => {
       
        try {
 
            if (isDealAgreement && !pppValue) {
                alert("Purpose, Process, Payoff, Spec. Terms is required");
                return;
            }
 
            // 1️ Clone Agreement
            let newAgreementId;
 
            try {
 
                // Step 1: clone agreement using amend API
                newAgreementId = await getAmendAgreement(id);
 
                if (!newAgreementId) {
                    toast.error("Failed to clone agreement");
                    return;
                }
 
                if (agreementType === "Amendment") {
                    var updatePayload={
                        ParentAgreement:{Id:id}
                    }
                    await updateAgreement(newAgreementId,updatePayload);
                    var payload={
                        RecordType:'Deal_Locked'
                    }
                    await updateAgreement(id,payload);
                    toast.success("Agreement amended successfully");
                } else if (agreementType === "Addendum") {
 
                    // Step 2: update only the name
                    const updatePayload = {
                        Name: `${agreement.Name} Addendum`,
                        ParentAgreement:{Id:id}
                    };
 
                    await updateAgreement(newAgreementId, updatePayload);
                      const payload={
                        RecordType:'Deal_Locked'
                    }
                    await updateAgreement(id,payload);
 
                    toast.success("Agreement Addendum created successfully");
                }
 
            } catch (err) {
 
                toast.error(getErrorMessage(err));
                return;
 
            }
            //  Fetch old groups
            let oldGroups;
 
            try {
                let temp = await queryAgreementGroupByAgreement(id);
                oldGroups= temp.map(item =>{
                    const {CreatedBy,CreatedDate,ModifiedBy,ModifiedDate,ETag,...rest}=item;
                    return rest;
                });
                console.log("Old groups", oldGroups);
            } catch (err) {
                toast.error(getErrorMessage(err));
                return;
            }
 
 
            const groupMapping = {};
            let status = false;
            // Create new groups
            for (const grp of oldGroups) {
 
                try {
 
                    const newGroupPayload = {
                        ...grp,
                        Id:null,
                        APTS_Agreement_c: newAgreementId,
                        APTS_Origin_Group_Id_c:{Id:grp.Id,Name:grp.Name}
                    };
 
                    const createdGroup = await createAgreementGroup(newGroupPayload);
                    status = createdGroup?.Success;
                    const newGroupId = createdGroup?.Data;
                    groupMapping[grp.Id] = newGroupId;
 
                } catch (err) {
                    toast.error(getErrorMessage(err));
                    return;
                }
            }
            if (status) {
                toast.success("Agreement groups are Amended successfully");
            }
            console.log("Group Mapping", groupMapping);
 
 
            //  Fetch old line items
            let oldLineItems;
 
            try {
                let temp = await queryAgreementLineItemsByAgreement(id);
                oldLineItems= temp.map(item =>{
                    const {CreatedBy,CreatedDate,ModifiedBy,ModifiedDate,ETag,...rest}=item;
                    return rest;
                });
 
            } catch (err) {
                alert("Failed to fetch agreement line items: " + getErrorMessage(err));
                return;
            }
            let final_status = false;
            //  Clone line items
            for (const line of oldLineItems) {
 
                try {
 
                    const oldGroupId = line?.APTS_Agreement_Group_c?.Id;
                    const newGroupId = groupMapping[oldGroupId];
 
                    const linePayload = {
                
                        ...line,
                        Id:null,
                        Agreement: newAgreementId,
                        APTS_Origin_Line_Item_Id_c:{Id:line.Id,Name:line.Name},
                        APTS_Agreement_Group_c: { Id: newGroupId },
                     
                    };
 
                 
 
                    const response = await createAgreementLineItem(linePayload);
                    final_status = response?.Success;
                } catch (err) {
                    toast.error(getErrorMessage(err));
                    return;
                }
            }
            if (final_status) {
                toast.success("AgreementLineItems are Amended successfully");
            }
            window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`;
           
        } catch (err) {
            alert("Unexpected error: " + getErrorMessage(err));
            console.error(err);
        }
    };
    if (!agreement) return <div>Loading...</div>;
 
    return (
        <div className="agreement-page">
 <div className="top-header">
        <div className="header-left">
          <span className="brand">Agreement changes: Amendment or Addendum</span>
        </div>

        <div className="header-actions">
         <button className="btn primary" onClick={handleContinue}>
                        Continue
          </button>
 
                    <button className="btn" onClick={() => window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`}>
                        Cancel
          </button>
        </div>
      </div>
           
 
            <div className="section">
 
                <div className="section-header">
                    <span className="arrow">▾</span>
                    <span>Agreement Change Type</span>
                </div>
 
                <div className="form-container">
 
                    <div className="form-row">
                        <label>Select applicable agreement changes type</label>
                        <div className="filter-group">
 
                        <select
                            value={agreementType}
                            onChange={(e) => setAgreementType(e.target.value)}
                        >
                            <option value="Amendment">Amendment</option>
                            <option value="Addendum">Addendum</option>
                        </select>
                        </div>
                    </div>
 
                    {isDealAgreement && (
                        <div className="form-row">
                            <label>
                                Purpose, Process, Payoff, Spec. Terms
              </label>
 
                            <textarea
                                value={pppValue}
                                onChange={(e) => setPppValue(e.target.value)}
                            />
                        </div>
                    )}
 
                    <div className="bottom-buttons">
                        <button className="btn primary" onClick={handleContinue}>
                            Continue
            </button>
 
                        <button className="btn" onClick={() => window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${id}`}>
                            Cancel
            </button>
                    </div>
 
                </div>
            </div>
 
        </div>
    );
}