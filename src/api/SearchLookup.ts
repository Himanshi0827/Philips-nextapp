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
