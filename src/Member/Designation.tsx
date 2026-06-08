// 'use client';

// import React, { useState,useEffect } from "react";
// import { toast } from "react-toastify";

// import "../CSS/Designation.css"
// import MemberSearch from "../components/MemberSearch";
// import { getAccountsByIds,getAgreementsByIds,getAgreementsIds,getMembershipAgreements ,createGPODesignateChange,getRetryRecords, UpdateGPODesignateChange,getUserIdFromToken,fetchRecords,getAgreementDetailsByIds,getAccountById,queryDesignatedContractsByMember,updateAccountContract,updateAccount, createMember,getActiveGPOAgreements, getCFAMembersByAgreementIds,getAgreementsByIdsDesignation} from "../api/member"; 
// import { queryGetAgreementDetails } from "../api/queryAgreementLineItemsByAgreement"; 

// export default function Designation() {

// const agreementId = sessionStorage.getItem("agreementId");
//   const [member, setMember] = useState(null);

//  const [selectedGPO, setSelectedGPO] = useState(null);
//  const showDesignationHeader = !!member?.Id;

//  const [rows, setRows] = useState([]);

//   const today = new Date().toISOString().split("T")[0];
// const [effectiveDate, setEffectiveDate] = useState(today);
//   const [tier, setTier] = useState("Tier 1");
//    const [Acc,setAcc] = useState(null);
//   const [options, setOptions] = useState([]);
// const [designated, setDesignated] = useState(null);
// const [showCheckBox, setShowCheckBox] = useState(false);
// const [showConfirm, setShowConfirm] = useState(false);
// const [retryRecords, setRetryRecords] = useState([]);
// const [showRetry, setShowRetry] = useState(false);
// const [currentDesignated, setCurrentDesignated] = useState(null);
// const [unDesignate, setUnDesignate] = useState(false);
// const [cfMsg, setCfMsg] = useState("");
// const [openModalCus, setOpenModalCus] = useState(false);
// const [custFrameagrList, setCustFrameagrList] = useState([]);

// const clearForm = () => {
//   setRows([]);
//   setMember(null);
//   setSelectedGPO(null);
//   setEffectiveDate(today);
//   setTier("Tier 1");
//   setOptions([]);
//   setDesignated(null);
//   setShowCheckBox(false);
// };
// useEffect(() => {
//   loadRetryRecords();
  
// }, []);

// const loadRetryRecords = async () => {
//   try {
//     const UserId = await getUserIdFromToken();
//     console.log("UserId for retry", UserId);
//     const data = await getRetryRecords(UserId);
// console.log("retry data", data);
//     if (data.length > 0) {
//       setRetryRecords(data);
//       setShowRetry(true);
//     } else {
//       setShowRetry(false);
//     }
//   } catch (e) {
//     console.error(e);
//   }
// };
// useEffect(() => {
//  //  loadData();
//    (async () => {
//     try {
//       const trying = await queryGetAgreementDetails(agreementId);
//       console.log(trying);
//       setAcc(trying);
//     } catch (err) {
//       console.error(err);
//     }
//   })();
//    console.log("account",Acc);
//    if (Acc && Acc.length > 0) {
//     const accRecord = Acc[0]?.Account;

//     if (accRecord) {
//       setSelectedGPO({
//         Id: accRecord.Id,
//         Name: accRecord.Name
//       });
//     }
//   }
//   if (!member?.Name) return;

// //   const load = async () => {
// //     const data = await getAccounts({
// //       filters: {
// //         Market_c: "North America",
// //         Country_c: "United States",
// //         Inactive_Flag_c: false,
// //         Golden_Record_Key_c: { notNull: true },
// //         Name: member.Name // EXACT MATCH
// //       }
// //     });
// // console.log("dataoption",data);
// // const mapped = data.map(rec => {
// //   const isDesignated = !!rec.Designated_GPO_c;

// //   if (isDesignated) {
// //     setCurrentDesignated(rec.Id); // store designated
// //     setShowCheckBox(true);        // show checkbox initially
// //   }

// //   return {
// //     label: `${rec.Designated_GPO_c?.Name || "No GPO"} ${
// //       isDesignated ? "(Designated)" : ""
// //     }`,
// //     value: rec.Id,
// //     isDesignated
// //   };
// // });

// // setOptions(mapped);
// // const designatedOption = mapped.find(o => o.isDesignated);

// // if (designatedOption) {
// //   setDesignated(designatedOption.value); 
// // }
   
// //  console.log("hdshe",mapped);
// //     setOptions(mapped);
// //      console.log("hdshe",options);
// //   };

// const load = async () => {
//   // STEP 1: Contracts
//   const contracts = await getMembershipAgreements(member.Id);

//   const agreementIds = contracts
//     .map(c => c.APTS_Related_Agreement_c)
//     .filter(Boolean);

//   if (!agreementIds.length) {
//     setOptions([]);
//     return;
//   }

//   // STEP 2: Agreements
//   const agreements = await getAgreementsIds(agreementIds);
// console.log("agreements", agreements);
//   const accountIds = [
//     ...new Set(agreements.map(a => a.Account?.Id))
//   ];
// console.log("accountIds", accountIds);
//   // STEP 3: Accounts
//   const accounts = await getAccountsByIds(accountIds);

//   // STEP 4: Map to radio options
//   // const mapped = accounts.map(acc => {
//   //   return {
//   //     label: acc.Name,
//   //     value: acc.Id,
//   //     isDesignated: acc.Id === member.Designated_GPO__c // adjust if needed
//   //   };
//   // });
// const mapped = accounts.map(acc => {
//   console.log("mapping account", acc.Id, member.Id);
//   console.log("current designated", member.Designated_GPO_c);
//  // const isDesignated = acc.Id === member.Id;
//  const designatedId =
//   member.Designated_GPO_c?.Id ||
//   member.Designated_GPO_c;

// const isDesignated = acc.Id === designatedId;
// //  const isDesignated = acc.Id === member.Designated_GPO_c.Id;
//   return {
//     label: isDesignated
//       ? `${acc.Name} (Designated)`
//       : acc.Name,
//     value: acc.Id,
//     isDesignated
//   };
// });

//     setOptions(mapped);
//     setShowCheckBox(false);
//     setUnDesignate(false);

//     const designatedOption = mapped.find(o => o.isDesignated);
//     if (designatedOption) {
//       console.log("Found designated option", designatedOption);
//       setDesignated(designatedOption.value);
//       setCurrentDesignated(designatedOption.value);
//       setShowCheckBox(true);
//       setUnDesignate(true);
//     }
//   };

//   load();
// }, [member],[Acc, agreementId]);
//    const loadData = async () => {
//       try {       
// const trying = await queryGetAgreementDetails(agreementId);
//   console.log(trying);
//   setAcc(trying);


//       } catch (err) {
//         console.error(err);
//       } 
//     };
//  const handleAddRow = () => {
//   if (!member || !selectedGPO) {
//     alert("Select Member and GPO");
//     return;
//   }

//   const newRow = {
//     id: Date.now(),
//     memberName: member.Name,
//     memberId: member.Id,
//     gpoName: selectedGPO.Name,
//     gpoId: selectedGPO.Id,
//     effectiveDate,
//     tier
//   };

//   setRows((prev) => [...prev, newRow]);
// };


// // const checkMembershipAgreements = async (memberId, newGpoId) => {
// //   try {
// //     const contracts = await getMembershipAgreements(memberId);
// // console.log("contracts", contracts);
// //     if (!contracts || contracts.length === 0) return 0;

// //     let allAgreements = [];

// //     //  Step 1: Fetch ALL agreements
// //     for (let contract of contracts) {
// //       if (contract.APTS_Related_Agreement_c) {
// //         const agr = await getAgreementById(
// //           contract.APTS_Related_Agreement_c
// //         );
// // console.log("agr for contract", contract.Id, agr);
// //         if (agr && agr.length > 0) {
// //           allAgreements.push(...agr);
// //         }
// //       }
// //     }

// //     const todayDate = new Date();

// //     //  Step 2: Apply EXACT same conditions as LWC/Apex
// //     const validAgreements = allAgreements.filter((agr) => {
// //       return (
// //         console.log("Checking agreement", agr.Id, ),
// //         agr.ContractEndDate &&
// //         new Date(agr.ContractEndDate) > todayDate &&

// //         agr.APTS_Member_SAP_Status_c === "In Progress" &&

// //         //  IMPORTANT: handle both cases (Id or direct value)
// //         (agr.Account === newGpoId || agr.Account?.Id === newGpoId) &&

// //         agr.Status === "Activated" &&
// //         agr.StatusCategory === "In Effect"
// //       );
// //     });

// //     console.log("Valid agreements after filter:", validAgreements);

// //     return validAgreements.length;

// //   } catch (e) {
// //     console.error("Error in membership check", e);
// //     return 0;
// //   }
// // };

