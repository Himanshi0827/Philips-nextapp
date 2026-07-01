import type { LookupObject } from "./common";

export interface Agreement {
  Id: string;
  Name: string;
  StatusCategory?: string;
  RecordType?: string;
  APTS_Sales_Area_c?: string;
  Apttus_Market_c?: string;
  APTS_GPO_Administration_fee_percents_c?: number;
  APTS_Exclude_Administration_Fees_c?: boolean;
  APTS_GPO_Admin_fee_payment_schedule_c?: string;
  APTS_GPO_Admin_fee_based_on_c?: string;
  APTS_Country_pricelist_update_rule_c?: string;
  [key: string]: unknown;
}

export interface AgreementLineItem {
  Id?: string;
  Name?: string;
  Agreement?: LookupObject;
  Product?: LookupObject;
  ListPrice?: number;
  NetPrice?: number;
  DeltaPrice?: number;
  APTS_GPO_Administration_fee_c?: number;
  APTS_GPO_Admin_fee_payment_schedule_c?: string;
  APTS_Country_pricelist_update_rule_c?: string;
  APTS_GPO_Admin_fee_is_based_on_c?: string;
  APTS_Upper_Bandwith_c?: number;
  APTS_Lower_Bandwith_c?: number;
  APTS_Contract_Net_Price_c?: number;
  APTS_Exclude_GPO_Administration_Fees_c?: boolean;
  APTS_Inherit_hierarchy_discount_c?: boolean;
  APTS_Exclude_From_Contract_Pricelists_c?: boolean;
  [key: string]: unknown;
}

export interface AgreementGroup {
  Id?: string;
  Name?: string;
  Description?: string;
  ListPrice?: number;
  NetPrice?: number;
  DeltaPrice?: number;
  Product?: LookupObject;
  Agreement?: string;
  [key: string]: unknown;
}

export interface AmendAgreementPayload {
  [key: string]: unknown;
}

export interface SubmitApprovalPayload {
  [key: string]: unknown;
}
