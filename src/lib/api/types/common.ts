export interface CongaAPIResponse<T> {
  Success: boolean;
  Data: T;
  Message?: string;
}

export interface LookupObject {
  Id: string;
  Name: string;
}

export interface PaginatedResponse<T> {
  Success: boolean;
  Data: T[];
  TotalCount?: number;
}
