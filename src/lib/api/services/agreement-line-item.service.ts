import { apiClient } from "../client";
import type { AgreementLineItem } from "../types";

const ALI = "/api/data/v1/objects/AgreementLineItem";

export async function getAgreementLineItems(): Promise<AgreementLineItem[]> {
  const { data } = await apiClient().get(ALI);
  return data;
}

export async function getAgreementLineItemById(id: string): Promise<AgreementLineItem> {
  const { data } = await apiClient().get(`${ALI}/${id}`);
  return data.Data;
}

export async function createAgreementLineItem(payload: Partial<AgreementLineItem>) {
  const { data } = await apiClient().post(ALI, payload);
  return data;
}

export async function updateAgreementLineItem(id: string, payload: Partial<AgreementLineItem>) {
  const { data } = await apiClient().put(`${ALI}/${id}`, payload);
  return data;
}

export async function deleteAgreementLineItem(id: string) {
  const { data } = await apiClient().delete(`${ALI}/${id}`);
  return data;
}
