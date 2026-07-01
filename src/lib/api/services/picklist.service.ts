import { apiClient } from "../client";
import type { PicklistResponse } from "../types";

const ALI_METADATA = "/api/metadata/v1/objects/AgreementLineItem/fields";
const MEMBER_METADATA = "/api/metadata/v1/objects/APTS_Account_Contract_c/fields";

export async function getPicklist(fieldname: string): Promise<PicklistResponse | undefined> {
  const { data } = await apiClient().get(`${ALI_METADATA}/${fieldname}/dependency-fields`);
  return data;
}

export async function getMemberPicklist(fieldname: string): Promise<PicklistResponse | undefined> {
  const { data } = await apiClient().get(`${MEMBER_METADATA}/${fieldname}/dependency-fields`);
  return data;
}
