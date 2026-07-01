import { apiClient } from "../client";

export async function getRecords(objectName: string) {
  const { data } = await apiClient().get(`/api/data/v1/objects/${objectName}`);
  return data;
}
