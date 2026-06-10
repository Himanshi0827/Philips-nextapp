// 'use client';

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { queryGetProposal, queryGetQuoteItem} from "../../src/api/queryAgreementLineItemsByAgreement";
// import { GetLookup } from "../../src/api/GetLookup";
// import { createAgreementLineItem, getAgreementLineItems, updateAgreementLineItem, getAgreementById} from "../../src/api/api";
// import { toast } from "react-toastify";

// export default function NewALIfromQuotes() {
// //   const acc = useLocation();
//   const acc=JSON.parse(sessionStorage.getItem("AccountDetails"));
//   console.log("Account details",acc);
//   const accountname = acc.AccountName;
//   const [open, setOpen] = useState({ quotes: true, items: true });
//   const [fromdate, setFromDate] = useState(() => {
//     const d = new Date();
//     d.setDate(d.getDate() - 180);
//     return d.toISOString().split("T")[0];
//   });
//   const [todate, setToDate] = useState(new Date().toISOString().split("T")[0]);
//   const [applyDeviated, setApplyDeviated] = useState(false);
//   const [quoteLineItems, setQuoteLineItems] = useState([]);
//   const [SelectedItems, setSelectedItems] = useState([]);
//   const [agreement_plist, setAgreement_PList] = useState([]);
//   const [selected_agreement_g, setSelectedAG] = useState({});
//   const [proposals, setProposals] = useState([]);
//   //qli
//   const [duplicateData, setDuplicateData] = useState([]);
//   const [showConfirmScreen, setShowConfirmScreen] = useState(false);
//   const [hasDuplicateData, setHasDuplicateData] = useState(false);
//   const [selectedproposals, setSelectedProposals] = useState([]);
//  const agreementName =sessionStorage.getItem("agreementName") ;
//   const handleCheckDuplicates = async () => {
//     try {
//       if (SelectedItems.length === 0) {
//         toast.error("Please select at least one Quote Line Item");
//         return;
//       }
 
//       const existingALIs = await getAgreementLineItems();
//       const agreementALIs = existingALIs.Data.filter(
//         (ali) => ali.Agreement === acc.Id
//       );
 
//       const comparison = SelectedItems.map((qli) => {
//         const match = agreementALIs.find(
//           (ali) => ali.Product?.Id === qli.Product?.Id
//         );
 
//         return {
//           qli,
//           duplicateAli: match || null,
//           selectedOption: match ? "ALI" : "QLI", // default
//         };
//       });
//       if (comparison[0].duplicateAli !== null) {
//         setDuplicateData(comparison);
//         setShowConfirmScreen(true);
//         setHasDuplicateData(true);
//       } else {
//         setDuplicateData(comparison);
//         setShowConfirmScreen(true);
//         setHasDuplicateData(false);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error checking duplicates");
//     }
//   };
//   const handleRadioChange = (index, value) => {
//     const updated = [...duplicateData];
//     updated[index].selectedOption = value;
//     setDuplicateData(updated);
//   };
//   const handleConfirmAli = async () => {
    
//  try {
//     const response = await getAgreementById(acc.Id);
//     console.log("Full Agreement API Response:", response);

//     // If the response is an array, take the first item. If it's an object, use it directly.
//     const agreement = Array.isArray(response) ? response[0] : response;

//     if (!agreement) {
//       toast.error("No agreement data found.");
//       return;
//     }

//     // Mapping fields based on your provided JSON log
//     const contractStart = agreement.ContractStartDate;
//     const contractEnd = agreement.ContractEndDate;

//     console.log("Extracted Dates -> Start:", contractStart, "End:", contractEnd);

//     if (!contractStart || !contractEnd) {
//       toast.error(`Agreement is missing dates. Start: ${contractStart}, End: ${contractEnd}`);
//       return;
//     }

//     const isTransactionContract = agreement.RecordType === "Transaction Contract" || 
//                                    agreement.RecordType?.Name === "Transaction Contract";

//     for (const row of duplicateData) {
//       const qli = row.qli;