// const checkMembershipAgreements = async (
//   memberId,
//   newGpoId
// ) => {

//   try {

//     /*
//       STEP 1:
//       Get contracts
//     */

//     const contracts =
//       await getMembershipAgreements(memberId);

//     console.log("contracts", contracts);

//    if (!contracts || contracts.length === 0) {
//       return 0;
//     }


//     const AccountIds = [];

//     contracts.forEach(c => {

//       // const Account =
//       //   c?.APTS_Member_c?.Designated_GPO_c ||
//       //   c?.APTS_Member_c?.Designated_GPO_c?.Id;

//       const Account = c?.APTS_Member_c
// console.log("Account for contract", c.Id, Account);
//       if (Account) {
//         AccountIds.push(Account);
//       }
//     });
//     console.log("AccountIds", AccountIds);
//  const designate = await getAccountsByIds(AccountIds);

//      const designatedIds = [];

//     designate.forEach(c => {

//       // const designated =
//       //   c?.APTS_Member_c?.Designated_GPO_c ||
//       //   c?.APTS_Member_c?.Designated_GPO_c?.Id;

//       const designated = c?.Designated_GPO_c?.Id || c?.Designated_GPO_c;
// console.log("designated for contract", c.Id, designated);
//       if (designated) {
//         designatedIds.push(designated);
//       }
//     });
//     console.log("designatedIds", designatedIds);
    


//     const agreementIds = contracts
//       .map(c => c.APTS_Related_Agreement_c)
//       .filter(Boolean);

//     if (!agreementIds.length) {
//       return 0;
//     }


//     const agreements =
//       await getAgreementsByIds(agreementIds);

//     console.log("agreements", agreements);

//     const todayDate = new Date();

//     const validAgreements =
//       agreements.filter(agr => {

//         const agrAccount =
//           agr.Account?.Id || agr.Account;

//         return (

//           agr.ContractEndDate &&
//           new Date(agr.ContractEndDate) > todayDate &&

//           agr.APTS_Agreement_SAP_Status_c ===
//             "In Progress" &&

//           (
//             agrAccount === newGpoId ||
//             designatedIds.includes(agrAccount)
//           ) 
//         );
//       });

//     console.log(
//       "validAgreements",
//       validAgreements
//     );

//     return validAgreements.length;

//   } catch (e) {

//     console.error(
//       "Error in membership check",
//       e
//     );

//     return 0;
//   }
// };
  
// const handleGPOUndesignate = async (memberId, designationChangeId) => {
//   try {
//     const contracts = await queryDesignatedContractsByMember(memberId);
//     console.log("Designated contracts for member", memberId, contracts);
//     const today = new Date();
//     today.setDate(today.getDate() - 1);
//     const formattedDate = today.toISOString().split("T")[0];

//     if (contracts.length > 0) {
//       console.log("Updating end date for designated contracts to", formattedDate);
//       await Promise.all(
//         contracts.map(contract =>
//           updateAccountContract(contract.Id, {
//             APTS_End_Date_c: formattedDate
//           })
//         )
//       );
//     }
// console.log("All designated contracts updated with end date", formattedDate);
//     const account = await getAccountById(memberId);
//     console.log("Account details for member", memberId, account);
//     if (account[0]?.Designated_GPO_c) {
//       console.log("Removing designated GPO from account", memberId);
//       await updateAccount(memberId, { Designated_GPO_c: null });
//     }

//     if (designationChangeId) {
//       await UpdateGPODesignateChange(designationChangeId, {
//         APTS_Status_c: "Processed"
//       });
//     }
//   } catch (err) {
//     console.error("handleGPOUndesignate error", err);
//     throw err;
//   }
// };

// const createNewMemberships = async (
//   memberId,
//   gpoId,
//   effectiveDate,
//   tier
// ) => {
// console.log("Creating new memberships for member", memberId, "GPO", gpoId, "effectiveDate", effectiveDate, "tier", tier);
//   const agreements =
//     await getActiveGPOAgreements(gpoId);
//     const existingContracts =
//   await getMembershipAgreements(memberId);

// const existingAgreementIds =
//   existingContracts.map(
//     c => c.APTS_Related_Agreement_c
//   );

// const agreementsToCreate =
//   agreements.filter(
//     agr =>
//       !existingAgreementIds.includes(
//         agr.Id
//       )
//   );

// console.log(
//   "agreementsToCreate",
//   agreementsToCreate
// );
// console.log("Active GPO agreements for GPO", gpoId, agreements);
//   if (!agreements.length) {
//     throw new Error(
//       "No active agreements found for GPO"
//     );
//   }

//  const createdMemberships = await Promise.all(
//     agreementsToCreate.map(agr =>
//       createMember({
//          Name: memberId || "New Member",
//         APTS_Member_c: memberId,

//         APTS_Related_Agreement_c: agr.Id,

//         APTS_Start_Date_c: effectiveDate,

//         APTS_End_Date_c:
//           agr.ContractEndDate,

//         APTS_Volume_Tier_c: tier,

//         APTS_Sync_to_SAP_c: "Yes",

//         APTS_Is_Record_Updated_c: true
//       })
//     )
//   );
//   console.log("Created memberships", createdMemberships);
// };
// const deactivateOldMemberships = async (
//   memberId,
//   effectiveDate
// ) => {
// console.log("Deactivating old memberships for member", memberId, "effectiveDate", effectiveDate);
//   const contracts =
//     await getMembershipAgreements(memberId);
// console.log("Contracts to deactivate", contracts);
//   if (!contracts?.length) return;

//   const endDate = new Date(effectiveDate);
//   endDate.setDate(endDate.getDate() - 1);

//   const formatted =
//     endDate.toISOString().split("T")[0];

//   const deactivatedContracts = await Promise.all(
//     contracts.map(contract =>
//       updateAccountContract(contract.Id, {
//         APTS_End_Date_c: formatted,
//         APTS_Is_Record_Updated_c: true,
//         APTS_Sync_to_SAP_c: "Yes"
//       })
//     )
//   );
//   console.log("Deactivated contracts", deactivatedContracts);
// };
// const deactivateMemberships = async (
//   memberIds,
//   effectiveDate,
//     newGpoId
// ) => {

//   for (const memberId of memberIds) {

//     const contracts =
//       await getMembershipAgreements(memberId);

//     if (!contracts?.length) continue;

//     const agreementIds =
//       contracts
//         .map(
//           c => c.APTS_Related_Agreement_c
//         )
//         .filter(Boolean);

//     const agreements =
//       await getAgreementsIds(
//         agreementIds
//       );

//     const agreementMap = {};

//     agreements.forEach(a => {
//       agreementMap[a.Id] = a;
//     });

//     const validContracts =
//       contracts.filter(c => {

//         const agr =
//           agreementMap[
//             c.APTS_Related_Agreement_c
//           ];

//         if (!agr) return false;
// const agrAccount =
//   agr.Account?.Id || agr.Account;

// return (
//   agr.Status === "Activated" &&
//   agr.StatusCategory ===
//     "In Effect" &&
//   new Date(
//     agr.ContractEndDate
//   ) > new Date() &&
//   agrAccount !== newGpoId
// );
//         // return (
//         //   agr.Status === "Activated" &&
//         //   agr.StatusCategory ===
//         //     "In Effect" &&
//         //   new Date(
//         //     agr.ContractEndDate
//         //   ) > new Date()
//         // );
//       });

//     const endDate =
//       new Date(effectiveDate);

//     endDate.setDate(
//       endDate.getDate() - 1
//     );

//     const formatted =
//       endDate
//         .toISOString()
//         .split("T")[0];

//     await Promise.all(
//       validContracts.map(contract =>
//         updateAccountContract(
//           contract.Id,
//           {
//             APTS_End_Date_c:
//               formatted,

//             APTS_Is_Record_Updated_c:
//               true,

//             APTS_Sync_to_SAP_c:
//               "Yes"
//           }
//         )
//       )
//     );
//   }
// };
// const getMembersToMove = ({
//   isCFACustomer,
//   isCFAMember,
//   selectedMemberId,
//   cfaMembers
// }) => {

//   if (isCFACustomer) {

//     return [
//       ...new Set(
//         cfaMembers.map(
//           m => m.APTS_Member_c
//         )
//       )
//     ];
//   }

//   if (isCFAMember) {

//     return [selectedMemberId];
//   }

//   return [selectedMemberId];
// };
// const determineCFARole = (
//   agreements,
//   memberId
// ) => {
// console.log("Determining CFA role for member", memberId, "with agreements", agreements);
//   let isCFACustomer = false;
//   let isCFAMember = false;

//   agreements.forEach(agr => {

//     const agrAccount =
//       agr.Account?.Id || agr.Account;

//     if (
//       agr.RecordType === "Customer_Framework"
//     ) {

