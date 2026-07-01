'use client';

import { AuthGuard } from "@/components/auth-guard";
import { useEffect, useState } from "react";
import { useRouter,useParams } from "next/navigation";
import LookupTypeAhead from "@/components/LookupTypeAhead";
import { searchLookupRecords } from "@/lib/api/services/lookup.service";
import { queryGetMember, getAccountsByIds, createMember } from "@/lib/api/services/member.service";
import { getPicklistOptions } from "@/lib/utils/getPicklistOptions";
import "@/styles/Members.css";


export default function CloneMembers() {
  const params = useParams();
const agreementId = params?.agreementId as string;
  const targetAgreementName = typeof window !== "undefined" ? sessionStorage.getItem("agreementName") : "";
  const [sourceAgreement, setSourceAgreement] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
const navigate = useRouter();

const [volumeTier, setVolumeTier] = useState("");
const [volumeTierOptions, setVolumeTierOptions] = useState<any[]>([]);

const [targetGroup, setTargetGroup] = useState<any[]>([]);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [isTierFromSource, setIsTierFromSource] = useState(false);

const [selectedMembers, setSelectedMembers] = useState<any[]>([]);


  useEffect(() => {
    if (!sourceAgreement) return;

    const loadMembers = async () => {
      try {
        setLoading(true);

        const records = await queryGetMember(sourceAgreement.Id);

        // Same enrichment logic you already use
        const accountIds = [
          ...new Set(
            records.map((rec: any) => rec?.APTS_Member_c).filter(Boolean)
          ),
        ];

        const accounts = await getAccountsByIds(accountIds);

        const accountMap = {};
        accounts.forEach((acc) => {
          accountMap[acc.Id] = acc;
        });

        const enriched = records.map((rec: any) => ({
          ...rec,
          accountData: accountMap[rec.APTS_Member_c] || null,
        }));

        setMembers(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
     loadPicklist();
  }, [sourceAgreement]);
const loadPicklist = async () => {
    const vt = await getPicklistOptions("APTS_Volume_Tier_c");
    setVolumeTierOptions(vt);
  };

  const handleCloneMembers = async () => {
  try {
    if (!selectedMembers.length) {
      alert("Select at least one member");
      return;
    }

    if (!targetGroup.length) {
      alert("Select Target Agreement Group");
      return;
    }

    const membersToClone = members.filter((m: any) =>
      selectedMembers.includes(m.Id)
    );

    for (let m of membersToClone) {
      for (let group of targetGroup) {
        const payload = {
          Name: m?.accountData?.Name || "Cloned Member",

          // CORE FIELDS
          APTS_Member_c: m.APTS_Member_c,
          APTS_Related_Agreement_c: agreementId,

          APTS_Agreement_Group_c: {
            Id: group.Id,
            Name: group.Name,
          },

          // Tier logic
          APTS_Volume_Tier_c: isTierFromSource
            ? m.APTS_Volume_Tier_c
            : volumeTier,

          // Dates
          APTS_Start_Date_c: startDate,
          APTS_End_Date_c: endDate,

          // OPTIONAL COPY FIELDS
          APTS_OIT_Value_c: m.APTS_OIT_Value_c,
          APTS_Current_over_achievement_c:
            m.APTS_Current_over_achievement_c,

        APTS_Member_Type_c: m.memberType,      
  APTS_OIT_start_date_c: m.oitStartDate,
  APTS_OIT_end_date_c: m.oitEndDate,
  APTS_Sync_to_SAP_c: m.syncToSAP,
  APTS_External_Identifier_c: m.externalId,
  APTS_Locked_Until_date_c: m.lockedUntil,

  APTS_Automatic_Tier_Review_c: m.autoTierReview,
  APTS_locked_for_tier_changes_c: m.lockedForTier
        };

        await createMember(payload);
      }
    }

    alert("Members cloned successfully");
    navigate.push(`/member/${agreementId}`);
  } catch (err) {
    console.error(err);
    alert("Error cloning members: ",err);
  }
};
  return (
    <AuthGuard>
    <div className="clone-container">
      
      {/* HEADER */}
      <div className="top-header">
        <div className="header-left">
          <span className="brand">PHILIPS</span>
          <span className="agreement">
           |  Agreement: {targetAgreementName}
          </span>
        </div>

  <div className="header-actions">
         
          <button  onClick={() =>
    navigate.push(`/member/${agreementId}`)}>Back To List</button>
        {/* <button className="primary" >
         Clone Selected Members
        </button> */}
        <button className="primary" style={{"background": "#0070d2"}} onClick={handleCloneMembers}>
  Clone Selected Members
</button>
        </div>

      </div>

    
      <div className="clone-card">
        <div className="form-grid">


          <div className="field full">
            <label>* Select Source Agreement</label>
            <LookupTypeAhead
              field={{
                DisplayName: "Agreement",
                LookupObjectName: "Agreement",
                TargetAgreement: agreementId,
              }}
              value={sourceAgreement}
              onChange={(record) => {
                if (record?.Id === agreementId) {
                  alert("Source cannot be same as Target");
                  return;
                }
                setSourceAgreement(record);
              }}
              searchFn={searchLookupRecords}
            />
          </div>


          <div className="field full">
            <label>Target Agreement</label>
            <input value={targetAgreementName} disabled />
          </div>


  <div className="field full">
    <label>* Order Intake Volume Tier</label>
    <select
      value={volumeTier}
      onChange={(e: any) => setVolumeTier(e.target.value)}
    >
      <option value="">Select</option>
      {volumeTierOptions.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>


  <div className="field full">
    <label>* Select Target Agreement Group(s)</label>
    <LookupTypeAhead
      field={{
        DisplayName: "Agreement Group",
        LookupObjectName: "APTS_Agreement_Groups_c",
        AgreementId: agreementId,
      }}
      value={null}
      onChange={(record) => {
        if (!record) return;

        setTargetGroup((prev) => {
          if (prev.find((g: any) => g.Id === record.Id)) return prev;
          return [...prev, record];
        });
      }}
      searchFn={searchLookupRecords}
    />


    <div className="selected-groups">
      {targetGroup.map((g: any) => (
        <span key={g.Id} className="group-chip">
          {g.Name}
          <button
            onClick={() =>
              setTargetGroup((prev) =>
                prev.filter((x: any) => x.Id !== g.Id)
              )
            }
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  </div>


  <div className="field full">
    <label>Member Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e: any) => setStartDate(e.target.value)}
    />
  </div>


  <div className="field full">
    <label>Member End Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(e: any) => setEndDate(e.target.value)}
    />
  </div>

 
  <div className="clone-checkbox">
    <label>
      <input
        type="checkbox"
        checked={isTierFromSource}
        onChange={(e: any) => setIsTierFromSource(e.target.checked)}
      />
      Is Tier from Source Agreement?
    </label>
  </div>
        </div>
      </div>

     

      {sourceAgreement && (
        <div className="members-section">

          <div className="section-title">Agreement Members</div>

          {loading ? (
            <p>Loading...</p>
          ) : members.length === 0 ? (
            //  SECOND SCREEN (EMPTY STATE)
            <div className="empty-banner">
              No active Members exists in source agreement which are not present in target agreement
            </div>
          ) : (
            //  THIRD SCREEN (TABLE)
            <div className="table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Account Name</th>
                    <th>MP1 Customer ID</th>
                    <th>Source Member Tier</th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((m: any) => (
                    <tr key={m.Id}>
                      <td>
                        <input
  type="checkbox"
  onChange={() => {
    setSelectedMembers((prev) =>
      prev.includes(m.Id)
        ? prev.filter((id) => id !== m.Id)
        : [...prev, m.Id]
    );
  }}
/>
                        {/* <input type="checkbox" /> */}
                      </td>
                      <td>{m?.accountData?.Name}</td>
                      <td>{m?.accountData?.MP1_Customer_id_1_c}</td>
                      <td>{m?.APTS_Volume_Tier_c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}
    </div>
    </AuthGuard>
  );
}