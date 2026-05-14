'use client';

import { useEffect, useState } from "react";
import {  useParams, useRouter } from "next/navigation";
import { queryGetOIT, queryGetmember,getMemberById } from "../../../src/api/member";
import CreateMembership from "../../../src/Member/CreateMembership";
import "../../../src/CSS/Members.css";

export default function MemberDetail() {
  const { memberId } = useParams();
  const state= JSON.parse(sessionStorage.getItem("memberDetails"));
  console.log("Member details",state);
  const navigate = useRouter();

  const [member, setMember] = useState(state?.member || null);
  const [agreementDetails, setAgreementDetails] = useState(state?.agreementDetails || null);
  const [agmList, setAgmList] = useState([]);
  const [oitList, setOitList] = useState([]);
  const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const [selectedAgm, setSelectedAgm] = useState(null);
  useEffect(() => {
    loadDetails();
  }, [memberId]);

const handleEdit = (agm) => {
  console.log("jadhj",agm);
  setSelectedAgm(agm);   // pass full row
  setShowModal(true);
};
const loadDetails = async () => {
  try {
    setLoading(true);

    let currentMember = member;

    // fallback
    if (!currentMember) {
      const res = await getMemberById(memberId);
      currentMember = res;
      setMember(res);
    }

    const agreementId = agreementDetails?.Id;
    const accountId = currentMember?.APTS_Member_c;

    //  AGM
    const allAgm = await queryGetmember(agreementId);

    const agmFiltered = allAgm.filter(
      (rec) => rec.APTS_Member_c === accountId
    );

    console.log("AGM FILTERED", agmFiltered);
    setAgmList(agmFiltered);

    //  OIT (correct API)
    const oit = await queryGetOIT(memberId);
    setOitList(oit || []);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div className="detail-page">

      {/* HEADER */}
           <div className="top-header">
        <div className="header-left">
          <span className="brand">PHILIPS</span>
          <span className="agreement">
  | Agreement: {agreementDetails?.Name || "Loading..."}
</span>
       
        </div>

        <div className="header-actions">
              <button onClick={() => navigate.back()}>Back To List</button>
        </div>
      </div>
    
   <div className="section-header">
        Member Details
      </div>

      {/* MEMBER DETAILS */}
      <div className="card">
        <div className="grid">
          <div className="field-row">
            <label>Member Name:</label>
            <span>{member?.accountData?.Name}</span>
          </div>

          <div className="field-row">
            <label>Related Agreement:</label>
            <span>{agreementDetails?.Name}</span>
          </div>

          <div className="field-row">
            <label>Member Type:</label>
            <span>{member?.APTS_Member_Type_c}</span>
          </div>

          <div className="field-row">
            <label>Agreement Customer:</label>
            <span>{agreementDetails?.Customer_Name__c}</span>
          </div>

          <div className="field-row">
            <label>Designated GPO:</label>
            <span>{member?.Designated_GPO__r?.Name}</span>
          </div>

          <div className="field-row">
            <label>ERP Deletion Flag:</label>
            <span>{member?.ERP_Delete__c ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>

      {/* AGREEMENT GROUP MEMBERS */}
      <div className="section-header">
  Agreement Group Members
</div>
      <div className="card">
       
<div className="card-body">
  <div className="center-btn">
     <button
  className="primary"
  onClick={() => {
    setSelectedAgm(null); // new record
    setShowModal(true);
  }}
>
  Add New Agreement Group Member
</button>
  </div>


    {showModal && (
  <div className="modal-overlay">
    <div className="modal-container">

      <div className="modal-header">
        <h2>
          {selectedAgm
            ? "Edit Agreement Group Member"
            : "New Agreement Group Member"}
        </h2>
      </div>

      <div className="modal-body">
       <CreateMembership
  mode={selectedAgm ? "modal-edit" : "modal-create"}
  onBack={() => setShowModal(false)}
  agreementDetails={agreementDetails}
  onSuccess={loadDetails} 
  member={member}               // fixed account
  existingRecord={selectedAgm}  // edit case
/>
      </div>

    </div>
  </div>
)}
        {agmList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Agreement Group</th>
                <th>Tier</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Active</th>
              </tr>
            </thead>
          
<tbody>
  {agmList.map((a) => (
    <tr key={a.Id}>
      <td>
        <button
          className="icon-btn"
          onClick={() => handleEdit(a)}
        >
          ✏️
        </button>
      </td>
      <td>{a?.APTS_Agreement_Group_c?.Name}</td>
      <td>{a?.APTS_Volume_Tier_c || "-"}</td>
      <td>{a?.APTS_Start_Date_c || "-"}</td>
      <td>{a?.APTS_End_Date_c || "-"}</td>
      <td>{a?.APTS_End_Date_c ? "false" : "true"}</td>
    </tr>
  ))}
</tbody>
            
          </table>
        ) : (
          <p>No Agreement Groups for this member</p>
        )}
      </div>
  </div>
      {/* OIT SECTION */}
      <div className="section-header">
  OIT Track Record
</div>
      <div className="card">
     

<div className="card-body"></div>
        {oitList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>OIT Value</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {oitList.map((o) => (
                <tr key={o.Id}>

                  <td>{o?.APTS_OIT_Value_c || "-"}</td>
      <td>{o?.APTS_Start_Date_c || "-"}</td>
      <td>{o?.APTS_End_Date_c || "-"}</td>
      <td>{o?.APTS_Volume_Tier_c || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No OIT records for {member?.accountData?.Name}</p>
        )}
      </div>
    </div>
  );
}