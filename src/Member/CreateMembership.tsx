'use client';

import { useEffect, useState } from "react";

import LookupTypeAhead from "../components/LookupTypeAhead";
import { searchLookupRecords } from "../api/SearchLookup";
import { createMember,updateMember } from "../api/member"; 
import { getPicklistOptions } from "./getPicklistOptions";
import Designation from "./Designation";

export default function CreateMembership({ mode,onBack ,onSuccess, agreementDetails,existingRecord, member}) {
  console.log("details",agreementDetails);
  const agreementId = sessionStorage.getItem("agreementId");
const [form, setForm] = useState({
  member: null,
  agreementGroup: null,
  memberType: "",
  startDate: "",
  endDate: "",
  oitValue: "",
  currentOverAchievement: "",
  volumeTier: "",
  syncToSAP: "",
  oitStartDate: "",
  oitEndDate: "",
  externalId: "",
  lockedUntil: "",
  autoTierReview: false,
  lockedForTier: false
});
 
const [memberTypes, setMemberTypes] = useState([]);
const [volumeTiers, setVolumeTiers] = useState([]);
const [syncOptions, setSyncOptions] = useState([]);



useEffect(() => {
  loadPicklists();

  if (mode === "modal-edit" && existingRecord) {
    //  EDIT MODE
    setForm({
      member: member?.accountData || null,

      agreementGroup: existingRecord?.APTS_Agreement_Group_c || null,
      memberType: existingRecord?.APTS_Member_Type_c || "",

      startDate: existingRecord?.APTS_Start_Date_c|| "",
      endDate: existingRecord?.APTS_End_Date_c || "",

      oitValue: existingRecord?.APTS_OIT_Value_c || "",
      currentOverAchievement:
        existingRecord?.APTS_Current_over_achievement_c || "",

      volumeTier: existingRecord?.APTS_Volume_Tier_c || "",
      syncToSAP: existingRecord?.APTS_Sync_to_SAP_c || "",

      oitStartDate: existingRecord?.APTS_OIT_start_date_c || "",
      oitEndDate: existingRecord?.APTS_OIT_end_date_c || "",

      externalId: existingRecord?.APTS_External_Identifier_c || "",
      lockedUntil: existingRecord?.APTS_Locked_Until_date_c || "",

      autoTierReview:
        existingRecord?.APTS_Automatic_Tier_Review_c || false,

      lockedForTier:
        existingRecord?.APTS_locked_for_tier_changes_c || false,
    });

  } else if (mode === "modal-create" && member) {
    //  NEW GROUP MEMBER (same account)
    setForm((prev) => ({
      ...prev,
      member: member?.accountData || member
    }));
  }

}, [existingRecord, member, mode]);
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
};
const loadPicklists = async () => {
  try {
    const mt = await getPicklistOptions("APTS_Member_Type_c");
    const vt = await getPicklistOptions("APTS_Volume_Tier_c");
    const sync = await getPicklistOptions("APTS_Sync_to_SAP_c");

    setMemberTypes(mt);
    setVolumeTiers(vt);
    setSyncOptions(sync);
  } catch (e) {
    console.error(e);
  }
};
const handleSave = async () => {
  try {
    const payload = {
      
  ...(mode === "modal-edit" && { Id: existingRecord?.Id }),
      Name: form.member?.Name || "New Member",
      APTS_Member_c: form.member?.Id,
      APTS_Related_Agreement_c: agreementId,
      APTS_Agreement_Group_c: {Id:form.agreementGroup?.Id, Name:form.agreementGroup?.Name},

      APTS_Member_Type_c: form.memberType,
      APTS_Start_Date_c: form.startDate,
      APTS_End_Date_c: form.endDate,

      APTS_OIT_Value_c: Number(form.oitValue),
      APTS_Current_over_achievement_c: Number(form.currentOverAchievement),

      APTS_Volume_Tier_c: form.volumeTier,
      APTS_Sync_to_SAP_c: form.syncToSAP,

      APTS_OIT_start_date_c: form.oitStartDate,
      APTS_OIT_end_date_c: form.oitEndDate,

      APTS_External_Identifier_c: form.externalId,
      APTS_Locked_Until_date_c: form.lockedUntil,

      APTS_Automatic_Tier_Review_c: form.autoTierReview,
      APTS_locked_for_tier_changes_c: form.lockedForTier
    };

    if (mode === "modal-edit") {
      console.log("id",existingRecord?.Id );
      console.log("payload edit",payload );
      await updateMember(existingRecord?.Id ,payload);
      alert("Updated successfully");
    } else {
      console.log("payload create",payload );
      await createMember(payload);
      alert("Created successfully");
    }
onSuccess && onSuccess();
    onBack();

  } catch (err) {
    console.error(err);
  }
};

 const isGPOFramework =
    agreementDetails?.RecordType === "GPO_Framework" &&
    agreementDetails?.APTS_Sales_Area_c === "United States" &&
    agreementDetails?.Apttus_Market_c === "North America" &&
    agreementDetails?.StatusCategory === "In Effect";

  //  SWITCH UI HERE
  if (mode === "page" && isGPOFramework) {
    return <Designation />;
  }

  return (
    <div className="members-container">

      {/* HEADER */}
      
{mode === "page" && (
  <div className="top-header">
    <div className="header-left">
      <span className="brand">PHILIPS</span>
      <span className="agreement">
        | Agreement: {agreementDetails?.Name}
      </span>
    </div>

    <div className="header-actions">
      <button onClick={onBack}>Back To List</button>
      <button style={{"background": "#0070d2"}} className="primary"  onClick={handleSave}>
        Save New Member
      </button>
    </div>
  </div>
)}
      <div className="section-title">Member Details</div>

     <div className="form-grid">

  {/* Row 1 */}
  <div className="field full">
    <label>* Select Member</label>
    <LookupTypeAhead
  field={{ DisplayName: "Member", LookupObjectName: "Account" }}
  value={form.member}
  onChange={(rec) => setForm({ ...form, member: rec })}
  searchFn={searchLookupRecords}
  disabled={mode !== "page"}   // 👈 key line
/>
   
  </div>

  <div className="field full">
    <label>* Related Agreement</label>
    <input value={agreementDetails?.Name || agreementId} disabled />
  </div>

  {/* Row 2 */}
  <div className="field full">
    <label>Member Type</label>
    <select
      value={form.memberType}
      onChange={(e) => setForm({ ...form, memberType: e.target.value })}
    >
      <option value="">Select an Option</option>
      {memberTypes.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>

  <div className="field full">
    <label>Agreement Group</label>
    <LookupTypeAhead
      field={{
        DisplayName: "Agreement Group",
        LookupObjectName: "APTS_Agreement_Groups_c",
        AgreementId: agreementId
      }}
      value={form.agreementGroup}
      onChange={(rec) => setForm({ ...form, agreementGroup: rec })}
      searchFn={searchLookupRecords}
    />
  </div>

  {/* Row 3 */}
  <div className="field full">
    <label>Start Date</label>
    <input
  type="date"
  value={formatDate(form.startDate)}
  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
/>
   
  </div>

  <div className="field full">
    <label>End Date</label>
    <input
  type="date"
  value={formatDate(form.endDate)}
  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
/>
  
  </div>

  {/* Row 4 */}
  <div className="field full">
    <label>* OIT Value</label>
    <input
      type="number"
      value={form.oitValue}
      onChange={(e) => setForm({ ...form, oitValue: e.target.value })}
    />
  </div>

  <div className="field full">
    <label>* Current over achievement</label>
    <input
      type="number"
      value={form.currentOverAchievement}
      onChange={(e) =>
        setForm({ ...form, currentOverAchievement: e.target.value })
      }
    />
  </div>

  {/* Row 5 */}
  <div className="field full">
    <label>Order Intake Volume Tier</label>
    <select
      value={form.volumeTier}
      onChange={(e) => setForm({ ...form, volumeTier: e.target.value })}
    >
      <option value="">Select an Option</option>
      {volumeTiers.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>

  <div className="field full">
    <label>Sync to SAP</label>
    <select
      value={form.syncToSAP}
      onChange={(e) => setForm({ ...form, syncToSAP: e.target.value })}
    >
      <option value="">Select an Option</option>
      {syncOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>

  {/* Row 6 */}
  <div className="field full">
    <label>OIT start date</label>
    <input
  type="date"
  value={formatDate(form.oitStartDate)}
  onChange={(e) => setForm({ ...form, oitStartDate: e.target.value })}
/>
 
  </div>

  <div className="field full">
    <label>OIT end date</label>
    <input
  type="date"
  value={formatDate(form.oitEndDate)}
  onChange={(e) => setForm({ ...form, oitEndDate: e.target.value })}
/>
   
  </div>

  {/* Row 7 */}
  <div className="field full">
    <label>External Identifier</label>
    <input
      type="text"
        value={form.externalId}
      onChange={(e) => setForm({ ...form, externalId: e.target.value })}
    />
  </div>

  <div className="field full">
    <label>Locked Until date</label>
    <input
  type="date"
  value={formatDate(form.lockedUntil)}
  onChange={(e) => setForm({ ...form, lockedUntil: e.target.value })}
/>
   
  </div>

  {/* Row 8 (Checkbox row like screenshot) */}
  <div className="checkbox-container">
    <input
      type="checkbox"
        checked={form.autoTierReview}
      onChange={(e) =>
        setForm({ ...form, autoTierReview: e.target.checked })
      }
    />
    <label>Automatic Tier Review</label>
  </div>

  <div className="checkbox-container">
    <input
      type="checkbox"
        checked={form.lockedForTier}
      onChange={(e) =>
        setForm({ ...form, lockedForTier: e.target.checked })
      }
    />
    <label>Locked for Tier changes</label>
  </div>

</div>
{mode !== "page" && (
  <div className="modal-footer">
    <button onClick={onBack}>Cancel</button>

    <button className="primary" onClick={handleSave}>
      {mode === "modal-edit"
        ? "Save Agreement Group Member"
        : "Create Agreement Group Member"}
    </button>
  </div>
)}
    </div>
  );
}