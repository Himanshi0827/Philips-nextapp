
import { useRouter } from "next/navigation";

function TopBar({ title, onSave, agreementHeader, mode, 
    agreementId, activeTab = "", completedTabs = [], onAddProduct, 
    onAddDiscount, onAddBilling, onSubmitAgreement, isClone = false, hasSelection = false })

{
  const navigate = useRouter();

  const isAgreementCompleted = completedTabs.includes("Agreement Group");
  const isProductCompleted = completedTabs.includes("Product Selection");
  const isDiscountCompleted = completedTabs.includes("Discount Pricing Strategy");
  const isBillingCompleted = completedTabs.includes("Select Billing Plan");
  const isAfterDiscount =[
    "Discount Pricing Strategy",
    "Agreement Header Information",
    "Information",
    "Select Billing Plan"].includes(activeTab);
  return (
    <>
      <div className="app-header">
        <div className="header-left">
          <span className="logo">PHILIPS</span>
       
            <span className="agreement-title">
            |  Agreement: {agreementHeader}
            </span>
          
        </div>

        <div className="header-right">
          <button
             onClick={() => navigate.push(`/${agreementId}`)} className="btn secondary">
            Back to List
          </button>
          {mode === "agreement" ? (
  <>
    {/* STEP 1 */}
    {activeTab === "Agreement Group" && (
      <button
        className="btn primary"
        disabled={!isAgreementCompleted}
        onClick={onAddProduct}
      >
        Add Product
      </button>
    )}

    {/* STEP 2 */}
    {activeTab === "Product Selection" && (
      <button
        className="btn primary"
        disabled={!isProductCompleted}
        onClick={onAddDiscount}
      >
    Add Discount Pricing Strategy
      </button>
    )}

    {/*  SHOW ADD BILLING FROM DISCOUNT ONWARDS */}
    {[
      "Discount Pricing Strategy",
      "Agreement Header Information",
      "Information",
    ].includes(activeTab) && (
      <button
        className="btn primary"
        disabled={!isDiscountCompleted}
        onClick={onAddBilling}
      >
        Add Billing Plan
      </button>
    )}

    {/*  FINAL BUTTON AVAILABLE AFTER DISCOUNT STEP */}
 {/* //   {isAfterDiscount && ( */}
        {(isAfterDiscount || (activeTab === "Product Selection" && isProductCompleted)) && (
      <button
        className="btn success"
        disabled={!isBillingCompleted}
        onClick={onSubmitAgreement}
      >
        Create Agreement Line Items
      </button>
    )}
  </>
) : isClone ? (
  hasSelection && (
    <button className="btn primary" onClick={onSave}>
      Clone Agreement Line Items
    </button>
  )
) : (
  <button className="btn primary" onClick={onSave}>
    Save Agreement Line Items
  </button>
)}

        </div>
      </div>

      <div className="section-header">{title}</div>
    </>
  );
}

export default TopBar;
