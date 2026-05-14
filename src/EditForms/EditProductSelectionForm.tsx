function EditProductSelectionForm({ data,onProductsChange , onChange,onComplete }) {

  return (
    <div className="form-card">
  
 
      <table className="form-table">
        <tbody>
 
          <tr>
            <td className="label">Line Type</td>
            <td>
              <select
                name="LineType"
                value={data.Line_Type_c}
                disabled
                style={{cursor:'not-allowed'}}
              >
                <option >{data.Line_Type_c}</option> </select>
            </td>
          </tr>
 
          <tr>
            <td className="label">Match Products by</td>
            <td>
              <select
                name="MatchProductsBy"
                value={data.APTS_Match_Products_By_c}
                style={{cursor:'not-allowed'}}
                disabled
              >
                <option>{data.APTS_Match_Products_By_c}</option>
              </select>
            </td>
          </tr>
 
   {data.APTS_Match_Products_By_c === "Hierarchy" && (
  <tr className="manual-selection-row">
    <td className="label"> *Selected Hierarchy</td>
    <td>
      <div className="list-box manual-box">
          <div className="list-item manual"style={{cursor:'not-allowed'}}>
            <span>📦 {data?.Matching_c} {data?.Code_c}</span>
            <span
              className="remove"
              disabled 
              style={{cursor:'not-allowed'}}>✖</span>
          </div>
       
      </div>
    </td>
  </tr>
)}
       
  {data.APTS_Match_Products_By_c === "Product" && (
  <tr className="manual-selection-row">
    <td className="label"> Selected Product</td>
    <td>
      <div className="list-box manual-box">
          <div className="list-item manual"style={{cursor:'not-allowed'}}>
            <span 
            >📦 {data?.Product?.Name}</span>
            <span
              className="remove"
              disabled 
              style={{cursor:'not-allowed'}}>✖</span>
          </div>
       
      </div>
    </td>
  </tr>
)}
 
{data?.APTS_Parent_Product_c && (
  <tr>
    <td className="label">Selected Parent Products</td>
    <td>
      <div className="list-box">
          <div className="list-item" style={{cursor:'not-allowed'}}>
            🧩 {data?.APTS_Parent_Product_c.Name} 
            <span
              className="remove"
              style={{cursor:'not-allowed'}}>✖</span>
          </div>
      </div>
    </td>
  </tr>
)}
 
        </tbody>
      </table>
 
    </div>
  );
}
 
export default EditProductSelectionForm;