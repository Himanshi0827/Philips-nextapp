import type { LookupObject } from "./common";

export interface Member {
  Id?: string;
  Name?: string;
  APTS_Member_c?: string;
  APTS_Related_Agreement_c?: string;
  APTS_Agreement_Group_c?: LookupObject | null;
  APTS_Member_Type_c?: string;
  APTS_Start_Date_c?: string;
  APTS_End_Date_c?: string;
  APTS_OIT_Value_c?: number;
  APTS_Current_over_achievement_c?: number;
  APTS_Volume_Tier_c?: string;
  APTS_Sync_to_SAP_c?: string;
  APTS_OIT_start_date_c?: string;
  APTS_OIT_end_date_c?: string;
  APTS_External_Identifier_c?: string;
  APTS_Locked_Until_date_c?: string;
  APTS_Automatic_Tier_Review_c?: boolean;
  APTS_locked_for_tier_changes_c?: boolean;
  accountData?: LookupObject;
  [key: string]: unknown;
}
