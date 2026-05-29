"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import Sidebar from "../../../src/components/Sidebar";
import TopBar from "../../../src/components/TopBar";

import { createAgreementLineItem, getAgreementById} from "../../../src/api/api"; //head
import { queryAgreementLineItemsByAgreement } from "../../../src/api/queryAgreementLineItemsByAgreement";
import "../../../src/CSS/FormLayout.css";
import { toast } from "react-toastify";

import AgreementGroupForm from "../../../src/forms/AgreementGroupForm";
import ProductSelectionForm from "../../../src/forms/ProductSelectionForm";
import DiscountPricingStrategyForm from "../../../src/forms/DiscountPricingStrategyForm";
import AgreementHeaderInformationForm from "../../../src/forms/AgreementHeaderInformationForm";
import InformationForm from "../../../src/forms/InformationForm";
import BillingPlanForm from "../../../src/forms/BillingPlanForm";

function NewAgreement() {
  const navigate = useRouter();

  const { agreementId } = useParams(); //  from URL
  // const location = useLocation();

  const id =
    agreementId || //  FIRST priority (URL)
    null;

  if (!id) {
    console.error("Agreement ID not found in URL or state");
  }

  const agreementName = sessionStorage.getItem("agreementName");
  const [agreementHeader, setAgreementHeader] = useState([]);
  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const data = await getAgreementById(id);
        console.log("Agreement Header:", data);
        setAgreementHeader(data?.[0] || null);
        console.log("Agreement Header:", agreementHeader);
      } catch (err) {
        console.error("Failed to fetch agreement:", err);
      }
    };

    fetchAgreement();
  }, [id]);

  const [payload, setPayload] = useState({
    agreementGroup: {
      AgreementLineItemName: "",
      agreementGroupId: "",
      agreementGroup: "",
    },

    productSelection: {
      LineType: "",
      MatchProductsBy: "",
      MG3: "",
      Field: "",
      selectedRecords: [],
      selectedProducts: [],
      selectedParentProducts: [],
    },
    discountPricing: {
      DiscountType: "",
      tierDiscounts: ["", "", "", "", ""],
      scaledTier: ["", "", "", "", ""],
      scaledDiscounts: ["", "", "", "", ""],
      volumeT: ["", "", "", "", ""],
    },
    agreementHeaderInfo: {
      AdministrationFee: "",
      AFPaymentSchedule: "",
      PriceUpdateRule: "",
      AFison: "",
      UpperBandwidth: "",
      LowerBandwidth: "",
      NetPriceODiscount: "",
      ExcludedAF: false,
      InheritHdiscount: false,
      ExcludefromContractP: false,
    },
    information: {
      ActivationDate: "",
      ExpirationDate: "",
      Description: "",
      ItemSequence: "",
      LineNumber: "",
    },
    billingPlan: {},
  });

  const updatePayload = (section, data) => {
    setPayload((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const getHeaderValue = (formValue, agreementValue) => {
    if (formValue !== "" && formValue !== null && formValue !== undefined) {
      return formValue;
    }
    return agreementValue;
  };

  const addIfValid = (obj, fieldName, value) => {
    if (value !== "" && value !== null && value !== undefined) {
      obj[fieldName] = value;
    }
  };

  const addIfNumber = (obj, fieldName, value) => {
    // Convert to Number and only add if it's a valid number
    if (value !== "" && value !== null && value !== undefined) {
      const num = Number(value);
      if (!isNaN(num)) {
        obj[fieldName] = num;
      }
    }
  };

  useEffect(() => {
    const ps = payload.productSelection;
    let isValidFlag = false;

    if (ps.MatchProductsBy === "Hierarchy") {
      isValidFlag = ps.selectedBUs?.length > 0;
    } else if (ps.MatchProductsBy === "Product") {
      const hasBaseProducts = ps.selectedProducts?.length > 0;

      const options = ps.selectedProducts.filter(
        (p) => p.Configuration === "Option",
      );
      const allOptionsHaveParents = options.every((opt) =>
        ps.selectedParentProducts?.some((parent) => parent.ChildId === opt.Id),
      );

      isValidFlag = hasBaseProducts && allOptionsHaveParents;
    }

    setHasProducts(isValidFlag);

    if (isValidFlag) {
      setCompletedTabs([...tabs]);
    } else {
      // Keep only the first two tabs unlocked if invalid
      setCompletedTabs((prev) => prev.filter((tab) => tabs.indexOf(tab) < 1));
    }
  }, [
    payload.productSelection.selectedBUs,
    payload.productSelection.selectedProducts,
    payload.productSelection.selectedParentProducts,
    payload.productSelection.MatchProductsBy,
  ]);

  const handleFinalSubmit = async () => {
    if (!id) {
      alert("Agreement context missing. Please go back and reopen.");
      return;
    }
    //  FETCH EXISTING ALI AGAIN (FINAL CHECK)
    const existingALI = await queryAgreementLineItemsByAgreement(id);
    const {
      selectedProducts,
      selectedParentProducts,
      MatchProductsBy,
      selectedRecords,
      Field,
    } = payload.productSelection;

    let requests = [];

    // --- CASE 1: MATCH BY PRODUCT ---
    if (MatchProductsBy === "Product") {
      const duplicate = selectedProducts.some((sp) =>
        existingALI.some((ali) => ali.Product?.Id === sp.Id),
      );
      const duplicatevalues = existingALI.map((ali) =>
        selectedProducts.filter((sp) => sp.Id === ali.Product?.Id),
      );

      if (duplicate) {
        duplicatevalues.forEach((item) => {
          if (item.length >= 1) {
            toast.error(
              `Agreement Line Item with matching criteria [Product Name- ${item[0].Name}] [ Product Code- ${item[0].ProductCode} ] is duplicated on this agreement. Please combine these commercial condition / price adjustment rules.`,
            );
          }
        });
        return;
      }

      requests = selectedProducts.map(async (childProduct) => {
        // 1. Find if this child has a selected parent
        const parentRecord = selectedParentProducts?.find(
          (p) => p.ChildId === childProduct.Id,
        );
        console.log("ex", payload.agreementHeaderInfo.ExcludedAF);
        console.log("ex", payload.agreementHeaderInfo.ExcludefromContractP);
        console.log("ex", payload.agreementHeaderInfo.InheritHdiscount);
        // 2. Determine which discount to use

        const hasParentDiscount =
          parentRecord?.Discounts && parentRecord.Discounts.length > 0;
        const hasChildDiscount =
          childProduct.Discounts && childProduct.Discounts.length > 0;

        const activeDiscountSource = hasParentDiscount
          ? parentRecord
          : childProduct;
        const discountType = activeDiscountSource.DiscountType;
        const discounts = activeDiscountSource.Discounts;
        console.log("non discountable", childProduct?.nonDiscountable);
        const lineItemPayload = {
          Name: payload.agreementGroup.AgreementLineItemName,
          Agreement: id,

          APTS_Not_Discountable_c:
            activeDiscountSource?.nonDiscountable ||
            !activeDiscountSource?.IsDiscountable ||
            payload.discountPricing.nonDiscountable ||
            false,

          Product: { Id: childProduct.Id, Name: childProduct.Name },
          ...(parentRecord && {
            APTS_Parent_Product_c: {
              Id: parentRecord.Id,
              Name: parentRecord.Name,
            },
          }),

          APTS_Agreement_Group_c: {
            Id: payload.agreementGroup.agreementGroupId,
            Name: payload.agreementGroup.agreementGroup.Name,
          },

          Line_Type_c: payload.productSelection.LineType,
          APTS_Match_Products_By_c: MatchProductsBy,

          APTS_Discount_Type_c: discountType,
        };
        const ah = payload.agreementHeaderInfo;
        addIfValid(
          lineItemPayload,
          "APTS_GPO_Admin_fee_payment_schedule_c",
          ah.AFPaymentSchedule,
        );
        addIfValid(
          lineItemPayload,
          "APTS_Country_pricelist_update_rule_c",
          ah.APTS_Country_pricelist_update_rule_c,
        );
        addIfValid(
          lineItemPayload,
          "APTS_GPO_Admin_fee_is_based_on_c",
          ah.AFison,
        );
        addIfValid(
          lineItemPayload,
          "APTS_GPO_Administration_fee_c",
          ah.AdministrationFee,
        );
        addIfValid(lineItemPayload, "APTS_Upper_Bandwith_c", ah.UpperBandwidth);
        addIfValid(lineItemPayload, "APTS_Lower_Bandwith_c", ah.LowerBandwidth);
        addIfValid(
          lineItemPayload,
          "APTS_Contract_Net_Price_c",
          ah.NetPriceODiscount,
        );
        addIfValid(
          lineItemPayload,
          "APTS_BillingPlan_c",
          childProduct.BillingPlan,
        );
        // Booleans
        lineItemPayload.APTS_Exclude_GPO_Administration_Fees_c =
          !!ah.ExcludedAF;
        lineItemPayload.APTS_Exclude_From_Contract_Pricelists_c =
          !!ah.ExcludefromContractP;
        lineItemPayload.APTS_Inherit_hierarchy_discount_c =
          !!ah.InheritHdiscount;

        // 4. Information Section (Cleaned)
        const info = payload.information;
        addIfValid(
          lineItemPayload,
          "APTS_Activation_Date_c",
          info.ActivationDate,
        );
        addIfValid(
          lineItemPayload,
          "APTS_Expiration_Date_c",
          info.ExpirationDate,
        );
        addIfValid(lineItemPayload, "Description", info.Description);
        addIfNumber(lineItemPayload, "ItemSequence", info.ItemSequence);
        addIfNumber(lineItemPayload, "LineNumber", info.LineNumber);

        // 5. Discounts
        addIfValid(lineItemPayload, "APTS_Discount_Type_c", discountType);
        mapDiscountsToPayload(lineItemPayload, discountType, discounts);
        // Helper to map tiered data from the structured objects we built in previous steps
        mapDiscountsToPayload(lineItemPayload, discountType, discounts);

        return createAgreementLineItem(lineItemPayload);
      });
    }
    // --- CASE 2: MATCH BY HIERARCHY (Existing Logic) ---
    else {
      const duplicate = existingALI.some((ali) =>
        selectedRecords.some(
          (sr) =>
            ali.Hierarchy_c?.Id === sr.Id &&
            ali.APTS_MG3_Service_c === payload.productSelection.MG3,
        ),
      );
      const duplicatevalues = selectedRecords.map((sr) =>
        existingALI.filter(
          (ali) =>
            sr.Id === ali.Hierarchy_c?.Id &&
            ali.APTS_MG3_Service_c === payload.productSelection.MG3,
        ),
      );
      console.log("Duplicates from hierarchy", duplicatevalues);

      if (duplicate) {
        duplicatevalues.forEach((item) => {
          if (item.length >= 1) {
            toast.error(
              `${item[0].Code_c} are already present in the agreement with selected MG3. Please remove them or select different MG3 to proceed`,
            );
          }
        });
        return;
      }

      requests = selectedRecords.map(async (record) => {
        const discount = payload.discountPricing;

        //  Find the full Product data from the productSelection list
        // to access its BU, MAG, and AG names
        const productDetail = payload.productSelection.productData?.find(
          (p) => p.Id === record.Id,
        );

        let selectedBillingPlan = "";

        if (productDetail) {
          //  Determine which "Key" in the billingPlan state matches this product.
          // We check in order: Article Group -> Main Article Group -> Business Unit
          // This matches the logic you used to build the list in BillingPlanForm.

          const buName = productDetail.Business_Unit_Name_c;
          const magName = productDetail.Main_Article_Group_Name_c;
          const agName = productDetail.Article_Group_Name_c;

          // Look up the value from our billingPlan object
          selectedBillingPlan =
            payload.billingPlan[agName] ||
            payload.billingPlan[magName] ||
            payload.billingPlan[buName];
        }

        const lineItemPayload = {
          Name: payload.agreementGroup.AgreementLineItemName,

          Agreement: id, //head

          APTS_Not_Discountable_c:
            payload.discountPricing.non_Disc_Hierarchy || false,

          APTS_Agreement_Group_c: {
            Id: payload.agreementGroup.agreementGroupId,
            Name: payload.agreementGroup.agreementGroup.Name,
          },
          Line_Type_c: payload.productSelection.LineType,
          APTS_Match_Products_By_c: payload.productSelection.MatchProductsBy,

          ...(payload.productSelection.Field && {
            [payload.productSelection.Field]: {
              Id: record.Id,
              Name: record.Name,
            },
          }),

          APTS_Discount_Type_c: discount.DiscountType || "None",
        };
        const ah = payload.agreementHeaderInfo;
        addIfValid(
          lineItemPayload,
          "APTS_GPO_Admin_fee_payment_schedule_c",
          ah.AFPaymentSchedule,
        );
        addIfValid(
          lineItemPayload,
          "APTS_Country_pricelist_update_rule_c",
          ah.PriceUpdateRule,
        );
        addIfValid(
          lineItemPayload,
          "APTS_GPO_Admin_fee_is_based_on_c",
          ah.AFison,
        );
        addIfValid(
          lineItemPayload,
          "APTS_GPO_Administration_fee_c",
          ah.AdministrationFee,
        );
        addIfValid(lineItemPayload, "APTS_Upper_Bandwith_c", ah.UpperBandwidth);
        addIfValid(lineItemPayload, "APTS_Lower_Bandwith_c", ah.LowerBandwidth);
        addIfValid(
          lineItemPayload,
          "APTS_Contract_Net_Price_c",
          ah.NetPriceODiscount,
        );
        addIfValid(lineItemPayload, "APTS_BillingPlan_c", selectedBillingPlan);
        lineItemPayload.APTS_Exclude_GPO_Administration_Fees_c =
          !!ah.ExcludedAF;
        lineItemPayload.APTS_Exclude_From_Contract_Pricelists_c =
          !!ah.ExcludefromContractP;
        lineItemPayload.APTS_Inherit_hierarchy_discount_c =
          !!ah.InheritHdiscount;
        const ps = payload.productSelection;

        addIfValid(lineItemPayload, "APTS_MG3_Service_c", ps.MG3);
        // 3. Information Section (Cleaned)
        const info = payload.information;
        addIfValid(
          lineItemPayload,
          "APTS_Activation_Date_c",
          info.ActivationDate,
        );
        addIfValid(
          lineItemPayload,
          "APTS_Expiration_Date_c",
          info.ExpirationDate,
        );
        addIfValid(lineItemPayload, "Description", info.Description);
        addIfValid(
          lineItemPayload,
          "APTS_Discount_Type_c",
          discount.DiscountType,
        );

        addIfNumber(lineItemPayload, "ItemSequence", info.ItemSequence);
        addIfNumber(lineItemPayload, "LineNumber", info.LineNumber);
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_1_c",
          discount.tierDiscounts?.[0],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_2_c",
          discount.tierDiscounts?.[1],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_3_c",
          discount.tierDiscounts?.[2],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_4_c",
          discount.tierDiscounts?.[3],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_5_c",
          discount.tierDiscounts?.[4],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_1_c",
          discount.scaledTier?.[0],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_2_c",
          discount.scaledTier?.[1],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_3_c",
          discount.scaledTier?.[2],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_4_c",
          discount.scaledTier?.[3],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Discount_Tier_5_c",
          discount.scaledTier?.[4],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Scaled_Discount_Percent_Tier_1_c",
          discount.scaledDiscounts?.[0],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Scaled_Discount_Percent_Tier_2_c",
          discount.scaledDiscounts?.[1],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Scaled_Discount_Percent_Tier_3_c",
          discount.scaledDiscounts?.[2],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Scaled_Discount_Percent_Tier_4_c",
          discount.scaledDiscounts?.[3],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Scaled_Discount_Percent_Tier_5_c",
          discount.scaledDiscounts?.[4],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Volume_Threshold_1_c",
          discount.volumeT?.[0],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Volume_Threshold_2_c",
          discount.volumeT?.[1],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Volume_Threshold_3_c",
          discount.volumeT?.[2],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Volume_Threshold_4_c",
          discount.volumeT?.[3],
        );
        addIfNumber(
          lineItemPayload,
          "APTS_Volume_Threshold_5_c",
          discount.volumeT?.[4],
        );

        console.log("finally", lineItemPayload);
        return createAgreementLineItem(lineItemPayload);
      });
    }

    try {
      const results = await Promise.all(requests);

      const allSuccessful = results.every((r) => r?.Success);

      if (allSuccessful) {
        toast.success("All Agreement Line Items created successfully");
      } else {
        toast.error("Some Agreement Line Items failed to create");
        return;
      }

      navigate.push(`/${agreementId}`, {
        state: {
          id,
          agreementName: "Philips Trial",
        },
      });
    } catch (err) {
      console.error("Submission failed:", err);
       console.error("Submission failed:", err.Errors[0].Message);
  const errorMessage = err.Errors[0]?.Message || "An error occurred during submission.";
  toast.error(`${errorMessage}`);
     // toast.error("Error while creating Agreement Line Items");
    }
  };

  const mapDiscountsToPayload = (payload, type, discounts) => {
    if (!discounts || discounts.length === 0) return;

    if (type === "Tier Discount" || type === "Net Price Override") {
      discounts.forEach((val, i) => {
        const field =
          type === "Tier Discount"
            ? `APTS_Discount_Tier_${i + 1}_c`
            : `APTS_NPO_Tier_${i + 1}_c`; // adjust NPO field names as per your API
        addIfNumber(payload, field, val);
      });
    } else if (type === "Tier Discount % + Scaled") {
      discounts[0]?.TierDiscount?.forEach((val, i) =>
        addIfNumber(payload, `APTS_Discount_Tier_${i + 1}_c`, val),
      );
      discounts[1]?.scaledDiscount?.forEach((val, i) =>
        addIfNumber(
          payload,
          `APTS_Scaled_Discount_Percent_Tier_${i + 1}_c`,
          val,
        ),
      );
      discounts[2]?.VolumeThreshold?.forEach((val, i) =>
        addIfNumber(payload, `APTS_Volume_Threshold_${i + 1}_c`, val),
      );
    } else if (type === "Net Price Override + Scaled") {
      discounts[0]?.NetPrice?.forEach((val, i) =>
        addIfNumber(payload, `APTS_NPO_Tier_${i + 1}_c`, val),
      );
      discounts[1]?.ScaledDiscountAmt?.forEach((val, i) =>
        addIfNumber(
          payload,
          `APTS_Scaled_Discount_Amount_Tier_${i + 1}_c`,
          val,
        ),
      );
      discounts[2]?.VolumeThreshold?.forEach((val, i) =>
        addIfNumber(payload, `APTS_Volume_Threshold_${i + 1}_c`, val),
      );
    }
  };

  const tabs = [
    "Agreement Group",
    "Product Selection",
    "Discount Pricing Strategy",
    "Agreement Header Information",
    "Information",
    "Select Billing Plan",
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [completedTabs, setCompletedTabs] = useState([]);
  const [hasProducts, setHasProducts] = useState(false);

  useEffect(() => {
    // If products exist → unlock all tabs
    if (hasProducts) {
      console.log("hello", hasProducts);
      setCompletedTabs([...tabs]);
      return;
    }

    // If products removed → lock back to step flow
    setCompletedTabs((prev) => prev.filter((tab) => tabs.indexOf(tab) <= 1));

    // If user is on locked tab → move back to 2nd tab
    const currentIndex = tabs.indexOf(activeTab);

    if (currentIndex > 1) {
      setActiveTab(tabs[1]);
    }
  }, [hasProducts]);
  // Prevent jumping to locked tabs

  useEffect(() => {
    const ag = payload.agreementGroup;

    const isValid =
      ag.AgreementLineItemName && ag.agreementGroup && ag.agreementGroupId;

    if (isValid && !completedTabs.includes("Agreement Group")) {
      setCompletedTabs((prev) => [...prev, "Agreement Group"]);
    }
  }, [payload.agreementGroup]);

  const handleTabSelect = (tab) => {
    const index = tabs.indexOf(tab);

    // If we have a valid selection (Hierarchy or Product), allow jumping anywhere
    if (hasProducts) {
      setActiveTab(tab);
      return;
    }

    // Fallback to sequential flow if no products/hierarchy selected yet
    if (index === 0) {
      setActiveTab(tab);
      return;
    }

    const previousTab = tabs[index - 1];
    if (completedTabs.includes(previousTab)) {
      setActiveTab(tab);
    }
  };

  const handleBack = () => {
    const index = tabs.indexOf(activeTab);
    if (index > 0) {
      setActiveTab(tabs[index - 1]);
    }
  };
  const markCompletedAndNext = () => {
    setCompletedTabs((prev) =>
      prev.includes(activeTab) ? prev : [...prev, activeTab],
    );

    const index = tabs.indexOf(activeTab);
    if (index < tabs.length - 1) {
      setActiveTab(tabs[index + 1]);
    }
  };

  console.log(payload.productSelection.selectedProducts);
  console.log(payload.productSelection.selectedParentProducts);
  const handleSave = () => {
    alert("Agreement saved");
  };

  const renderForm = () => {
    switch (activeTab) {
      case "Agreement Group":
        return (
          <AgreementGroupForm
            onComplete={markCompletedAndNext}
            data={payload.agreementGroup}
            onChange={(data) => updatePayload("agreementGroup", data)}
          />
        );

      case "Product Selection":
        return (
          <ProductSelectionForm
            onComplete={markCompletedAndNext}
            // Remove the manual setHasProducts here to prevent conflicts
            onProductsChange={(products) => {}}
            data={payload.productSelection}
            onChange={(data) => updatePayload("productSelection", data)}
          />
        );

      case "Discount Pricing Strategy":
        return (
          <DiscountPricingStrategyForm
            onComplete={markCompletedAndNext}
            prev={payload.productSelection}
            data={payload.discountPricing}
            onChange={(data) => updatePayload("discountPricing", data)}
            onChangeProduct={(data) => updatePayload("productSelection", data)}
          />
        );

      case "Agreement Header Information":
        return (
          <AgreementHeaderInformationForm
            agreementHeader={agreementHeader}
            onComplete={markCompletedAndNext}
            data={payload.agreementHeaderInfo}
            onChange={(data) => updatePayload("agreementHeaderInfo", data)}
          />
        );

      case "Information":
        return (
          <InformationForm
            onComplete={markCompletedAndNext}
            data={payload.information}
            onChange={(data) => updatePayload("information", data)}
          />
        );

      case "Select Billing Plan":
        return (
          <BillingPlanForm
            onComplete={markCompletedAndNext}
            product={payload.productSelection}
            data={payload.billingPlan}
            onChange={(data) => updatePayload("billingPlan", data)}
            onSubmit={handleFinalSubmit}
            onChangeProduct={(data) => updatePayload("productSelection", data)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        activeTab={activeTab}
        completedTabs={completedTabs}
        onSelect={handleTabSelect}
      />

      <div style={{ flex: 1 }}>
        <TopBar
          title={activeTab}
          agreementHeader={agreementName}
          mode="agreement"
          activeTab={activeTab}
          completedTabs={completedTabs}
          onAddProduct={() => setActiveTab("Product Selection")}
          onAddDiscount={() => setActiveTab("Discount Pricing Strategy")}
          onAddBilling={() => setActiveTab("Select Billing Plan")}
          onSubmitAgreement={handleFinalSubmit}
          agreementId={agreementId}
        />

        <div style={{ padding: "20px" }}>{renderForm()}</div>
      </div>
    </div>
  );
}

export default NewAgreement;
