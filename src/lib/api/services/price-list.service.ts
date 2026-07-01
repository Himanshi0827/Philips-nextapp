import { apiClient } from "../client";

const PRICE_LIST = "/api/data/v1/objects/PriceList";

export async function getPriceListById(id: string) {
  const { data } = await apiClient().get(`${PRICE_LIST}/${id}`);
  return data.Data;
}

export async function updatePriceList(id: string, payload: unknown) {
  const { data } = await apiClient().put(`${PRICE_LIST}/${id}`, payload);
  return data;
}
