import { getMemberPicklist } from "@/lib/api/services/picklist.service";

interface PicklistOption {
  label: string;
  value: string;
}

export async function getPicklistOptions(fieldApiName: string): Promise<PicklistOption[]> {
  const res = await getMemberPicklist(fieldApiName);
  return (
    res?.Data?.PicklistMetadata[0]?.PicklistEntries?.map(
      (p: { DisplayText?: string; Value: string }) => ({
        label: p.DisplayText ?? p.Value,
        value: p.Value,
      }),
    ) || []
  );
}
