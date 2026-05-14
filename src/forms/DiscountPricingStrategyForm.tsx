'use client';

import { useState,useEffect } from "react";
import  ProductList  from "../components/ProductList";
import DiscountPopup from "../components/DiscountPop";
 
function DiscountPricingStrategyForm({ data,onChange,onComplete,prev,onChangeProduct }) {
  const [discountType, setDiscountType] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeParentIndex, setActiveParentIndex] = useState(null);

 
  useEffect(()=>
  {
    prev.selectedRecords.map(p=>p.DiscountType="");
  },[])
  
 const openProductDiscountPopup = (index) => {
  setActiveIndex(index);
  setActiveParentIndex(null);
};

const openParentDiscountPopup = (index) => {
  setActiveParentIndex(index);
  setActiveIndex(null);
};

  const closePopup = () => {
    setActiveIndex(null);
  };
  const saveDiscount = (discountType,index) => {
   
    console.log(prev.selectedProducts);
    closePopup();
  };
  const [form, setForm] = useState({
   DiscountType:""
  });
 
  const [error, setError] = useState("");
 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
 
  const handleNext = () => {
    setError("");
    onComplete(); //  mark tab completed & go to next
  };
 const saveParentDiscount = (discountType, index) => {
  const parents = [...prev.selectedParentProducts];
  parents[index].DiscountType = discountType;
  onChange({ selectedParentProducts: parents });
};

  return (
    <>
    <div className="form-card Discount">
    <div className="form-card">
      
      {prev.MatchProductsBy==='Product' &&
      (
        <>
     
      <ProductList
  products={prev.selectedProducts}
  onOpenDiscount={openProductDiscountPopup}
  data={data}
  isParentTable={false}
/>
{activeIndex !== null && (
  <DiscountPopup
    product={prev.selectedProducts[activeIndex]}
    index={activeIndex}
    prev={prev}
    onSave={saveDiscount}
    onClose={() => setActiveIndex(null)}
    data={data}
    onChange={onChange}
    onChangeProduct={onChangeProduct}
    mode="PRODUCT"
  />
)}
     
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}
      
      </>)}
      {prev.selectedParentProducts?.length > 0 && (
  <>
    <h4 style={{ marginTop: '20px' }}>Parent Product Discounts</h4>
    <ProductList
      products={prev.selectedParentProducts}
      onOpenDiscount={openParentDiscountPopup}
      data={data}
      isParentTable={true} // This triggers the Child Name/Code columns
    />
  </>
)}
      
{activeParentIndex !== null && (
  <DiscountPopup
    product={prev.selectedParentProducts[activeParentIndex]}
    index={activeParentIndex}
    prev={prev}
    onSave={saveParentDiscount}
    onClose={() => setActiveParentIndex(null)}
    data={data}
    onChange={onChange}
    onChangeProduct={onChangeProduct}
    mode="PARENT"
  />
)}


    </div>
    
      {prev.MatchProductsBy==='Hierarchy' &&
    (
      <>
        <DiscountPopup
          product={prev.selectedRecords[activeIndex]}
          index={activeIndex}
          prev={prev}
          onSave={saveDiscount}
          onClose={closePopup}
          data={data}
          onChange={onChange}
        />
      
      </>
      )}
 
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}
 
     
    </div>
    </>
  );
}
 
export default DiscountPricingStrategyForm;