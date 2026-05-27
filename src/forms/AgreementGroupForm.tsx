// 'use client';

// import { useState,useEffect } from "react";
// import LookupTypeAhead from "../components/LookupTypeAhead";
// import { searchLookupRecords } from "../api/SearchLookup";

// function AgreementGroupForm({ data,onChange,onComplete }) {
  
//  const agreementId=sessionStorage.getItem("agreementId");
 
//   const [form, setForm] = useState({
//     agreementGroup: "",
//     AgreementLineItemName:""
//   });

//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     onChange({
//       [e.target.name]:e.target.value,
//     });
//     setForm({
//       ...form,
//       [e.target.name]:[e.target.value]
//     });
//   };

//   const handleNext = () => {
//     //const { agreementGroup } = form;

//     if (!data.agreementGroup ) {
//       setError("Please fill the fields before proceeding.");
//       return;
//     }

//     setError("");
//     onComplete(); // mark tab completed & move to next tab
//   };

//   return (
//     <div className="form-card">
//       <table className="form-table">
//         <tbody>

//           <tr>
//             <td className="label">AgreementLineItem Name:</td>
//             <td>
//              <div className="field">
//             <input name="AgreementLineItemName" 
//                       onChange={handleChange} 
//                       value={data.AgreementLineItemName} 
//                       type="text" />
//               </div>
//             </td>
//           </tr>
//           <tr>
//   <td className="label">Agreement Group</td>
//   <td>
//     <LookupTypeAhead
//       field={{
//         DisplayName: "Agreement Group",
//         LookupObjectName: "APTS_Agreement_Groups_c",
//         AgreementId:agreementId
//       }}
//       value={data.agreementGroup}   // { Id, Name }
//       onChange={(record) =>
        
//         onChange({
//           agreementGroup: record,        // store full object
//           agreementGroupId: record?.Id   // store Id separately if needed
//         })
//       }
//       searchFn={searchLookupRecords}
//     />
//   </td>
// </tr>

         

//         </tbody>
//       </table>

//       {error && (
//         <div style={{ color: "red", marginTop: "10px" }}>
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AgreementGroupForm;




'use client';
 
import { useState,useEffect } from "react";
import LookupTypeAhead from "../components/LookupTypeAhead";
import { searchLookupRecords } from "../api/SearchLookup";
import { getAgreementGroupById } from "../api/api";
 
function AgreementGroupForm({ data,onChange,onComplete }) {
  const [agList,setAgList]=useState<any>([]);
  // useEffect(()=>
  // {
  //   const fetch_ag_by_id=async ()=>
  //   {
  //     try
  //     {
  //       const agreementId=sessionStorage.getItem("agreementId");
  //       const res=await getAgreementGroupById(agreementId);
  //       setAgList(res);
  //       console.log("Trial from form",res);
  //     }
  //     catch(error)
  //     {
  //       console.error(error);
  //     }
  //   }
  //   fetch_ag_by_id();
  // },[])
 useEffect(() => {
  const fetch_ag_by_id = async () => {
    try {
      const agreementId = sessionStorage.getItem("agreementId");
      const res = await getAgreementGroupById(agreementId);

      setAgList(res);

      console.log("Trial from form", res);

      // auto select first row
      if (res && res.length > 0 && !data?.agreementGroupId) {
        onChange({
          agreementGroup: res[0],
          agreementGroupId: res[0]?.Id
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetch_ag_by_id();
}, []);
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
                      type="text" /></div>
            </td>
          </tr>
          <tr>

            <td colSpan={2} className="innertable-wrapper">
          <div>
            <div className="proposal-table-container">
              <table className="proposal-table">
      <thead>
        <tr>
          <th></th>
          <th>Commercial Conditions</th>
          <th>Group Name</th>
          <th>Timeperiod for member tier change review</th>
        </tr>
      </thead>
 
  
      <tbody>
  {agList.map((agreement) => {
    const isSelected =
      data?.agreementGroupId === agreement?.Id;

    return (
      // <tr
      //   key={agreement.Id}
      //   className={`table-row ${
      //     isSelected ? "selected-row" : ""
      //   }`}
      // >
      <tr
  key={agreement.Id}
  className={`table-row ${
    isSelected ? "selected-row" : ""
  }`}
  onClick={() => {
    onChange({
      agreementGroup: agreement,
      agreementGroupId: agreement?.Id,
    });
  }}
>
        {/* radio */}
        <td>
          <input
            type="radio"
            name="agreementGroup"
            checked={isSelected}
            onChange={() => {
              onChange({
                agreementGroup: agreement,
                agreementGroupId: agreement?.Id,
              });
            }}
          />
        </td>

        {/* commercial condition */}
        <td>
          <div className="tooltip-wrapper">
            <button className="group-btn">−</button>

            <span className="tooltip-text">
              No commercial condition present
            </span>
          </div>
        </td>

        {/* group name */}
        <td>
          <a
            href={`https://preview-rls09.congacloud.com/admin/entity/APTS_Agreement_Groups_c/detail/${agreement?.Id}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="clone-link"
          >
            {agreement?.Name}
          </a>
        </td>

        {/* review */}
        <td>
          {agreement
            .APTS_Time_period_for_member_tier_change_c ||
            "Annually"}
        </td>
      </tr>
    );
  })}
</tbody>
    </table>
  </div>
</div>
</td>
  {/* <td className="label">Agreement Group</td>
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
  </td> */}
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
