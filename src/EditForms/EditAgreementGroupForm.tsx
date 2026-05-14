
function EditAgreementGroupForm({ data,onChange,onComplete }) {
 
  return (
    <div className="form-card">
      <table className="form-table">
        <tbody>
 
          <tr>
            <td className="label">AgreementLineItem Name:</td>
            <td>
              <input name="AgreementLineItemName"
                      value={data?.Name || ''}
                      style={{cursor:'not-allowed'}}
                      type="text"
                      disabled
                       />
            </td>
          </tr>
          <tr>
  <td className="label">Agreement Group</td>
  <td>
    <input name="agreementGroup"
          value={data?.APTS_Agreement_Group_c?.Name||''}
          type="text"
          style={{cursor:'not-allowed'}}
          disabled
    />
  </td>
</tr>
 
        </tbody>
      </table>
 
    </div>
  );
}
 
export default EditAgreementGroupForm;