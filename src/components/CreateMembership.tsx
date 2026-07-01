'use client';

import { useEffect, useState } from "react";

import LookupTypeAhead from "@/components/LookupTypeAhead";
import { searchLookupRecords } from "@/lib/api/services/lookup.service";
import { createMember,updateMember } from "@/lib/api/services/member.service"; 
import { getPicklistOptions } from "@/lib/utils/getPicklistOptions";
import Designation from "./Designation";

export default function CreateMembership({ mode,onBack ,onSuccess, agreementDetails,existingRecord, member}) {
  console.log("details",agreementDetails);
  const agreementId = typeof window !== "undefined" ? sessionStorage.getItem("agreementId") : null;
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
 
const [memberTypes, setMemberTypes] = useState<any[]>([]);
const [volumeTiers, setVolumeTiers] = useState<any[]>([]);
const [syncOptions, setSyncOptions] = useState<any[]>([]);



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
    const payload: Record<string, any> = {
      ...(mode === "modal-edit" && { Id: existingRecord?.Id }),
      Name: form.member?.Name || "New Member",
      APTS_Member_c: form.member?.Id,
      APTS_Related_Agreement_c: agreementId,
      // Required numerics always included
      APTS_OIT_Value_c: Number(form.oitValue),
      APTS_Current_over_achievement_c: Number(form.currentOverAchievement),
      // Booleans always included
      APTS_Automatic_Tier_Review_c: form.autoTierReview,
      APTS_locked_for_tier_changes_c: form.lockedForTier,
    };

    // Optional — only include when the user provided a value
    if (form.agreementGroup?.Id) {
      payload.APTS_Agreement_Group_c = { Id: form.agreementGroup.Id, Name: form.agreementGroup.Name };
    }
    if (form.memberType) payload.APTS_Member_Type_c = form.memberType;
    if (form.startDate) payload.APTS_Start_Date_c = form.startDate;
    if (form.endDate) payload.APTS_End_Date_c = form.endDate;
    if (form.volumeTier) payload.APTS_Volume_Tier_c = form.volumeTier;
    if (form.syncToSAP) payload.APTS_Sync_to_SAP_c = form.syncToSAP;
    if (form.oitStartDate) payload.APTS_OIT_start_date_c = form.oitStartDate;
    if (form.oitEndDate) payload.APTS_OIT_end_date_c = form.oitEndDate;
    if (form.externalId) payload.APTS_External_Identifier_c = form.externalId;
    if (form.lockedUntil) payload.APTS_Locked_Until_date_c = form.lockedUntil;

    if (mode === "modal-edit") {
      await updateMember(existingRecord?.Id, payload);
      alert("Updated successfully");
    } else {
      await createMember(payload);
      alert("Created successfully");
    }
    onSuccess && onSuccess();
    onBack();

  } catch (err: any) {
    console.error(err);
    alert(`Save failed: ${err?.message || "Unknown error"}`);
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
      onChange={(e: any) => setForm({ ...form, memberType: e.target.value })}
    >
      <option value="">Select an Option</option>
      {memberTypes.map((opt: any) => (
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
  onChange={(e: any) => setForm({ ...form, startDate: e.target.value })}
/>
   
  </div>

  <div className="field full">
    <label>End Date</label>
    <input
  type="date"
  value={formatDate(form.endDate)}
  onChange={(e: any) => setForm({ ...form, endDate: e.target.value })}
/>
  
  </div>

  {/* Row 4 */}
  <div className="field full">
    <label>* OIT Value</label>
    <input
      type="number"
      value={form.oitValue}
      onChange={(e: any) => setForm({ ...form, oitValue: e.target.value })}
    />
  </div>

  <div className="field full">
    <label>* Current over achievement</label>
    <input
      type="number"
      value={form.currentOverAchievement}
      onChange={(e: any) =>
        setForm({ ...form, currentOverAchievement: e.target.value })
      }
    />
  </div>

  {/* Row 5 */}
  <div className="field full">
    <label>Order Intake Volume Tier</label>
    <select
      value={form.volumeTier}
      onChange={(e: any) => setForm({ ...form, volumeTier: e.target.value })}
    >
      <option value="">Select an Option</option>
      {volumeTiers.map((opt: any) => (
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
      onChange={(e: any) => setForm({ ...form, syncToSAP: e.target.value })}
    >
      <option value="">Select an Option</option>
      {syncOptions.map((opt: any) => (
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
  onChange={(e: any) => setForm({ ...form, oitStartDate: e.target.value })}
/>
 
  </div>

  <div className="field full">
    <label>OIT end date</label>
    <input
  type="date"
  value={formatDate(form.oitEndDate)}
  onChange={(e: any) => setForm({ ...form, oitEndDate: e.target.value })}
/>
   
  </div>

  {/* Row 7 */}
  <div className="field full">
    <label>External Identifier</label>
    <input
      type="text"
        value={form.externalId}
      onChange={(e: any) => setForm({ ...form, externalId: e.target.value })}
    />
  </div>

  <div className="field full">
    <label>Locked Until date</label>
    <input
  type="date"
  value={formatDate(form.lockedUntil)}
  onChange={(e: any) => setForm({ ...form, lockedUntil: e.target.value })}
/>
   
  </div>

  {/* Row 8 (Checkbox row like screenshot) */}
  <div className="checkbox-container">
    <input
      type="checkbox"
        checked={form.autoTierReview}
      onChange={(e: any) =>
        setForm({ ...form, autoTierReview: e.target.checked })
      }
    />
    <label>Automatic Tier Review</label>
  </div>

  <div className="checkbox-container">
    <input
      type="checkbox"
        checked={form.lockedForTier}
      onChange={(e: any) =>
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