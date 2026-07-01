import { apiClient } from "../client";
import type { Member } from "../types";

const MEMBER = "/api/data/v1/objects/APTS_Account_Contract_c";
const ACCOUNT = "/api/data/v1/objects/Account";
const QUERY = "/api/data/v1/query";
const GPO_DESIGNATION = "/api/data/v1/objects/APTS_GPO_Designation_Changes_c";

export async function getMemberById(id: string): Promise<Member> {
  const { data } = await apiClient().get(`${MEMBER}/${id}`);
  return data.Data;
}

export async function getMember() {
  const { data } = await apiClient().get(MEMBER);
  return data;
}

export async function createMember(payload: Partial<Member>) {
  const { data } = await apiClient().post(MEMBER, payload);
  return data;
}

export async function updateMember(id: string, payload: Partial<Member>) {
  const { data } = await apiClient().put(`${MEMBER}/${id}`, payload);
  return data;
}

export async function getAccountById(id: string) {
  const { data } = await apiClient().get(`${ACCOUNT}/${id}`);
  return data.Data;
}

export async function queryGetMember(agreementId: string) {
  const { data } = await apiClient().post(`${QUERY}/APTS_Account_Contract_c`, {
    ObjectName: "APTS_Account_Contract_c",
    Criteria: `APTS_Related_Agreement_c ='${agreementId}'`,
    Select: ["*"],
  });
  return data.Data;
}

export async function getFilteredAccounts() {
  const { data } = await apiClient().post(`${QUERY}/Account`, {
    ObjectName: "Account",
    Criteria: `Market_c = 'North America' AND Country_c = 'United States' AND MP1_Customer_id_1_c != null AND Inactive_Flag_c = false AND ERP_Account_Group_c = '0001 - SOLD TO PARTY'`,
    Select: ["*"],
  });
  return data.Data || [];
}

export async function getAccountsByIds(ids: string[]) {
  if (!ids.length) return [];
  const formattedIds = ids.map((id) => `'${id}'`).join(",");
  const { data } = await apiClient().post(`${QUERY}/Account`, {
    ObjectName: "Account",
    Criteria: `Id IN (${formattedIds})`,
    Select: ["*"],
  });
  return data.Data || [];
}

export async function getAgreementsByIds(ids: string[]) {
  if (!ids.length) return [];
  const formattedIds = ids.map((id) => `'${id}'`).join(",");
  const { data } = await apiClient().post(`${QUERY}/Agreement`, {
    ObjectName: "Agreement",
    Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US' AND (RecordType = 'GPO_Framework' OR (APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement') AND RecordType = 'Customer_Framework')) AND APTS_Member_SAP_Status_c='In Progress'`,
    Select: ["*"],
  });
  return data.Data || [];
}

export async function getAgreementsByIdsDesignation(
  ids: string[],
  accountIds: string,
  memberId: string,
  gpoId: string,
) {
  if (!ids.length) return [];
  const formattedIds = ids.map((id) => `'${id}'`).join(",");
  const { data } = await apiClient().post(`${QUERY}/Agreement`, {
    ObjectName: "Agreement",
    Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US' AND ((RecordType = 'GPO_Framework' AND Account.Id != '${gpoId}') OR (APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement') AND RecordType = 'Customer_Framework' AND ((Account.Id= '${memberId}' AND APTS_Customer_Pricelist_Customer_c.Id = '${accountIds}') OR (Account.Id!= '${memberId}' AND APTS_Customer_Pricelist_Customer_c.Id = '${accountIds}') OR Account.Id = '${accountIds}')))`,
    Select: ["*"],
  });
  return data.Data || [];
}

export async function getAgreementsIds(ids: string[]) {
  if (!ids.length) return [];
  const formattedIds = ids.map((id) => `'${id}'`).join(",");
  const { data } = await apiClient().post(`${QUERY}/Agreement`, {
    ObjectName: "Agreement",
    Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US'`,
    Select: ["*"],
  });
  return data.Data || [];
}

export async function queryGetOIT(memberId: string) {
  const { data } = await apiClient().post(`${QUERY}/APTS_OIT_Track_Record_c`, {
    ObjectName: "APTS_OIT_Track_Record_c",
    Criteria: `Agreement_Member_c.Id ='${memberId}'`,
    Select: ["*"],
  });
  return data.Data;
}

export async function getMembershipAgreements(memberId: string) {
  const { data } = await apiClient().post(`${QUERY}/APTS_Account_Contract_c`, {
    ObjectName: "APTS_Account_Contract_c",
    Criteria: `APTS_Member_c = '${memberId}'`,
    Select: ["*"],
  });
  return data.Data || [];
}

export async function createGPODesignateChange(payload: unknown) {
  const { data } = await apiClient().post(GPO_DESIGNATION, payload);
  return data;
}

export async function updateGPODesignateChange(id: string, payload: unknown) {
  const { data } = await apiClient().put(`${GPO_DESIGNATION}/${id}`, payload);
  return data;
}