//       if (row.duplicateAli && row.selectedOption === "QLI") {
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         await updateAgreementLineItem(row.duplicateAli.Id, {
//           APTS_Expiration_Date_c: yesterday.toISOString().split("T")[0],
//         });
//       }

//       if (!row.duplicateAli || row.selectedOption === "QLI") {
        
// // Inside handleConfirmAli loop
// const payload = {
//   Name: qli.Name,
//   // Check if your API wants an ID string or an object { Id: ... }
//   Agreement: acc.Id, 
//   Product: { Id: qli.Product.Id },
//   APTS_Agreement_Group_c: {
//               Id: selected_agreement_g.Id,
//             },

//   // Dates: Ensure these are valid strings
//   StartDate: contractStart, 
//   APTS_Expiration_Date_c: contractEnd,
//   EndDate: contractEnd,

//   APTS_BillingPlan_c: qli.APTS_BillingPlan_c || "",
//  // APTS_Proposal_Line_Item_c: qli.Id,
//   APTS_Match_Products_By_c: "Product",
//   Line_Type_c: "Equipment",
// };

// // Fix for Quantity: avoid NaN
// if (isTransactionContract) {
//   payload.Quantity = qli.Quantity ? Number(qli.Quantity) : 0;
// }

// // Fix for Discounts: ensure Number conversion is safe
// const adjType = qli.AdjustmentType || qli.Apttus_QPConfig__AdjustmentType__c; 

// if (adjType === "% Discount") {
//   const stratDisc = Number(qli.APTS_Strategic_Discount_Amount_c_c?.Value || 0);
//   const contDisc = Number(qli.APTS_Contract_Discount_Amount_c?.Value || 0);
  
//   payload.APTS_Discount_Type_c = "Tier Discount";
//   payload.APTS_Discount_Tier_1_c = stratDisc + contDisc;
// } 
// else if (adjType === "Net Price Override") {
//   payload.APTS_Discount_Type_c = "Net Price Override";
//   payload.APTS_NPO_Tier_1_c = Number(qli.APTS_Offered_Price_c_c?.Value || 0);
// }

//         await createAgreementLineItem(payload);
//       }
//     }
//       toast.success("ALI process completed successfully!");
 
//      navigate.push(`/${acc.Id}`);
//     } catch (err) {
//       console.error(err);
//       toast.error("Error confirming ALIs");
//     }
//   };
  
//   useEffect(() => {
//     const loadProposalItems = async () => {
//       try {
       
//         const data = await queryGetProposal(
//           acc.AccountId,
//           fromdate,
//           todate
//         );
//         setProposals(data || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
 
//     loadProposalItems();
//     const loadAg_group = async () => {
//       try {
//         const data = await GetLookup("APTS_Agreement_Groups_c");
//         const final = data.Data.filter(
//           (d) => d.APTS_Agreement_c === acc.Id
//         );
//         setAgreement_PList(final);
//         setSelectedAG(final[0]);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     loadAg_group();
//   }, [fromdate, todate]);
 
//   const toggle = (name) => {
//     setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
//   };
 
//   const navigate = useRouter();
//   const handleback = () => {

//    navigate.push(`/${acc.Id}`);
//    console.log("agre",acc.Id);
//   };
 
//   const toggleSelectItem = (item) => {
//     setSelectedItems((prev) => {
//       const exists = prev.find((i) => i.Id === item.Id);
//  console.log("exists",exists);
//       if (exists) {
//         return prev.filter((i) => i.Id !== item.Id);
//       } else {
//         return [...prev, item];
//       }
//     });
//   };
//   const toggleSelect = async (item, e) => {
//     try {
//       if (e.target.checked) {
//         setSelectedProposals((prev) => [...prev, item]);
//         const lineitems = await queryGetQuoteItem(item.Id);
//         lineitems.map(li=>li.ProposalNumber= item.ProposalNumber);
//  console.log("lineitem",lineitems);
//         setQuoteLineItems((prev) => [...prev, ...lineitems]);
//       } else {
//         setSelectedProposals(selectedproposals.filter(i=>i.Id !==item.Id));
//         console.log(e.target.checked);
//         console.log(
//           quoteLineItems.filter((quote) => quote.Proposal_c !== item.Id)
//         );
//         setQuoteLineItems(
//           quoteLineItems.filter((quote) => quote.Proposal_c !== item.Id)
//         );
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };
  
//   const handleAddAli = async () => {
//     try {
//       // 1. Validation
//       if (!selected_agreement_g?.Id) {
//         toast.error("Please select an Agreement Group first.");
//         return;
//       }
 
//       const targetAgreementId = acc.Id; // Passed from navigation state
 
//       // 2. Map QLI to ALI Payload
//       const requests = SelectedItems.map((qli) => {
//         // Calculate Discount (Mapping the 'Strategic + Contract' logic from Apex)
//         const stratDisc = qli.APTS_Strategic_Discount_Amount_c_c?.Value || 0;
//         const contDisc = qli.APTS_Contract_Discount_Amount_c?.Value || 0;
//         const combinedDiscount = stratDisc + contDisc;
 
//         const payload = {
//           Name: qli.Name,
//           Agreement: targetAgreementId,
 
//           // Product Mapping
//           Product: {
//             Id: qli.Product.Id,
//           },
 
//           // Agreement Group Mapping
//           APTS_Agreement_Group_c: {
//             Id: selected_agreement_g.Id,
//             Name: selected_agreement_g.Name,
//           },
 
//           // Strategy Mapping (Logic from Apex: default to Tier Discount)
//           APTS_Discount_Type_c: "Tier Discount",
//           APTS_Discount_Tier_1_c: combinedDiscount,
 
//           // Configuration Mapping
//           Line_Type_c: "Equipment", // Defaulting to Equipment as per your Apex createALI
//           APTS_Match_Products_By_c: "Product",
//           APTS_PO_Number_c: qli.Id,
//           //  APTS_Proposal_Line_Item_c: qli.Id, // Cross-reference back to QLI
//         };
//         console.log("ali", payload);
//         // Call the API utility you already have in api.js
//         return createAgreementLineItem(payload);
//       });
 
//       // 3. Execute all requests
//       await Promise.all(requests);
 
//       toast.success(`${SelectedItems.length} Agreement Line Items created!`);

    
//        navigate.push(`/${acc.Id}`, {
//         state: { agreementId: targetAgreementId, agreementName: accountname },
//       });
//     } catch (err) {
//       console.error("Failed to create ALIs:", err);
//       toast.error("Error creating Agreement Line Items.");
//     }
//   };

//   return (
//     <div className="ali-page">
//       {/* HEADER */}

//          <div className="top-header">
//         <div className="header-left">
//           <span className="brand">PHILIPS</span>
//           <span className="agreement">
//    | Agreement: {agreementName}
// </span>
       
//         </div>

//         <div className="header-actions">
        
//         </div>
//       </div>
     
//       {!showConfirmScreen && (
//         <>
//           <div className="ali-body">
//             <div style={{ display: "flex" , padding: "20px"}}>
//               <div style={{ display: "flex", paddingRight: "50px" }}>
//                 <label>Customer:</label>
//                 <div style={{ fontWeight: "bold", paddingLeft: "10px" }}>
//                   {accountname}
//                 </div>
//               </div>
 
//               <div style={{ display: "flex" }}>
//                 <label style={{ paddingRight: "30px" }}>
//                   Add to Agreement Group:{" "}
//                 </label>
//               </div>
//               <div className="filter-group">
//               <select
//                 value={selected_agreement_g?.Id}
//                 onChange={(e) => {
//                   const selectedId = e.target.value;
//                   const selectedRecord = agreement_plist.find(
//                     (a) => a.Id === selectedId
//                   );
//                   setSelectedAG(selectedRecord);
//                 }}
//               >
//                 {agreement_plist.map((agreement) => (
//                   <option key={agreement.Id} value={agreement.Id}>
//                     {agreement.Name}
//                   </option>
//                 ))}
//               </select>
//               </div>
//             </div>
 
//             {/* SECTION 1 */}
//             <div className="ali-section">
//               <div
//                 className="ali-section-header"
//                 onClick={() => toggle("quotes")}
//               >
//                 <span>Select Quotes</span>
 
//                 <span className={`arrow ${open.quotes ? "open" : ""}`}>▼</span>
//               </div>
 
//               {open.quotes && (
//                 <div className="ali-section-content">
//                   <div className="filter-row">
//                     <label>From</label>
//                     <input
//                       type="date"
//                       value={fromdate}
//                       onChange={(e) => setFromDate(e.target.value)}
//                     />
 
//                     <label>To</label>
//                     <input
//                       type="date"
//                       value={todate}
//                       onChange={(e) => setToDate(e.target.value)}
//                     />
//                   </div>
//                   {proposals && (
//                     <div className="proposal-table-container">
//                       <table className="proposal-table">
//                         <thead>
//                           <tr>
//                             <th className="checkbox-col"></th>
//                             <th>Proposal Id</th>
//                             <th>Proposal Name</th>
//                             <th>Opportunity Name</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {proposals.map((item, index) => (
//                             <tr key={index}>
//                               <td>
//                                 {" "}
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedproposals.some(
//                                     (i) => i.Id === item.Id
//                                   )}
//                                   onChange={(e) => toggleSelect(item, e)}
//                                 />{" "}
//                               </td>
//                               <td>{item.ProposalNumber}</td>
//                               <td>{item.Name}</td>
//                               <td>{item.Opportunity.Name}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                   {proposals.length === 0 && (
//                     <p className="no-data"> No Proposals Found </p>
//                   )}
//                 </div>
//               )}
//             </div>
 
//             {/* SECTION 2 */}
//             <div className="ali-section">
//               <div
//                 className="ali-section-header"
//                 onClick={() => toggle("items")}
//               >
//                 <span>Select Quote Line Items</span>
 
//                 <span className={`arrow ${open.items ? "open" : ""}`}>▼</span>
//               </div>
 
//               {open.items && (
//                 <div className="ali-section-content">
//                   <div className="toggle-row">
//                     <span>Apply Deviated Discounts</span>
//                     <label className="switch">
//                       <input
//                         type="checkbox"
//                         checked={applyDeviated}
//                         onChange={(e) => setApplyDeviated(e.target.checked)}
//                       />
//                       <span className="slider"></span>
//                     </label>
//                   </div>
 
//                   <div className="ali-section-content">
//                     <input
//                       className="search-box"
//                       type="text"
//                       placeholder="Search with product name, product code"
//                     />
 
//                     {quoteLineItems.length === 0 && (
//                       <p className="no-data">No Line Items Found</p>
//                     )}
//                     {quoteLineItems.length > 0 && (
//                       <div>
//                         <div className="proposal-table-container">
//                           <table className="proposal-table">
//                             <thead>
//                               <tr>
//                                 <th className="checkbox-col"></th>
//                                 <th>Proposal Id</th>
//                                 <th>Line Item Id</th>
//                                 <th>Product Code</th>
//                                 <th>Product </th>
//                                 <th>Contract Adjustment %</th>
//                                 <th>Strategic Adjustment %</th>
//                                 <th>Promotion Adjustment %</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {quoteLineItems.map((item, index) => (
//                                 <tr key={index}>
//                                   <td>
//                                     {" "}
//                                     <input
//                                       type="checkbox"
//                                       checked={SelectedItems.some(
//                                         (i) => i.Id === item.Id
//                                       )}
//                                       onChange={() => toggleSelectItem(item)}
//                                     />{" "}
//                                   </td>
//                                   <td>{item.ProposalNumber}</td>
//                                   <td>{item.Id}</td>
//                                   <td>{item.Product.Id}</td>
//                                   <td>{item.Product.Name}</td>
//                                   <td>
//                                     {item.APTS_Contract_Discount_Amount_c.Value}
//                                   </td>
//                                   <td>
//                                     {
//                                       item.APTS_Strategic_Discount_Amount_c_c
//                                         .Value
//                                     }
//                                   </td>
//                                   <td>
//                                     {
//                                       item.APTS_Promotion_Discount_Amount_c_c
//                                         .Value
//                                     }
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
 
//           <div className="ali-footer" style={{ textAlign: "center" }}>
//             <button className="btn-secondary" onClick={handleback}>
//               Back to List
//             </button>
 
//             {/* <button className="btn-primary">
//           Add Ali
//         </button> */}
//             <button className="btn-primary" onClick={handleCheckDuplicates}>
//               Add Ali
//             </button>
//           </div>
//         </>
//       )}
 
//       {showConfirmScreen && (
//         <>
//           <div className="ali-body">
//             {hasDuplicateData && (
//               <table className="proposal-table">
//                 <thead>
//                   <tr>
//                     <th>Product Code/Name</th>
//                     <th>Duplicates</th>
//                     <th>Discount %</th>
//                     <th>Billing Plan</th>
//                     <th>Payment Term</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {duplicateData.map((row, index) => (
//                     <tr key={index}>
//                       <td>
//                         {row.qli.Product.Id} / {row.qli.Product.Name}
//                       </td>
 
//                       <td>
//                         {row.duplicateAli && (
//                           <>
//                             <div>
//                               <input
//                                 type="radio"
//                                 name={`dup-${index}`}
//                                 checked={row.selectedOption === "ALI"}
//                                 onChange={() => handleRadioChange(index, "ALI")}
//                               />
//                               {row.duplicateAli.Name}
//                             </div>
//                           </>
//                         )}
 
//                         <div>
//                           <input
//                             type="radio"
//                             name={`dup-${index}`}
//                             checked={row.selectedOption === "QLI"}
//                             onChange={() => handleRadioChange(index, "QLI")}
//                           />
//                           {row.qli.Id}/{row.qli.Name}
//                         </div>
//                       </td>
 
//                       <td>0</td>
//                       <td>{row.qli.BillingPlan || "0/0/100"}</td>
//                       <td>ZB30</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//           <div className="ali-footer" style={{ textAlign: "center" }}>
//             <button
//               className="btn-secondary"
//               onClick={() => setShowConfirmScreen(false)}
//             >
//               Previous
//             </button>
//             <button className="btn-primary" onClick={handleConfirmAli}>
//               Confirm
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { queryGetProposal, queryGetQuoteItem} from "../../src/api/queryAgreementLineItemsByAgreement";
import { GetLookup } from "../../src/api/GetLookup";
import { createAgreementLineItem, getAgreementLineItems, updateAgreementLineItem, getAgreementById} from "../../src/api/api";
import { toast } from "react-toastify";
import "../../src/CSS/dashboard.css";

export default function NewALIfromQuotes() {
//   const acc = useLocation();
  const acc=JSON.parse(sessionStorage.getItem("AccountDetails"));
  console.log("Account details",acc);
  const [displayQuoteItems, setDisplayQuoteItems] = useState([]); //new
  const [discountSelections, setDiscountSelections] = useState({});//new
  const accountname = acc.AccountName;
  const [open, setOpen] = useState({ quotes: true, items: true });
  const [fromdate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 180);
    return d.toISOString().split("T")[0];
  });
  const [todate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [applyDeviated, setApplyDeviated] = useState(false);
  const [quoteLineItems, setQuoteLineItems] = useState([]);
   const [quotePage, setQuotePage] = useState(1);
  const [qliPage, setQliPage] = useState(1);
  
  const [SelectedItems, setSelectedItems] = useState([]);
  const [agreement_plist, setAgreement_PList] = useState([]);
  const [selected_agreement_g, setSelectedAG] = useState({});
  const [proposals, setProposals] = useState([]);
  //qli
  const [duplicateData, setDuplicateData] = useState([]);
  const [showConfirmScreen, setShowConfirmScreen] = useState(false);
  const [hasDuplicateData, setHasDuplicateData] = useState(false);
  const [selectedproposals, setSelectedProposals] = useState([]);
 const agreementName =sessionStorage.getItem("agreementName") ;
 const pageSize = 5;
  const qliHeaderCheckboxRef = useRef(null);
  const getDuplicateKey = (item) =>
    applyDeviated
      ? item.APTS_Parent_Bundle_Product_Code_c || ""
      : item.APTS_Product_Code_c || "";
  const getDuplicateSummary = (items) => {
    const seen = new Map();
    const duplicates = [];
    items.forEach((item) => {
      const key = getDuplicateKey(item);
      if (!key) return;
      if (seen.has(key)) {
        duplicates.push({ key, first: seen.get(key), second: item });
      } else {
        seen.set(key, item);
      }
    });
    return duplicates;
  };
  const selectedHasDuplicates = getDuplicateSummary(SelectedItems).length > 0;
  const quoteTotalPages = Math.max(1, Math.ceil((proposals?.length || 0) / pageSize));
  const qliTotalPages = Math.max(1, Math.ceil((displayQuoteItems?.length || 0) / pageSize));
  const quotePageItems = proposals.slice((quotePage - 1) * pageSize, quotePage * pageSize);
  const qliPageItems = displayQuoteItems.slice((qliPage - 1) * pageSize, qliPage * pageSize);
  const selectedAllDisplayItems =
    displayQuoteItems.length > 0 &&
    displayQuoteItems.every((item) =>
      SelectedItems.some((selected) => selected.Id === item.Id)
    );
  const selectedSomeDisplayItems =
    displayQuoteItems.some((item) =>
      SelectedItems.some((selected) => selected.Id === item.Id)
    ) && !selectedAllDisplayItems;
  useEffect(() => {
    setQuotePage(1);
  }, [proposals.length]);

  useEffect(() => {
    setQliPage(1);
  }, [displayQuoteItems.length, applyDeviated]);

  useEffect(() => {
    if (qliHeaderCheckboxRef.current) {
      qliHeaderCheckboxRef.current.indeterminate = selectedSomeDisplayItems;
    }
  }, [selectedSomeDisplayItems, qliPageItems, SelectedItems]);
  
  // const handleCheckDuplicates = async () => {
   const goToDuplicatePage = async () => {
    try {
      if (SelectedItems.length === 0) {
        toast.error("Please select at least one Quote Line Item");
        return;
      }
 
      const existingALIs = await getAgreementLineItems();
      const agreementALIs = existingALIs.Data.filter(
        (ali) => ali.Agreement === acc.Id
      );
 
      const comparison = SelectedItems.map((qli) => {
        const match = agreementALIs.find(
          (ali) => 
            applyDeviated
              ? ali.APTS_Parent_Bundle_Product_Code_c ===
                qli.APTS_Parent_Bundle_Product_Code_c
              :ali.Product?.Id === qli.Product?.Id
        );
 
        return {
          qli,
          duplicateAli: match || null,
          selectedOption: match ? "ALI" : "QLI", // default
        };
      });

      // if (comparison[0].duplicateAli !== null) {

           const hasDuplicates = comparison.some(
  item => item.duplicateAli !== null
);
      if(hasDuplicates){
        setDuplicateData(comparison);
        setShowConfirmScreen(true);
        setHasDuplicateData(true);
      } else {
        setDuplicateData(comparison);
        setShowConfirmScreen(true);
        setHasDuplicateData(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error checking duplicates");
    }
  };
  const handleRadioChange = (index, value) => {
    const updated = [...duplicateData];
    updated[index].selectedOption = value;
    setDuplicateData(updated);
  };
  const handleConfirmAli = async () => {
    
 try {
    const response = await getAgreementById(acc.Id);
    console.log("Full Agreement API Response:", response);

    // If the response is an array, take the first item. If it's an object, use it directly.
    const agreement = Array.isArray(response) ? response[0] : response;

    if (!agreement) {
      toast.error("No agreement data found.");
      return;
    }

    // Mapping fields based on your provided JSON log
    const contractStart = agreement.ContractStartDate;
    const contractEnd = agreement.ContractEndDate;

    console.log("Extracted Dates -> Start:", contractStart, "End:", contractEnd);

    if (!contractStart || !contractEnd) {
      toast.error(`Agreement is missing dates. Start: ${contractStart}, End: ${contractEnd}`);
      return;
    }

    const isTransactionContract = agreement.RecordType === "Transaction Contract" || 
                                   agreement.RecordType?.Name === "Transaction Contract";

    for (const row of duplicateData) {
      const qli = row.qli;
      const selectedDiscountType = getSelectedDiscountType(qli);

      if (row.duplicateAli && row.selectedOption === "QLI") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        await updateAgreementLineItem(row.duplicateAli.Id, {
          APTS_Expiration_Date_c: yesterday.toISOString().split("T")[0],
        });
      }

      if (!row.duplicateAli || row.selectedOption === "QLI") {
        
// Inside handleConfirmAli loop
const payload = {
  Name: qli.Name,
  // Check if your API wants an ID string or an object { Id: ... }
  Agreement: acc.Id, 
  Product: { Id: qli.Product.Id },
  APTS_Agreement_Group_c: {
              Id: selected_agreement_g.Id,
            },

  // Dates: Ensure these are valid strings
  StartDate: contractStart, 
  APTS_Expiration_Date_c: contractEnd,
  EndDate: contractEnd,

  APTS_BillingPlan_c: qli.APTS_BillingPlan_c || "",
 // APTS_Proposal_Line_Item_c: qli.Id,
  APTS_Match_Products_By_c: "Product",
  Line_Type_c: "Equipment",
};

// Fix for Quantity: avoid NaN
if (isTransactionContract) {
  payload.Quantity = qli.Quantity ? Number(qli.Quantity) : 0;
}

// Fix for Discounts: ensure Number conversion is safe
// const adjType = qli.AdjustmentType || qli.Apttus_QPConfig__AdjustmentType__c; 
if (applyDeviated) {
  if (selectedDiscountType === "Net Price Override") {
    payload.APTS_Discount_Type_c = "Net Price Override";
    payload.APTS_NPO_Tier_1_c = Number(
      qli.APTS_Offered_Price_Without_Promo_c?.Value  || 0
    );
  } else {
    const stratDisc = Number(qli.APTS_Strategic_Discount_c || 0);
    const contDisc = Number(qli.APTS_ContractDiscount_c || 0);
    payload.APTS_Discount_Type_c = "Tier Discount";
    payload.APTS_Discount_Tier_1_c = stratDisc + contDisc;
  }
} else {
  const adjType = qli.AdjustmentType || qli.AdjustmentType; 
if (adjType === "% Discount") {
  const stratDisc = Number(qli.APTS_Strategic_Discount_Amount_c_c?.Value || 0);
  const contDisc = Number(qli.APTS_Contract_Discount_Amount_c?.Value || 0);
  
  payload.APTS_Discount_Type_c = "Tier Discount";
  payload.APTS_Discount_Tier_1_c = stratDisc + contDisc;
} 
else if (adjType === "Net Price Override") {
  payload.APTS_Discount_Type_c = "Net Price Override";
  payload.APTS_NPO_Tier_1_c = Number(qli.APTS_Offered_Price_c_c?.Value || 0);
}
}
        await createAgreementLineItem(payload);
      }
    }
      toast.success("ALI process completed successfully!");
 
     navigate.push(`/${acc.Id}`);
    } catch (err) {
      console.error(err);
      toast.error("Error confirming ALIs");
    }
  };

  useEffect(() => {
    console.log("Original Quote Line Items:", quoteLineItems);
  if (!quoteLineItems.length) {
    console.log("No quote line items available.");
    setDisplayQuoteItems([]);
    return;
  }
 
  if (!applyDeviated) {
    console.log("Filtering for OFF state: Excluding deviated discounts");
    // OFF State
    console.log("Filtering quote line items to ", quoteLineItems);
    const filtered = quoteLineItems.filter(
      item =>
        item.LineType === "Product/Service" &&
        !item.BundleOptional &&
        !item.IsOptional
    );
 console.log("Filtering quote line items to ", filtered);
    setDisplayQuoteItems(filtered);
  } else {
    console.log("Filtering for ON state: Including deviated discounts");
    // ON State
    const filtered = quoteLineItems.filter(item => {
      const isProduct =
        item.LineType === "Product/Service";
 
      const isOption =
        item.LineType === "Option" &&
        Number(item.ListPrice || 0) !== 0;
 
      return (
        (isProduct || isOption) &&
        !item.BundleOptional &&
        !item.IsOptional
      );
    });
 
    setDisplayQuoteItems(filtered);
  }
}, [applyDeviated, quoteLineItems]);
const handleDiscountTypeChange = (id, value) => {
  setDiscountSelections(prev => ({
    ...prev,
    [id]: value
  }));
   };
const getSelectedDiscountType = (item) =>
  discountSelections[item.Id] ?? item.DiscountType ?? "None";

const ensureDeviatedDiscountDefaults = (items) => {
  const nextSelections = { ...discountSelections };
  let changed = false;

  items.forEach((item) => {
    if (!nextSelections[item.Id]) {
      nextSelections[item.Id] = "None";
      changed = true;
    }
  });

  if (changed) {
    setDiscountSelections(nextSelections);
  }

  return nextSelections;
};

const validateDeviatedSelection = (items) => {
  console.log("Validating deviated selection for items:", items);
  const selectedByProductCode = new Map();

  for (const item of items) {
    const childCode = item.APTS_Product_Code_c || "";
    const parentCode = item.APTS_Parent_Bundle_Product_Code_c || "";
    const key = childCode || parentCode;
    console.log(`Checking item ${item.Id} with key:`, key);


    if (!key) continue;

    if (selectedByProductCode.has(key)) {
      toast.error(
        "Duplicate product codes are not allowed when Apply Deviated Discounts is ON."
      );
      return false;
    }

    selectedByProductCode.set(key, item);
  }

  const selectedIds = new Set(items.map((item) => item.Id));
  const optionRows = items.filter((item) => item.AdjustmentType === "Option");
  const missingParents = optionRows.filter((item) => {
    const parentId = item.ParentId || item.ParentItemId || item.ParentProductId;
    if (parentId && selectedIds.has(parentId)) return false;
    const parentCode = item.APTS_Parent_Bundle_Product_Code_c;
    if (!parentCode) return true;
    return !items.some(
      (candidate) => candidate.APTS_Product_Code_c === parentCode
    );
  });
console.log("Option rows:", optionRows);
console.log("Missing parents:", missingParents);
console.log("Selected IDs:", selectedIds);
  if (missingParents.length > 0) {
    toast.error(
      "Some selected option rows do not have their parent selected. Please add the parent product first."
    );
    return false;
  }

  const zeroPriced = items.filter(
    (item) => Number(item.APTS_Offered_Price_Without_Promo_c || 0) === 0
  );
  if (zeroPriced.length > 0) {
    toast.error(
      "Zero-priced products are not allowed for deviated discount creation."
    );
    return false;
  }

  return true;
};
  
  useEffect(() => {
    const loadProposalItems = async () => {
      try {
        const data = await queryGetProposal(
          acc.AccountId,
          fromdate,
          todate
        );
        setProposals(data || []);
      } catch (err) {
        console.error(err);
      }
    };
 
    loadProposalItems();
    const loadAg_group = async () => {
      try {
        const data = await GetLookup("APTS_Agreement_Groups_c");
        const final = data.Data.filter(
          (d) => d.APTS_Agreement_c === acc.Id
        );
        setAgreement_PList(final);
        setSelectedAG(final[0]);
      } catch (err) {
        console.error(err);
      }
    };
    loadAg_group();
  }, [fromdate, todate]);
 
  const toggle = (name) => {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };
 
  const navigate = useRouter();
  const handleback = () => {
   navigate.push(`/${acc.Id}`);
   console.log("agre",acc.Id);
  };
 
  const toggleSelectItem = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.Id === item.Id);
 console.log("exists",exists);
      if (exists) {
        return prev.filter((i) => i.Id !== item.Id);
      } else {
       const next = [...prev, item];
        if (getDuplicateSummary(next).length > 0) {
          toast.error(
            applyDeviated
              ? "Similar line items selected by parent product code. Please select unique line items."
              : "Duplicate line items selected by product code. Please select unique line items."
          );
        }
        return next;
      }
    });
  };
 const toggleSelectAllVisible = (checked) => {
    if (!checked) {
      setSelectedItems((prev) =>
        prev.filter((item) => !displayQuoteItems.some((visible) => visible.Id === item.Id))
      );
      return;
    }
    const next = Array.from(
      new Map([...SelectedItems, ...displayQuoteItems].map((item) => [item.Id, item])).values()
    );
    if (getDuplicateSummary(next).length > 0) {
      toast.error(
        applyDeviated
          ? "Similar line items selected by parent product code. Please select unique line items."
          : "Duplicate line items selected by product code. Please select unique line items."
      );
      return;
    }
    setSelectedItems(next);
  };
  const toggleSelect = async (item, e) => {
    try {
      if (e.target.checked) {
        setSelectedProposals((prev) => [...prev, item]);
        const lineitems = await queryGetQuoteItem(item.Id);
        lineitems.map(li=>li.ProposalNumber= item.ProposalNumber);
 console.log("lineitem",lineitems);
        setQuoteLineItems((prev) => [...prev, ...lineitems]);
      } else {
        setSelectedProposals(selectedproposals.filter(i=>i.Id !==item.Id));
        console.log(e.target.checked);
        console.log(
          quoteLineItems.filter((quote) => quote.Proposal_c !== item.Id)
        );
        setQuoteLineItems(
          quoteLineItems.filter((quote) => quote.Proposal_c !== item.Id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
//   const toggleSelect = async (item: any, e: any) => {
//   try {
//     if (e.target.checked) {
//       setSelectedProposals((prev) => [...prev, item]);
//       const allItems = await queryGetQuoteItem(item.Id);
//       const filteredItems = allItems
//         .filter((li: any) => {
//           const notBundleOptional =
//             li.APTS_IsBundleOptional_c === false;
 
//           const notOptional =
//             li.IsOptional === false;

//           const notMenuOtt =
//             li.Product?.Solution_Classification__c !==
//             "Menu/OTT";
 
//           if (
//             !notBundleOptional ||
//             !notOptional ||
//             !notMenuOtt
//           ) {
//             return false;
//           }
 
//           // Toggle OFF
//           if (!applyDeviated) {
//             return (
//               li.LineType  ===
//               "Product/Service"
//             );
//           }
 
//           // Toggle ON
//           return (
//             li.LineType  ===
//               "Product/Service" ||
//             (li.LineType  ===
//               "Option" &&
//               Number(
//                 li.ListPrice  || 0
//               ) !== 0)
//           );
//         })
//         .map((li: any) => ({
//           ...li,
//           ProposalNumber: item.Proposal_c,
//         }));
 
//       setQuoteLineItems((prev) => [
//         ...prev,
//         ...filteredItems,
//       ]);
//     } else {
//       setSelectedProposals((prev) =>
//         prev.filter((i: any) => i.Id !== item.Id)
//       );
 
//       setQuoteLineItems((prev) =>
//         prev.filter(
//           (quote: any) =>
//             quote.Proposal_c !== item.Id
//         )
//       );
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error("Error loading quote items");
//   }
// };
  
  const handleAddAli = async () => {
      if (selectedHasDuplicates) {
      toast.error(
        applyDeviated
          ? "Similar line items selected by parent product code. Please select unique line items."
          : "Duplicate line items selected by product code. Please select unique line items."
      );
      return;
    }
      if (SelectedItems.length === 0) {
      toast.error("Please select at least one Quote Line Item");
      return;
    }
    try {
      // 1. Validation
      if (!selected_agreement_g?.Id) {
        toast.error("Please select an Agreement Group first.");
        return;
      }
 
      // const targetAgreementId = acc.Id; // Passed from navigation state
 
      // // 2. Map QLI to ALI Payload
      // const requests = SelectedItems.map((qli) => {
      //   // Calculate Discount (Mapping the 'Strategic + Contract' logic from Apex)
      //   const stratDisc = qli.APTS_Strategic_Discount_Amount_c_c?.Value || 0;
      //   const contDisc = qli.APTS_Contract_Discount_Amount_c?.Value || 0;
      //   const combinedDiscount = stratDisc + contDisc;
 
      //   const payload = {
      //     Name: qli.Name,
      //     Agreement: targetAgreementId,
 
      //     // Product Mapping
      //     Product: {
      //       Id: qli.Product.Id,
      //     },
 
      //     // Agreement Group Mapping
      //     APTS_Agreement_Group_c: {
      //       Id: selected_agreement_g.Id,
      //       Name: selected_agreement_g.Name,
      //     },
 
      //     // Strategy Mapping (Logic from Apex: default to Tier Discount)
      //     APTS_Discount_Type_c: "Tier Discount",
      //     APTS_Discount_Tier_1_c: combinedDiscount,
 
      //     // Configuration Mapping
      //     Line_Type_c: "Equipment", // Defaulting to Equipment as per your Apex createALI
      //     APTS_Match_Products_By_c: "Product",
      //     APTS_PO_Number_c: qli.Id,
      //     //  APTS_Proposal_Line_Item_c: qli.Id, // Cross-reference back to QLI
      //   };
      //   console.log("ali", payload);
      //   // Call the API utility you already have in api.js
      //   return createAgreementLineItem(payload);
      // });
 
      // // 3. Execute all requests
      // await Promise.all(requests);
 
      // toast.success(`${SelectedItems.length} Agreement Line Items created!`);

    
      //  navigate.push(`/${acc.Id}`, {
      //   state: { agreementId: targetAgreementId, agreementName: accountname },
      // });
      if (applyDeviated) {
        ensureDeviatedDiscountDefaults(SelectedItems);
        if (!validateDeviatedSelection(SelectedItems)) {
          return;
        }
      }
      await goToDuplicatePage();
    } catch (err) {
      console.error("Failed to prepare ALIs:", err);
      toast.error("Error preparing Agreement Line Items.");
    }
  };
const isDisabled = (item) =>
  SelectedItems.some(
    (selected) =>
      selected.Id !== item.Id &&
      getDuplicateKey(selected) &&
      getDuplicateKey(selected) === getDuplicateKey(item)
  );
  const renderPagination = (page, totalPages, setPage) => (
    <div className="proposal-pagination">
      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
    return(
        <div className="ali-page">
      {/* HEADER */}

         <div className="top-header">
        <div className="header-left">
          <span className="brand">PHILIPS</span>
          <span className="agreement">
   | Agreement: {agreementName}
</span>

        </div>

        <div className="header-actions">

        </div>
      </div>

      {!showConfirmScreen && (
        <>
          <div className="ali-body">
            <div style={{ display: "flex" , padding: "20px"}}>
              <div style={{ display: "flex", paddingRight: "50px" }}>
                <label>Customer:</label>
                <div style={{ fontWeight: "bold", paddingLeft: "10px" }}>
                  {accountname}
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <label style={{ paddingRight: "30px" }}>
                  Add to Agreement Group:{" "}
                </label>
              </div>
              <div className="filter-group">
              <select
                value={selected_agreement_g?.Id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedRecord = agreement_plist.find(
                    (a) => a.Id === selectedId
                  );
                  setSelectedAG(selectedRecord);
                }}
              >
                {agreement_plist.map((agreement) => (
                  <option key={agreement.Id} value={agreement.Id}>
                    {agreement.Name}
                  </option>
                ))}
              </select>
              </div>
            </div>

            {/* SECTION 1 */}
            <div className="ali-section">
              <div
                className="ali-section-header"
                onClick={() => toggle("quotes")}
              >
                <span>Select Quotes</span>

                <span className={`arrow ${open.quotes ? "open" : ""}`}>▼</span>
              </div>

              {open.quotes && (
                <div className="ali-section-content">
                  <div className="filter-row">
                    <label>From</label>
                    <input
                      type="date"
                      value={fromdate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />

                    <label>To</label>
                    <input
                      type="date"
                      value={todate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                  {proposals && (
                    <div className="proposal-table-container">
                      <table className="proposal-table">
                        <thead>
                          <tr>
                            <th className="checkbox-col"></th>
                            <th>Proposal Id</th>
                            <th>Proposal Name</th>
                            <th>Opportunity Name</th>
                          </tr>
                        </thead>
                        <tbody>
                           {quotePageItems.map((item, index) => (
                            <tr key={index}>
                              <td>
                                {" "}
                                <input
                                  type="checkbox"
                                  checked={selectedproposals.some(
                                    (i) => i.Id === item.Id
                                  )}
                                  onChange={(e) => toggleSelect(item, e)}
                                />{" "}
                              </td>
                              <td>{item.ProposalNumber}</td>
                              <td>{item.Name}</td>
                              <td>{item.Opportunity.Name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                        {renderPagination(quotePage, quoteTotalPages, setQuotePage)}
                    </div>
                  )}
                  {proposals.length === 0 && (
                    <p className="no-data"> No Proposals Found </p>
                  )}
                </div>
              )}
            </div>

            {/* SECTION 2 */}
            <div className="ali-section">
              <div
                className="ali-section-header"
                onClick={() => toggle("items")}
              >
                <span>Select Quote Line Items</span>

                <span className={`arrow ${open.items ? "open" : ""}`}>▼</span>
              </div>

              {open.items && (
                <div className="ali-section-content">
                  <div className="toggle-row">
                    <span>Apply Deviated Discounts</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={applyDeviated}
                        onChange={(e) => setApplyDeviated(e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="ali-section-content">
                    <input
                      className="search-box"
                      type="text"
                      placeholder="Search with product name, product code"
                    />

                    {quoteLineItems.length === 0 && (
                      <p className="no-data">No Line Items Found</p>
                    )}
                    {quoteLineItems.length > 0 && (
                      <div>
                        <div className="proposal-table-container">
                          <table className="proposal-table">
                            <thead>
                              <tr>
                                <th className="checkbox-col">
                                  <input
                                    ref={qliHeaderCheckboxRef}
                                    type="checkbox"
                                    checked={selectedAllDisplayItems}
                                    onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                                  />
                                </th>
                                <th>Proposal Id</th>
                                <th>Line Item Id</th>
                                { !applyDeviated && (
                                <th>Product Code</th>
                                )}
                                {applyDeviated && (
                                <>
                                <th>Adjustment Type</th>
                                <th>Discount Type</th>
                                <th>Product code</th>
                                <th>Parent Product Code</th>
                                <th>Product</th>
                                <th>Offered Price Without Promo</th>
                                </> )}
                                { !applyDeviated && (
                                <th>Product</th>
                                )}
                                <th>Contract Adjustment %</th>
                                <th>Strategic Adjustment %</th>
                                <th>Promotion Adjustment %</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* {quoteLineItems.map((item, index) => ( */}
                              {/* new */}
                                {qliPageItems.map((item,index)=>(
                                <tr key={index}>
                                  <td>
                                    {" "}
                                    <input
                                      type="checkbox"
                                      disabled={isDisabled(item)&& !applyDeviated}
                                      style={isDisabled(item)&& !applyDeviated?{"opacity":"0.5"}:{opacity:1}}
                                      checked={SelectedItems.some(
                                        (i) => i.Id === item.Id
                                      )}
                                      onChange={() => toggleSelectItem(item)}
                                    />{" "}
                                  </td>
                                  <td>{item.ProposalNumber}</td>
                                  <td>{item.Line_Item_Id_c}</td>
                                  {!applyDeviated &&(
                                  <td>{item.APTS_Product_Code_c}</td>)}
                                  {applyDeviated && (
  <>
    <td>{item.AdjustmentType}</td>

    <td>
      <select
      className="discount-select"
        value={discountSelections[item.Id] ?? item.DiscountType ?? ""}
        onChange={(e) =>
          handleDiscountTypeChange(item.Id, e.target.value)
        }
      >
        <option value="">Select Discount</option>
        <option value="Tier Discount">Tier Discount</option>
        <option value="Net Price Override">
          Net Price Override
        </option>
      </select>
    </td>
      <td>{item.APTS_Product_Code_c}</td>
      <td>{item.APTS_Parent_Bundle_Product_Code_c}</td>
      <td>{item.Product.Name}</td>
      <td>
      {item.APTS_Offered_Price_Without_Promo_c?.Value}
    </td>
  </>
)}  
                        {!applyDeviated&&(
                        <td>{item.Product.Name}</td>)}
                                  {/* <td>
                                    {item.APTS_Contract_Discount_Amount_c.Value}
                                  </td>
                                  <td>
                                    {
                                      item.APTS_Strategic_Discount_Amount_c_c
                                        .Value
                                    }
                                  </td>
                                  <td>
                                    {
                                      item.APTS_Promotion_Discount_Amount_c_c
                                        .Value
                                    }
                                  </td> */}
                                  <td>
  {applyDeviated
    ? item.APTS_ContractDiscount_c
    : item.APTS_Solution_Contract_Discount__c}
</td>

<td>
  {applyDeviated
    ? item.APTS_Strategic_Discount_c
    : item.APTS_Solution_Strategic_Discount__c}
</td>

<td>
  {applyDeviated
    ? item.APTS_Promotion__c
    : item.APTS_Solution_Promotion_Discount__c}
</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                          {renderPagination(qliPage, qliTotalPages, setQliPage)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="ali-footer" style={{ textAlign: "center" }}>
            <button className="btn-secondary" onClick={handleback}>
              Back to List
            </button>

            {/* <button className="btn-primary">
          Add Ali
        </button> */}
         {/* <button className="btn-primary" onClick={handleCheckDuplicates} disabled={selectedHasDuplicates}> */}
           <button className="btn-primary" onClick={handleAddAli} disabled={SelectedItems.length === 0 || selectedHasDuplicates}>
              Add Ali
            </button>
          </div>
        </>
      )}

      {showConfirmScreen && (
        <>
          <div className="ali-body">
            {hasDuplicateData && (
              <table className="proposal-table">
                <thead>
                  <tr>
                    <th>Product Code/Name</th>
                    <th>Duplicates</th>
                    <th>Discount %</th>
                    <th>Billing Plan</th>
                    <th>Payment Term</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicateData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        {row.qli.Product.Id} / {row.qli.Product.Name}
                      </td>

                      <td>
                        {row.duplicateAli && (
                          <>
                            <div>
                              <input
                                type="radio"
                                name={`dup-${index}`}
                                checked={row.selectedOption === "ALI"}
                                onChange={() => handleRadioChange(index, "ALI")}
                              />
                              {row.duplicateAli.Name}
                            </div>
                          </>
                        )}

                        <div>
                          <input
                            type="radio"
                            name={`dup-${index}`}
                            checked={row.selectedOption === "QLI"}
                            onChange={() => handleRadioChange(index, "QLI")}
                          />
                          {row.qli.Id}/{row.qli.Name}
                        </div>
                      </td>

                      <td>0</td>
                      <td>{row.qli.BillingPlan || "0/0/100"}</td>
                      <td>ZB30</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="ali-footer" style={{ textAlign: "center" }}>
            <button
              className="btn-secondary"
              onClick={() => setShowConfirmScreen(false)}
            >
              Previous
            </button>
            <button className="btn-primary" onClick={handleConfirmAli}>
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
    );
}

