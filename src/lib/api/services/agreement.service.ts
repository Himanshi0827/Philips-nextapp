import { apiClient } from "../client";
import type { Agreement, AgreementGroup, SubmitApprovalPayload } from "../types";

const AGREEMENT = "/api/data/v1/objects/Agreement";
const GROUP = "/api/data/v1/objects/APTS_Agreement_Groups_c";
const PRODUCT = "/api/data/v1/objects/Product";

export async function getAgreementById(id: string): Promise<Agreement> {
  const { data } = await apiClient().get(`${AGREEMENT}/${id}`);
  return data.Data;
}

export async function createAgreement(payload: Partial<Agreement>) {
  const { data } = await apiClient().post(AGREEMENT, payload);
  return data;
}

export async function updateAgreement(id: string, payload: Partial<Agreement>) {
  const { data } = await apiClient().put(`${AGREEMENT}/${id}`, payload);
  return data;
}

export async function getAmendAgreement(id: string) {
  const { data } = await apiClient().post(`/api/clm/v1/contracts/${id}/amend`);
  return data.Data;
}

export async function submitForApproval(body: SubmitApprovalPayload) {
  const { data } = await apiClient().post("/api/approvals/v1/requests/submit", body);
  return data;
}

export async function getAgreementGroupById(agreementId: string): Promise<AgreementGroup[]> {
  const { data } = await apiClient().get(`${GROUP}?criteria=APTS_Agreement_c%3D%27${agreementId}%27`);
  return data.Data;
}

export async function createAgreementGroup(payload: Partial<AgreementGroup>) {
  const { data } = await apiClient().post(GROUP, payload);
  return data;
}

export async function getProductById(id: string) {
  const { data } = await apiClient().get(`${PRODUCT}/${id}`);
  return data.Data;
}
