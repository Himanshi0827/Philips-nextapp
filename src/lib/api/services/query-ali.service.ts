import { apiClient } from "../client";

const QUERY = "/api/data/v1/query";

export async function queryAgreementLineItemsByAgreement(agreementId: string) {
  const { data } = await apiClient().post(`${QUERY}/AgreementLineItem`, {
    ObjectName: "AgreementLineItem",
    Criteria: `Agreement ='${agreementId}'`,
    Select: ["*"],
  });
  return data.Data;
}

export async function queryCheckAgreementGroup(agreementGroupId: string, name: string) {
  const { data } = await apiClient().post(`${QUERY}/APTS_Agreement_Groups_c`, {
    ObjectName: "APTS_Agreement_Groups_c",
    Criteria: `APTS_Agreement_c ='${agreementGroupId}' AND Name= '${name}'`,
    Select: ["Name", "Id"],
  });
  return data.Data;
}

export async function queryGetAgreementDetails(agreementId: string) {
  const { data } = await apiClient().post(`${QUERY}/Agreement`, {
    ObjectName: "Agreement",
    Criteria: `Id ='${agreementId}'`,
    Select: [
      "Id",
      "Name",
      "Account.Id",
      "Account.Name",
      "RecordType",
      "APTS_Sales_Area_c",
      "Apttus_Market_c",
      "StatusCategory",
      "APTS_Account_Name__c",
    ],
  });
  return data.Data;
}

export async function queryGetProposal(accountId: string, fromDate: string, toDate: string) {
  const { data } = await apiClient().post(`${QUERY}/Proposal`, {
    ObjectName: "Proposal",
    Criteria: `Account.Id ='${accountId}' AND CreatedDate >= '${fromDate}T00:00:00Z' AND CreatedDate <= '${toDate}T23:59:59Z'`,
    Select: ["Id", "Name", "Opportunity.Id", "Opportunity.Name", "ProposalNumber", "CreatedDate", "CreatedBy.Name"],
  });
  return data.Data;
}

export async function queryGetQuoteItem(quoteId: string) {
  const { data } = await apiClient().post(`${QUERY}/LineItem`, {
    ObjectName: "LineItem",
    Criteria: `Proposal_c ='${quoteId}'`,
    Select: ["*"],
  });
  return data.Data;
}

export async function queryAgreementGroupByAgreement(agreementId: string) {
  const { data } = await apiClient().post(`${QUERY}/APTS_Agreement_Groups_c`, {
    ObjectName: "APTS_Agreement_Groups_c",
    Criteria: `APTS_Agreement_c ='${agreementId}'`,
    Select: ["*"],
  });
  return data.Data;
}
