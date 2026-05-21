import { useState, useEffect } from "react";
import "../CSS/dashboard.css";
import "../CSS/FormLayout.css";
import { GetPicklist } from "../api/GetPicklist";

function DiscountPopup({product,mode,onSave,onClose,data,onChange,prev,index,onChangeProduct}) {
  console.log("Product values",product);
  //Hierarchy records
  const [non_Disc_Hierarchy,setNon_Disc_Hierarchy]=useState(data.non_Disc_Hierarchy ||false);
  const [hierarchyDiscount, setHierarchyDiscount] = useState(
    data.hierarchyDiscount || [],
  );
  const [tierDiscounts, setTierDiscounts] = useState(
    data.tierDiscounts || ["", "", "", "", ""],
  );

  const [scaledTier, setScaledTier] = useState(
    data.scaledTier || ["", "", "", "", ""],
  );
  const [scaledDiscounts, setScaledDiscounts] = useState(
    data.scaledDiscounts || ["", "", "", "", ""],
  );
  const [volumeT, setVolumeT] = useState(data.volumeT || ["", "", "", "", ""]);

  //Product records
  const [nonDiscountable,setNonDiscountable]=useState(product?.nonDiscountable || !product?.IsDiscountable);
 
  const [discountTypes, setDiscountType] = useState([]);
  const [productTierDiscount, setProductTierDiscount] = useState(
    data.productTierDiscount || ["", "", "", "", ""],
  );

  const [productNetPrice, setProductNetPrice] = useState(
    data.productNetPrice || ["", "", "", "", "", "", ""],
  );

  const [scaledTier_product, setScaledTierProduct] = useState(
    data.scaledDiscounts_product || ["", "", "", "", ""],
  );
  const [scaledDiscounts_product, setScaledDiscountsProduct] = useState(
    data.scaledDiscounts_product || ["", "", "", "", ""],
  );
  const [volumeT_product, setVolumeTProduct] = useState(
    data.volumeT_product || ["", "", "", "", ""],
  );

  const [productScaledNetPrice, setProductScaledNetPrice] = useState(
    data.productScaledNetPrice || ["", "", "", "", "", "", ""],
  );
  const [productScaledDiscountAmt, setProductScaledDiscountAmt] = useState(
    data.productScaledDiscountAmt || ["", "", "", "", ""],
  );
  const [productVolumeThreshold, setProductVolumeThreshold] = useState(
    data.productVolumeThreshold || ["", "", "", "", ""],
  );

  const [selectedDiscount, setSelectedDiscount] = useState(
    data.selectedDiscount || "None",
  );
  const [form, setForm] = useState({
    DiscountType: "",
  });
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const hasValue = (value) => value !== "" && value != null;

  const isVolumeThresholdInOrder = (thresholds) => {
    let lastValue = null;
    for (let i = 0; i < thresholds.length; i++) {
      if (hasValue(thresholds[i])) {
        const currentValue = Number(thresholds[i]);
        if (lastValue !== null && currentValue <= lastValue) {
          return false;
        }
        lastValue = currentValue;
      }
    }
    return true;
  };

  const showErrorToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const canEditVolumeThreshold = (discounts, thresholds, ind) => {
    if (hasValue(thresholds[ind])) return true;
    return ind === 0
      ? hasValue(discounts[0])
      : hasValue(discounts[ind]) && hasValue(thresholds[ind - 1]);
  };

  useEffect(() => {
    const discounts = async () => {
      try {
        const res1 = await GetPicklist("APTS_Discount_Type_c");
        if (res1.Success) {
          const picklist = res1.Data.PicklistMetadata[0].PicklistEntries;
          setDiscountType(picklist);
          setHierarchyDiscount(
            data.hierarchyDiscount ||
              picklist.filter((d) => d.Value.toLowerCase().includes("tier")),
          );
          setTierDiscounts(data.tierDiscounts || ["", "", "", "", ""]);
          
          setSelectedDiscount(product?.DiscountType || "None");
          //hierarchy
          setScaledDiscounts(data.scaledDiscounts || ["", "", "", "", ""]);
          setScaledTier(data.scaledTier || ["", "", "", "", ""]);
          setVolumeT(data.volumeT || ["", "", "", "", ""]);

          setNon_Disc_Hierarchy(data?.non_Disc_Hierarchy||false);

          setProductTierDiscount(product?.Discounts || ["", "", "", "", ""]);
          
          setProductNetPrice(
            product?.Discounts || ["", "", "", "", "", "", ""],
          );
          
          setScaledTierProduct(
            product?.Discounts[0]?.TierDiscount || ["", "", "", "", ""],
          );
          setScaledDiscountsProduct(
            product?.Discounts[1]?.scaledDiscount || ["", "", "", "", ""],
          );
          setVolumeTProduct(
            product?.Discounts[2]?.VolumeThreshold || ["", "", "", "", ""],
          );

    
          setProductScaledNetPrice(
            product?.Discounts[0]?.NetPrice || ["", "", "", "", "", "", ""],
          );
          setProductScaledDiscountAmt(
            product?.Discounts[1]?.ScaledDiscountAmt || ["", "", "", "", ""],
          );
          setProductVolumeThreshold(
            product?.Discounts[2]?.VolumeThreshold || ["", "", "", "", ""],
          );
        }
        if (product?.IsDiscountable === false) {
          setNonDiscountable(true);
          const updatedProducts = [...prev.selectedProducts];
          updatedProducts[index] = {  ...updatedProducts[index],  nonDiscountable: true, };
          onChangeProduct({ selectedProducts: updatedProducts });
          console.log("It's working ")
        } else {
          setNonDiscountable(product?.nonDiscountable || false);
        }
      } catch (err) {
        console.error("Failed to fetch ", err?.err);
      }
    };
    discounts();
  }, []);

  
  const handleFocus = (ind, fieldname) => {
    const handler = focushandler[fieldname];

    if (handler) {
      handler(ind);
    }
  };

  const focushandler = {
    "Tier Discount": (ind) => {
      const val = scaledTier[ind];
      if (val !== "" && val != null)
        handleScaleChange(ind, "Tier Discount", Number(val).toString());
    },
    "Scaled Discount": (ind) => {
      const val = scaledDiscounts[ind];
      if (val !== "" && val != null)
        handleScaleChange(ind, "Scaled Discount", Number(val).toString());
    },
    "Volume Threshold": (ind) => {
      const val = volumeT[ind];
      if (val !== "" && val != null)
        handleScaleChange(ind, "Volume Threshold", Number(val).toString());
    },
    "Tier Discount Main": (ind) => {
      const val =
        prev.MatchProductsBy === "Hierarchy"
          ? tierDiscounts[ind]
          : prev.MatchProductsBy === "Product"
            ? productTierDiscount[ind]
            : "";
     
      console.log("tier:", val);
      if (val !== "" && val != null)
        handleTierChange(ind, Number(val).toString());
    },
    "Tier Discount Product": (ind) => {
      const val = scaledTier_product[ind];
      if (val !== "" && val != null)
        handleScaleChange_product(ind, "Tier Discount", Number(val).toString());
    },
    "Scaled Discount Product": (ind) => {
      const val = scaledDiscounts_product[ind];
      if (val !== "" && val != null)
        handleScaleChange_product(
          ind,
          "Scaled Discount",
          Number(val).toString(),
        );
    },
    "Volume Threshold Product": (ind) => {
      const val = volumeT_product[ind];
      if (val !== "" && val != null)
        handleScaleChange_product(
          ind,
          "Volume Threshold",
          Number(val).toString(),
        );
    },
    "Net Price Override": (ind) => {
      const val = productNetPrice[ind];
      if (val !== "" && val != null)
        handleOverrideChange(ind, "Net Price Override", Number(val).toString());
    },
    "Net Price Scaled Override": (ind) => {
      const val = productScaledNetPrice[ind];
      if (val !== "" && val != null)
        handleScaledNetChange(
          ind,
          "Net Price Override",
          Number(val).toString(),
        );
    },
    "Scaled Discount Amount": (ind) => {
      const val = productScaledDiscountAmt[ind];
      if (val !== "" && val != null)
        handleScaledNetChange(
          ind,
          "Scaled Discount Amount",
          Number(val).toString(),
        );
    },
    "Volume Threshold Net": (ind) => {
      const val = productVolumeThreshold[ind];
      if (val !== "" && val != null)
        handleScaledNetChange(ind, "Volume Threshold", Number(val).toString());
    },
  };

  const handleBlur = (ind, fieldname, value) => {
    if (!value) return;
    const format = Number(value).toFixed(2);
    const handler = blurHandler[fieldname];
    if (handler) {
      handler(ind, format);
    }
  };

  const blurHandler = {
    "Tier Discount": (i, v) => handleScaleChange(i, "Tier Discount", v),
    "Scaled Discount": (i, v) => handleScaleChange(i, "Scaled Discount", v),
    "Volume Threshold": (i, v) => handleScaleChange(i, "Volume Threshold", v),
    "Tier Discount Main": (i, v) => handleTierChange(i, v),
    "Tier Discount Product": (i, v) =>
      handleScaleChange_product(i, "Tier Discount", v),
    "Scaled Discount Product": (i, v) =>
      handleScaleChange_product(i, "Scaled Discount", v),
    "Volume Threshold Product": (i, v) =>
      handleScaleChange_product(i, "Volume Threshold", v),
    "Net Price Override": (i, v) =>
      handleOverrideChange(i, "Net Price Override", v),
    "Net Price Scaled Override": (i, v) =>
      handleScaledNetChange(i, "Net Price Override", v),
    "Scaled Discount Amount": (i, v) =>
      handleScaledNetChange(i, "Scaled Discount Amount", v),
    "Volume Threshold Net": (i, v) =>
      handleScaledNetChange(i, "Volume Threshold", v),
  };

  const handleTierChange = (ind, value) => {
    if (value > 100) {
      value = 100;
    } else if (value <= 0) {
      value = null;
    }
    if (prev.MatchProductsBy === "Hierarchy") {
      const updatedTiers = [...tierDiscounts];
      updatedTiers[ind] = value;
      setTierDiscounts(updatedTiers);
      onChange({ ...data, tierDiscounts: updatedTiers });
    } else if (prev.MatchProductsBy === "Product") {
      const update_records = [...productTierDiscount];
      update_records[ind] = value;
      setProductTierDiscount(update_records);
      onChange({ ...data, productTierDiscount: update_records });
    }
  };

  const handleScaleChange = (ind, fieldname, value) => {
    if (fieldname === "Tier Discount") {
      if (value > 100) {
        value = 100;
      } else if (value <= 0) {
        value = null;
      }
      const updatedTier_discount = [...scaledTier];
      updatedTier_discount[ind] = value;
      setScaledTier(updatedTier_discount);
      onChange({ ...data, scaledTier: updatedTier_discount });
    }
    if (fieldname === "Scaled Discount") {
      if (value > 100) {
        value = 100;
      } else if (value <= 0) {
        value = null;
      }
      const updateScaled_discount = [...scaledDiscounts];
      updateScaled_discount[ind] = value;
      setScaledDiscounts(updateScaled_discount);
      onChange({ ...data, scaledDiscounts: updateScaled_discount });
    }
    if (fieldname === "Volume Threshold") {
      if (value === "" || value == null) {
        value = null;
      }

      if (value != null && value <= 0) {
        value = null;
      }

      const update_threshold = [...volumeT];
      update_threshold[ind] = value;
      setVolumeT(update_threshold);
      onChange({ ...data, volumeT: update_threshold });
    }
  };

  const handleChange = (e) => {
    onChange({
      [e.target.name]: e.target.value,
    });
    prev.DiscountType = e.target.value;
    console.log(e.target.value);
    setForm({
      ...form,
      [e.target.name]: [e.target.value],
    });

    if (
      e.target.value === "None" ||
      e.target.value === "Tier Discount" ||
      e.target.value === "Tier Discount % + Scaled"
    ) {
      setTierDiscounts(["", "", "", "", ""]);
      setScaledDiscounts(["", "", "", "", ""]);
      setScaledTier(["", "", "", "", ""]);
      setVolumeT(["", "", "", "", ""]);
    }
  };

  const handleDiscountChange = (e) => {
    setSelectedDiscount(e.target.value);
    // onChange({...data,selectedDiscount:e.target.value});
    if (
      e.target.value === "None" ||
      e.target.value === "Tier Discount" ||
      e.target.value === "Net Price Override" ||
      e.target.value === "Tier Discount % + Scaled" ||
      e.target.value === "Net Price Override + Scaled"
    ) {
      setProductTierDiscount(["", "", "", "", ""]);

      setProductNetPrice(["", "", "", "", "", "", ""]);

      setScaledTierProduct(["", "", "", "", ""]);
      setScaledDiscountsProduct(["", "", "", "", ""]);
      setVolumeTProduct(["", "", "", "", ""]);

      setProductScaledNetPrice(["", "", "", "", "", "", ""]);
      setProductScaledDiscountAmt(["", "", "", "", ""]);
      setProductVolumeThreshold(["", "", "", "", ""]);
    }
  };

  const handleScaleChange_product = (ind, fieldname, value) => {
    if (fieldname === "Tier Discount") {
      if (value > 100) {
        value = 100;
      } else if (value <= 0) {
        value = null;
      }
      const updatedTier_discount = [...scaledTier_product];
      updatedTier_discount[ind] = value;
      setScaledTierProduct(updatedTier_discount);
      onChange({ ...data, scaledTier_product: updatedTier_discount });
    }
    if (fieldname === "Scaled Discount") {
      if (value > 100) {
        value = 100;
      } else if (value <= 0) {
        value = null;
      }
      const updateScaled_discount = [...scaledDiscounts_product];
      updateScaled_discount[ind] = value;
      setScaledDiscountsProduct(updateScaled_discount);
      onChange({ ...data, scaledDiscounts_product: updateScaled_discount });
    }
    if (fieldname === "Volume Threshold") {
      if (value === "" || value == null) {
        value = null;
      }

      if (value != null && value <= 0) {
        value = null;
      }

      const update_threshold = [...volumeT_product];
      update_threshold[ind] = value;
      setVolumeTProduct(update_threshold);
      onChange({ ...data, volumeT_product: update_threshold });
    }
  };

  const handleOverrideChange = (ind, fieldname, value) => {
    if (fieldname === "Net Price Override") {
  
      const update_net = [...productNetPrice];
      update_net[ind] = value;
      setProductNetPrice(update_net);
      onChange({ ...data, productNetPrice: update_net });
    } else if (fieldname === "Scaled Discount Amount") {
      const update = [...productScaledDiscountAmt];
      console.log(update);
      update[ind] = value;
      setProductScaledDiscountAmt(update);
      onChange({ ...data, productScaledDiscountAmt: update });
    }
  };

  const handleScaledNetChange = (ind, fieldname, value) => {
    if (fieldname === "Net Price Override") {
   
      const update_net = [...productScaledNetPrice];
      update_net[ind] = value;
      setProductScaledNetPrice(update_net);
      onChange({ ...data, productScaledNetPrice: update_net });
    } else if (fieldname === "Scaled Discount Amount") {
      if (value <=  0) {
        value = null;
      }
      const update = [...productScaledDiscountAmt];
      update[ind] = value;
      setProductScaledDiscountAmt(update);
      onChange({ ...data, productScaledDiscountAmt: update });
    } else if (fieldname === "Volume Threshold") {
      if (value === "" || value == null) {
        value = null;
      }

      if (value != null && value <= 0) {
        value = null;
      }

      const update = [...productVolumeThreshold];
      update[ind] = value;
      setProductVolumeThreshold(update);
      onChange({ ...data, productVolumeThreshold: update });
    }
  };

  const handleNonDiscountable = (bool_value) => {
    // 1. Logic Guard: If product is hard-coded as not discountable in DB
    if (product?.IsDiscountable === false) {
      bool_value = true;
    }
   
    // 2. Update local UI state
    setNonDiscountable(bool_value);
   
    // 3. Update the parent state so Row A doesn't affect Row B
    if (mode === "PRODUCT") {
      const updatedProducts = [...prev.selectedProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        nonDiscountable: bool_value,
      };
      onChangeProduct({ selectedProducts: updatedProducts });
    } else if (mode === "PARENT") {
      const updatedParents = [...prev.selectedParentProducts];
      updatedParents[index] = {
        ...updatedParents[index],
        nonDiscountable: bool_value,
      };
      onChangeProduct({ selectedParentProducts: updatedParents });
    }
   
    // 4. Clear values if non-discountable is true
    if (bool_value) {
      setProductTierDiscount(["", "", "", "", ""]);
      setProductNetPrice(["", "", "", "", "", "", ""]);
      setScaledTierProduct(["", "", "", "", ""]);
      setScaledDiscountsProduct(["", "", "", "", ""]);
      setVolumeTProduct(["", "", "", "", ""]);
      setProductScaledNetPrice(["", "", "", "", "", "", ""]);
      setProductScaledDiscountAmt(["", "", "", "", ""]);
      setProductVolumeThreshold(["", "", "", "", ""]);
    }
  };

  const handleNon_Disc_Hierarchy= (bool_value)=>
  {
    setNon_Disc_Hierarchy(bool_value);
    onChange({non_Disc_Hierarchy:bool_value});
    if(bool_value)
    {
      setTierDiscounts(["","","","",""]);
      setScaledTier(["","","","",""]);
      setScaledDiscounts(["","","","",""]);
      setVolumeT(["","","","",""]);
    }
  }

  const handleClose = () => {
    // data.selectedDiscount=product.DiscountType??'';
    onClose();
  };
  const buildDiscountPayload = (type) => {
    if (type === "Tier Discount") {
      return [...productTierDiscount];
    }

    if (type === "Net Price Override") {
      return [...productNetPrice];
    }

    if (type === "Tier Discount % + Scaled") {
      const merged = [
        { TierDiscount: [...scaledTier_product] },
        { scaledDiscount: [...scaledDiscounts_product] },
        { VolumeThreshold: [...volumeT_product] },
      ];
      return merged;
 
    }

    if (type === "Net Price Override + Scaled") {
      const merged = [
        { NetPrice: [...productScaledNetPrice] },
        { ScaledDiscountAmt: [...productScaledDiscountAmt] },
        { VolumeThreshold: [...productVolumeThreshold] },
      ];
      return merged;
    }

    return [];
  };
  // const handleSave = (selectedDiscount, index) => {
  //   // Validate volume thresholds for discount types that use them
  //   if (selectedDiscount === "Tier Discount % + Scaled") {
  //     if (!isVolumeThresholdInOrder(volumeT_product)) {
  //       showErrorToast("Volume Threshold should be in increasing order");
  //       return;
  //     }
  //   }

  //   if (selectedDiscount === "Net Price Override + Scaled") {
  //     if (!isVolumeThresholdInOrder(productVolumeThreshold)) {
  //       showErrorToast("Volume Threshold should be in increasing order");
  //       return;
  //     }
  //   }

  //   if (data.DiscountType === "Tier Discount % + Scaled") {
  //     if (!isVolumeThresholdInOrder(volumeT)) {
  //       showErrorToast("Volume Threshold should be in increasing order");
  //       return;
  //     }
  //   }

  //   onSave(selectedDiscount, index);

  //   if (mode === "PRODUCT") {
  //     const products = [...prev.selectedProducts];
  //     products[index] = {
  //       ...products[index],
  //       DiscountType: selectedDiscount,
  //       Discounts: buildDiscountPayload(selectedDiscount),
  //     };
  //     onChangeProduct({ selectedProducts: products });
  //   }

  //   if (mode === "PARENT") {
  //     const parents = [...prev.selectedParentProducts];
  //     parents[index] = {
  //       ...parents[index],
  //       DiscountType: selectedDiscount,
  //       Discounts: buildDiscountPayload(selectedDiscount),
  //     };
  //     onChangeProduct({ selectedParentProducts: parents });
  //   }

  //   onClose();
  // };
const isFilledNetPrice=(scaled,volume)=>{
    for(let i=0;i<scaled.length;i++)
    {
      if(scaled[i] && !volume[i])
      {
        showErrorToast(`🚫 Please enter corresponding Volume Threshold for Scaled Discount Amount, Tier ${i+1}`);
        return true;
      }
      if(!scaled[i] && volume[i])
      {
        showErrorToast(`🚫 Please enter corresponding Scaled Discount Amount, Tier for Volume Threshold ${i+1}`);
        return true;
      }
    }
  }
  const isFilled=(scaled,volume)=>{
    for(let i=0;i<scaled.length;i++)
    {
      if(scaled[i] && !volume[i])
      {
        showErrorToast(`🚫 Please enter corresponding Volume Threshold for Scaled Discount %, Tier ${i+1}`);
        return true;
      }
      if(!scaled[i] && volume[i])
      {
        showErrorToast(`🚫 Please enter corresponding Scaled Discount %, Tier for Volume Threshold ${i+1}`);
        return true;
      }
    }
  }
  const handleSave = (selectedDiscount, index) => {
    // Validate volume thresholds for discount types that use them
    if (selectedDiscount === "Tier Discount % + Scaled") {
      if (!isVolumeThresholdInOrder(volumeT_product)) {
        showErrorToast("Volume Threshold should be in increasing order");
        return;
      }
      if(isFilled(scaledDiscounts_product,volumeT_product))
      {
        return;
      }
    }
 
    if (selectedDiscount === "Net Price Override + Scaled") {
      if (!isVolumeThresholdInOrder(productVolumeThreshold)) {
        showErrorToast("Volume Threshold should be in increasing order");
        return;
      }
      if(isFilledNetPrice(productScaledDiscountAmt,productVolumeThreshold))
      {
        return;
      }
    }
 
    if (data.DiscountType === "Tier Discount % + Scaled") {
      if (!isVolumeThresholdInOrder(volumeT)) {
        showErrorToast("Volume Threshold should be in increasing order");
        return;
      }
    }
 
    onSave(selectedDiscount, index);
 
    if (mode === "PRODUCT") {
      const products = [...prev.selectedProducts];
      products[index] = {
        ...products[index],
        DiscountType: selectedDiscount,
        Discounts: buildDiscountPayload(selectedDiscount),
      };
      onChangeProduct({ selectedProducts: products });
    }
 
    if (mode === "PARENT") {
      const parents = [...prev.selectedParentProducts];
      parents[index] = {
        ...parents[index],
        DiscountType: selectedDiscount,
        Discounts: buildDiscountPayload(selectedDiscount),
      };
      onChangeProduct({ selectedParentProducts: parents });
    }
 
    onClose();
  };

  return (
    <>
      {prev.MatchProductsBy === "Product" && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>
                Discount Pricing Strategy for{" "}
                {mode === "PARENT" ? "Parent Product" : "Product"}:{" "}
                {product.Name}
              </h3>
              {/* <h3>Discount Pricing Strategy for {product.Name}</h3> */}
            </div>

            <div className="modal-body">
              <div className="table-containerpop"></div>
              <table className="form-table">
                <tbody>
                  <tr>
                    <td className="label">
                      <label>Discount Type</label>
                    </td>
                    <td>
                      <select
                        name="DiscountType"
                        value={selectedDiscount}
                        onChange={handleDiscountChange}
                      >
                        {discountTypes.map((discounttype) => (
                          <option
                            key={discounttype.Value}
                            value={discounttype.Value}
                          >
                            {discounttype.Value}
                          </option>
                        ))}{" "}
                      </select>
                    </td>
                    <td>
                    { selectedDiscount !=="None" && selectedDiscount!=="" &&
                    <div className="toggle-row" style={{paddingTop:"15px"}}>
                  <span>Not Discountable</span>
                  <label className="switch">
                    <input type="checkbox" checked={nonDiscountable} disabled={product?.IsDiscountable === false}
                    style={{ backgroundColor: !product?.IsDiscountable ? "#e0e0e0" : "white",
                      cursor: !product?.IsDiscountable ? "not-allowed" : "text" }}
                    onChange={(e) => handleNonDiscountable(e.target.checked)} />
                  <span className="slider"></span>
                  </label>
                </div>}
                </td>
                  </tr>
                  <tr></tr>

                  {selectedDiscount === "Tier Discount" && (
                    <tr>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {productTierDiscount.map(
                            (value, ind) =>
                              ind < 3 && (
                                <>
                                  <label>%Discount, Tier {ind + 1}</label>
                                  <input
                                    key={ind}
                                    type="number"
                                    step="0.01"
                                    value={productTierDiscount[ind] ?? ""}
                                    readOnly={
                                      data?.nonDiscountable ||
                                      (ind > 0 &&
                                      !productTierDiscount[ind - 1] &&
                                      !productTierDiscount[ind])
                                    }
                                    onChange={(e) =>
                                      handleTierChange(ind, e.target.value)
                                    }
                                    style={{
                                      backgroundColor:
                                        nonDiscountable ||(ind > 0 &&
                                        !productTierDiscount[ind - 1] &&
                                        !productTierDiscount[ind])
                                          ? "#e0e0e0"
                                          : "white",
                                      cursor:
                                        nonDiscountable||(ind > 0 &&
                                        !productTierDiscount[ind - 1] &&
                                        !productTierDiscount[ind])
                                          ? "not-allowed"
                                          : "text",
                                    }}
                                    onBlur={(e) =>
                                      handleBlur(
                                        ind,
                                        "Tier Discount Main",
                                        e.target.value,
                                      )
                                    }
                                    onFocus={() =>
                                      handleFocus(ind, "Tier Discount Main")
                                    }
                                    min="0"
                                    max="100"
                                  />
                                </>
                              ),
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {productTierDiscount.map(
                            (value, ind) =>
                              ind >= 3 && (
                                <>
                                  <label>%Discount, Tier {ind + 1}</label>
                                  <input
                                    key={ind}
                                    type="number"
                                    value={productTierDiscount[ind] ?? ""}
                                    step="0.01"
                                    readOnly={
                                      !productTierDiscount[ind - 1] &&
                                      !productTierDiscount[ind]
                                    }
                                    onChange={(e) =>
                                      handleTierChange(ind, e.target.value)
                                    }
                                    style={{
                                      backgroundColor:
                                        !productTierDiscount[ind - 1] &&
                                        !productTierDiscount[ind]
                                          ? "#e0e0e0"
                                          : "white",
                                      cursor:
                                        !productTierDiscount[ind - 1] &&
                                        !productTierDiscount[ind]
                                          ? "not-allowed"
                                          : "text",
                                    }}
                                    onBlur={(e) =>
                                      handleBlur(
                                        ind,
                                        "Tier Discount Main",
                                        e.target.value,
                                      )
                                    }
                                    onFocus={() =>
                                      handleFocus(ind, "Tier Discount Main")
                                    }
                                  />
                                </>
                              ),
                          )}
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                      </td>
                    </tr>
                  )}

                  {selectedDiscount === "Net Price Override" && (
                    <tr>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {productNetPrice.map(
                            (value, ind) =>
                              ind < 4 && (
                                <>
                                  <label>
                                    Net Price Override, Tier {ind + 1}(USD)
                                  </label>
                                  <input
                                    key={ind}
                                    type="number"
                                    step="0.01"
                                    value={productNetPrice[ind] ?? ""}
                                    readOnly={
                                      nonDiscountable ||(ind > 0 &&
                                      !productNetPrice[ind - 1] &&
                                      !productNetPrice[ind])
                                    }
                                    onChange={(e) =>
                                      handleOverrideChange(
                                        ind,
                                        "Net Price Override",
                                        e.target.value,
                                      )
                                    }
                                    style={{
                                      backgroundColor:
                                        nonDiscountable ||(ind > 0 &&
                                        !productNetPrice[ind - 1] &&
                                        !productNetPrice[ind])
                                          ? "#e0e0e0"
                                          : "white",
                                      cursor:
                                        nonDiscountable ||(ind > 0 &&
                                        !productNetPrice[ind - 1] &&
                                        !productNetPrice[ind])
                                          ? "not-allowed"
                                          : "text",
                                    }}
                                    onBlur={(e) =>
                                      handleBlur(
                                        ind,
                                        "Net Price Override",
                                        e.target.value,
                                      )
                                    }
                                    onFocus={() =>
                                      handleFocus(ind, "Net Price Override")
                                    }
                                    min="0"
                                    max="100"
                                  />
                                </>
                              ),
                          )}
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {productNetPrice.map(
                            (value, ind) =>
                              ind > 3 && (
                                <>
                                  <label>
                                    Net Price Override, Tier {ind + 1}(USD)
                                  </label>
                                  <input
                                    key={ind}
                                    type="number"
                                    value={productNetPrice[ind] ?? ""}
                                    step="0.01"
                                    readOnly={
                                      !productNetPrice[ind - 1] &&
                                      !productNetPrice[ind]
                                    }
                                    onChange={(e) =>
                                      handleOverrideChange(
                                        ind,
                                        "Net Price Override",
                                        e.target.value,
                                      )
                                    }
                                    style={{
                                      backgroundColor:
                                        !productNetPrice[ind - 1] &&
                                        !productNetPrice[ind]
                                          ? "#e0e0e0"
                                          : "white",
                                      cursor:
                                        !productNetPrice[ind - 1] &&
                                        !productNetPrice[ind]
                                          ? "not-allowed"
                                          : "text",
                                    }}
                                    onBlur={(e) =>
                                      handleBlur(
                                        ind,
                                        "Net Price Override",
                                        e.target.value,
                                      )
                                    }
                                    onFocus={() =>
                                      handleFocus(ind, "Net Price Override")
                                    }
                                  />
                                </>
                              ),
                          )}
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                      </td>
                    </tr>
                  )}

                  {selectedDiscount === "Tier Discount % + Scaled" && (
                    <tr>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {scaledTier_product.map((value, ind) => (
                            <>
                              <label>%Discount, Tier {ind + 1}</label>
                              <input
                                key={ind}
                                type="number"
                                step="0.01"
                                value={scaledTier_product[ind] ?? ""}
                                readOnly={
                                  nonDiscountable ||(ind > 0 &&
                                  !scaledTier_product[ind - 1] &&
                                  !scaledTier_product[ind])
                                }
                                onChange={(e) =>
                                  handleScaleChange_product(
                                    ind,
                                    "Tier Discount",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  backgroundColor:
                                    nonDiscountable||(ind > 0 &&
                                    !scaledTier_product[ind - 1] &&
                                    !scaledTier_product[ind])
                                      ? "#e0e0e0"
                                      : "white",
                                  cursor:
                                    nonDiscountable||(ind > 0 &&
                                    !scaledTier_product[ind - 1] &&
                                    !scaledTier_product[ind])
                                      ? "not-allowed"
                                      : "text",
                                }}
                                onBlur={(e) =>
                                  handleBlur(
                                    ind,
                                    "Tier Discount Product",
                                    e.target.value,
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(ind, "Tier Discount Product")
                                }
                              />
                            </>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {scaledDiscounts_product.map((value, ind) => (
                            <>
                              <label>Scaled Discount %, Tier {ind + 1}</label>
                              <input
                                key={ind}
                                type="number"
                                value={scaledDiscounts_product[ind] ?? ""}
                                step="0.01"
                                readOnly={
                                  (ind === 0
                                    ? !scaledTier_product[0] &&
                                      !scaledDiscounts_product[ind]
                                    : !scaledDiscounts_product[ind - 1] &&
                                      !scaledDiscounts_product[ind])
                                }
                                onChange={(e) =>
                                  handleScaleChange_product(
                                    ind,
                                    "Scaled Discount",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  backgroundColor: (
                                    ind === 0
                                      ? !scaledTier_product[0] &&
                                        !scaledDiscounts_product[ind]
                                      : !scaledDiscounts_product[ind - 1] &&
                                        !scaledDiscounts_product[ind]
                                  )
                                    ? "#e0e0e0"
                                    : "white",
                                  cursor: (
                                    ind === 0
                                      ? !scaledTier_product[0] &&
                                        !scaledDiscounts_product[ind]
                                      : !scaledDiscounts_product[ind - 1] &&
                                        !scaledDiscounts_product[ind]
                                  )
                                    ? "not-allowed"
                                    : "text",
                                }}
                                onBlur={(e) =>
                                  handleBlur(
                                    ind,
                                    "Scaled Discount Product",
                                    e.target.value,
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(ind, "Scaled Discount Product")
                                }
                              />
                            </>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {volumeT_product.map((value, ind) => {
                            const disabled = !canEditVolumeThreshold(
                              scaledDiscounts_product,
                              volumeT_product,
                              ind,
                            );
                            return (
                              <>
                                <label>Volume Threshold{ind + 1}</label>
                                <input
                                  key={ind}
                                  type="number"
                                  value={volumeT_product[ind] ?? ""}
                                  step="0.01"
                                  readOnly={disabled}
                                  onChange={(e) =>
                                    handleScaleChange_product(
                                      ind,
                                      "Volume Threshold",
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    backgroundColor: disabled
                                      ? "#e0e0e0"
                                      : "white",
                                    cursor: disabled ? "not-allowed" : "text",
                                  }}
                                  onBlur={(e) =>
                                    handleBlur(
                                      ind,
                                      "Volume Threshold Product",
                                      e.target.value,
                                    )
                                  }
                                  onFocus={() =>
                                    handleFocus(ind, "Volume Threshold Product")
                                  }
                                />
                              </>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}

                  {selectedDiscount === "Net Price Override + Scaled" && (
                    <tr>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {productScaledNetPrice.map((value, ind) => (
                            <>
                              <label>
                                Net Price Override, Tier {ind + 1}(USD)
                              </label>
                              <input
                                key={ind}
                                type="number"
                                step="0.01"
                                value={productScaledNetPrice[ind] ?? ""}
                                readOnly={
                                  nonDiscountable||(ind > 0 &&
                                  !productScaledNetPrice[ind - 1] &&
                                  !productScaledNetPrice[ind])
                                }
                                onChange={(e) =>
                                  handleScaledNetChange(
                                    ind,
                                    "Net Price Override",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  backgroundColor:
                                    nonDiscountable||(ind > 0 &&
                                    !productScaledNetPrice[ind - 1] &&
                                    !productScaledNetPrice[ind])
                                      ? "#e0e0e0"
                                      : "white",
                                  cursor:
                                    ind > 0 &&
                                    !productScaledNetPrice[ind - 1] &&
                                    !productScaledNetPrice[ind]
                                      ? "not-allowed"
                                      : "text",
                                }}
                                onBlur={(e) =>
                                  handleBlur(
                                    ind,
                                    "Net Price Scaled Override",
                                    e.target.value,
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(ind, "Net Price Scaled Override")
                                }
                                min="0"
                                max="100"
                              />
                            </>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {productScaledDiscountAmt.map((value, ind) => (
                            <>
                              <label>
                                Scaled Discount Amount, Tier {ind + 1}(USD)
                              </label>
                              <input
                                key={ind}
                                type="number"
                                step="0.01"
                                value={productScaledDiscountAmt[ind] ?? ""}
                                readOnly={
                                  ind === 0
                                    ? !productScaledNetPrice[0] &&
                                      !productScaledDiscountAmt[ind]
                                    : !productScaledDiscountAmt[ind - 1] &&
                                      !productScaledDiscountAmt[ind]
                                }
                                onChange={(e) =>
                                  handleScaledNetChange(
                                    ind,
                                    "Scaled Discount Amount",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  backgroundColor: (
                                    ind === 0
                                      ? !productScaledNetPrice[0] &&
                                        !productScaledDiscountAmt[ind]
                                      : !productScaledDiscountAmt[ind - 1] &&
                                        !productScaledDiscountAmt[ind]
                                  )
                                    ? "#e0e0e0"
                                    : "white",
                                  cursor: (
                                    ind === 0
                                      ? !productScaledNetPrice[0] &&
                                        !productScaledDiscountAmt[ind]
                                      : !productScaledDiscountAmt[ind - 1] &&
                                        !productScaledDiscountAmt[ind]
                                  )
                                    ? "not-allowed"
                                    : "text",
                                }}
                                onBlur={(e) =>
                                  handleBlur(
                                    ind,
                                    "Scaled Discount Amount",
                                    e.target.value,
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(ind, "Scaled Discount Amount")
                                }
                                min="0"
                                max="100"
                              />
                            </>
                          ))}
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {productVolumeThreshold.map((value, ind) => {
                            const disabled = !canEditVolumeThreshold(
                              productScaledDiscountAmt,
                              productVolumeThreshold,
                              ind,
                            );
                            return (
                              <>
                                <label>Volume Threshold{ind + 1}</label>
                                <input
                                  key={ind}
                                  type="number"
                                  value={productVolumeThreshold[ind] ?? ""}
                                  step="0.01"
                                  readOnly={disabled}
                                  onChange={(e) =>
                                    handleScaledNetChange(
                                      ind,
                                      "Volume Threshold",
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    backgroundColor: disabled
                                      ? "#e0e0e0"
                                      : "white",
                                    cursor: disabled ? "not-allowed" : "text",
                                  }}
                                  onBlur={(e) =>
                                    handleBlur(
                                      ind,
                                      "Volume Threshold Net",
                                      e.target.value,
                                    )
                                  }
                                  onFocus={() =>
                                    handleFocus(ind, "Volume Threshold Net")
                                  }
                                />
                              </>
                            );
                          })}
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => handleSave(selectedDiscount, index)}
                className="modal-btn-save"
              >
                Save
              </button>
              <button onClick={handleClose} className="modal-btn-cancel">
                Cancel
              </button>
            </div>
            {showToast && (
              <div
                style={{
                  position: "fixed",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "15px 20px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  zIndex: 9999,
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {toastMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {prev.MatchProductsBy === "Hierarchy" && (
        <>
          <table className="form-table">
            <tbody>
              <tr>
                <td className="label">
                  <label>Discount Type</label>
                </td>
                <td>
                  <select
                    name="DiscountType"
                    value={prev.DiscountType}
                    onChange={handleChange}
                  >
                    <option value="None">None</option>
                    {hierarchyDiscount.map((discounttype) => (
                      <option
                        key={discounttype.Value}
                        value={discounttype.Value}
                      >
                        {discounttype.Value}
                      </option>
                    ))}{" "}
                  </select>
                </td>
                <td>
                {
                    prev.DiscountType !=="None" && prev.DiscountType!==undefined &&
                  <div className="toggle-row" style={{paddingTop:"15px", paddingRight:"10px"}}>
                  <span>Not Discountable</span>
                  <label className="switch">
                    <input type="checkbox" checked={non_Disc_Hierarchy}
                    onChange={(e) => handleNon_Disc_Hierarchy(e.target.checked)} />
                  <span className="slider"></span>
                  </label>
                </div>}
                </td>
              </tr>
              <tr></tr>

              {data.DiscountType === "Tier Discount" && (
                <tr>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {tierDiscounts.map(
                        (value, ind) =>
                          ind < 3 && (
                            <>
                              <label>%Discount, Tier {ind + 1}</label>
                              <input
                                key={ind}
                                type="number"
                                step="0.01"
                                value={tierDiscounts[ind] ?? ""}
                                readOnly={
                                  non_Disc_Hierarchy ||(ind > 0 &&
                                  !tierDiscounts[ind - 1] &&
                                  !tierDiscounts[ind])
                                }
                                onChange={(e) =>
                                  handleTierChange(ind, e.target.value)
                                }
                                style={{
                                  backgroundColor:
                                    non_Disc_Hierarchy ||(ind > 0 &&
                                    !tierDiscounts[ind - 1] &&
                                    !tierDiscounts[ind])
                                      ? "#e0e0e0"
                                      : "white",
                                  cursor:
                                    non_Disc_Hierarchy ||(ind > 0 &&
                                    !tierDiscounts[ind - 1] &&
                                    !tierDiscounts[ind])
                                      ? "not-allowed"
                                      : "text",
                                }}
                                onBlur={(e) =>
                                  handleBlur(
                                    ind,
                                    "Tier Discount Main",
                                    e.target.value,
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(ind, "Tier Discount Main")
                                }
                                min="0"
                                max="100"
                              />
                            </>
                          ),
                      )}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {tierDiscounts.map(
                        (value, ind) =>
                          ind >= 3 && (
                            <>
                              <label>%Discount, Tier {ind + 1}</label>
                              <input
                                key={ind}
                                type="number"
                                value={tierDiscounts[ind] ?? ""}
                                step="0.01"
                                readOnly={
                                  !tierDiscounts[ind - 1] && !tierDiscounts[ind]
                                }
                                onChange={(e) =>
                                  handleTierChange(ind, e.target.value)
                                }
                                style={{
                                  backgroundColor:
                                    !tierDiscounts[ind - 1] &&
                                    !tierDiscounts[ind]
                                      ? "#e0e0e0"
                                      : "white",
                                  cursor:
                                    !tierDiscounts[ind - 1] &&
                                    !tierDiscounts[ind]
                                      ? "not-allowed"
                                      : "text",
                                }}
                                onBlur={(e) =>
                                  handleBlur(
                                    ind,
                                    "Tier Discount Main",
                                    e.target.value,
                                  )
                                }
                                onFocus={() =>
                                  handleFocus(ind, "Tier Discount Main")
                                }
                              />
                            </>
                          ),
                      )}
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                  </td>
                </tr>
              )}

              {data.DiscountType === "Tier Discount % + Scaled" && (
                <tr>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {scaledTier.map((value, ind) => (
                        <>
                          <label>%Discount, Tier {ind + 1}</label>
                          <input
                            key={ind}
                            type="number"
                            step="0.01"
                            value={scaledTier[ind] ?? ""}
                            readOnly={
                              non_Disc_Hierarchy ||(ind > 0 &&
                              !scaledTier[ind - 1] &&
                              !scaledTier[ind])
                            }
                            onChange={(e) =>
                              handleScaleChange(
                                ind,
                                "Tier Discount",
                                e.target.value,
                              )
                            }
                            style={{
                              backgroundColor:
                                non_Disc_Hierarchy ||(ind > 0 &&
                                !scaledTier[ind - 1] &&
                                !scaledTier[ind])
                                  ? "#e0e0e0"
                                  : "white",
                              cursor:
                                non_Disc_Hierarchy ||(ind > 0 &&
                                !scaledTier[ind - 1] &&
                                !scaledTier[ind])
                                  ? "not-allowed"
                                  : "text",
                            }}
                            onBlur={(e) =>
                              handleBlur(ind, "Tier Discount", e.target.value)
                            }
                            onFocus={() => handleFocus(ind, "Tier Discount")}
                          />
                        </>
                      ))}
                    </div>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {scaledDiscounts.map((value, ind) => (
                        <>
                          <label>Scaled Discount %, Tier {ind + 1}</label>
                          <input
                            key={ind}
                            type="number"
                            value={scaledDiscounts[ind] ?? ""}
                            step="0.01"
                            readOnly={
                              ind === 0
                                ? !scaledTier[0] && !scaledDiscounts[ind]
                                : !scaledDiscounts[ind - 1] &&
                                  !scaledDiscounts[ind]
                            }
                            onChange={(e) =>
                              handleScaleChange(
                                ind,
                                "Scaled Discount",
                                e.target.value,
                              )
                            }
                            style={{
                              backgroundColor: (
                                ind === 0
                                  ? !scaledTier[0] && !scaledDiscounts[ind]
                                  : !scaledDiscounts[ind - 1] &&
                                    !scaledDiscounts[ind]
                              )
                                ? "#e0e0e0"
                                : "white",
                              cursor: (
                                ind === 0
                                  ? !scaledTier[0] && !scaledDiscounts[ind]
                                  : !scaledDiscounts[ind - 1] &&
                                    !scaledDiscounts[ind]
                              )
                                ? "not-allowed"
                                : "text",
                            }}
                            onBlur={(e) =>
                              handleBlur(ind, "Scaled Discount", e.target.value)
                            }
                            onFocus={() => handleFocus(ind, "Scaled Discount")}
                          />
                        </>
                      ))}
                    </div>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {volumeT.map((value, ind) => {
                        const disabled = !canEditVolumeThreshold(
                          scaledDiscounts,
                          volumeT,
                          ind,
                        );
                        return (
                          <>
                            <label>Volume Threshold{ind + 1}</label>
                            <input
                              key={ind}
                              type="number"
                              value={volumeT[ind] ?? ""}
                              step="0.01"
                              readOnly={disabled}
                              onChange={(e) =>
                                handleScaleChange(
                                  ind,
                                  "Volume Threshold",
                                  e.target.value,
                                )
                              }
                              style={{
                                backgroundColor: disabled
                                  ? "#e0e0e0"
                                  : "white",
                                cursor: disabled ? "not-allowed" : "text",
                              }}
                              onBlur={(e) =>
                                handleBlur(
                                  ind,
                                  "Volume Threshold",
                                  e.target.value,
                                )
                              }
                              onFocus={() => handleFocus(ind, "Volume Threshold")}
                            />
                          </>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default DiscountPopup;