//       if (agrAccount === memberId) {

//         isCFACustomer = true;

//       } else {

//         isCFAMember = true;
//       }
//     }
//   });

//   return {
//     isCFACustomer,
//     isCFAMember
//   };
// };
// const handleConfirmYes = async () => {
//   try {
//     for (let r of rows) {
//       const payload = {
//         Name: `Change Designation - ${r.memberName} to ${r.gpoName}`,
//         APTS_Member_Account_c:{Id: r.memberId,Name: r.memberName},
//         APTS_Designated_GPO_c: {Id: r.gpoId, Name: r.gpoName},
//         APTS_Start_date_c: r.effectiveDate,
//         APTS_Order_Intake_Volume_Tier_c: r.tier,
//         APTS_Un_designate_c: unDesignate,
//         APTS_Customer_MP1_Id_c: member.MP1_Customer_id_1_c,
//           APTS_Golden_Record_Key_c: member?.Golden_Record_Key_c || null,
//         APTS_Status_c: "Not Processed"
//       };

//        const result = await createGPODesignateChange(payload);
//     console.log("designation change result", result);
//  const createdId = result?.Data
//     if (unDesignate) {
//       const createdId = result?.Data

//       await handleGPOUndesignate(r.memberId, createdId);
//       toast.info("Un-Designation will be processed along with Designation.");
//     } else {
//       // =====================================
// // STEP 1 - GET MEMBER CONTRACTS
// // =====================================

// const memberContracts =
//   await getMembershipAgreements(
//     r.memberId
//   );
// if (!memberContracts || memberContracts.length === 0) {
//   throw new Error("No membership contracts found for member");
// }
// console.log(
//   "memberContracts",
//   memberContracts
// );

// // =====================================
// // STEP 2 - GET AGREEMENT IDS and the gpo of the account in gpo membership contracts
// // =====================================

// const designate = await getAccountById(r.memberId);

// console.log("account details for member", r.memberId, designate);
// const designatedIds = designate[0]?.Designated_GPO_c?.Id;
// console.log("current designated GPO for member", r.memberId, designatedIds);
// const agreementIds =
//   memberContracts
//     .map(
//       c => c.APTS_Related_Agreement_c
//     )
//     .filter(Boolean);
// console.log( "agreementIds", agreementIds);
// // =====================================
// // STEP 3 - GET AGREEMENTS
// // =====================================

// const agreements =
//   await getAgreementsByIdsDesignation(
//     agreementIds,
//    designatedIds,
//     r.memberId,
//     r.gpoId
//   );
// console.log("agreements without designated filter", agreements);


// // =====================================
// // STEP 4 - DETERMINE CFA ROLE
// // =====================================

// const {
//   isCFACustomer,
//   isCFAMember
// } = determineCFARole(
//   agreements,
//   r.memberId
// );

// console.log(
//   "isCFACustomer",
//   isCFACustomer
// );

// console.log(
//   "isCFAMember",
//   isCFAMember
// );

// // =====================================
// // STEP 5 - GET CFA MEMBERS
// // =====================================

// let cfaMembers = [];

// if (
//   isCFACustomer ||
//   isCFAMember
// ) {

//   cfaMembers =
//     await getCFAMembersByAgreementIds(
//       agreementIds
//     );

//   console.log(
//     "cfaMembers",
//     cfaMembers
//   );
// }

// // =====================================
// // STEP 6 - GET MEMBERS TO MOVE
// // =====================================

// const membersToMove =
//   getMembersToMove({

//     isCFACustomer,

//     isCFAMember,

//     selectedMemberId:
//       r.memberId,

//     cfaMembers
//   });

// console.log(
//   "membersToMove",
//   membersToMove
// );

// // =====================================
// // STEP 7 - DEACTIVATE OLD MEMBERSHIPS
// // =====================================

// const deactivatedMemberships = await deactivateMemberships(
//   membersToMove,
//   r.effectiveDate,
//   r.gpoId
// );
// console.log("Old memberships deactivated for members", deactivatedMemberships);
// // =====================================
// // STEP 8 - CREATE NEW MEMBERSHIPS
// // =====================================

// for (const memberId of membersToMove) {

//  const createdMembership = await createNewMemberships(
//     memberId,
//     r.gpoId,
//     r.effectiveDate,
//     r.tier
//   );
//   console.log("New memberships created for member", memberId, createdMembership);
// }

// // =====================================
// // STEP 9 - UPDATE ACCOUNT GPO
// // =====================================

// for (const memberId of membersToMove) {

//   const updatedAccount = await updateAccount(
//     memberId,
//     {
//       Designated_GPO_c: {
//         Id: r.gpoId,
//         Name: r.gpoName
//       }
//     }
//   );
//   console.log("Account updated with new designated GPO for member", memberId, updatedAccount);
// }

// // =====================================
// // STEP 10 - MARK PROCESSED
// // =====================================

// const updatedDesignation = await UpdateGPODesignateChange(
//   createdId,
//   {
//     APTS_Status_c: "Processed"
//   }
// );
// console.log("Designation change updated", updatedDesignation);
//     }
   

//     toast.success("GPO Designation Change Created!");

//     }

//     //  Clear everything
//     clearForm();

//     // close modal
//     setShowConfirm(false);

//   } catch (e) {
//     console.error(e);
//     toast.error("Failed to create designation");
//   }
// };
// const handleRetry = async () => {
//   try {
//     const today = new Date().toISOString().split("T")[0];

//     for (let rec of retryRecords) {
//       let updatedDate = rec.APTS_Start_date_c;

//       // Fix past date
//       if (updatedDate && updatedDate < today) {
//         updatedDate = today;
//       }else{
//         updatedDate = rec.APTS_Start_date_c;
//       }

//       const payload = {
//         APTS_Start_date_c: updatedDate,
//         APTS_Status_c: "Not Processed",
//         APTS_Error_Message_c: null
//       };

//       await UpdateGPODesignateChange(rec.Id, payload);
//     }

//     toast.success("Records are submitted");

//     // Refresh state
//     setRetryRecords([]);
//     setShowRetry(false);

//   } catch (e) {
//     console.error(e);
//     toast.error("Retry failed");
//   }
// };

// const handleDesignationValidation = async () => {

//   try {
//      if (unDesignate) {

//     console.log(
//       "UnDesignate checked - skipping validations"
//     );

//     handleAddRow();

//     return;
//   }

//     // MEMBER VALIDATION
//     if (!member || !selectedGPO) {
//       toast.error("Please Select the GPO Account");
//       return;
//     }

//     // DATE VALIDATION
//     if (effectiveDate < today) {
//       toast.error("Please Select the future date from Date picker to proceed further.");
//       return;
//     }

//     // SAP VALIDATION
//     const count = await checkMembershipAgreements(
//       member.Id,
//       selectedGPO.Id
//     );
// console.log("Valid agreement count for validation", count);
//     if (count > 0) {
//       toast.error(
//         "Member SAP status In Progress. Please try after sometime"
//       );
//       return;
//     }

//     // DUPLICATE VALIDATION
//     const duplicateRecords =
//       await fetchRecords(member.Id);
// console.log("duplicateRecords", duplicateRecords);
//     if (duplicateRecords.length > 0) {
//       toast.error(
//         "Duplicate record is identified of member designate change."
//       );
//       return;
//     }

//     // SAME GPO VALIDATION
//     if (
//       currentDesignated &&
//       currentDesignated === selectedGPO.Id
//     ) {
//       toast.error(
//         "Member is already designated to the same GPO. Please create a new membership record for the same designated GPO."
//       );
//       return;
//     }

//     // CFA VALIDATION
// // CFA VALIDATION
// const memberContracts = await getMembershipAgreements(member.Id);

// console.log("memberContracts", memberContracts);
// console.log("member.Id", member.Id);
// const accountIds = memberContracts
//   .map(c => c.APTS_Member_c)
//   .filter(Boolean);
//  console.log("accountIds from contracts", accountIds);
//   const designate = await getAccountsByIds(accountIds);

//      const designatedIds = [];

//     designate.forEach(c => {

//       const designated = c?.Designated_GPO_c?.Id || c?.Designated_GPO_c;
// console.log("accountIds from contracts designated for contract", c.Id, designated);
//       if (designated) {
//         designatedIds.push(designated);
//       }
//     });
//     console.log("designatedIds", designatedIds); 
// if (memberContracts && memberContracts.length > 0) {

//   let misccount = 0;
//   let mismcount = 0;

//   const cfagrlist = [];


//   const agreementIds = memberContracts
//     .map(rec => rec.APTS_Related_Agreement_c)
//     .filter(Boolean);



//   const agreements = await getAgreementDetailsByIds(
//     agreementIds,designatedIds,member.Id
//   );

//   console.log("agreements", agreements);

