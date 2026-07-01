import { apiClient } from "../client";

const HIERARCHY = "/api/data/v1/query/Product_Hierarchy_c";

interface HierarchyPayload {
  ObjectName: string;
  Criteria?: string;
  Select: string[];
  Distinct?: boolean;
}

async function queryProductHierarchy(payload: HierarchyPayload) {
  const { data } = await apiClient().post(HIERARCHY, payload);
  return data;
}

export async function queryHierarchyByCriteria({ criteria, select }: { criteria: string; select: string[] }) {
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

export async function queryHierarchyMags(buId: string) {
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

export async function queryHierarchyAgs(magId: string) {
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
