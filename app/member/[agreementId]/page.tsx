'use client';

import { useRouter, useParams } from "next/navigation";

import { useEffect, useState, useMemo } from "react";
import { queryGetmember ,getAccountsByIds} from "../../../src/api/member"; 
import AgreementGroupSelector from "../../../src/components/AgreementGroupSelector";
import "../../../src/CSS/Members.css";
import CreateMembership from "../../../src/Member/CreateMembership";
import { queryGetAgreementDetails } from "../../../src/api/queryAgreementLineItemsByAgreement";

const PAGE_SIZE = 5;

export default function Membership() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agreementGroup, setAgreementGroup] = useState([]);
  const { agreementId } = useParams();
   
  const [showCreate, setShowCreate] = useState(false);
  const [agreementDetails, setAgreementDetails] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [includeExpired, setIncludeExpired] = useState(false);
const navigate = useRouter();
  useEffect(() => {
    sessionStorage.setItem("agreementId",agreementId);
    loadMembers();
      loadAgreement();
       
  }, []);
  const loadAgreement = async () => {
  try {
    const res = await queryGetAgreementDetails(agreementId);
    setAgreementDetails(res?.[0]);
    console.log("name",agreementDetails);
  } catch (err) {
    console.error(err);
  }
};


const loadMembers = async () => {
  try {
    setLoading(true);

    const records = await queryGetmember(agreementId);

    //  Step 1: Collect all Account IDs
    const accountIds = [
      ...new Set(
        records
          .map((rec) => rec?.APTS_Member_c)
          .filter(Boolean)
      ),
    ];

    //  Step 2: Bulk fetch Accounts
    const accounts = await getAccountsByIds(accountIds);

    //  Step 3: Convert to Map for fast lookup
    const accountMap = {};
    accounts.forEach((acc) => {
      accountMap[acc.Id] = acc;
    });

    //  Step 4: Merge into members
    const enrichedRecords = records.map((rec) => ({
      ...rec,
      accountData: accountMap[rec.APTS_Member_c] || null,
    }));

   
const deduped = Object.values(
  enrichedRecords.reduce((acc, rec) => {
    const accId = rec?.APTS_Member_c;

    if (!accId) return acc;

    if (!acc[accId]) {
      acc[accId] = rec;
    }

    return acc;
  }, {})
);

const groupedMembers = Object.values(
  enrichedRecords.reduce((acc, rec) => {
    const accId = rec?.APTS_Member_c;

    if (!accId) return acc;

    if (!acc[accId]) {
      acc[accId] = {
        ...rec,
        groups: [],
        memberRecords: [], // IMPORTANT
      };
    }

    acc[accId].groups.push(
      rec?.APTS_Agreement_Group_c?.Name
    );

    acc[accId].memberRecords.push(rec);

    return acc;
  }, {})
);
// const groupedMembers = Object.values(
//   enrichedRecords.reduce((acc, rec) => {
//     const accId = rec?.APTS_Member_c;
//     if (!accId) return acc;

//     if (!acc[accId]) {
//       acc[accId] = {
//         ...rec,
//         groups: []
//       };
//     }

//     acc[accId].groups.push(rec?.APTS_Agreement_Group_c?.Name);

//     return acc;
//   }, {})
// );
setMembers(deduped);
setMembers(groupedMembers);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  
//   const filtered = useMemo(() => {
//   let data = members;
//  const today = new Date();

//   // Filter expired members (ONLY when checkbox is unchecked)
//   if (!includeExpired) {
//     data = data.filter((m) => {
//       const endDate = m?.APTS_End_Date_c
//         ? new Date(m.APTS_End_Date_c)
//         : null;

//       return !endDate || endDate >= today; 
//       // include if:
//       // - no end date OR
//       // - end date is today or future
//     });
//   }

//   //  Search
//   if (search) {
//     const searchLower = search.toLowerCase();

//     data = data.filter((m) =>
//      m?.accountData?.Name?.toLowerCase().includes(searchLower) || // Account Name
//      m?.accountData?.MP1_Customer_id_1_c?.toLowerCase().includes(searchLower)                 // MP1 ID
//     );
//   }

//   //  Agreement Group filter (MULTI SELECT)
//   if (agreementGroup?.length > 0) {
//   data = data.filter((m) =>
//     agreementGroup.some((g) =>
//       m.groups?.includes(g.Name)   //  match by Name
//     )
//   );
// }

//   return data;
// }, [members, search, agreementGroup, includeExpired]);
 
const filtered = useMemo(() => {
  let data = members;

  const today = new Date();

  // =========================
  // FILTER EXPIRED
  // =========================
  if (!includeExpired) {
    data = data.filter((m) => {
      /*
        groups/member records for same account
        should remain visible if ANY record
        is not expired
      */

      // if no member records array exists
      // fallback to current record
      const memberRecords = m.memberRecords || [m];

      const hasActiveMember = memberRecords.some((rec) => {
        const endDate = rec?.APTS_End_Date_c
          ? new Date(rec.APTS_End_Date_c)
          : null;

        return !endDate || endDate >= today;
      });

      return hasActiveMember;
    });
  }

  // =========================
  // SEARCH
  // =========================
  if (search) {
    const searchLower = search.toLowerCase();

    data = data.filter((m) =>
      m?.accountData?.Name?.toLowerCase()?.includes(searchLower) ||
      m?.accountData?.MP1_Customer_id_1_c
        ?.toLowerCase()
        ?.includes(searchLower)
    );
  }

  // =========================
  // AGREEMENT GROUP FILTER
  // =========================
  if (agreementGroup?.length > 0) {
    data = data.filter((m) =>
      agreementGroup.some((g) =>
        m.groups?.includes(g.Name)
      )
    );
  }

  return data;
}, [members, search, agreementGroup, includeExpired]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const visible = useMemo(() => {
      if (viewAll) return filtered;
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page,viewAll]);
console.log("stat",visible);
const isExpiredAccount = (member) => {
  const today = new Date();

  const memberRecords = member.memberRecords || [member];

  // expired only if ALL records are expired
  return memberRecords.every((rec) => {
    const endDate = rec?.APTS_End_Date_c
      ? new Date(rec.APTS_End_Date_c)
      : null;

    return endDate && endDate < today;
  });
};
  return (
    <div className="members-container">
     
      {showCreate ? (
       
        <CreateMembership
  onBack={() => setShowCreate(false)}
    onSuccess={loadMembers}
  agreementDetails={agreementDetails}
  mode="page"
/>
      ) : (
       

        <>
         {/* HEADER */}
      <div className="top-header">
        <div className="header-left">
          <span className="brand">PHILIPS</span>
          <span className="agreement">
   | Agreement: {agreementDetails?.Name || "Loading..."}
</span>
       
        </div>

        <div className="header-actions">
          <button
            className="btn"
            onClick={() =>
              (window.location.href = `https://preview-rls09.congacloud.com/clm/detail/${agreementId}`)
            }
          >
            Back To Agreement
          </button>
          <button onClick={loadMembers}>Refresh</button>
          <button style={{"background": "#0070d2"}}
  className="primary"
  onClick={() =>
  {
    const agreementName=agreementDetails?.Name;
    sessionStorage.setItem("agreementName",agreementName);
    navigate.push(`/clone-members/${agreementId}`, {
      agreementDetails:agreementDetails,
      state: { agreementName: agreementDetails?.Name }
    })
  }}
>
  Clone Members
</button>
        
          <button style={{"background": "#0070d2"}} className="primary" onClick={() => setShowCreate(true)}>
            Create New Member
          </button>
        </div>
      </div>
          <div className="section-title">Members</div>

          {/* SEARCH */}
          <div className="toolbar">
            {/* LEFT: Member Search */}
            <input
              type="text"
              placeholder="Search members with account name, MP1 customer Id..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            {/* Include Expired */}
            <div className="checkbox-container">
  <input
    type="checkbox"
    checked={includeExpired}
    onChange={(e) => {
      setIncludeExpired(e.target.checked);
      setPage(1);
    }}
  />
  <label>Include Expired Members</label>
</div>
            {/* <div className="checkbox-container">
              <input type="checkbox" />
              <label>Include Expired Members</label>
            </div> */}

            {/* RIGHT: Agreement Group Lookup */}
            <div className="lookup-container">
              <label>Filter by Agreement Group(s)</label>
              <AgreementGroupSelector
                agreementId={agreementId}
                value={agreementGroup}
                onChange={(group) => {
                  setAgreementGroup(group);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Account Name</th>
                    <th>MP1 Customer ID</th>
                    <th>Agreement Groups</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map((m) => (
                    // <tr key={m.Id}>
                    <tr
  key={m.Id}
  className={isExpiredAccount(m) ? "expired-row" : ""}
>
                      <td>
                   
                        <button
  onClick={() =>{
    const data={
      member:m,
      agreementDetails:agreementDetails,
      accountId:m?.APTS_Member_c
    }
    sessionStorage.setItem("memberDetails",JSON.stringify(data));
    navigate.push(`/member-detail/${m.Id}`, {
      state: {
        member: m,
        agreementDetails: agreementDetails,
        accountId: m.APTS_Member_c,   
      }, })}}>
  📄
</button>
                      </td>
                      <td>{m?.accountData?.Name}</td>
                      <td>{m?.accountData?.MP1_Customer_id_1_c}</td>
                      <td>{m.groups.join(", ")}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
      
           <div className="table-footer pagination">
     
            <>
            

              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                ◀ Previous
              </button>

              <span className="page-info">
                Page {page} of {totalPages}
              </span>
<span className="record-count">
  Total Records: {filtered.length}
</span>
               <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
                Next ▶
              </button>

             
      
        
            {!viewAll ? (
  <button className="primary" onClick={() => setViewAll(true)}>
    View All
  </button>
) : (
  <button className="primary" onClick={() => setViewAll(false)}>
    Return
  </button>
)}
            </>
        
        </div>
        </>
      )}
    </div>
  );
}
