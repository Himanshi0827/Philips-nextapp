import { apiClient } from "../client";

const SEARCH = "/api/search/v1/objects";

export async function getLookup(fields: string) {
  const { data } = await apiClient().get(`/api/data/v1/objects/${fields}`);
  return data;
}

export const searchLookupRecords = async (criteria: unknown, objectName: string) => {
  const { data } = await apiClient().post(
    `${SEARCH}/${objectName}/query?includeTotalCount=true`,
    {
      ObjectName: objectName,
      Criteria: criteria,
      SearchType: "TypeAhead",
      limit: 100,
      Skip: 0,
      Select: [],
      AdditionalTypeAheadFilterCriteria: "",
    },
  );
  return data?.Data || [];
};

export const searchHierarchyRecords = async (criteria: unknown) => {
  const { data } = await apiClient().post(
    `${SEARCH}/Product_Hierarchy_c/query?includeTotalCount=true`,
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
  );
  return data?.Data || [];
};

interface HierarchyRow {
  Id?: string;
  Name?: string;
  Business_Unit_ID_c?: string;
  Business_Group_ID_c?: string;
  Main_Article_Group_ID_c?: string;
  Article_Group_ID_c?: string;
}

export const dedupeHierarchyResults = (rows: HierarchyRow[] = [], mode: string): HierarchyRow[] => {
  const keyFor = (row: HierarchyRow): string => {
    if (mode === "BU") return `${row.Business_Unit_ID_c ?? ""}::${row.Business_Group_ID_c ?? ""}`;
    if (mode === "MAG") return `${row.Business_Unit_ID_c ?? ""}::${row.Main_Article_Group_ID_c ?? ""}`;
    if (mode === "AG") return `${row.Main_Article_Group_ID_c ?? ""}::${row.Article_Group_ID_c ?? ""}`;
    return row.Id ?? row.Name ?? "";
  };

  const hasValue = (value: unknown): boolean =>
    value !== null && value !== undefined && `${value}`.trim() !== "";

  const filtered = rows.filter((row) => {
    if (mode === "MAG") return hasValue(row.Main_Article_Group_ID_c) && hasValue(row.Business_Unit_ID_c);
    if (mode === "AG") return hasValue(row.Article_Group_ID_c) && hasValue(row.Main_Article_Group_ID_c);
    if (mode === "BU") return hasValue(row.Business_Unit_ID_c) && hasValue(row.Business_Group_ID_c);
    return true;
  });

  return Array.from(new Map(filtered.map((row) => [keyFor(row), row])).values());
};
