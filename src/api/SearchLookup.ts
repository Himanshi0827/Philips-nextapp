import axios from "axios";
import { getAccessToken } from "./api";

export const searchLookupRecords = async (criteria:unknown, objectName:string) => {
  const token = await getAccessToken();

  const response = await axios.post(
    
    "https://preview-rls09.congacloud.com/api/search/v1/objects/" +
      objectName +
      "/query?includeTotalCount=true",
    {
      ObjectName: objectName,
      Criteria: criteria,
      SearchType: "TypeAhead",
      limit :100,
      Skip: 0,
      Select: [],
      AdditionalTypeAheadFilterCriteria: "",
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      
        "Content-Type": "application/json",
      },
    },
  );

  return response.data?.Data || [];
};

export const searchHierarchyRecords = async (criteria:unknown) => {
  const token = await getAccessToken();

  const response = await axios.post(
    "https://preview-rls09.congacloud.com/api/search/v1/objects/Product_Hierarchy_c/query?includeTotalCount=true",
    {
      ObjectName: "Product_Hierarchy_c",
      Criteria: criteria,
      SearchType: "TypeAhead",
      Limit: 100,
      Skip: 0,
      Select: [
        "Id",
        "Name",
        "Business_Unit_Name_c",
        "Business_Group_Name_c",
        "Business_Unit_ID_c",
        "Business_Group_ID_c",
        "Main_Article_Group_Name_c",
        "Main_Article_Group_ID_c",
        "Article_Group_Name_c",
        "Article_Group_ID_c",
      ],
      AdditionalTypeAheadFilterCriteria: "",
      Distinct: true,
      Sort: {
        FieldName: "Name",
        OrderBy: "Ascending",
      },
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data?.Data || [];
};

export const dedupeHierarchyResults = (rows = [], mode:string) => {
  const keyFor = (row) => {
    if (mode === "BU") return `${row.Business_Unit_ID_c || ""}::${row.Business_Group_ID_c || ""}`;
    if (mode === "MAG") return `${row.Business_Unit_ID_c || ""}::${row.Main_Article_Group_ID_c || ""}`;
    if (mode === "AG") return `${row.Main_Article_Group_ID_c || ""}::${row.Article_Group_ID_c || ""}`;
    return row.Id || row.Name;
  };

  const hasValue = (value) => value !== null && value !== undefined && `${value}`.trim() !== "";
  const filtered = rows.filter((row) => {
    if (mode === "MAG") return hasValue(row.Main_Article_Group_ID_c) && hasValue(row.Business_Unit_ID_c);
    if (mode === "AG") return hasValue(row.Article_Group_ID_c) && hasValue(row.Main_Article_Group_ID_c);
    if (mode === "BU") return hasValue(row.Business_Unit_ID_c) && hasValue(row.Business_Group_ID_c);
    return true;
  });

  return Array.from(new Map(filtered.map((row) => [keyFor(row), row])).values());
};
