import { useState, useEffect } from "react";
import {getProductById} from "../api/api";

function EditDiscountPricingStrategyForm({ data, onChange, onComplete }) {
  const discountType = data?.APTS_Discount_Type_c || "";
  console.log("Discount Data",data);
  //  LOCAL STATE (IMPORTANT)
  const [tierDiscounts, setTierDiscounts] = useState([]);
  const [netDiscounts, setNetDiscounts] = useState([]);
 
  const [notDiscountable,setNonDiscountableDiscountable]=useState(false);
  const [scaledDiscounts, setScaledDiscounts] = useState([]);
  const [scaledVolume, setScaledVolume] = useState([]);
  const [scaledAmount, setScaledAmount] = useState([]);
 const [productData,setProductData]=useState([]);
  const format2=(v)=>
  {
    if(v===undefined ||v==="") return "";
    if(v==null || v==0) return null;
    return Number(v).toFixed(2)
  }
 
  //  Initialize when data loads
  useEffect(() => {
    if (!data) return;
 
    setTierDiscounts([
      format2(data?.APTS_Discount_Tier_1_c) || "",
      format2(data?.APTS_Discount_Tier_2_c) || "",
      format2(data?.APTS_Discount_Tier_3_c) || "",
      format2(data?.APTS_Discount_Tier_4_c) || "",
      format2(data?.APTS_Discount_Tier_5_c) || "",
    ]);
 
    setNetDiscounts([
      format2(data?.APTS_NPO_Tier_1_c?.Value) || "",
      format2(data?.APTS_NPO_Tier_2_c?.Value) || "",
      format2(data?.APTS_NPO_Tier_3_c?.Value) || "",
      format2(data?.APTS_NPO_Tier_4_c?.Value) || "",
      format2(data?.APTS_NPO_Tier_5_c?.Value) || "",
      format2(data?.APTS_NPO_Tier_6_c?.Value) || "",
      format2(data?.APTS_NPO_Tier_7_c?.Value) || "",
    ]);
 
 
    setScaledDiscounts([
      format2(data?.APTS_Scaled_Discount_Percent_Tier_1_c) || "",
      format2(data?.APTS_Scaled_Discount_Percent_Tier_2_c) || "",
      format2(data?.APTS_Scaled_Discount_Percent_Tier_3_c) || "",
      format2(data?.APTS_Scaled_Discount_Percent_Tier_4_c) || "",
      format2(data?.APTS_Scaled_Discount_Percent_Tier_5_c) || "",
    ]);
 
    setScaledVolume([
      format2(data?.APTS_Volume_Threshold_1_c) || "",
      format2(data?.APTS_Volume_Threshold_2_c) || "",
      format2(data?.APTS_Volume_Threshold_3_c) || "",
      format2(data?.APTS_Volume_Threshold_4_c) || "",
      format2(data?.APTS_Volume_Threshold_5_c) || "",
    ]);
 
    setScaledAmount([
      format2(data?.APTS_Scaled_Discount_Amount_Tier_1_c?.Value) || "",
      format2(data?.APTS_Scaled_Discount_Amount_Tier_2_c?.Value) || "",
      format2(data?.APTS_APTS_Scaled_Discount_Amount_Tier_3_c?.Value) || "",
      format2(data?.APTS_Scaled_Discount_Amount_Tier_4_c?.Value) || "",
      format2(data?.APTS_Scaled_Discount_Amount_Tier_5_c?.Value) || "",
    ]);
 const loadProducts= async()=>
  {
    try
    {
      const product = await getProductById(data?.Product?.Id);
      setProductData(product[0]);
    }
    catch(err)
    {
      console.error(err);
    }
  };
  loadProducts();
    setNonDiscountableDiscountable(data?.APTS_Not_Discountable_c);
  }, []);
 
  useEffect(()=> {
    tierDiscounts.forEach((v,i)=>{
      onChange(`APTS_Discount_Tier_${i+1}_c`,v!==''?Number(v):null);
    });
 
    netDiscounts.forEach((v,i)=>
    {
      onChange(`APTS_NPO_Tier_${i + 1}_c`,Number(v)===0?null: {
        Value: Number(v),
        CurrencyCode: "USD",
        CurrencySymbol: "$"
      });
    });
 
    scaledDiscounts.forEach((v,i)=>
    {
      onChange(`APTS_Scaled_Discount_Percent_Tier_${i + 1}_c`, v!==''?Number(v):null);
    });
 
    scaledVolume.forEach((v,i)=>
    {
      onChange(`APTS_Volume_Threshold_${i + 1}_c`, v!==''?Number(v):null);
    });
// APTS_Scaled_Discount_Amount_Tier_1_c
 
    scaledAmount.forEach((v,i)=>
    {
      onChange(`APTS_Scaled_Discount_Amount_Tier_${i + 1}_c`, Number(v)===0?null:{
 
        Value: Number(v),
        CurrencyCode: "USD",
        CurrencySymbol: "$"
      });
    });
 
    onChange(`APTS_Not_Discountable_c`,notDiscountable);
    
  },[tierDiscounts,netDiscounts,scaledDiscounts,scaledVolume,scaledAmount,notDiscountable]);
  console.log(tierDiscounts);
 
  const numberornull=(v)=>
  {
    if(v==="" || v==null || v===undefined)return null;
    return Number(v);
  }
  //  Update Tier Discount Properly
 
//  Tier Discount
 
 
const handleTierChange = (index, value) => {
  if(value>100)
  {
    value=100;
  }
   else if (value <= 0) {
      value = '';
    }
  const updated = [...tierDiscounts];
  updated[index] = value;
  setTierDiscounts(updated);
 
  // onChange(`_Discount_Tier_${index + 1}_c`, value);
};
 
//  Scaled Discount %
const handleScaledDiscountChange = (index, value) => {
  if(value>100)
  {
    value=100;
  }
  else if (value <= 0) {
      value = null;
    }
  const updated = [...scaledDiscounts];
  updated[index] = value;
  setScaledDiscounts(updated);
 
  
};
 
//  Volume Threshold
const handleScaledVolumeChange = (index, value) => {
  if (value > 100) {
        value = 100;
      } else if (value <= 0) {
        value = null;
      }
  const updated = [...scaledVolume];
  updated[index] = value;
  setScaledVolume(updated);
 
  
};
 
//  Net Override (Scaled)
const handleScaledAmountChange = (index, value) => {
  if (value > 100) {
        value = 100;
      } else if (value <= 0) {
        value = null;
      }
  const updated = [...scaledAmount];
  updated[index] = value;
  setScaledAmount(updated);
 
  
};
 
//  Net Price Override
const handleNetChange = (index, value) => {
  const updated = [...netDiscounts];
  updated[index] = value;
  setNetDiscounts(updated);
 
 
  // onChange(`Net_Price_Override_Tier_${index + 1}_c`, value);
};
const handleFocus=(index,fieldname)=>
{
  if(fieldname==="Tier Discount")
  {
    const tier=tierDiscounts[index];
    if(tier!=="" && tier!=null)
    {
      handleTierChange(index,Number(tier).toString())
    }
  }
  else if(fieldname==="Net Price")
  {
    const net_D=netDiscounts[index];
    if(net_D!=="" && net_D!=null)
    {
      handleNetChange(index,Number(net_D).toString())
    }
  }
  else if(fieldname==="Scaled Discount")
  {
    const scaled_D=scaledDiscounts[index];
    if(scaled_D!=="" && scaled_D!=null)
    {
      handleScaledDiscountChange(index,Number(scaled_D).toString())
    }
  }
  else if(fieldname==="Volume Threshold")
  {
    const volume_T=scaledVolume[index];
    if(volume_T!=="" && volume_T!=null)
    {
      handleScaledVolumeChange(index,Number(volume_T).toString())
    }
  }
  else if(fieldname==="Scaled Amount")
  {
    const scaled_A=scaledAmount[index];
    if(scaled_A!=="" && scaled_A!=null)
    {
      handleScaledAmountChange(index,Number(scaled_A).toString())
    }
  }
}
const handleBlur=(index,value,fieldname)=>
{
  if(value==="" || value==null)
    return;
  const format_value=Number(value).toFixed(2);
  if(fieldname==="Tier Discount")
  {
    handleTierChange(index,format_value);
  }
  else if(fieldname==="Net Price")
  {
    handleNetChange(index,format_value);
  }
  else if(fieldname==="Scaled Discount")
  {
    handleScaledDiscountChange(index,format_value);
  }
  else if(fieldname==="Volume Threshold")
  {
    handleScaledVolumeChange(index,format_value);
  }
  else if(fieldname==="Scaled Amount")
  {
    handleScaledAmountChange(index,format_value);
  }
}
 
const handleDiscountChange=(e)=>
{
  const temp=e.target.checked;
  setNonDiscountableDiscountable(temp);
  if(temp)
  {
    setTierDiscounts(["","","","",""]);
    setNetDiscounts(["","","","","","",""]);
    setScaledDiscounts(["","","","",""]);
    setScaledVolume(["","","","",""]);
    setScaledAmount(["","","","",""]);
  }
}
 
return (
  <div className="form-card">
   
    <table className="form-table">
      <tbody>
 
      <tr>
    {/* Discount Type */}
      <td className="label">
      <label>Discount Type</label>
      </td>
      <td>
      <input type="text" value={discountType} disabled />
      </td>
      <td>
      { discountType!=="None" &&
      <div className="toggle-row" style={{paddingTop:"15px"}}>
                  <span>Not Discountable</span>
                  <label className="switch">
                    <input type="checkbox" checked={notDiscountable} 
                      onChange={(e)=>handleDiscountChange(e)}
                      disabled={productData?.APTS_Discountable_c === false}
                     />
                  <span className="slider"></span>
                  </label>
                </div>}
      </td>
      </tr> 
      {/* Tier Discount */}
      {discountType === "Tier Discount" && (
      <>
      <tr>
      <td>
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
        {tierDiscounts.map((value, index) => index<3 && (
          <div className="field" key={index}>
          <label>% Discount Tier {index + 1}</label>
          <input type="number" step="0.01" value={value} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
          onChange={(e) => handleTierChange(index, e.target.value)}
          onBlur={(e)=>handleBlur(index,e.target.value,"Tier Discount")}
          onFocus={()=>handleFocus(index,"Tier Discount")} />
          </div> ))}
      </div>
      </td>
 
      <td>
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
      {tierDiscounts.map((value, index) => index>2 && (
      <div className="field" key={index}>
      <label>% Discount Tier {index + 1}</label>
      <input type="number" step="0.01" value={value} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
      onChange={(e) =>handleTierChange(index, e.target.value) }
      onBlur={(e)=>handleBlur(index,e.target.value,"Tier Discount")}
      onFocus={()=>handleFocus(index,"Tier Discount")} />
      </div> ))}
      </div>
 
      <br></br><br></br><br></br><br></br>
      </td>
      </tr>
      </>)}
 
      {/* Net Price Override */}
    {discountType === "Net Price Override" && (
      <tr>
      <td>
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
      {netDiscounts.map((value, index) => index<4 && (
      <div className="field" key={index}>
        <label>Net Price Override Tier {index + 1}</label>
          <input type="number" step="0.01" value={value} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
            onChange={(e) => handleNetChange(index, e.target.value) }
            onBlur={(e)=>handleBlur(index,e.target.value,"Net Price")}
            onFocus={()=>handleFocus(index,"Net Price")}  />
      </div> ))}
      </div> 
      </td>
 
      <td>
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
      {netDiscounts.map((value, index) => index>3 && (
      <div className="field" key={index}>
        <label>Net Price Override Tier {index + 1}</label>
          <input type="number" step="0.01" value={value} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
            onChange={(e) => handleNetChange(index, e.target.value) }
            onBlur={(e)=>handleBlur(index,e.target.value,"Net Price")}
            onFocus={()=>handleFocus(index,"Net Price")} />
      </div> ))}
      </div> 
 
      <br></br><br></br><br></br>
      
      </td>
      </tr>)}
     
      {discountType === "Tier Discount % + Scaled" && (
      <>
      {/* Tier Discount */}
      <tr>
      <td>
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
 
      {tierDiscounts.map((value, index) => (
      <div className="field" key={index}>    
        <label>% Discount Tier {index + 1}</label>
          <input type="number" step="0.01" min="0" max="100" value={value || ""}
          readOnly={notDiscountable} style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
            onChange={(e) => handleTierChange(index, e.target.value)}
            onBlur={(e)=>handleBlur(index,e.target.value,"Tier Discount")}
            onFocus={()=>handleFocus(index,"Tier Discount")} />
      </div> ))}
 
      </div>
      </td>
 
      <td>
    {/* Scaled Discount % */}
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
      
      {scaledDiscounts.map((value, index) => (
      <div className="field" key={index}>
      <label>Scaled Discount %, Tier {index + 1}</label>
        <input type="number" step="0.01" value={value || ""} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
          onChange={(e) => handleScaledDiscountChange(index, e.target.value)} 
          onBlur={(e)=>handleBlur(index,e.target.value,"Scaled Discount")}
          onFocus={()=>handleFocus(index,"Scaled Discount")} />
      </div> ))}
      </div>
      </td>
 
      <td>
      
      {/* Volume Threshold */}
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
      
      {scaledVolume.map((value, index) => (
      <div className="field" key={index}>
      <label>Volume Threshold {index + 1}</label>
        <input type="number" step="0.01" value={value || ""} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
          onChange={(e) => handleScaledVolumeChange(index, e.target.value) }
          onBlur={(e)=>handleBlur(index,e.target.value,"Volume Threshold")}
          onFocus={()=>handleFocus(index,"Volume Threshold")} />
      </div> ))}
      </div>
      </td>
      </tr>
      </> )}
 
      {discountType === "Net Price Override + Scaled" && (
      <>
      <tr>
      <td>
      {/* Net Price Override */}
 
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
 
        {netDiscounts.map((value, index) => (
        <div className="field" key={index}>
          <label>Net Price Override Tier {index + 1}</label>
          <input type="number" step="0.01" value={value || ""} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
            onChange={(e) => handleNetChange(index, e.target.value) }
            onBlur={(e)=>handleBlur(index,e.target.value,"Net Price")}
            onFocus={()=>handleFocus(index,"Net Price")}  />
        </div> ))}
      </div>
      </td>
 
      <td>
    {/* Scaled Discount Amount */}
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
      {scaledAmount.map((value, index) => (
      <div className="field" key={index}>
        <label>Scaled Discount Amount Tier {index + 1}</label>
        <input type="number" step="0.01" value={value || ""} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
            onChange={(e) => handleScaledAmountChange(index, e.target.value) }
            onBlur={(e)=>handleBlur(index,e.target.value,"Scaled Amount")}
            onFocus={()=>handleFocus(index,"Scaled Amount")} />
      </div> ))}
      </div>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
     </td>
 
    {/* Volume Threshold */}
      <td>
      <div style={{ display:'flex',flexDirection:'column',gap:'10px'}}>
      {scaledVolume.map((value, index) => (
      <div className="field" key={index}>
        <label>Volume Threshold {index + 1}</label>
        <input type="number" step="0.01" value={value || ""} readOnly={notDiscountable}
          style={{ backgroundColor:notDiscountable ? "#e0e0e0" : "white",
            cursor: notDiscountable ? "not-allowed" : "text"}}
            onChange={(e) => handleScaledVolumeChange(index, e.target.value) } 
            onBlur={(e)=>handleBlur(index,e.target.value,"Volume Threshold")}
            onFocus={()=>handleFocus(index,"Volume Threshold")}/>
      </div> ))}
      </div>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      </td>
      </tr>
      </> )}
      </tbody>
    </table>
    </div> );
}
 
export default EditDiscountPricingStrategyForm;
