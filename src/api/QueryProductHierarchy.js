import { getAccessToken } from "./api";

async function queryProductHierarchy(payload) {
  const access_token = getAccessToken();
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/Product_Hierarchy_c",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}

export async function queryHierarchyByCriteria({ criteria, select }) {
  return queryProductHierarchy({
    ObjectName: "Product_Hierarchy_c",
    Criteria: criteria,
    Select: select,
    Distinct: true,
  });
}

export async function queryHierarchyBusinesses() {
  return queryProductHierarchy({
    ObjectName: "Product_Hierarchy_c",
    Select: [
      "Business_Unit_Name_c",
      "Business_Group_Name_c",
      "Business_Unit_ID_c",
      "Business_Group_ID_c",
    ],
    Distinct: true,
  });
}

export async function queryHierarchyMags(buId) {
  return queryProductHierarchy({
    ObjectName: "Product_Hierarchy_c",
    Criteria: `Business_Unit_ID_c= '${buId}'`,
    Select: [
      "Business_Unit_Name_c",
      "Main_Article_Group_Name_c",
      "Business_Unit_ID_c",
      "Main_Article_Group_ID_c",
    ],
    Distinct: true,
  });
}

export async function queryHierarchyAgs(magId) {
  return queryProductHierarchy({
    ObjectName: "Product_Hierarchy_c",
    Criteria: `Main_Article_Group_ID_c= '${magId}'`,
    Select: [
      "Main_Article_Group_Name_c",
      "Article_Group_Name_c",
      "Main_Article_Group_ID_c",
      "Article_Group_ID_c",
    ],
    Distinct: true,
  });
}
