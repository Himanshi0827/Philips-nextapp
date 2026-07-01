import { BASE_URL } from "./client";

export const endpoints = {
  agreementLineItems: `${BASE_URL}/api/data/v1/objects/AgreementLineItem`,
  agreementLineItem: (id: string) => `${BASE_URL}/api/data/v1/objects/AgreementLineItem/${id}`,

  agreements: `${BASE_URL}/api/data/v1/objects/Agreement`,
  agreement: (id: string) => `${BASE_URL}/api/data/v1/objects/Agreement/${id}`,
  amendAgreement: (id: string) => `${BASE_URL}/api/clm/v1/contracts/${id}/amend`,

  agreementGroups: `${BASE_URL}/api/data/v1/objects/APTS_Agreement_Groups_c`,
  agreementGroupsByAgreement: (agreementId: string) =>
    `${BASE_URL}/api/data/v1/objects/APTS_Agreement_Groups_c?criteria=APTS_Agreement_c%3D%27${agreementId}%27`,

  product: (id: string) => `${BASE_URL}/api/data/v1/objects/Product/${id}`,
  products: `${BASE_URL}/api/data/v1/objects/Product`,

  members: `${BASE_URL}/api/data/v1/objects/APTS_Membership_c`,
  member: (id: string) => `${BASE_URL}/api/data/v1/objects/APTS_Membership_c/${id}`,

  submitApproval: `${BASE_URL}/api/approvals/v1/requests/submit`,

  metadata: (objectName: string) => `${BASE_URL}/api/metadata/v1/objects/${objectName}`,
  lookup: (objectName: string, query: string) =>
    `${BASE_URL}/api/data/v1/objects/${objectName}?criteria=${encodeURIComponent(query)}`,
  search: (objectName: string, query: string) =>
    `${BASE_URL}/api/data/v1/objects/${objectName}?search=${encodeURIComponent(query)}`,

  priceLists: `${BASE_URL}/api/data/v1/objects/Apttus_Config2__PriceList__c`,
  records: (objectName: string) => `${BASE_URL}/api/data/v1/objects/${objectName}`,
};