//   const agreementMap = {};

//   agreements.forEach(agr => {
//     agreementMap[agr.Id] = agr;
//   });



//   for (let rec of memberContracts) {

//     const agr =
//       agreementMap[rec.APTS_Related_Agreement_c];

//     if (!agr) continue;


//     const agrAccount =
//       agr.Account?.Id || agr.Account;
// console.log("agrAccount", agrAccount, "designatedIds", designatedIds);

//     const memberAccountId =rec.APTS_Member_c;

// if (
//   memberAccountId === member.Id &&
//   agrAccount === member.Id
// ){

//       misccount++;
//       console.log("misccount", misccount);

//     } else {

//       mismcount++;
//       console.log("mismcount", mismcount);
//     }

//     cfagrlist.push({
//       Name: agr.Name,
//       AgmntId: agr.Id
//     });
//   }

//   console.log("misccount", misccount);
//   console.log("mismcount", mismcount);

//   if (cfagrlist.length > 0) {

//     setCustFrameagrList(cfagrlist);

//     if (misccount > 0) {

//       setCfMsg(
//         "Member is the customer of a CFA - a participant of a local agreement (LSP,MST,CAA,PSP). Do you want to proceed with Designation?"
//       );

//     } else if (mismcount > 0) {

//       setCfMsg(
//         "Member is a member of a CFA - a participant of a local agreement (LSP,MST,CAA,PSP). Do you want to proceed with Designation?"
//       );
//     }

//     setOpenModalCus(true);

//     return;
//   }
// }

// // FINAL
// handleAddRow();

//   } catch (e) {
//     console.error(e);
//     toast.error("Validation failed");
//   }
// };

//   return (
//     <div className="page-container">
      
//       {/* HEADER */}
//       <div className="header" style={{justifyContent:"center"}}>Designation Page</div>
 
//       {/* FILTER SECTION */}

//       <div className="filter-container">
//         {showRetry && (
//   <div style={{ marginBottom: "10px" }}>
//     <span style={{ fontWeight: "bold" }}>
//       Retry Failed Designation:
//     </span>

//     <button
//       className="btn-primary"
//       style={{ marginLeft: "10px" }}
//       onClick={handleRetry}
//     >
//       Retry
//     </button>
//   </div>
// )}
//   <div className="filter-group">
//     <label>Filter By Market</label>
//     <select>
//       <option>North America</option>
//     </select>
//   </div>
 
//   <div className="filter-group">
//     <label>Filter By Sales Area</label>
//     <select>
//       <option>United States</option>
//     </select>
//   </div>
 
//   <div className="filter-group">
//     <label>Select Member</label>
//     <MemberSearch
//   value={member}
//   onChange={(rec) => {
//     setMember(rec);
//     console.log("selected member", rec);
//     console.log("member", member);
//   }}
//   type="MEMBER"
// />
   
//   </div>
// </div>
 
//       {/* CONDITIONAL DESIGNATION HEADER */}
//       {showDesignationHeader && (
//         <>
//         <div className="designation" >
//      Designation Form Header
//         </div>
//         <div className="designation-header">
//           <table className="designation-table">
//             <th>Existing Membership </th>
//             <th>Effective Date</th>
//             <th>Order Intake Volume Tier</th>
//             <th>Add New GPO Membership</th>
//             <tbody>
//               <tr>
//                 <td>The list below shows all existing Membership records. The selected one is the currently designated one. If none of them are selected, then the member is not designated to any GPO.
//                   {options.length > 0 && (
//   <div>
   
//     {options.map(opt => (
//       <label key={opt.value}>
//         <input
//   type="radio"
//   name="designation"
//   value={opt.value}
//   checked={designated === opt.value}   
//   onChange={(e) => {
//   const val = e.target.value;
//   setDesignated(val);

//   const selected = options.find(o => o.value === val);

//   // LWC logic equivalent
//   if (selected?.label.includes("(Designated)")) {
//     setShowCheckBox(true);
//   } else {
//     setShowCheckBox(false);
//     setUnDesignate(false); // reset checkbox
//   }
// }}
//   // onChange={(e) => {
//   //   const val = e.target.value;
//   //   setDesignated(val);

//   //   const selected = options.find(o => o.value === val);

//   //   if (selected?.isDesignated) {
//   //     setShowCheckBox(true);
//   //   } else {
//   //     setShowCheckBox(false);
//   //     setUnDesignate(false); // reset checkbox
//   //   }
//   // }}
// />
//         {/* <input
//           type="radio"
//           name="designation"
//           value={opt.value}
//           onChange={(e) => {
//             const val = e.target.value;
//             setDesignated(val);

//             const selected = options.find(o => o.value === val);

//             if (selected.label.includes("Designated")) {
//               setShowCheckBox(true);
//             } else {
//               setShowCheckBox(false);
//             }
//           }}
//         /> */}
//         {opt.label}
//       </label>
//     ))}
//   </div>
// )}
// {showCheckBox && (
//   <div style={{ marginTop: "10px" }}>
//     <label>
//       <input
//         type="checkbox"
//         checked={unDesignate}
//         onChange={(e) => setUnDesignate(e.target.checked)}
//       />
//       {" "}Un-Designate
//     </label>
//   </div>
// )}
//                 </td>
//                 <td><input
//                 type="date"
//                 value={effectiveDate}
//                 onChange={(e) => setEffectiveDate(e.target.value)}
//               /></td>
//               <td>
//               <select value={tier} onChange={(e) => setTier(e.target.value)} className="select">
//                 <option>Tier 1</option>
//                 <option>Tier 2</option>
//               </select>
//               </td>
//               <td>
// You can create new membership records and designate the member to the select GPO.
// <div className="filter-group">
//   <label>Select GPO</label>
  
//   <MemberSearch
//   value={selectedGPO}
//   onChange={setSelectedGPO}
//   type="GPO"
// />
// </div>
// </td>
//               </tr>
//             </tbody>
//           </table>
//           <div className="button-container">
//           {/* <button
//   className="btn-primary"
//   onClick={async () => {
//     if (!member || !selectedGPO) {
//       toast.error("Select Member and GPO");
//       return;
//     }

//     if (effectiveDate < today) {
//       toast.error("Please select future date");
//       return;
//     }
// console.log("memberId", member.Id);
// console.log("selectedGPOId", selectedGPO.Id);
//     const count = await checkMembershipAgreements(
//       member.Id,
//       selectedGPO.Id
//     );
// console.log("valid agreement count", count);
//     if (count > 0) {
//       console.log("Existing valid agreements found:", count);
//       toast.error(
//         "Member SAP status In Progress. Please try after sometime"
//       );
//       return;
//     }

//     //  Only after validation
//     handleAddRow();
//   }}
// > */}
// <button
//   className="btn-primary"
//   onClick={handleDesignationValidation}
// >
//   Submit Designated Change Request
// </button></div>
           
//         </div>
//         </>
//       )}
//  {showConfirm && (
//   <div className="modal-overlay">
//     <div className="modal-box">
//       <h3>Confirmation</h3>
//       <p>Are you sure that you want to add/change the GPO Designation?</p>

//       <div className="modal-actions">
//         <button
//           className="btn-primary"
//           onClick={handleConfirmYes}
//         >
//           Yes
//         </button>

//         <button
//           className="btn-secondary"
//           onClick={() => setShowConfirm(false)}
//         >
//           No
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// {openModalCus && (
//   <div className="modal-overlay">
//     <div className="modal-box">

//       <h3>Confirmation</h3>

//       <p>{cfMsg}</p>

//       <div className="modal-actions">

//         <button
//           className="btn-primary"
//           onClick={() => {

//             setOpenModalCus(false);

//             handleAddRow();
//           }}
//         >
//           Yes
//         </button>

//         <button
//           className="btn-secondary"
//           onClick={() => {
//             setOpenModalCus(false);
//           }}
//         >
//           No
//         </button>

//       </div>
//     </div>
//   </div>
// )}
//       {/* TABLE SECTION */}
//       { showDesignationHeader &&
//       <>
//       <div className="table-section">
//         <h4>Designated Form Request</h4>
 
//         <table>
//           <thead>
//             <tr>
//               <th>Member Account</th>
//               <th>Designated GPO</th>
//               <th>Effective Date</th>
//               <th>Order Intake Volume Tier</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
 
        
//           <tbody>
//   {rows.length === 0 ? (
//     <tr>
//       <td colSpan="5" style={{ textAlign: "center" }}>
//         No Data
//       </td>
//     </tr>
//   ) : (
//     rows.map((r) => (
//       <tr key={r.id}>
//         <td>{r.memberName}</td>
//         <td>{r.gpoName}</td>
//         <td>{r.effectiveDate}</td>
//         <td>{r.tier}</td>
//         <td>
//           <button onClick={() =>
//             setRows(rows.filter((x) => x.id !== r.id))
//           }>
//             ❌
//           </button>
//         </td>
//       </tr>
//     ))
//   )}
// </tbody>
//         </table>
//       </div>
 
