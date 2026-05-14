'use client';

import { useEffect, useState } from "react";
import { GetPicklist } from "../api/GetPicklist";

// Added agreementHeader to props
function EditAgreementHeaderInformationForm({ data, onChange, onComplete, agreementHeader }) {
  const [AFPaymentSchedules, setAFPaymentSchedule] = useState([]);
  const [PriceUpdateRules, setPriceUpdateRule] = useState([]);
  const [AFisonList, setAFisonList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPicklists = async () => {
      try {
        const res1 = await GetPicklist("APTS_GPO_Admin_fee_payment_schedule_c");
        const res2 = await GetPicklist("APTS_Country_pricelist_update_rule_c");
        const res3 = await GetPicklist("APTS_GPO_Admin_fee_is_based_on_c");

        if (res1.Success) {
          setAFPaymentSchedule(res1.Data.PicklistMetadata[0].PicklistEntries);
        }
        if (res2.Success) {
          setPriceUpdateRule(res2.Data.PicklistMetadata[0].PicklistEntries);
        }
        if (res3.Success) {
          setAFisonList(res3.Data.PicklistMetadata[0].PicklistEntries);
        }
      } catch (err) {
        console.error("Failed to fetch picklists", err);
      }
    };

    fetchPicklists();
  }, []);

  const handleNext = () => {
    // Validation logic (matches your data structure)
    if (
      !data.APTS_GPO_Administration_fee_c ||
      !data.APTS_GPO_Admin_fee_payment_schedule_c ||
      !data.APTS_Country_pricelist_update_rule_c ||
      !data.APTS_GPO_Admin_fee_is_based_on_c
    ) {
      setError("Please fill all required fields before proceeding.");
      return;
    }

    setError("");
    onComplete();
  };

  // Add a loading state if header isn't available yet
  if (!agreementHeader) {
    return <div>Loading agreement header...</div>;
  }

  return (
    <div className="form-card">
      
      {/* SECTION 1: Agreement Header Details (Read-Only) */}
      <div className="section-header">
        Agreement Header Details
      </div>

      <div className="two-column">
        <div className="field">
          <label>Administration Fee %</label>
          <input 
            type="number" 
            value={agreementHeader?.APTS_GPO_Administration_fee_percents_c || ""} 
            disabled 
          />
        </div>
 <div className="toggle-row" style={{paddingTop:"15px"}}>
          <label>Exclude Administration Fees</label>
          <label className="switch">
                    <input  type="checkbox" 
            checked={!!agreementHeader?.APTS_Exclude_Administration_Fees_c} 
            disabled 
                     />
                  <span className="slider"></span>
                  </label>
        


         
        </div>
       
        <div className="field">
          <label>Administration Fee Payment Schedule</label>
          <input 
            type="text" 
            value={agreementHeader?.APTS_GPO_Admin_fee_payment_schedule_c || ""} 
            disabled 
          />
        </div>

        <div className="field">
          <label>Administration Fee is calculated on</label>
          <input 
            type="text" 
            value={agreementHeader?.APTS_GPO_Admin_fee_based_on_c || ""} 
            disabled 
          />
        </div>

        <div className="field full">
          <label>Default Country Pricelist Update Rule</label>
          <input 
            type="text" 
            value={agreementHeader?.APTS_Country_pricelist_update_rule_c || ""} 
            disabled 
          />
        </div>
      </div>
      
      {/* SECTION 2: Agreement Line Item Configuration (Editable) */}
      <div className="section-header mt">
        Agreement Line Item Configuration
        <span className="subtext">
          — overrides the agreement header configuration for this ALI
        </span>
      </div>

      <div className="two-column">

        <div className="field">
          <label>Administration Fee % *</label>
          <input
            type="number"
            value={data.APTS_GPO_Administration_fee_c || ""}
            onChange={(e) =>
              onChange("APTS_GPO_Administration_fee_c", e.target.value)
            }
          />
        </div>

        <div className="field">
          <label>Administration Fee Payment Schedule *</label>
          <select
            value={data.APTS_GPO_Admin_fee_payment_schedule_c || ""}
            onChange={(e) =>
              onChange("APTS_GPO_Admin_fee_payment_schedule_c", e.target.value)
            }
          >
            <option value="">Select</option>
            {AFPaymentSchedules.map((item) => (
              <option key={item.Value} value={item.Value}>
                {item.Value}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Price Update Rule *</label>
          <select
            value={data.APTS_Country_pricelist_update_rule_c || ""}
            onChange={(e) =>
              onChange("APTS_Country_pricelist_update_rule_c", e.target.value)
            }
          >
            <option value="">Select</option>
            {PriceUpdateRules.map((item) => (
              <option key={item.Value} value={item.Value}>
                {item.Value}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Administration Fee is calculated on *</label>
          <select
            value={data.APTS_GPO_Admin_fee_is_based_on_c || ""}
            onChange={(e) =>
              onChange("APTS_GPO_Admin_fee_is_based_on_c", e.target.value)
            }
          >
            <option value="">Select</option>
            {AFisonList.map((item) => (
              <option key={item.Value} value={item.Value}>
                {item.Value}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Upper Bandwidth</label>
          <input
            type="number"
            value={data.APTS_Upper_Bandwith_c || ""}
            onChange={(e) =>
              onChange("APTS_Upper_Bandwith_c", e.target.value)
            }
          />
        </div>

        <div className="field">
          <label>Lower Bandwidth</label>
          <input
            type="number"
            value={data.APTS_Lower_Bandwith_c || ""}
            onChange={(e) =>
              onChange("APTS_Lower_Bandwith_c", e.target.value)
            }
          />
        </div>

        <div className="field">
          <label>Net Price Override As % Discount</label>
          <input
            type="number"
            value={data.APTS_Contract_Net_Price_c || ""}
            onChange={(e) =>
              onChange("APTS_Contract_Net_Price_c", e.target.value)
            }
          />
        </div>

<div className="toggle-row" style={{paddingTop:"15px"}}>
          <label>Exclude Administration Fees</label>
          <label className="switch">
                    <input  type="checkbox"
            checked={!!data.APTS_Exclude_GPO_Administration_Fees_c}
            onChange={(e) =>
              onChange("APTS_Exclude_GPO_Administration_Fees_c", e.target.checked)}
                     />
                  <span className="slider"></span>
                  </label>
         
        </div>
 <div className="toggle-row" style={{paddingTop:"15px"}}>
          <label>Inherit hierarchy discounts</label>
             <label className="switch">
                    <input  type="checkbox"
            checked={!!data.APTS_Inherit_hierarchy_discount_c}
            onChange={(e) =>
              onChange("APTS_Inherit_hierarchy_discount_c", e.target.checked)
            }
                     />
                  <span className="slider"></span>
                  </label></div>
 
<div className="toggle-row" style={{paddingTop:"15px"}}>
          <label>Exclude From Contract Pricelists</label>
           <label className="switch">
                    <input  type="checkbox"
            checked={!!data.APTS_Exclude_From_Contract_Pricelists_c}
            onChange={(e) =>
              onChange("APTS_Exclude_From_Contract_Pricelists_c", e.target.checked)
            }
                     />
                  <span className="slider"></span>
                  </label>
          
         
        </div>
       
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "12px" }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default EditAgreementHeaderInformationForm;