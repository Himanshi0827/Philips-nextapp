'use client';

import { useEffect, useRef, useState } from "react";
 
function LookupTypeAhead({ field, value, onChange, searchFn }) {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
 
  //  Sync selected value → input
  useEffect(() => {
    if (value?.Name) {
      setInputValue(value.Name);
      setShowDropdown(false);
      setResults([]);
    }
  }, [value?.Id]);
 
 
  useEffect(() => {
    if (!inputValue || inputValue.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    if (value?.Name === inputValue) return;
 
    //  Debounce API calls
    clearTimeout(debounceRef.current);
    // Inside useEffect in LookupTypeAhead.js
debounceRef.current = setTimeout(async () => {
  const data = await searchFn(inputValue, field.LookupObjectName);
  
  let filtered = data || [];
if(field?.AgreementId)
  {
    filtered=filtered.filter(record=> record?.APTS_Agreement_c===field?.AgreementId);
  }
  // Filter by TargetAgreement ID if it's provided in the field config
  if (field.TargetAgreement) {
    filtered = filtered.filter(record => {
      
      // Check common API variations for Agreement lookup fields
      const recordAgreementId = record.Agreement_c || record.APTS_Agreement_c || record.Agreement__c;
      
      if (field.Part === "Source" || field.Part === "Target") {
        // Must match the specific agreement passed (Source or Target)
        return recordAgreementId === field.TargetAgreement;
      } else {
        // For general selection (like selecting the Source Agreement itself), 
        // exclude the target so you don't clone an agreement into itself
        return record.Id !== field.TargetAgreement;
      }
    });
  }

  setResults(filtered);
  setShowDropdown(true);
}, 300);
   
  }, [inputValue]);
 
  const handleSelect = (record) => {
    onChange({
      Id: record.Id,
      Name: record.Name,
      ProductCode:record?.ProductCode,
      Configuration:record?.ConfigurationType,
      IsDiscountable:record?.APTS_Discountable_c
    });
    setInputValue("");
    setShowDropdown(false);
    setResults([]);
  };
 
  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
 
    //  Clear selected value if user edits text
    if (value) {
      onChange(null);
    }
  };
 
  return (
    <div className="lookup-container">
      {/* <input
        type="text"
        value={inputValue}
        placeholder={`Search ${field.DisplayName}`}
        onChange={handleChange}
        onFocus={() => inputValue.length >= 3 && setShowDropdown(true)}
      /> */}
      <div className="lookup-input-wrapper">
    <input
      type="text"
      value={inputValue}
      className="lookup-input-field"
      placeholder={`Search by ${field.DisplayName?.toLowerCase()}`}
      onChange={handleChange}
      onFocus={() => inputValue.length >= 3 && setShowDropdown(true)}
    />
 
    {/* <span className="lookup-search-icon">🔍</span> */}
  </div>

 {showDropdown && results.length > 0 && (
  <ul className="lookup-dropdown">
    {results.map((r) => (
      <li
        key={r.Id}
        className="lookup-item"
        onClick={() => handleSelect(r)}
      >
         {field.isProductLookup ? (
        <div className="lookup-row">
 

          <div className="lookup-content">
            <div className="lookup-title">
              {r.Name}
            </div>
            <div className="product-meta">
              {r.ConfigurationType} • {r.ProductCode}
            </div>

           
          </div>
        </div>
          ) : (
      
          <div className="lookup-content">
            <div className="lookup-title">
              {r.Name}
            </div>
           

            <div className="lookup-subtext">
              {r.Status || "In Effect"} • Expiry Date: {r.EndDate || "N/A"}
            </div>
          </div>
        )}
      </li>
    ))}
  </ul>
)}
     
    </div>
  );
}
 
export default LookupTypeAhead;