//       {/* FOOTER ACTIONS */}
//       <div className="footer">
      
 
//         <div style={{ margin: "10px" }}>
         
//           <button
// className="btn-primary"
// disabled={rows.length === 0}
//   onClick={() => setShowConfirm(true)}
// >
//   Designate
// </button>
       
// <button
//  className="btn-primary"
//   onClick={clearForm}
//   style={{ margin: "10px" }}
// >
//   Clear Form
// </button>

//         </div>
//       </div>
//       </>
//   }
//     </div>
//   );
// }
'use client';

import React, { useState,useEffect } from "react";
import { toast } from "react-toastify";

import "../CSS/Designation.css"
import MemberSearch from "../components/MemberSearch";
import { getAccountsByIds,getAgreementsByIds,getAgreementsIds,getMembershipAgreements ,createGPODesignateChange,getRetryRecords, UpdateGPODesignateChange,getUserIdFromToken,fetchRecords,getAgreementDetailsByIds,getAccountById,queryDesignatedContractsByMember,updateAccountContract,updateAccount, createMember,getActiveGPOAgreements, getCFAMembersByAgreementIds,getAgreementsByIdsDesignation} from "../api/member"; 
import { queryGetAgreementDetails } from "../api/queryAgreementLineItemsByAgreement"; 

