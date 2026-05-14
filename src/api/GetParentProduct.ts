import axios from "axios";
import { getAccessToken } from "./api";

const BASE_URL = "https://preview-rls09.congacloud.com/api/data/v1/query";

export const getParentProduct = async (childProduct) => {
  try {
    const access_token = await getAccessToken();

    const body = {
      Criteria: `ComponentProduct.Name='${childProduct.Name}'`,
      Select: [
        "Id",
        "Name",
        "ParentProduct.Name",
        "ParentProduct.Id",
        "ParentProduct",
      ],
    };

    const response = await axios.post(
      `${BASE_URL}/ProductOptionComponent`,
      body,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (response.data?.Success && response.data.Data?.length > 0) {
      console.log("Product data", response.data.Data);
      const temp = response.data.Data;
      const parent = temp
        .filter((item) => item.ParentProduct)
        .map((item) => ({
          Id: item.ParentProduct.Id,
          Name: item.ParentProduct.Name,
          ChildProductId: childProduct.Id,
          ChildProductName: childProduct.Name,
          ChildProductCode: childProduct?.ProductCode,
        }));
      console.log("My try", parent);
   
      return parent;
    
    }

    return null;
  } catch (err) {
    console.error(
      "GetParentProduct error:",
      err?.response?.data?.Errors || err,
    );
    return null;
  }
};