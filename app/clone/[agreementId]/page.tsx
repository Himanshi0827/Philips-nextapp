'use client';

import { useEffect, useState } from "react";

import "../../../src/CSS/FormLayout.css";
import "../../../src/CSS/dashboard.css";
import { useRouter, useParams, useSearchParams} from "next/navigation";
import LookupTypeAhead from "../../../src/components/LookupTypeAhead";
import { searchLookupRecords } from "../../../src/api/SearchLookup";
import {  createAgreementLineItem,createAgreementGroup } from "../../../src/api/api";
import { GetLookup } from "../../../src/api/GetLookup";
import { queryAgreementLineItemsByAgreement,queryCheckAgreementGroup } from "../../../src/api/queryAgreementLineItemsByAgreement";
import TopBar from "../../../src/components/TopBar";
import {toast} from "react-toastify";
 

function CloneAgreementLineItems() {
  const navigate=useRouter();
  const { agreementId } = useParams();   //  from URL
const location = useSearchParams();

const targetAgreementId =
  agreementId ||                      //  FIRST priority (URL)
  location.state?.agreementId ||     // fallback (navigation)
  null;

if (!targetAgreementId) {
  console.error("Agreement ID not found in URL or state");
}


const agreementName =sessionStorage.getItem("agreementName") ;
const targetAgreementName = sessionStorage.getItem("agreementName");
  const [sourceAgreement, setSourceAgreement] = useState(null);
  const [targetGroup, setTargetGroup] = useState(null);
const [sourceGroup, setSourceGroup] = useState([]);

  const [lineItems, setLineItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
const [agreementPlist, setAgreementPlist] = useState([]);
 const [wrapColumns, setWrapColumns] = useState({});
const [columnWidths, setColumnWidths] = useState({});
const [openMenu, setOpenMenu] = useState(null);
  /*  Load Source Line Items  */
useEffect(() => {
  if (!sourceAgreement) return;

  const loadLineItems = async () => {
    try {
      const data = await queryAgreementLineItemsByAgreement(
        sourceAgreement.Id
      );
      console.log("data",data)
      setLineItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  loadLineItems();
}, [sourceAgreement]);
useEffect(() => {
  if (!targetAgreementId) return;
console.log("target agreement id",targetAgreementId);
  const loadTargetGroups = async () => {
    try {
      const groups =await GetLookup("APTS_Agreement_Groups_c");
      console.log("groups",groups);
       console.log("groups",groups.Data);
       const final = groups.Data.filter(
          (d) => d.APTS_Agreement_c === targetAgreementId
        );
      //  await searchLookupRecords({
      //   searchText: "",
      //   field: {
      //     LookupObjectName: "APTS_Agreement_Groups_c",
      //     TargetAgreement: targetAgreementId,
      //     Part: "Target"
      //   }
      // });

console.log("groups",final);
      setAgreementPlist(final|| []);
      console.log("agreementPlist",agreementPlist);
    } catch (err) {
      console.error(err);
    }
  };

  loadTargetGroups();
}, [targetAgreementId]);
console.log("trial Id",targetAgreementId);
  /*Select Row */

  const toggleSelect = (item) => {
    setSelectedItems(prev =>
      prev.includes(item.Id)
        ? prev.filter(id => id !== item.Id)
        : [...prev, item.Id]
    );
  };

  /* Clone Logic  */

console.log(sourceGroup);
const [cloneGroupSameAsSource, setCloneGroupSameAsSource] = useState(false);

const getGroupName = (item) => {
  return (
    item?.APTS_Agreement_Group_c?.Name ||
    item?.AgreementGroupName ||
    item?.Agreement_Group_Name__c ||
    null
  )?.trim();
};

const normalizeKey = (name) => name?.toLowerCase().trim();

const handleClone = async () => {
  try {
    if (!selectedItems?.length) {
      alert("Please select at least one Agreement Line to clone.");
      return;
    }

    if (!targetAgreementId) {
      alert("Select Target Agreement.");
      return;
    }

    if (!cloneGroupSameAsSource && !targetGroup) {
      alert("Select Target Agreement Group.");
      return;
    }

    const itemsToClone = lineItems.filter(line =>
      selectedItems.includes(line.Id)
    );
console.log("item",itemsToClone);
    const groupMapping = {};


    if (cloneGroupSameAsSource) {
      const uniqueGroups = [
        ...new Set(
          itemsToClone
            .map(item => getGroupName(item))
            .filter(Boolean)
        )
      ];

      for (const groupName of uniqueGroups) {
        const key = groupName.toLowerCase().trim();

        //  STEP 1A — check existing
        const existingCheck = await queryCheckAgreementGroup(
          targetAgreementId,
          groupName
        );

        let groupId =
          existingCheck?.[0]?.Id ||
          existingCheck?.find(g => g?.Name === groupName)?.Id;

        //  STEP 1B — create if not exists
        if (!groupId) {
          console.log("Creating missing group:", groupName);

          const newGroupPayload = {
            APTS_Agreement_c: targetAgreementId,
            Name: groupName
          };

          await createAgreementGroup(newGroupPayload);

          //  STEP 1C — RE-QUERY (your requested fix)
          const requery = await queryCheckAgreementGroup(
            targetAgreementId,
            groupName
          );

          groupId =
            requery?.[0]?.Id ||
            requery?.find(g => g?.Name === groupName)?.Id;
        }

        if (!groupId) {
          console.error(
            "Still no groupId after create+query:",
            groupName
          );
          continue;
        }

        groupMapping[key] = groupId;
      }

      console.log("Final groupMapping =", groupMapping);
    }

    for (let item of itemsToClone) {
      let finalGroupId;

      if (cloneGroupSameAsSource) {
        const key = getGroupName(item)?.toLowerCase()?.trim();
        finalGroupId = groupMapping[key];
      } else {
        finalGroupId = targetGroup?.Id;
      }

      if (!finalGroupId) {
        console.warn(
          "No target group found. Skipping item:",
          item.Name
        );
        continue;
      }

      const payload = {
        Name: item.Name,
        Agreement: targetAgreementId,
        APTS_Agreement_Group_c: { Id: finalGroupId },
        Line_Type_c: item.Line_Type_c,
        APTS_Discount_Type_c: item.APTS_Discount_Type_c,
        APTS_Match_Products_By_c: item.APTS_Match_Products_By_c,
        APTS_BillingPlan_c: item.APTS_BillingPlan_c,
        APTS_MG3_Service_c: item.APTS_MG3_Service_c

      };
    if (item.Product?.Id) {
      payload.Product = {
        Id: item.Product.Id
      };
    }
    console.log(item.Hierarchy_c);
   if (item.Hierarchy_c?.Id) {
      payload.Hierarchy_c = {
        Id: item.Hierarchy_c.Id
      };
    }
const discountFields = [
      "APTS_Discount_Tier_1_c",
      "APTS_Discount_Tier_2_c",
      "APTS_Discount_Tier_3_c",
      "APTS_Discount_Tier_4_c",
      "APTS_Discount_Tier_5_c",
      "APTS_Scaled_Discount_Percent_Tier_1_c",
      "APTS_Scaled_Discount_Percent_Tier_2_c",
      "APTS_Scaled_Discount_Percent_Tier_3_c",
      "APTS_Scaled_Discount_Percent_Tier_4_c",
      "APTS_Scaled_Discount_Percent_Tier_5_c",
      "APTS_Volume_Threshold_1_c",
      "APTS_Volume_Threshold_2_c",
      "APTS_Volume_Threshold_3_c",
      "APTS_Volume_Threshold_4_c",
      "APTS_Volume_Threshold_5_c",
      "APTS_NPO_Tier_1_c",
      "APTS_NPO_Tier_2_c",
      "APTS_NPO_Tier_3_c",
      "APTS_NPO_Tier_4_c",
      "APTS_NPO_Tier_5_c",
      "APTS_NPO_Tier_6_c",
      "APTS_NPO_Tier_7_c",
      "APTS_Scaled_Discount_Amount_Tier_1_c",
      "APTS_Scaled_Discount_Amount_Tier_2_c",
      "APTS_APTS_Scaled_Discount_Amount_Tier_3_c",
      "APTS_Scaled_Discount_Amount_Tier_4_c",
      "APTS_Scaled_Discount_Amount_Tier_5_c"
    ];

    discountFields.forEach(field => {
      if (item[field] !== null && item[field] !== undefined) {
        payload[field] = item[field];
      }
    });
      await createAgreementLineItem(payload);
    }

    toast.success("Agreement Lines cloned successfully");
    navigate.push(`/${agreementId}`);

  } catch (error) {
    console.error("Error cloning agreement lines:", error);
    toast.error("Error while cloning Agreement Lines.");
  }
};
const filteredLineItems = lineItems.filter(li => {
  if (sourceGroup.length === 0) return true;

  return sourceGroup.some(
    group => group.Id === li.APTS_Agreement_Group_c?.Id
  );
});

const handleSelectAll = (checked) => {
  if (checked) {
    setSelectedItems(filteredLineItems.map(item => item.Id));
  } else {
    setSelectedItems([]);
  }
};
const toggleColumnWrap = (columnKey, mode) => {
  setWrapColumns((prev) => ({
    ...prev,
    [columnKey]: mode,
  }));
};


const columns = [
  { key: "Name", label: "Name" },
  { key: "AgreementGroup", label: "Agreement Group" },
  { key: "LineType", label: "Line Type" },
  { key: "DiscountType", label: "Discount Type" },
  { key: "MatchProducts", label: "Match Products By" },
  { key: "Code", label: "Code" },
  { key: "Matching", label: "Matching" },
  { key: "ParentProduct", label: "Parent Product" },
  { key: "PricingFamily", label: "Pricing Family" },
  { key: "RelatedService", label: "Related Service" },
  { key: "BillingPlan", label: "Billing Plan" },
  { key: "ExcludeFromContractPricelists", label: "Exclude From Contract Pricelists" },
  { key: "MG3", label: "MG3" },
  { key: "NotDiscountable", label: "Not Discountable" },
  { key: "QuoteType", label: "Quote Type" },
  { key: "ServicePlanType", label: "Service Plan Type" }
  // { key: "Tier1", label: "Tier 1" },
  // { key: "Tier2", label: "Tier 2" },
  // { key: "Tier3", label: "Tier 3" },
  // { key: "Tier4", label: "Tier 4" },
  // { key: "Tier5", label: "Tier 5" },
  // { key: "ScaledDiscountT1", label: "Scaled Discount %, Tier 1" },
  // { key: "ScaledDiscountT2", label: "Scaled Discount %, Tier 2" },
  // { key: "ScaledDiscountT3", label: "Scaled Discount %, Tier 3" },
  // { key: "ScaledDiscountT4", label: "Scaled Discount %, Tier 4" },
  // { key: "ScaledDiscountT5", label: "Scaled Discount %, Tier 5" },
  // { key: "VolumeThreshold1", label: "Volume Threshold 1" },
  // { key: "VolumeThreshold2", label: "Volume Threshold 2" },
  // { key: "VolumeThreshold3", label: "Volume Threshold 3" },
  // { key: "VolumeThreshold4", label: "Volume Threshold 4" },
  // { key: "VolumeThreshold5", label: "Volume Threshold 5" },
  //  { key: "NPO1", label: "NPO Tier 1" },
  //  { key: "NPO2", label: "NPO Tier 2" },
  //  { key: "NPO3", label: "NPO Tier 3" },
  //  { key: "NPO4", label: "NPO Tier 4" },
  //  { key: "NPO5", label: "NPO Tier 5" },
  //  { key: "NPO6", label: "NPO Tier 6" },
  //  { key: "NPO7", label: "NPO Tier 7" },
  //  { key: "ScaledDiscountAmtT1", label: "Scaled Discount Amt, Tier 1" },
  //  { key: "ScaledDiscountAmtT2", label: "Scaled Discount Amt, Tier 2" },
  //  { key: "ScaledDiscountAmtT3", label: "Scaled Discount Amt, Tier 3" },
  //  { key: "ScaledDiscountAmtT4", label: "Scaled Discount Amt, Tier 4" },
  //  { key: "ScaledDiscountAmtT5", label: "Scaled Discount Amt, Tier 5" }
];
const startResize = (e, columnKey) => {
  e.preventDefault();

  const startX = e.pageX;
  const startWidth = columnWidths[columnKey] || 180;

  const onMouseMove = (moveEvent) => {
    const newWidth =
      startWidth + (moveEvent.pageX - startX);

    setColumnWidths((prev) => ({
      ...prev,
      [columnKey]: Math.max(newWidth, 80),
    }));
  };

  const onMouseUp = () => {
    document.removeEventListener(
      "mousemove",
      onMouseMove
    );
    document.removeEventListener(
      "mouseup",
      onMouseUp
    );
  };

  document.addEventListener(
    "mousemove",
    onMouseMove
  );
  document.addEventListener(
    "mouseup",
    onMouseUp
  );
};

  return (<div className="clone-container">

  <TopBar
  title="Agreement"
  onSave={handleClone}
  agreementHeader={agreementName}
  agreementId={agreementId}
  isClone={true}
  hasSelection={selectedItems.length > 0}
/>
  <div className="clone-card">
    <div className="clone-grid">

      <div className="field">
        <label className="clone-label">Source Agreement</label>
        <LookupTypeAhead
          field={{
            DisplayName: "Agreement",
            LookupObjectName: "Agreement",
            TargetAgreement:targetAgreementId
          }}
          value={sourceAgreement}
          onChange={(record) => {
            if (record?.Id === targetAgreementId) {
              alert("Source cannot be same as Target");
              return;
            }
            console.log("trial",record)
            setSourceAgreement(record);
          }}
          searchFn={searchLookupRecords}
        />
      </div>

      <div className="field">
        <label className="clone-label">Target Agreement</label>
        <input value={targetAgreementName} disabled />
      </div>
   </div>
       </div>
      {sourceAgreement && (
        <>
        <div className="section-header">Agreement Group</div>
          <div className="clone-card">

              <div className="clone-grid">

          <div className="field">
            <label className="clone-label">Source Agreement Group</label>
            <LookupTypeAhead
            field={{
              DisplayName: "Agreement Group",
              LookupObjectName: "APTS_Agreement_Groups_c",
              TargetAgreement: sourceAgreement.Id,
              Part:"Source"
            }}
            value={null}
onChange={(record) => {
  if (!record) return;

  setSourceGroup(prev => {
    if (prev.find(g => g.Id === record.Id)) return prev;
    return [...prev, record];
  });
}}


            searchFn={searchLookupRecords}
          />
            {sourceGroup.map(group => (
    <span key={group.Id} className="group-chip">
      {group.Name}
      <button
        onClick={() =>
          setSourceGroup(prev =>
            prev.filter(g => g.Id !== group.Id)
          )
        }
      >
        ✕
      </button>
    </span>
  ))}
          </div>
{/* <div className="selected-groups"> */}

{/* </div> */}


{!cloneGroupSameAsSource && (
  <div className="field">
  <label className="clone-label">Target Agreement Group</label>
    <select
    placeholder="Select An Option"
    className="clone-select"
    value={targetGroup?.Id || ""}
    onChange={(e) => {
      const selectedId = e.target.value;

      const selectedRecord = agreementPlist.find(
        (g) => g.Id === selectedId
      );

      setTargetGroup(selectedRecord);
    }}
  >
    {/* <option value="">
     Select An Option
    </option> */}

    {agreementPlist.map((group) => (
      <option
        key={group.Id}
        value={group.Id}
      >
        {group.Name}
      </option>
    ))}
  </select>
   {/* <LookupTypeAhead
  field={{
    DisplayName: "Agreement Group",
    LookupObjectName: "APTS_Agreement_Groups_c",
    TargetAgreement:targetAgreementId,
    Part:"Target"
  }}
  value={targetGroup}
  onChange={(record) => setTargetGroup(record)}
  searchFn={searchLookupRecords}
/> */}
</div>
)}
<div className="clone-checkbox">
  <label className="clone-label">
    <input
      type="checkbox"
      checked={cloneGroupSameAsSource}
      onChange={(e) => {setCloneGroupSameAsSource(e.target.checked);

      setTargetGroup(sourceGroup);}}
    />
   Create Agreement Group Too
  </label>
<p> *Agreement group conditions will not be cloned if the agreement group name is same in both source/target agreement.</p>
</div>
</div>
</div>
        </>
      )}



{sourceAgreement&&(
<div className="clone-grid-section">

    {/* Header */}
    <div className="clone-grid-header">
      <div className="clone-grid-title">
        Agreement Line Items (Total: {lineItems.length})
      </div>

      <div className="clone-grid-subinfo">
        <span>Total: {lineItems.length}</span>
        <span>Selected: {selectedItems.length}</span>
      </div>
    </div>

    {/* Scrollable Table */}
    <div className="clone-grid-table-wrapper">

    {/* <div className="clone-table-wrapper"> */}
      {/* <table className="clone-table"> */}
      <table className="clone-grid-table">
        <thead>
          <tr>
            <th>
  <input
    type="checkbox"
    checked={
      filteredLineItems.length > 0 &&
      selectedItems.length === filteredLineItems.length
    }
    onChange={(e) =>
      handleSelectAll(e.target.checked)
    }
  />
</th>
{columns.map((col) => (
  <th
    key={col.key}
    style={{
      width: columnWidths[col.key] || 100,
      minWidth: columnWidths[col.key] || 80,
    }}
    className="resizable-header"
  >
    {/* <div className="header-content"> */}
     

    <div className="header-menu">
       <span>{col.label}</span>
  <button
    type="button"
    className="header-menu-btn"
    onClick={() =>
      setOpenMenu(
        openMenu === col.key ? null : col.key
      )
    }
  >
    ▼
  </button>

  {openMenu === col.key && (
    <div className="header-dropdown">
      <div
        className="dropdown-item"
        onClick={() => {
          toggleColumnWrap(col.key, "clip");
          setOpenMenu(null);
        }}
      >
        Clip text
      </div>

      <div
        className="dropdown-item"
        onClick={() => {
          toggleColumnWrap(col.key, "wrap");
          setOpenMenu(null);
        }}
      >
        Wrap text
      </div>
    </div>
  )}
</div>
    {/* </div> */}

    <div
      className="resize-handle"
      onMouseDown={(e) =>
        startResize(e, col.key)
      }
    />
  </th>
))}
            {/* <th></th> */}
              {/* <th>Name</th>
              <th>Agreement Group</th>
              <th>Line Type</th>
              <th>Discount Type</th>
              <th>Match Products By</th>

              <th>Billing Plan</th>
              <th>MG3</th>
              <th>Tier 1</th>
              <th>Tier 2</th>
              <th>Tier 3</th>
              <th>Tier 4</th>
              <th>Tier 5</th>
              <th>Scaled Discount %, Tier 1</th>
                <th>Scaled Discount %, Tier 2</th>
                  <th>Scaled Discount %, Tier 3</th>
                    <th>Scaled Discount %, Tier 4</th>
                      <th>Scaled Discount %, Tier 5</th>
                      <th>Volume Threshold 1</th>
                      <th>Volume Threshold 2</th>
                      <th>Volume Threshold 3</th>
                      <th>Volume Threshold 4</th>
                      <th>Volume Threshold 5</th>
                       <th>NPO1</th><th>NPO2</th><th>NPO3</th><th>NPO4</th><th>NPO5</th><th>NPO6</th><th>NPO7</th>
                       <th>Scale Discount Amt T1</th><th>Scale Discount Amt T2</th><th>Scale Discount Amt T3</th><th>Scale Discount Amt T4</th><th>Scale Discount Amt T5</th> */}
          </tr>
        </thead>
         <tbody>
          {lineItems
          .filter(li => {

            {/* {filteredLineItems.map(li => { */}
      if (sourceGroup.length === 0) return true;
 
      return sourceGroup.some(
        group => group.Id === li.APTS_Agreement_Group_c?.Id
      );
    })
           
            .map(item => (
              <tr key={item.Id}>
                <td>
                  <input
  type="checkbox"
  checked={selectedItems.includes(item.Id)}
  onChange={() => toggleSelect(item)}
/>
                  {/* <input
                    type="checkbox"
                    onChange={() => toggleSelect(item)}
                  /> */}
                </td>
                <td className={
    wrapColumns["Name"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.Name}</td>
                <td className={
    wrapColumns["AgreementGroup"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>
  {item.APTS_Agreement_Group_c?.Id ? (
    <a
      href={`https://preview-rls09.congacloud.com/admin/entity/APTS_Agreement_Groups_c/detail/${item.APTS_Agreement_Group_c.Id}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="clone-link"
    >
      {item.APTS_Agreement_Group_c?.Name}
    </a>
  ) : (
    "-"
  )}
</td>
                {/* <td>{item.APTS_Agreement_Group_c?.Name}</td> */}
                <td className={
    wrapColumns["LineType"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.Line_Type_c}</td>
                <td className={
    wrapColumns["DiscountType"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Discount_Type_c}</td>
                <td className={
    wrapColumns["MatchProductsBy"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Match_Products_By_c}</td>

<td className={
    wrapColumns["Code"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.Code_c}</td>

            <td className={
    wrapColumns["Matching"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>
    {item.APTS_Match_Products_By_c === "Hierarchy" && item.Hierarchy_c?.Id ? (
      <a
        href={`https://preview-rls09.congacloud.com/admin/entity/Product_Hierarchy_c/detail/${item.Hierarchy_c.Id}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="clone-link"
      >
        {item.Hierarchy_c?.Name || item.Matching_c || "-"}
      </a>
    ) : item.APTS_Match_Products_By_c === "Product" && item.Product?.Id ? (
      <a
        href={`https://preview-rls09.congacloud.com/admin/entity/Product/detail/${item.Product.Id}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="clone-link"
      >
        {item.Product?.Name || "-"}
      </a>
    ) : (
      item.Matching_c || "-"
    )}
  </td>

              

 <td className={
    wrapColumns["ParentProduct"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>
    {item.APTS_Parent_Product_c?.Id ? (
      <a
        href={`https://preview-rls09.congacloud.com/admin/entity/Product/detail/${item.APTS_Parent_Product_c.Id}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="clone-link"
      >
        {item.APTS_Parent_Product_c?.Name || "-"}
      </a>
    ) : (
      "-"
    )}
  </td>
   <td className={
    wrapColumns["PricingFamily"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.Pricing_Family_c}</td>

                <td className={
    wrapColumns["RelatedService"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.ServiceLocation}</td>
                <td className={
    wrapColumns["BillingPlan"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_BillingPlan_c}</td>
                

    <td className={
    wrapColumns["ExcludeFromContractPricelists"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Exclude_From_Contract_Pricelists_c== true
                        ? "True"
                        :"False"}</td>
  <td className={
    wrapColumns["MG3"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_MG3_Service_c}</td>
    <td className={
    wrapColumns["NotDiscountable"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Not_Discountable_c== true
                        ? "True"
                        :"False"}</td>
    <td className={
    wrapColumns["QuoteType"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Quote_Type_c}</td>
    <td className={
    wrapColumns["ServicePlanType"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Service_Plan_Type_c}</td>
                {/* <td className={
    wrapColumns["DiscountTier1"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Discount_Tier_1_c}</td>
                <td className={
    wrapColumns["DiscountTier2"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Discount_Tier_2_c}</td>
                <td className={
    wrapColumns["DiscountTier3"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Discount_Tier_3_c}</td>
                <td className={
    wrapColumns["DiscountTier4"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Discount_Tier_4_c}</td>
                <td className={
    wrapColumns["DiscountTier5"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Discount_Tier_5_c}</td>
                    <td className={
    wrapColumns["ScaledDiscountPercentTier1"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Percent_Tier_1_c}</td>
                    <td className={
    wrapColumns["ScaledDiscountPercentTier2"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Percent_Tier_2_c}</td>
                    <td className={
    wrapColumns["ScaledDiscountPercentTier3"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Percent_Tier_3_c}</td>
                    <td className={
    wrapColumns["ScaledDiscountPercentTier4"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Percent_Tier_4_c}</td>
                    <td className={
    wrapColumns["ScaledDiscountPercentTier5"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Percent_Tier_5_c}</td>
                    <td className={
    wrapColumns["VolumeThreshold1"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Volume_Threshold_1_c}</td>
                    <td className={
    wrapColumns["VolumeThreshold2"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Volume_Threshold_2_c}</td>
                    <td className={
    wrapColumns["VolumeThreshold3"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Volume_Threshold_3_c}</td>
                    <td className={
    wrapColumns["VolumeThreshold4"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Volume_Threshold_4_c}</td>
                    <td className={
    wrapColumns["VolumeThreshold5"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Volume_Threshold_5_c}</td>
                    <td className={
    wrapColumns["NPOSTier1"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_NPO_Tier_1_c?.Value}</td>
                     <td className={
    wrapColumns["NPOSTier2"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_NPO_Tier_2_c?.Value}</td>
                      <td className={
    wrapColumns["NPOSTier3"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_NPO_Tier_3_c?.Value}</td>
                       <td className={
    wrapColumns["NPOSTier4"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_NPO_Tier_4_c?.Value}</td>
                        <td className={
    wrapColumns["NPOSTier5"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_NPO_Tier_5_c?.Value}</td>
                         <td className={
    wrapColumns["NPOSTier6"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_NPO_Tier_6_c?.Value}</td>
                          <td className={
    wrapColumns["NPOSTier7"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_NPO_Tier_7_c?.Value}</td>
                    <td className={
    wrapColumns["ScaledDiscountAmountTier1"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Amount_Tier_1_c?.Value}</td>
                    <td className={
    wrapColumns["ScaledDiscountAmountTier2"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Amount_Tier_2_c?.Value}</td>
                    <td className={
    wrapColumns["ScaledDiscountAmountTier3"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_APTS_Scaled_Discount_Amount_Tier_3_c?.Value}</td>
                    <td className={
    wrapColumns["ScaledDiscountAmountTier4"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Amount_Tier_4_c?.Value}</td>
                    <td className={
    wrapColumns["ScaledDiscountAmountTier5"] === "wrap"
      ? "wrap-cell"
      : "clip-cell"
  }>{item.APTS_Scaled_Discount_Amount_Tier_5_c?.Value}</td>
  */}
               
              </tr>
            ))}
        </tbody>
      </table>
    </div>
     </div>
  )}

  {selectedItems.length > 0 && (
    <div className="clone-actions">
      <button className="primary-btn" onClick={handleClone}>
        Clone Selected
      </button>
    </div>
  )}

</div>

  );}

export default CloneAgreementLineItems;
 
