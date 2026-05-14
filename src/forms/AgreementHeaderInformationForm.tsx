'use client';

import { useState,useEffect } from "react";
import { GetPicklist } from "../api/GetPicklist";

function AgreementHeaderInformationForm({ data,onChange,onComplete ,agreementHeader}) { //head

  const [AFPaymentSchedules,setAFPaymentSchedule]= useState([]);
  const [PriceUpdateRules,setPriceUpdateRule] =useState([]);
  const [AFison,setAFison] =useState([]);

  useEffect(()=>
  {
  const handleAgreement = async ()=>
  {
    try{
      const res1= await GetPicklist("APTS_GPO_Admin_fee_payment_schedule_c");
      const res2= await GetPicklist("APTS_Country_pricelist_update_rule_c");
      const res3= await GetPicklist("APTS_GPO_Admin_fee_is_based_on_c");
      if(res1.Success)
      {
        setAFPaymentSchedule(res1.Data.PicklistMetadata[0].PicklistEntries);
      }
      if(res2.Success)
      {
        setPriceUpdateRule(res2.Data.PicklistMetadata[0].PicklistEntries);
      }
      if(res3.Success)
      {
        setAFison(res3.Data.PicklistMetadata[0].PicklistEntries);
      }
    }
    catch(err)
    {
      console.error("Failed to fetch ",err);
    }
  };
  handleAgreement();
},[]);

  const [error, setError] = useState("");

const handleChange = (e) => {
  const { name, value } = e.target;

  onChange({
    [name]: value
  });
};

  const handleNext = () => {

    // Minimal required validation
    if (
      !data.AdministrationFee ||
      !data.AFPaymentSchedule ||
      !data.PriceUpdateRule ||
      !data.AFison
    ) {
      setError("Please fill all required fields before proceeding.");
      return;
    }

    setError("");
    onComplete(); //  mark tab completed & move to next tab
  };
if (!agreementHeader) {
  return <div>Loading agreement header...</div>;
}

  return (
    <div className="form-card">

      {/* SECTION 1 */}
      <div className="section-header">
        Agreement Header Details
      </div>

      <div className="two-column">
        <div className="field">
          <label>Admini
            stration Fee %</label>
          {/* head */}
          <input
  type="number"
  value={agreementHeader?.APTS_GPO_Administration_fee_percents_c || ""}
  disabled
/>

        </div>

          <div className="toggle-row" style={{paddingTop:"15px"}}>
          <label>Exclude Administration Fees</label>
          <label className="switch">
                    <input type="checkbox"  checked={!!agreementHeader?.APTS_Exclude_Administration_Fees_c}
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

      {/* SECTION 2 */}
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
            name="AdministrationFee"
            value={data.AdministrationFee}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Administration Fee Payment Schedule *</label>
          <select
            name="AFPaymentSchedule"
            value={data.AFPaymentSchedule}
            onChange={handleChange}
          >
         <option value="">---None---</option>
            {AFPaymentSchedules.map(paymentschedule => (
                  <option>
                  {paymentschedule.Value}
                  </option>
                ))}
          </select>
        </div>

        <div className="field">
          <label>Price Update Rule *</label>
          <select
            name="PriceUpdateRule"
            value={data.PriceUpdateRule}
            onChange={handleChange}
          >
            <option value="">---None---</option>
            {PriceUpdateRules.map(priceUpdateRule => (
                  <option>
                  {priceUpdateRule.Value}
                  </option>
                ))}
          </select>
        </div>

        <div className="field">
          <label>Administration Fee is calculated on *</label>
          <select
            name="AFison"
            value={data.AFison}
            onChange={handleChange}
          >
            <option value="">---None---</option>
            {AFison.map(Af => (
                  <option>
                  {Af.Value}
                  </option>
                ))}
          </select>
        </div>

        <div className="field">
          <label>Upper Bandwidth</label>
          <input
            type="number"
            name="UpperBandwidth"
            value={data.UpperBandwidth}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Lower Bandwidth</label>
          <input
            type="number"
            name="LowerBandwidth"
            value={data.LowerBandwidth}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Net Price Override As % Discount</label>
          <input
            type="number"
            name="NetPriceODiscount"
            value={data.NetPriceODiscount}
            onChange={handleChange}
          />
        </div>

          <div className="toggle-row" style={{paddingTop:"15px"}}>
          <label>Exclude Administration Fees</label>
          <label className="switch">
                    <input type="checkbox"   
                    name="ExcludedAF" 
                    checked={!!data?.ExcludedAF} onChange={(e)=>
          {
            onChange({[e.target.name]:e.target.checked});
            console.log(e.target.name,e.target.checked);}}
                     />
                  <span className="slider"></span>
                  </label>
         
        </div>

      <div className="toggle-row" style={{paddingTop:"15px"}}>
          <label>Inherit hierarchy discounts</label>
             <label className="switch">
                    <input type="checkbox"   
                   name="InheritHdiscount" checked={!!data?.InheritHdiscount} onChange={(e)=>
          {
            onChange({[e.target.name]:e.target.checked});
            console.log(e.target.name,e.target.checked);
          }}
                     />
                  <span className="slider"></span>
                  </label>
         
        </div>

         <div className="toggle-row" style={{paddingTop:"15px"}}>
          <label>Exclude From Contract Pricelists</label>
           <label className="switch">
                    <input type="checkbox"   
                   name="ExcludefromContractP" checked={!!data?.ExcludefromContractP} onChange={(e)=>
          {
            onChange({[e.target.name]:e.target.checked});
            console.log(e.target.name,e.target.checked);
          }}
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

export default AgreementHeaderInformationForm;