export async function getRetryRecords(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const formattedDate = sevenDaysAgo.toISOString();
  const { data } = await apiClient().post(`${QUERY}/APTS_GPO_Designation_Changes_c`, {
    ObjectName: "APTS_GPO_Designation_Changes_c",
    Criteria: `APTS_Status_c = 'Error' AND CreatedDate > '${formattedDate}' AND CreatedBy.Id= '${userId}'`,
    Select: ["Id", "APTS_Start_date_c", "APTS_Error_Message_c", "APTS_Status_c"],
  });
  return data.Data || [];
}

export async function fetchDesignationRecords(accId: string) {
  const { data } = await apiClient().post(`${QUERY}/APTS_GPO_Designation_Changes_c`, {
    ObjectName: "APTS_GPO_Designation_Changes_c",
    Criteria: `APTS_Member_Account_c.Id = '${accId}' AND APTS_Status_c = 'Not Processed'`,
    Select: ["*"],
  });
  return data.Data || [];
}

export async function getAgreementDetailsByIds(
  ids: string[],
  accountIds: string[],
  memberId: string,
) {
  if (!ids.length) return [];
  const formattedIds = ids.length ? ids.map((id) => `'${id}'`).join(",") : "''";
  const formattedAccountIds = accountIds.length ? accountIds.map((id) => `'${id}'`).join(",") : "''";
  const { data } = await apiClient().post(`${QUERY}/Agreement`, {
    ObjectName: "Agreement",
    Criteria: `Id IN (${formattedIds}) AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US' AND APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement') AND RecordType = 'Customer_Framework' AND ((Account.Id= '${memberId}' AND APTS_Customer_Pricelist_Customer_c.Id IN (${formattedAccountIds})) OR APTS_Customer_Pricelist_Customer_c.Id IN (${formattedAccountIds}) OR Account.Id in (${formattedAccountIds}))`,
    Select: ["Id", "Name", "Account"],
  });
  return data.Data || [];
}

export async function queryDesignatedContractsByMember(memberId: string) {
  const { data } = await apiClient().post(`${QUERY}/APTS_Account_Contract_c`, {
    ObjectName: "APTS_Account_Contract_c",
    Criteria: `APTS_Designated_Flag_c = true AND APTS_Member_c = '${memberId}'`,
    Select: ["Id", "APTS_End_Date_c"],
  });
  return data.Data || [];
}

export async function updateAccountContract(id: string, payload: unknown) {
  const { data } = await apiClient().put(`${MEMBER}/${id}`, payload);
  return data;
}

export async function updateAccount(id: string, payload: unknown) {
  const { data } = await apiClient().put(`${ACCOUNT}/${id}`, payload);
  return data;
}

export async function getActiveGPOAgreements(gpoId: string) {
  const { data } = await apiClient().post(`${QUERY}/Agreement`, {
    ObjectName: "Agreement",
    Criteria: `Account.Id = '${gpoId}' AND Status = 'Activated' AND StatusCategory = 'In Effect' AND Apttus_Market_c = 'North America' AND APTS_SalesArea_c = 'United States' AND APTS_Country_Code_c = 'US'`,
    Select: ["*"],
  });
  return data.Data || [];
}

export async function getCFAMembersByAgreementIds(agreementIds: string[]) {
  if (!agreementIds.length) return [];
  const formattedIds = agreementIds.map((id) => `'${id}'`).join(",");
  const { data } = await apiClient().post(`${QUERY}/APTS_Account_Contract_c`, {
    ObjectName: "APTS_Account_Contract_c",
    Criteria: `APTS_Related_Agreement_c IN (${formattedIds})`,
    Select: ["Id", "APTS_Member_c", "APTS_Related_Agreement_c", "APTS_End_Date_c"],
  });
  return data.Data || [];
}

export function getUserIdFromToken(token: string): string | null {
  try {
    let rawToken = token;
    if (rawToken.startsWith("Bearer ")) {
      rawToken = rawToken.slice(7);
    }
    const parts = rawToken.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decodedPayload = JSON.parse(
      typeof atob === "function"
        ? atob(payload)
        : Buffer.from(payload, "base64").toString("utf-8"),
    );
    return decodedPayload.c_user_id || decodedPayload.sub || null;
  } catch {
    return null;
  }
}

interface FilterParams {
  filters?: Record<string, unknown>;
  likeFields?: string[];
  searchText?: string;
}

export const buildCriteria = (filters: Record<string, unknown> = {}): string => {
  const clauses: string[] = [];
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    if (typeof value === "object" && value !== null && "notNull" in value) {
      clauses.push(`${key} != null`);
    } else if (typeof value === "string") {
      clauses.push(`${key} = '${value}'`);
    } else {
      clauses.push(`${key} = ${value}`);
    }
  });
  return clauses.join(" AND ");
};

export async function getAccounts({ filters = {}, likeFields = [], searchText = "" }: FilterParams) {
  const criteria = buildCriteria(filters);
  const { data } = await apiClient().post(`${QUERY}/Account`, {
    ObjectName: "Account",
    Criteria: criteria,
    Select: ["*"],
  });
  let result: Record<string, unknown>[] = data.Data || [];
  if (searchText) {
    const lower = searchText.toLowerCase();
    result = result.filter((rec) =>
      likeFields.some((field) => `${rec[field] ?? ""}`.toLowerCase().includes(lower)),
    );
  }
  return result;
}
