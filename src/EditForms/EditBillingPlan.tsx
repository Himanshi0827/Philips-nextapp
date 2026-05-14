import { useEffect, useState } from "react";
import { GetPicklist } from "../api/GetPicklist";
import Select from "react-select";

function EditBillingPlanForm({ data, onChange, onComplete }) {
  const [billingOptions, setBillingOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await GetPicklist("APTS_BillingPlan_c");
        if (res?.Success) {
          setBillingOptions(res.Data.PicklistMetadata[0].PicklistEntries);
        }
      } catch (err) {
        console.error("Billing picklist error:", err);
      }
    };

    fetchOptions();
  }, []);
console.log("Data",data?.APTS_BillingPlan_c);
  return (
    <div className="form-card">
  <table className="data-table billing-table">
        <thead>
          <tr>
            <th>{data.APTS_Match_Products_By_c==='Hierarchy'? "Hierarchy"
                  :data.APTS_Match_Products_By_c==='Product'?"Product":''}</th>
            <th>Billing Plan</th>
          </tr>
        </thead>
        <tbody>
         <tr>
              <td>{data.APTS_Match_Products_By_c==='Hierarchy'? `${data?.Matching_c} |${data?.Code_c}`
                  :data.APTS_Match_Products_By_c==='Product'?`${data?.Code_c} • ${data.Product.Name}`:''}</td>
            <td><div className="field">
        <label>Billing Plan *</label>
        {/* <select
          value={data.APTS_BillingPlan_c || ""}
          onChange={(e) => onChange("APTS_BillingPlan_c", e.target.value) }
        >
          <option value="">Select</option>
          {billingOptions.map((opt) => (
            <option key={opt.Value} value={opt.Value}>
              {opt.Label || opt.Value}
            </option>
          ))}
        </select> */}
        <Select
        value={billingOptions
            .map(opt => ({ value: opt.Value, label: opt.Label || opt.Value }))
            .find(opt => opt.value === data?.APTS_BillingPlan_c)}
        onChange={(e) => onChange("APTS_BillingPlan_c", e.value) }
        options={[
          ...billingOptions.map(opt => ({
            value: opt.Value,
            label: opt.Label || opt.Value,
            key: opt.Value
          }))
        ]}
      />
      </div></td>
         </tr>
        </tbody>
      </table>
      

    </div>
  );
}

export default EditBillingPlanForm;