export default function Designation() {

const agreementId = sessionStorage.getItem("agreementId");
  const [member, setMember] = useState(null);

 const [selectedGPO, setSelectedGPO] = useState(null);
 const showDesignationHeader = !!member?.Id;

 const [rows, setRows] = useState([]);

  const today = new Date().toISOString().split("T")[0];
const [effectiveDate, setEffectiveDate] = useState(today);
  const [tier, setTier] = useState("Tier 1");
   const [Acc,setAcc] = useState(null);
  const [options, setOptions] = useState([]);
const [designated, setDesignated] = useState(null);
const [showCheckBox, setShowCheckBox] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
const [retryRecords, setRetryRecords] = useState([]);
const [showRetry, setShowRetry] = useState(false);
const [currentDesignated, setCurrentDesignated] = useState(null);
const [unDesignate, setUnDesignate] = useState(false);
const [cfMsg, setCfMsg] = useState("");
const [openModalCus, setOpenModalCus] = useState(false);
const [custFrameagrList, setCustFrameagrList] = useState([]);
const [isProcessing, setIsProcessing] = useState(false);
const [progress, setProgress] = useState(0);
const [progressText, setProgressText] = useState("");

const clearForm = () => {
  setRows([]);
  setMember(null);
  setSelectedGPO(null);
  setEffectiveDate(today);
  setTier("Tier 1");
  setOptions([]);
  setDesignated(null);
  setShowCheckBox(false);
};
useEffect(() => {
  loadRetryRecords();
  
}, []);

const loadRetryRecords = async () => {
  try {
    const UserId = await getUserIdFromToken();
    console.log("UserId for retry", UserId);
    const data = await getRetryRecords(UserId);
console.log("retry data", data);
    if (data.length > 0) {
      setRetryRecords(data);
      setShowRetry(true);
    } else {
      setShowRetry(false);
    }
  } catch (e) {
    console.error(e);
  }
};
useEffect(() => {
 //  loadData();
   (async () => {
    try {
      const trying = await queryGetAgreementDetails(agreementId);
      console.log(trying);
      setAcc(trying);
    } catch (err) {
      console.error(err);
    }
  })();
   console.log("account",Acc);
   if (Acc && Acc.length > 0) {
    const accRecord = Acc[0]?.Account;

    if (accRecord) {
      setSelectedGPO({
        Id: accRecord.Id,
        Name: accRecord.Name
      });
    }
  }
  if (!member?.Name) return;

//   const load = async () => {
//     const data = await getAccounts({
//       filters: {
//         Market_c: "North America",
//         Country_c: "United States",
//         Inactive_Flag_c: false,
//         Golden_Record_Key_c: { notNull: true },
//         Name: member.Name // EXACT MATCH
//       }
//     });
// console.log("dataoption",data);
// const mapped = data.map(rec => {
//   const isDesignated = !!rec.Designated_GPO_c;

//   if (isDesignated) {
//     setCurrentDesignated(rec.Id); // store designated
//     setShowCheckBox(true);        // show checkbox initially
//   }

//   return {
//     label: `${rec.Designated_GPO_c?.Name || "No GPO"} ${
//       isDesignated ? "(Designated)" : ""
//     }`,
//     value: rec.Id,
//     isDesignated
//   };
// });

// setOptions(mapped);
// const designatedOption = mapped.find(o => o.isDesignated);

// if (designatedOption) {
//   setDesignated(designatedOption.value); 
// }
   
//  console.log("hdshe",mapped);
//     setOptions(mapped);
//      console.log("hdshe",options);
//   };

const load = async () => {
  // STEP 1: Contracts
  const contracts = await getMembershipAgreements(member.Id);

  const agreementIds = contracts
    .map(c => c.APTS_Related_Agreement_c)
    .filter(Boolean);

  if (!agreementIds.length) {
    setOptions([]);
    return;
  }

  // STEP 2: Agreements
  const agreements = await getAgreementsIds(agreementIds);
console.log("agreements", agreements);
  const accountIds = [
    ...new Set(agreements.map(a => a.Account?.Id))
  ];
console.log("accountIds", accountIds);
  // STEP 3: Accounts
  const accounts = await getAccountsByIds(accountIds);

  // STEP 4: Map to radio options
  // const mapped = accounts.map(acc => {
  //   return {
  //     label: acc.Name,
  //     value: acc.Id,
  //     isDesignated: acc.Id === member.Designated_GPO__c // adjust if needed
  //   };
  // });
const mapped = accounts.map(acc => {
  console.log("mapping account", acc.Id, member.Id);
  console.log("current designated", member.Designated_GPO_c);
 // const isDesignated = acc.Id === member.Id;
 const designatedId =
  member.Designated_GPO_c?.Id ||
  member.Designated_GPO_c;

const isDesignated = acc.Id === designatedId;
//  const isDesignated = acc.Id === member.Designated_GPO_c.Id;
  return {
    label: isDesignated
      ? `${acc.Name} (Designated)`
      : acc.Name,
    value: acc.Id,
    isDesignated
  };
});

    setOptions(mapped);
    setShowCheckBox(false);
    setUnDesignate(false);

    const designatedOption = mapped.find(o => o.isDesignated);
    if (designatedOption) {
      console.log("Found designated option", designatedOption);
      setDesignated(designatedOption.value);
      setCurrentDesignated(designatedOption.value);
      setShowCheckBox(true);
      setUnDesignate(true);
    }
  };

  load();
}, [member],[Acc, agreementId]);
   const loadData = async () => {
      try {       
const trying = await queryGetAgreementDetails(agreementId);
  console.log(trying);
  setAcc(trying);


      } catch (err) {
        console.error(err);
      } 
    };
 const handleAddRow = () => {
  if (!member || !selectedGPO) {
    alert("Select Member and GPO");
    return;
  }

  const newRow = {
    id: Date.now(),
    memberName: member.Name,
    memberId: member.Id,
    gpoName: selectedGPO.Name,
    gpoId: selectedGPO.Id,
    effectiveDate,
    tier
  };

  setRows((prev) => [...prev, newRow]);
};


// const checkMembershipAgreements = async (memberId, newGpoId) => {
//   try {
//     const contracts = await getMembershipAgreements(memberId);
// console.log("contracts", contracts);
//     if (!contracts || contracts.length === 0) return 0;

//     let allAgreements = [];

//     //  Step 1: Fetch ALL agreements
//     for (let contract of contracts) {
//       if (contract.APTS_Related_Agreement_c) {
//         const agr = await getAgreementById(
//           contract.APTS_Related_Agreement_c
//         );
// console.log("agr for contract", contract.Id, agr);
//         if (agr && agr.length > 0) {
//           allAgreements.push(...agr);
//         }
//       }
//     }

//     const todayDate = new Date();

//     //  Step 2: Apply EXACT same conditions as LWC/Apex
//     const validAgreements = allAgreements.filter((agr) => {
//       return (
//         console.log("Checking agreement", agr.Id, ),
//         agr.ContractEndDate &&
//         new Date(agr.ContractEndDate) > todayDate &&

//         agr.APTS_Member_SAP_Status_c === "In Progress" &&

//         //  IMPORTANT: handle both cases (Id or direct value)
//         (agr.Account === newGpoId || agr.Account?.Id === newGpoId) &&

//         agr.Status === "Activated" &&
//         agr.StatusCategory === "In Effect"
//       );
//     });

//     console.log("Valid agreements after filter:", validAgreements);

//     return validAgreements.length;

//   } catch (e) {
//     console.error("Error in membership check", e);
//     return 0;
//   }
// };

const checkMembershipAgreements = async (
  memberId,
  newGpoId
) => {

  try {

    /*
      STEP 1:
      Get contracts
    */

    const contracts =
      await getMembershipAgreements(memberId);

    console.log("contracts", contracts);

   if (!contracts || contracts.length === 0) {
      return 0;
    }


    const AccountIds = [];

    contracts.forEach(c => {

      // const Account =
      //   c?.APTS_Member_c?.Designated_GPO_c ||
      //   c?.APTS_Member_c?.Designated_GPO_c?.Id;

      const Account = c?.APTS_Member_c
console.log("Account for contract", c.Id, Account);
      if (Account) {
        AccountIds.push(Account);
      }
    });
    console.log("AccountIds", AccountIds);
 const designate = await getAccountsByIds(AccountIds);

     const designatedIds = [];

    designate.forEach(c => {

      // const designated =
      //   c?.APTS_Member_c?.Designated_GPO_c ||
      //   c?.APTS_Member_c?.Designated_GPO_c?.Id;

      const designated = c?.Designated_GPO_c?.Id || c?.Designated_GPO_c;
console.log("designated for contract", c.Id, designated);
      if (designated) {
        designatedIds.push(designated);
      }
    });
    console.log("designatedIds", designatedIds);
    


    const agreementIds = contracts
      .map(c => c.APTS_Related_Agreement_c)
      .filter(Boolean);

    if (!agreementIds.length) {
      return 0;
    }


    const agreements =
      await getAgreementsByIds(agreementIds);

    console.log("agreements", agreements);

    const todayDate = new Date();

    const validAgreements =
      agreements.filter(agr => {

        const agrAccount =
          agr.Account?.Id || agr.Account;

        return (

          agr.ContractEndDate &&
          new Date(agr.ContractEndDate) > todayDate &&

          agr.APTS_Agreement_SAP_Status_c ===
            "In Progress" &&

          (
            agrAccount === newGpoId ||
            designatedIds.includes(agrAccount)
          ) 
        );
      });

    console.log(
      "validAgreements",
      validAgreements
    );

    return validAgreements.length;

  } catch (e) {

    console.error(
      "Error in membership check",
      e
    );

    return 0;
  }
};
  
const handleGPOUndesignate = async (memberId, designationChangeId) => {
  try {
    const contracts = await queryDesignatedContractsByMember(memberId);
    console.log("Designated contracts for member", memberId, contracts);
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const formattedDate = today.toISOString().split("T")[0];

    if (contracts.length > 0) {
      console.log("Updating end date for designated contracts to", formattedDate);
      await Promise.all(
        contracts.map(contract =>
          updateAccountContract(contract.Id, {
            APTS_End_Date_c: formattedDate
          })
        )
      );
    }
console.log("All designated contracts updated with end date", formattedDate);
    const account = await getAccountById(memberId);
    console.log("Account details for member", memberId, account);
    if (account[0]?.Designated_GPO_c) {
      console.log("Removing designated GPO from account", memberId);
      await updateAccount(memberId, { Designated_GPO_c: null });
    }

    if (designationChangeId) {
      await UpdateGPODesignateChange(designationChangeId, {
        APTS_Status_c: "Processed"
      });
    }
  } catch (err) {
    console.error("handleGPOUndesignate error", err);
    throw err;
  }
};

const createNewMemberships = async (
  memberId,
  gpoId,
  effectiveDate,
  tier
) => {
console.log("Creating new memberships for member", memberId, "GPO", gpoId, "effectiveDate", effectiveDate, "tier", tier);
  const agreements =
    await getActiveGPOAgreements(gpoId);
    const existingContracts =
  await getMembershipAgreements(memberId);

const existingAgreementIds =
  existingContracts.map(
    c => c.APTS_Related_Agreement_c
  );

const agreementsToCreate =
  agreements.filter(
    agr =>
      !existingAgreementIds.includes(
        agr.Id
      )
  );

console.log(
  "agreementsToCreate",
  agreementsToCreate
);
console.log("Active GPO agreements for GPO", gpoId, agreements);
  if (!agreements.length) {
    throw new Error(
      "No active agreements found for GPO"
    );
  }

 const createdMemberships = await Promise.all(
    agreementsToCreate.map(agr =>
      createMember({
         Name: memberId || "New Member",
        APTS_Member_c: memberId,

        APTS_Related_Agreement_c: agr.Id,

        APTS_Start_Date_c: effectiveDate,

        APTS_End_Date_c:
          agr.ContractEndDate,

        APTS_Volume_Tier_c: tier,

        APTS_Sync_to_SAP_c: "Yes",

        APTS_Is_Record_Updated_c: true
      })
    )
  );
  console.log("Created memberships", createdMemberships);
};
const deactivateOldMemberships = async (
  memberId,
  effectiveDate
) => {
console.log("Deactivating old memberships for member", memberId, "effectiveDate", effectiveDate);
  const contracts =
    await getMembershipAgreements(memberId);
console.log("Contracts to deactivate", contracts);
  if (!contracts?.length) return;

  const endDate = new Date(effectiveDate);
  endDate.setDate(endDate.getDate() - 1);

  const formatted =
    endDate.toISOString().split("T")[0];

  const deactivatedContracts = await Promise.all(
    contracts.map(contract =>
      updateAccountContract(contract.Id, {
        APTS_End_Date_c: formatted,
        APTS_Is_Record_Updated_c: true,
        APTS_Sync_to_SAP_c: "Yes"
      })
    )
  );
  console.log("Deactivated contracts", deactivatedContracts);
};
const deactivateMemberships = async (
  memberIds,
  effectiveDate,
    newGpoId
) => {

  for (const memberId of memberIds) {

    const contracts =
      await getMembershipAgreements(memberId);

    if (!contracts?.length) continue;

    const agreementIds =
      contracts
        .map(
          c => c.APTS_Related_Agreement_c
        )
        .filter(Boolean);

    const agreements =
      await getAgreementsIds(
        agreementIds
      );

    const agreementMap = {};

    agreements.forEach(a => {
      agreementMap[a.Id] = a;
    });

    const validContracts =
      contracts.filter(c => {

        const agr =
          agreementMap[
            c.APTS_Related_Agreement_c
          ];

        if (!agr) return false;
const agrAccount =
  agr.Account?.Id || agr.Account;

return (
  agr.Status === "Activated" &&
  agr.StatusCategory ===
    "In Effect" &&
  new Date(
    agr.ContractEndDate
  ) > new Date() &&
  agrAccount !== newGpoId
);
        // return (
        //   agr.Status === "Activated" &&
        //   agr.StatusCategory ===
        //     "In Effect" &&
        //   new Date(
        //     agr.ContractEndDate
        //   ) > new Date()
        // );
      });

    const endDate =
      new Date(effectiveDate);

    endDate.setDate(
      endDate.getDate() - 1
    );

    const formatted =
      endDate
        .toISOString()
        .split("T")[0];

    await Promise.all(
      validContracts.map(contract =>
        updateAccountContract(
          contract.Id,
          {
            APTS_End_Date_c:
              formatted,

            APTS_Is_Record_Updated_c:
              true,

            APTS_Sync_to_SAP_c:
              "Yes"
          }
        )
      )
    );
  }
};
const getMembersToMove = ({
  isCFACustomer,
  isCFAMember,
  selectedMemberId,
  cfaMembers
}) => {

  if (isCFACustomer) {

    return [
      ...new Set(
        cfaMembers.map(
          m => m.APTS_Member_c
        )
      )
    ];
  }

  if (isCFAMember) {

    return [selectedMemberId];
  }

  return [selectedMemberId];
};
const determineCFARole = (
  agreements,
  memberId
) => {
console.log("Determining CFA role for member", memberId, "with agreements", agreements);
  let isCFACustomer = false;
  let isCFAMember = false;

  agreements.forEach(agr => {

    const agrAccount =
      agr.Account?.Id || agr.Account;

    if (
      agr.RecordType === "Customer_Framework"
    ) {

      if (agrAccount === memberId) {

        isCFACustomer = true;

      } else {

        isCFAMember = true;
      }
    }
  });

  return {
    isCFACustomer,
    isCFAMember
  };
};
const resetProgressState = () => {
  setIsProcessing(false);
  setProgress(0);
  setProgressText("");
};
const updateProgress = (value, text) => {
  setProgress(value);
  setProgressText(text);

  if (value >= 100) {
    setTimeout(() => {
      resetProgressState();
    }, 600);
  }
};
const handleConfirmYes = async () => {
  try {
     setIsProcessing(true);

    updateProgress(
      0,
      "Starting Designation Process..."
    );
    for (let r of rows) {
      const payload = {
        Name: `Change Designation - ${r.memberName} to ${r.gpoName}`,
        APTS_Member_Account_c:{Id: r.memberId,Name: r.memberName},
        APTS_Designated_GPO_c: {Id: r.gpoId, Name: r.gpoName},
        APTS_Start_date_c: r.effectiveDate,
        APTS_Order_Intake_Volume_Tier_c: r.tier,
        APTS_Un_designate_c: unDesignate,
        APTS_Customer_MP1_Id_c: member.MP1_Customer_id_1_c,
          APTS_Golden_Record_Key_c: member?.Golden_Record_Key_c || null,
        APTS_Status_c: "Not Processed"
      };

       const result = await createGPODesignateChange(payload);
        updateProgress(
  10,
  "Creating Designation Change Record..."
);
    console.log("designation change result", result);
 const createdId = result?.Data
    if (unDesignate) {
      const createdId = result?.Data

      await handleGPOUndesignate(r.memberId, createdId);
            updateProgress(
  50,
  "Processing Un-Designation..."
);
      toast.info("Un-Designation will be processed along with Designation.");
  updateProgress(
  100,
  "Completed"
);
    } else {
      // =====================================
// STEP 1 - GET MEMBER CONTRACTS
// =====================================
updateProgress(
  20,
  "Fetching Member Contracts..."
);
const memberContracts =
  await getMembershipAgreements(
    r.memberId
  );
if (!memberContracts || memberContracts.length === 0) {
  throw new Error("No membership contracts found for member");
}
console.log(
  "memberContracts",
  memberContracts
);

// =====================================
// STEP 2 - GET AGREEMENT IDS and the gpo of the account in gpo membership contracts
// =====================================

const designate = await getAccountById(r.memberId);

console.log("account details for member", r.memberId, designate);
const designatedIds = designate[0]?.Designated_GPO_c?.Id;
console.log("current designated GPO for member", r.memberId, designatedIds);
const agreementIds =
  memberContracts
    .map(
      c => c.APTS_Related_Agreement_c
    )
    .filter(Boolean);
console.log( "agreementIds", agreementIds);
// =====================================
// STEP 3 - GET AGREEMENTS
// =====================================
updateProgress(
  30,
  "Fetching Agreements..."
);
const agreements =
  await getAgreementsByIdsDesignation(
    agreementIds,
   designatedIds,
    r.memberId,
    r.gpoId
  );
console.log("agreements without designated filter", agreements);


// =====================================
// STEP 4 - DETERMINE CFA ROLE
// =====================================
updateProgress(
  40,
  "Determining CFA Relationships..."
);
const {
  isCFACustomer,
  isCFAMember
} = determineCFARole(
  agreements,
  r.memberId
);

console.log(
  "isCFACustomer",
  isCFACustomer
);

console.log(
  "isCFAMember",
  isCFAMember
);

// =====================================
// STEP 5 - GET CFA MEMBERS
// =====================================
updateProgress(
  50,
  "Fetching CFA Members..."
);
let cfaMembers = [];

if (
  isCFACustomer ||
  isCFAMember
) {

  cfaMembers =
    await getCFAMembersByAgreementIds(
      agreementIds
    );

  console.log(
    "cfaMembers",
    cfaMembers
  );
}

// =====================================
// STEP 6 - GET MEMBERS TO MOVE
// =====================================

const membersToMove =
  getMembersToMove({

    isCFACustomer,

    isCFAMember,

    selectedMemberId:
      r.memberId,

    cfaMembers
  });

console.log(
  "membersToMove",
  membersToMove
);

// =====================================
// STEP 7 - DEACTIVATE OLD MEMBERSHIPS
// =====================================
updateProgress(
  65,
  "Deactivating Existing Memberships..."
);
const deactivatedMemberships = await deactivateMemberships(
  membersToMove,
  r.effectiveDate,
  r.gpoId
);
console.log("Old memberships deactivated for members", deactivatedMemberships);
// =====================================
// STEP 8 - CREATE NEW MEMBERSHIPS
// =====================================
updateProgress(
  80,
  "Creating New Memberships..."
);
for (const memberId of membersToMove) {

 const createdMembership = await createNewMemberships(
    memberId,
    r.gpoId,
    r.effectiveDate,
    r.tier
  );
  console.log("New memberships created for member", memberId, createdMembership);
}

// =====================================
// STEP 9 - UPDATE ACCOUNT GPO
// =====================================
updateProgress(
  90,
  "Updating Member Accounts..."
);
for (const memberId of membersToMove) {

  const updatedAccount = await updateAccount(
    memberId,
    {
      Designated_GPO_c: {
        Id: r.gpoId,
        Name: r.gpoName
      }
    }
  );
  console.log("Account updated with new designated GPO for member", memberId, updatedAccount);
}

// =====================================
// STEP 10 - MARK PROCESSED
// =====================================
updateProgress(
  95,
  "Marking Request as Processed..."
);
const updatedDesignation = await UpdateGPODesignateChange(
  createdId,
  {
    APTS_Status_c: "Processed"
  }
);
updateProgress(
  100,
  "Designation Process Completed"
);
console.log("Designation change updated", updatedDesignation);
    }
   

    toast.success("GPO Designation Change Created!");

    }

    //  Clear everything
    clearForm();

    // close modal
    setShowConfirm(false);

  } catch (e) {
    console.error(e);
    toast.error("Failed to create designation");
    resetProgressState();
  }
};
const handleRetry = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    for (let rec of retryRecords) {
      let updatedDate = rec.APTS_Start_date_c;

      // Fix past date
      if (updatedDate && updatedDate < today) {
        updatedDate = today;
      }else{
        updatedDate = rec.APTS_Start_date_c;
      }

      const payload = {
        APTS_Start_date_c: updatedDate,
        APTS_Status_c: "Not Processed",
        APTS_Error_Message_c: null
      };

      await UpdateGPODesignateChange(rec.Id, payload);
    }

    toast.success("Records are submitted");

    // Refresh state
    setRetryRecords([]);
    setShowRetry(false);

  } catch (e) {
    console.error(e);
    toast.error("Retry failed");
  }finally {
    setTimeout(() => {
      resetProgressState();
    }, 1000);
}
};

