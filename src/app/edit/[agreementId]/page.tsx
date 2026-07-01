'use client';

import { AuthGuard } from "@/components/auth-guard";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { getAgreementById } from "@/lib/api/services/agreement.service";
import { getAgreementLineItemById, updateAgreementLineItem } from "@/lib/api/services/agreement-line-item.service";
import "@/styles/FormLayout.css";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import EditAgreementGroupForm from "@/components/EditAgreementGroupForm";
import EditProductSelectionForm from "@/components/EditProductSelectionForm";
import EditDiscountPricingStrategyForm from "@/components/EditDiscountPricingStrategyForm";
import EditAgreementHeaderInformationForm from "@/components/EditAgreementHeaderInformationForm";
import EditInformationForm from "@/components/EditInformationForm";
import EditBillingPlanForm from "@/components/EditBillingPlan";

function EditAgreement() {
  const navigate = useRouter();
  const params = useParams();
const agreementId = params?.agreementId as string;
const location = useSearchParams();
 
const id =
  agreementId ||                      //  FIRST priority (URL)
  location.state?.agreementId ||     // fallback (navigation)
  null;
 
if (!id) {
  console.error("Agreement ID not found in URL or state");
}

const agreementName = typeof window !== "undefined" ? sessionStorage.getItem("agreementName") : "";
  const [agreementHeader, setAgreementHeader] = useState<any[]>([]);
   useEffect(() => {
      const fetchAgreement = async () => {
        try {
          const data = await getAgreementById(agreementId);
          console.log("Agreement Header:", data);
          setAgreementHeader(data?.[0] || null);
          console.log("Agreement Header:", agreementHeader);
        } catch (err) {
          console.error("Failed to fetch agreement:", err);
        }
      };
  
      fetchAgreement();
    }, [agreementId]);
  const tabs = [
    "Agreement Group",
    "Product Selection",
    "Discount Pricing Strategy",
    "Agreement Header Information",
    "Information",
    "Select Billing Plan",
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [completedTabs, setCompletedTabs] = useState<any[]>([]);
  const [hasProducts, setHasProducts] = useState(false);
  const [agreement, setAgreement] = useState<any[]>([]);
  const { state } = useSearchParams();
  const [originalAgreement, setOriginalAgreement] = useState<any>(null);

  const temp = typeof window !== "undefined" ? sessionStorage.getItem("agreementLineItemId") : null;
  useEffect(() => {
    const getAgreement = async () => {
      const agree = await getAgreementLineItemById(temp);

      if (agree?.length > 0) {
        console.log(agree);
        setAgreement(agree[0]);
        setOriginalAgreement(agree[0]); //  store original
        setCompletedTabs(tabs);
      }
    };

    getAgreement();
  }, [temp]);

  const handleTabSelect = (tab) => {
    const index = tabs.indexOf(tab);

    // Global unlock
    const isUnlocked = activeTab === tabs[1] && hasProducts;

    if (isUnlocked) {
      setActiveTab(tab);
      return;
    }

    if (index === 0) {
      setActiveTab(tab);
      return;
    }

    const previousTab = tabs[index - 1];

    if (completedTabs.includes(previousTab)) {
      setActiveTab(tab);
    }
  };

  const handleChange = (field, value) => {
    console.log("Field Changed:", field);
    console.log("Old Value:", agreement?.[field]);
    console.log("New Value:", value);

    setAgreement((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleSave = async () => {
    try {
      const payload = {};

      console.log("======== PUT DEBUG ========");
      console.log("Original:", originalAgreement);
      console.log("Updated:", agreement);

      const response = await updateAgreementLineItem(temp, agreement);
      if (response.Success) {
        toast.success("Agreement Line Item updated successfully");
      }

      navigate.push(`/${agreementId}`);
    } catch (err) {
      toast.error(err.Errors[0].Message);

      console.error("Update failed:", err);
      alert(`Update failed: ${err.message}`);
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case "Agreement Group":
        return (
          <EditAgreementGroupForm
            onComplete={markCompletedAndNext}
            data={agreement}
          />
        );

      case "Product Selection":
        return (
          <EditProductSelectionForm
            onComplete={markCompletedAndNext}
            data={agreement}
          />
        );

      case "Discount Pricing Strategy":
        return (
          <EditDiscountPricingStrategyForm
            data={agreement}
            onChange={handleChange}
            onComplete={markCompletedAndNext}
          />
        );

      case "Agreement Header Information":
        return (
          <EditAgreementHeaderInformationForm
            data={agreement}
            onChange={handleChange}
            onComplete={markCompletedAndNext}
            agreementHeader={agreementHeader}
          />
        );

      case "Information":
        return (
          <EditInformationForm
            data={agreement}
            onChange={handleChange}
            onComplete={markCompletedAndNext}
          />
        );

      case "Select Billing Plan":
        return (
          <EditBillingPlanForm
            data={agreement}
            onChange={handleChange}
            onComplete={markCompletedAndNext}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard>
    <div style={{ display: "flex" }}>
      <Sidebar
    
        activeTab={activeTab}
        completedTabs={completedTabs}
        onSelect={handleTabSelect}
      />

      <div style={{ flex: 1 }}>
      
        <TopBar
  title={activeTab}
  onSave={handleSave}
  mode="edit"
  agreementHeader={agreementName}
  agreementId={agreementId}
/>

        <div style={{ padding: "20px" }}>{renderForm()}</div>
      </div>
    </div>
    </AuthGuard>
  );
}

export default EditAgreement;
