import axios from "axios";
import { getAccessToken } from "./api";

const BASE_URL = "https://preview-rls09.congacloud.com/api/data/v1/query";
export const getProductsByParent = async (parentProductId) => {

  try {
    const access_token = await getAccessToken();
    const body = {
      // Adjusted to match your requirement: ParentId + Active status
      Criteria: `Id='${parentProductId.Id}' AND IsActive=true`,
      Select: ["Id", "Name", "ProductCode","APTS_Discountable_c"],
    };

    const response = await axios.post(`${BASE_URL}/Product`, body, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    
    const temp = response.data.Data;
    const parent = temp.map((item) => ({
      Id: item.Id,
      Name: item.Name,
      ProductCode: item.ProductCode,
      ChildId: parentProductId.ChildProductId,
      ChildName: parentProductId.ChildProductName,
      ChildProductCode: parentProductId?.ChildProductCode,
      IsDiscountable:item.APTS_Discountable_c

    }));
    console.log("Product Code", parent);
   
    return parent;
  } catch (err) {
    console.error("getProductsByParent error:", err);
    return [];
  }
};