const handleDesignationValidation = async () => {

  try {
     if (unDesignate) {

    console.log(
      "UnDesignate checked - skipping validations"
    );

    handleAddRow();

    return;
  }

    // MEMBER VALIDATION
    if (!member || !selectedGPO) {
      toast.error("Please Select the GPO Account");
      return;
    }

    // DATE VALIDATION
    if (effectiveDate < today) {
      toast.error("Please Select the future date from Date picker to proceed further.");
      return;
    }

    // SAP VALIDATION
    const count = await checkMembershipAgreements(
      member.Id,
      selectedGPO.Id
    );
console.log("Valid agreement count for validation", count);
    if (count > 0) {
      toast.error(
        "Member SAP status In Progress. Please try after sometime"
      );
      return;
    }

    // DUPLICATE VALIDATION
    const duplicateRecords =
      await fetchRecords(member.Id);
console.log("duplicateRecords", duplicateRecords);
    if (duplicateRecords.length > 0) {
      toast.error(
        "Duplicate record is identified of member designate change."
      );
      return;
    }

    // SAME GPO VALIDATION
    if (
      currentDesignated &&
      currentDesignated === selectedGPO.Id
    ) {
      toast.error(
        "Member is already designated to the same GPO. Please create a new membership record for the same designated GPO."
      );
      return;
    }

    // CFA VALIDATION
// CFA VALIDATION
const memberContracts = await getMembershipAgreements(member.Id);

console.log("memberContracts", memberContracts);
console.log("member.Id", member.Id);
const accountIds = memberContracts
  .map(c => c.APTS_Member_c)
  .filter(Boolean);
 console.log("accountIds from contracts", accountIds);
  const designate = await getAccountsByIds(accountIds);

     const designatedIds = [];

    designate.forEach(c => {

      const designated = c?.Designated_GPO_c?.Id || c?.Designated_GPO_c;
console.log("accountIds from contracts designated for contract", c.Id, designated);
      if (designated) {
        designatedIds.push(designated);
      }
    });
    console.log("designatedIds", designatedIds); 
if (memberContracts && memberContracts.length > 0) {

  let misccount = 0;
  let mismcount = 0;

  const cfagrlist = [];


  const agreementIds = memberContracts
    .map(rec => rec.APTS_Related_Agreement_c)
    .filter(Boolean);



  const agreements = await getAgreementDetailsByIds(
    agreementIds,designatedIds,member.Id
  );

  console.log("agreements", agreements);

  const agreementMap = {};

  agreements.forEach(agr => {
    agreementMap[agr.Id] = agr;
  });



  for (let rec of memberContracts) {

    const agr =
      agreementMap[rec.APTS_Related_Agreement_c];

    if (!agr) continue;


    const agrAccount =
      agr.Account?.Id || agr.Account;
console.log("agrAccount", agrAccount, "designatedIds", designatedIds);

    const memberAccountId =rec.APTS_Member_c;

if (
  memberAccountId === member.Id &&
  agrAccount === member.Id
){

      misccount++;
      console.log("misccount", misccount);

    } else {

      mismcount++;
      console.log("mismcount", mismcount);
    }

    cfagrlist.push({
      Name: agr.Name,
      AgmntId: agr.Id
    });
  }

  console.log("misccount", misccount);
  console.log("mismcount", mismcount);

  if (cfagrlist.length > 0) {

    setCustFrameagrList(cfagrlist);

    if (misccount > 0) {

      setCfMsg(
        "Member is the customer of a CFA - a participant of a local agreement (LSP,MST,CAA,PSP). Do you want to proceed with Designation?"
      );

    } else if (mismcount > 0) {

      setCfMsg(
        "Member is a member of a CFA - a participant of a local agreement (LSP,MST,CAA,PSP). Do you want to proceed with Designation?"
      );
    }

    setOpenModalCus(true);

    return;
  }
}

// FINAL
handleAddRow();

  } catch (e) {
    console.error(e);
    toast.error("Validation failed");
  }
};

  return (
    <div className="page-container">
      
      {/* HEADER */}
      <div className="header" style={{justifyContent:"center"}}>Designation Page</div>
 
      {/* FILTER SECTION */}

      <div className="filter-container">
        {showRetry && (
  <div style={{ marginBottom: "10px" }}>
    <span style={{ fontWeight: "bold" }}>
      Retry Failed Designation:
    </span>

    <button
      className="btn-primary"
      style={{ marginLeft: "10px" }}
      onClick={handleRetry}
    >
      Retry
    </button>
  </div>
)}
  <div className="filter-group">
    <label>Filter By Market</label>
    <select>
      <option>North America</option>
    </select>
  </div>
 
  <div className="filter-group">
    <label>Filter By Sales Area</label>
    <select>
      <option>United States</option>
    </select>
  </div>
 
  <div className="filter-group">
    <label>Select Member</label>
    <MemberSearch
  value={member}
  onChange={(rec) => {
    setMember(rec);
    console.log("selected member", rec);
    console.log("member", member);
  }}
  type="MEMBER"
/>
   
  </div>
</div>
 
      {/* CONDITIONAL DESIGNATION HEADER */}
      {showDesignationHeader && (
        <>
        <div className="designation" >
     Designation Form Header
        </div>
        <div className="designation-header">
          <table className="designation-table">
            <thead>
            <tr>
            <th>Existing Membership </th>
            <th>Effective Date</th>
            <th>Order Intake Volume Tier</th>
            <th>Add New GPO Membership</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <td>The list below shows all existing Membership records. The selected one is the currently designated one. If none of them are selected, then the member is not designated to any GPO.
                  {options.length > 0 && (
  <div>
   
    {options.map(opt => (
      <label key={opt.value}>
        <input
  type="radio"
  name="designation"
  value={opt.value}
  checked={designated === opt.value}   
  onChange={(e) => {
  const val = e.target.value;
  setDesignated(val);

  const selected = options.find(o => o.value === val);

  // LWC logic equivalent
  if (selected?.label.includes("(Designated)")) {
    setShowCheckBox(true);
  } else {
    setShowCheckBox(false);
    setUnDesignate(false); // reset checkbox
  }
}}
  // onChange={(e) => {
  //   const val = e.target.value;
  //   setDesignated(val);

  //   const selected = options.find(o => o.value === val);

  //   if (selected?.isDesignated) {
  //     setShowCheckBox(true);
  //   } else {
  //     setShowCheckBox(false);
  //     setUnDesignate(false); // reset checkbox
  //   }
  // }}
/>
        {/* <input
          type="radio"
          name="designation"
          value={opt.value}
          onChange={(e) => {
            const val = e.target.value;
            setDesignated(val);

            const selected = options.find(o => o.value === val);

            if (selected.label.includes("Designated")) {
              setShowCheckBox(true);
            } else {
              setShowCheckBox(false);
            }
          }}
        /> */}
        {opt.label}
      </label>
    ))}
  </div>
)}
{showCheckBox && (
  <div style={{ marginTop: "10px" }}>
    <label>
      <input
        type="checkbox"
        checked={unDesignate}
        onChange={(e) => setUnDesignate(e.target.checked)}
      />
      {" "}Un-Designate
    </label>
  </div>
)}
                </td>
                <td><input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              /></td>
              <td>
              <select value={tier} onChange={(e) => setTier(e.target.value)} className="select">
                <option>Tier 1</option>
                <option>Tier 2</option>
              </select>
              </td>
              <td>
You can create new membership records and designate the member to the select GPO.
<div className="filter-group">
  <label>Select GPO</label>
  
  <MemberSearch
  value={selectedGPO}
  onChange={setSelectedGPO}
  type="GPO"
/>
</div>
</td>
              </tr>
            </tbody>
          </table>
          <div className="button-container">
          {/* <button
  className="btn-primary"
  onClick={async () => {
    if (!member || !selectedGPO) {
      toast.error("Select Member and GPO");
      return;
    }

    if (effectiveDate < today) {
      toast.error("Please select future date");
      return;
    }
console.log("memberId", member.Id);
console.log("selectedGPOId", selectedGPO.Id);
    const count = await checkMembershipAgreements(
      member.Id,
      selectedGPO.Id
    );
console.log("valid agreement count", count);
    if (count > 0) {
      console.log("Existing valid agreements found:", count);
      toast.error(
        "Member SAP status In Progress. Please try after sometime"
      );
      return;
    }

    //  Only after validation
    handleAddRow();
  }}
> */}
<button
  className="btn-primary"
  onClick={handleDesignationValidation}
>
  Submit Designated Change Request
</button></div>
           
        </div>
        </>
      )}
 {showConfirm && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Confirmation</h3>
      <p>Are you sure that you want to add/change the GPO Designation?</p>

      <div className="modal-actions">
        {/* <button
          className="btn-primary"
          onClick={handleConfirmYes}
        >
          Yes
        </button> */}
<button
  className="btn-primary"
  onClick={handleConfirmYes}
  disabled={isProcessing}
>
  {isProcessing
    ? "Processing..."
    : "Yes"}
</button>
        <button
          className="btn-secondary"
          onClick={() => setShowConfirm(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}
{isProcessing && (
  <div className="modal-overlay">
    <div
      className="modal-box"
      style={{ width: "450px" }}
    >
      <h3>
        Processing Designation Change
      </h3>

      <p>{progressText}</p>

      <div
        style={{
          width: "100%",
          height: "20px",
          background: "#ddd",
          borderRadius: "10px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#0070d2",
            transition: "width 0.5s ease"
          }}
        />
      </div>

      <div
        style={{
          marginTop: "10px",
          textAlign: "center"
        }}
      >
        {progress}%
      </div>
    </div>
  </div>
)}
{openModalCus && (
  <div className="modal-overlay">
    <div className="modal-box">

      <h3>Confirmation</h3>

      <p>{cfMsg}</p>

      <div className="modal-actions">

        <button
          className="btn-primary"
          onClick={() => {

            setOpenModalCus(false);

            handleAddRow();
          }}
        >
          Yes
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            setOpenModalCus(false);
          }}
        >
          No
        </button>

      </div>
    </div>
  </div>
)}
      {/* TABLE SECTION */}
      { showDesignationHeader &&
      <>
      <div className="table-section">
        <h4>Designated Form Request</h4>
 
        <table>
          <thead>
            <tr>
              <th>Member Account</th>
              <th>Designated GPO</th>
              <th>Effective Date</th>
              <th>Order Intake Volume Tier</th>
              <th>Delete</th>
            </tr>
          </thead>
 
        
          <tbody>
  {rows.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        No Data
      </td>
    </tr>
  ) : (
    rows.map((r) => (
      <tr key={r.id}>
        <td>{r.memberName}</td>
        <td>{r.gpoName}</td>
        <td>{r.effectiveDate}</td>
        <td>{r.tier}</td>
        <td>
          <button onClick={() =>
            setRows(rows.filter((x) => x.id !== r.id))
          }>
            ❌
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
 
      {/* FOOTER ACTIONS */}
      <div className="footer">
      
 
        <div style={{ margin: "10px" }}>
         
          <button
className="btn-primary"
disabled={rows.length === 0}
  onClick={() => setShowConfirm(true)}
>
  Designate
</button>
       
<button
 className="btn-primary"
  onClick={clearForm}
  style={{ margin: "10px" }}
>
  Clear Form
</button>

        </div>
      </div>
      </>
  }
    </div>
  );
}
