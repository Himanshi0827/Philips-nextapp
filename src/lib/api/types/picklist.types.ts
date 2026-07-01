export interface PicklistEntry {
  Value: string;
  Label?: string;
  IsDefault?: boolean;
}

export interface PicklistMetadata {
  FieldName: string;
  PicklistEntries: PicklistEntry[];
}

export interface PicklistResponse {
  PicklistMetadata: PicklistMetadata[];
}
