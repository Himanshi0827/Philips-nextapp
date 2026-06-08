'use client';
import { getAccessToken } from "./api";
export async function queryAgreementLineItemsByAgreement(agreementId:string) {
  try {
    const token = getAccessToken();

    const response = await fetch(
      "https://preview-rls09.congacloud.com/api/data/v1/query/AgreementLineItem",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ObjectName: "AgreementLineItem",
          Criteria: `Agreement ='${agreementId}'`,
          Select: [
            "*"
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
      //throw new Error("Failed to query line items");
    }

    const result = await response.json();
    return result.Data;
  } catch (err) {
    console.error((err as Error).message);
    throw err;
  }
}

export async function queryCheckAgreementGroup(agreement_group_Id:string, name:string) {
  const token = getAccessToken();
  console.log("trial", agreement_group_Id, name);
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_Agreement_Groups_c",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ObjectName: "APTS_Agreement_Groups_c",
        Criteria: `APTS_Agreement_c ='${agreement_group_Id}' AND Name= '${name}'`,
        Select: ["Name", "Id"],
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to query line items");
  }

  const result = await response.json();
  console.log("trial2", result);
  return result.Data;
}






export async function queryGetAgreementDetails(agreement_id:string) {

  const token = getAccessToken();
 console.log("t",agreement_id);
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/Agreement",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "Agreement",
        Criteria: `Id ='${agreement_id}'`,
        Select: [
          "Id",
          "Name",
          "Account.Id",
          "Account.Name",
          "RecordType" ,
    "APTS_Sales_Area_c" ,
    "Apttus_Market_c",
    "StatusCategory",
    "APTS_Account_Name__c"
          
        ]
      })
    }
  );
 console.log("detial",response);
  if (!response.ok) {
    throw new Error("Failed to query line items");
  }
 
  const result = await response.json();
  console.log("result",result);
  return result.Data;
}

 export async function queryGetProposal(Account_id:string, fromDate:string, toDate:string) {
  const token = getAccessToken();

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/Proposal",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "Proposal",
        Criteria: `
          Account.Id ='${Account_id}'
          AND CreatedDate >= '${fromDate}T00:00:00Z'
          AND CreatedDate <= '${toDate}T23:59:59Z'
        `,
        Select: [
          "Id",
          "Name",
          "Opportunity.Id",
          "Opportunity.Name",
          "ProposalNumber",
          "CreatedDate",
          "CreatedBy.Name"
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to query proposals");
  }

  const result = await response.json();
  return result.Data;
}

export async function queryGetQuoteItem(Quote_id:string) {
  const token = getAccessToken();
 console.log("quote",Quote_id);
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/LineItem",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "LineItem",
        Criteria: `Proposal_c ='${Quote_id}'`,
        Select: [
          "*"
          // "Name",
          // //  "Product.ProductCode", 
          //  "Product",
          //   "APTS_Strategic_Discount_Amount_c_c",
          //   "APTS_Contract_Discount_Amount_c",
          //  "APTS_Promotion_Discount_Amount_c_c",
          //  "Proposal_c",
          // "APTS_BillingPlan_c",
          // "AdjustmentType",
          // "Quantity",
          // "APTS_Offered_Price_c_c"
        ]
      })
    }
  );
 
  if (!response.ok) {
    throw new Error("Failed to query line items");
  }
 
  const result = await response.json();
  console.log("result",result);
  return result.Data;
}


//try 
export async function queryAgreementGroupByAgreement(agreementId:string) {
  try {
    const token = getAccessToken();

    const response = await fetch(
      "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_Agreement_Groups_c",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ObjectName: "APTS_Agreement_Groups_c",
          Criteria: `APTS_Agreement_c ='${agreementId}'`,
          Select: [
            "*"
            // "Name"
      
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
      //throw new Error("Failed to query line items");
    }

    const result = await response.json();
    console.log("agreement Group",result);
    return result.Data;
  } catch (err) {
    console.error((err as Error).message);
    throw err;
  }
}
