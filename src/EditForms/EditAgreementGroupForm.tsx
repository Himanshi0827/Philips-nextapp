
// function EditAgreementGroupForm({ data,onChange,onComplete }) {
 
//   return (
//     <div className="form-card">
//       <table className="form-table">
//         <tbody>
 
//           <tr>
//             <td className="label">AgreementLineItem Name:</td>
//             <td>
//               <input name="AgreementLineItemName"
//                       value={data?.Name || ''}
//                       style={{cursor:'not-allowed'}}
//                       type="text"
//                       disabled
//                        />
//             </td>
//           </tr>
//           <tr>
//   <td className="label">Agreement Group</td>
//   <td>
//     <input name="agreementGroup"
//           value={data?.APTS_Agreement_Group_c?.Name||''}
//           type="text"
//           style={{cursor:'not-allowed'}}
//           disabled
//     />
//   </td>
// </tr>
 
//         </tbody>
//       </table>
 
//     </div>
//   );
// }
 
// export default EditAgreementGroupForm;

function EditAgreementGroupForm({ data,onChange,onComplete }) {
 
  return (
//     <div className="form-card">
//       <table className="form-table">
//         <tbody>
 
//           <tr>
//             <td className="label">AgreementLineItem Name:</td>
//             <td>
//               <input name="AgreementLineItemName"
//                       value={data?.Name || ''}
//                       style={{cursor:'not-allowed'}}
//                       type="text"
//                       disabled
//                        />
//             </td>
//           </tr>
//           <tr>
//   <td className="label">Agreement Group</td>
//   <td>
//     <input name="agreementGroup"
//           value={data?.APTS_Agreement_Group_c?.Name||''}
//           type="text"
//           style={{cursor:'not-allowed'}}
//           disabled
//     />
//   </td>
// </tr>
 
//         </tbody>
//       </table>
 
//     </div>
<div>
  <div className="proposal-table-container">
    <table className="proposal-table">
      <thead>
        <tr>
          <th></th>
          <th>Commercial Conditions</th>
          <th>Group Name</th>
          <th>Timeperiod for member tier change review</th>
          <th>ALI Name</th>
        </tr>
      </thead>
 
      <tbody>
          <tr>
            {/* radio */}
            <td>
              <input
                type="radio"
                name="agreementGroup"
                checked={true} />
            </td>
 
            {/* icon/button */}
            {/* <td style={{'alignItems':'center'}}>
              <button>
                <b>⊝</b>
              </button>
            </td> */}
  <td>
          <div className="tooltip-wrapper">
            <button className="group-btn">−</button>

            <span className="tooltip-text">
              No commercial condition present
            </span>
          </div>
        </td>
            {/* group */}
            <td><a
      href={`https://preview-rls09.congacloud.com/admin/entity/APTS_Agreement_Groups_c/detail/${data.APTS_Agreement_Group_c?.Id}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="clone-link"
    > {data.APTS_Agreement_Group_c?.Name}
    </a></td>
 
            {/* review */}
            <td>
             {data.Timeperiod_for_member_tier_change_review_c}
            </td>
            <td>{data?.Name}</td>
          </tr>
      </tbody>
    </table>
  </div>
</div>
  );
}
 
export default EditAgreementGroupForm;

