

import { getAccessToken } from "./api";

export async function getMemberById(id:string) {
  try {
    const CONTRACT_URL =
      "https://preview-rls09.congacloud.com/api/data/v1/objects/APTS_Account_Contract_c";
 
    const accessToken = getAccessToken();
    const response = await fetch(`${CONTRACT_URL}/${id}`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        
      },
    });
 
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const result = await response.json();
    return result.Data;
  } catch (err) {
    console.error((err as Error).message);
  }
}

export async function getMember() {
  const accessToken = getAccessToken();
  const API_URL =
  "https://preview-rls09.congacloud.com/api/data/v1/objects/APTS_Account_Contract_c";
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
   
    },
  });
 
  if (!response.ok) {
    throw new Error("Failed to fetch Member");
  }
 
  return response.json();
}
 

export async function createMember(payload:unknown) {
  const accessToken = getAccessToken();

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/objects/APTS_Account_Contract_c",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create member");
  }

  return response.json();
}




export async function getAccountById(id:string) {
  try {
    const CONTRACT_URL =
      "https://preview-rls09.congacloud.com/api/data/v1/objects/Account";
 
    const accessToken = getAccessToken();
    const response = await fetch(`${CONTRACT_URL}/${id}`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
   
      },
    });
 
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const result = await response.json();
    return result.Data;
  } catch (err) {
    console.error((err as Error).message);
  }
}



export async function queryGetmember(agreement_id:string) {
  const token = getAccessToken();
 console.log("agreement",agreement_id);
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_Account_Contract_c",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "APTS_Account_Contract_c",
        Criteria: `APTS_Related_Agreement_c ='${agreement_id}'`,
        Select: [
          "*"
        ]
      })
    }
  );
 
  if (!response.ok) {
    throw new Error("Failed to bring members");
  }
   const result = await response.json();
  console.log("result",result);
  return result.Data;
}

export async function getFilteredAccounts() {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://preview-rls09.congacloud.com/api/data/v1/query/Account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ObjectName: "Account",
          Criteria: `
           Market_c = 'North America'  AND Country_c = 'United States'  AND MP1_Customer_id_1_c != null    AND Inactive_Flag_c = false   AND ERP_Account_Group_c = '0001 - SOLD TO PARTY'
          `,
          Select: ["*"],
        }),
      }
    );

    const result = await response.json();
    return result.Data || [];

  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getAccountsByIds(ids = []) {
  try {
    if (!ids.length) return [];

    const token = getAccessToken();

    const formattedIds = ids.map(id => `'${id}'`).join(",");

    const response = await fetch(
      "https://preview-rls09.congacloud.com/api/data/v1/query/Account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ObjectName: "Account",
          Criteria: `Id IN (${formattedIds})`,
         
          Select: ["*"],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }

    const result = await response.json();
    return result.Data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getAgreementsByIds(ids = []) {
  if (!ids.length) return [];

  const token = getAccessToken();
  const formattedIds = ids.map(id => `'${id}'`).join(",");

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/Agreement",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "Agreement",
        Criteria: `
          Id IN (${formattedIds})
          AND Status = 'Activated'
          AND StatusCategory = 'In Effect'
          AND Apttus_Market_c = 'North America'
          AND APTS_SalesArea_c = 'United States'
          AND APTS_Country_Code_c = 'US'
          AND (RecordType = 'GPO_Framework'
          OR (APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement')
      )AND RecordType = 'Customer_Framework')
      AND APTS_Member_SAP_Status_c='In Progress'
        `,
        Select: [
          "*"
        ]
      })
    }
  );

  const result = await response.json();
  return result.Data || [];
}


export async function getAgreementsByIdsDesignation(ids = [],accountIds:string,memberId:string,gpoId:string) {
  if (!ids.length) return [];

  const token = getAccessToken();
  const formattedIds = ids.map(id => `'${id}'`).join(",");


  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/Agreement",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "Agreement",
        Criteria: `
          Id IN (${formattedIds})
          AND Status = 'Activated'
          AND StatusCategory = 'In Effect'
          AND Apttus_Market_c = 'North America'
          AND APTS_SalesArea_c = 'United States'
          AND APTS_Country_Code_c = 'US'
          AND ((RecordType = 'GPO_Framework'
          AND Account.Id != '${gpoId}')
          OR (APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement')
      AND RecordType = 'Customer_Framework'
      AND ((Account.Id= '${memberId}' 
          AND APTS_Customer_Pricelist_Customer_c.Id = '${accountIds}')
          OR (Account.Id!= '${memberId}' AND APTS_Customer_Pricelist_Customer_c.Id = '${accountIds}' )
          OR Account.Id = '${accountIds}' )))
        `,
        Select: [
          "*"
        ]
      })
    }
  );

  const result = await response.json();
  return result.Data || [];
}

export async function getAgreementsIds(ids = []) {
  if (!ids.length) return [];

  const token = getAccessToken();
  const formattedIds = ids.map(id => `'${id}'`).join(",");

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/Agreement",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "Agreement",
        Criteria: `
          Id IN (${formattedIds})
          AND Status = 'Activated'
          AND StatusCategory = 'In Effect'
          AND Apttus_Market_c = 'North America'
          AND APTS_SalesArea_c = 'United States'
          AND APTS_Country_Code_c = 'US'
        `,
        Select: [
          "*"
        ]
      })
    }
  );

  const result = await response.json();
  return result.Data || [];
}


export async function queryGetOIT(member_id:string) {
  const token = getAccessToken();
 console.log("agreement",member_id);
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_OIT_Track_Record_c",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "APTS_OIT_Track_Record_c",
        Criteria: `Agreement_Member_c.Id ='${member_id}'`,
        Select: [
          "*"
        ]
      })
    }
  );
 
  if (!response.ok) {
    throw new Error("Failed to bring members");
  }
   const result = await response.json();
  console.log("result",result);
  return result.Data;
}



export async function updateMember(id:string, payload:unknown) {
  try {
    const CONTRACT_URL =
      "https://preview-rls09.congacloud.com/api/data/v1/objects/APTS_Account_Contract_c";
 
    const accessToken = getAccessToken();
    const response = await fetch(`${CONTRACT_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
     
      },
      body: JSON.stringify(payload),
    });
 
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error((err as Error).message);
    throw err;
  }
}



export async function getAccounts({
  filters = {},
  likeFields = [],
  searchText = ""
}) {
  try {
    const token = await getAccessToken();

    const criteria = buildCriteria(filters);

    const response = await fetch(
      "https://preview-rls09.congacloud.com/api/data/v1/query/Account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ObjectName: "Account",
          Criteria: criteria,
          Select: ["*"],
        }),
      }
    );

    const result = await response.json();
    let data = result.Data || [];

    // CLIENT SIDE SEARCH (WORKS ALWAYS)
    if (searchText) {
      const lower = searchText.toLowerCase();

      data = data.filter((rec) =>
        likeFields.some(field =>
          (rec[field] || "")
            .toString()
            .toLowerCase()
            .includes(lower)
        )
      );
    }

    return data;

  } catch (err) {
    console.error(err);
    return [];
  }
}

export const buildCriteria = (filters = {}) => {
  const clauses = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    //  HANDLE NOT NULL
    if (typeof value === "object" && value.notNull) {
      clauses.push(`${key} != null`);
    }
    else if (typeof value === "string") {
      clauses.push(`${key} = '${value}'`);
    } 
    else {
      clauses.push(`${key} = ${value}`);
    }
  });

  return clauses.join(" AND ");
};


export async function getMembershipAgreements(memberId:string) {
  const token = getAccessToken();

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_Account_Contract_c",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "APTS_Account_Contract_c",
        Criteria: `
          APTS_Member_c = '${memberId}'
        `,
        Select: ["*"]
      })
    }
  );

  const result = await response.json();
  return result.Data;
}




export async function createGPODesignateChange(payload:unknown) {
  const accessToken = getAccessToken();

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/objects/APTS_GPO_Designation_Changes_c",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );
console.log("createGPODesignateChange response", response);
  if (!response.ok) {
    throw new Error("Failed to create GPO designation change");
  }

  return response.json();
}


export async function UpdateGPODesignateChange(id:string,payload:unknown) {
    try {
    const CONTRACT_URL =
      "https://preview-rls09.congacloud.com/api/data/v1/objects/APTS_GPO_Designation_Changes_c";
       const accessToken = getAccessToken();
    const response = await fetch(`${CONTRACT_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
     
      },
      body: JSON.stringify(payload),
    });
 
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error((err as Error).message);
    throw err;
  }
}


export async function getRetryRecords(UserId:string) {

  const token = getAccessToken();
   const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const formattedDate = sevenDaysAgo.toISOString();
  console.log("formattedDate", `Bearer ${token}`);
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_GPO_Designation_Changes_c",
     {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ObjectName: "APTS_GPO_Designation_Changes_c",
        Criteria: `
          APTS_Status_c = 'Error'
          AND CreatedDate > '${formattedDate}'
          AND CreatedBy.Id= '${UserId}'
        `,
        Select: [
          "Id",
          "APTS_Start_date_c",
          "APTS_Error_Message_c",
          "APTS_Status_c"
        ]
      })
    }
  );

  const result = await response.json();
  return result.Data || [];
}

 export async function getUserIdFromToken() {
  let token = getAccessToken();
  console.log(" Raw Token:", token);
 
  try {

    // Remove "Bearer " if present

    if (token.startsWith("Bearer ")) {

      token = token.slice(7);

      console.log(" Token after removing Bearer:", token);

    }
 
    // Split token

    const parts = token.split('.');

    if (parts.length !== 3) {

      console.error(" Invalid JWT format");

      return null;

    }
 
    const payload = parts[1];

    console.log("Encoded Payload:", payload);
 
    // Decode base64

    let decodedPayload;
 
    // Browser

    if (typeof window !== "undefined" && typeof atob === "function") {

      decodedPayload = JSON.parse(atob(payload));

    } 

    // Node.js

    else {

      decodedPayload = JSON.parse(

        Buffer.from(payload, "base64").toString("utf-8")

      );

    }
 
    console.log(" Decoded Payload:", decodedPayload);
 
    // Extract user id

    const userId = decodedPayload.c_user_id || decodedPayload.sub;
 
    console.log(" Extracted UserId:", userId);
 
    return userId;
 
  } catch (error) {

    console.error(" Error decoding token:", error);

    return null;

  }

}
 


export async function fetchRecords(accId:string) {

  const token = getAccessToken();
   const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const formattedDate = sevenDaysAgo.toISOString();
  console.log("formattedDate", `Bearer ${token}`);
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_GPO_Designation_Changes_c",
     {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ObjectName: "APTS_GPO_Designation_Changes_c",
        Criteria: `APTS_Member_Account_c.Id = '${accId}'
          AND APTS_Status_c = 'Not Processed'`,
        Select: [
          "*"
        ]
      })
    }
  );

  const result = await response.json();
  return result.Data || [];
}





export async function getAgreementDetailsByIds(ids = [],accountIds=[],memberId:string) {

  if (!ids.length) return [];

  const token = getAccessToken();

  // const formattedIds = ids
  //   .map(id => `'${id}'`)
  //   .join(",");

  // const formattedAccountIds = accountIds
  //   .map(id => `'${id}'`)
  //   .join(",");
const formattedIds = ids.length 
    ? ids.map(id => `'${id}'`).join(",") 
    : "''";

  // If accountIds list is empty, fallback to ''
  const formattedAccountIds = accountIds.length 
    ? accountIds.map(id => `'${id}'`).join(",") 
    : "''";

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/Agreement",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "Agreement",
        Criteria: `
          Id IN (${formattedIds})
            AND Status = 'Activated'
          AND StatusCategory = 'In Effect'
          AND Apttus_Market_c = 'North America'
          AND APTS_SalesArea_c = 'United States'
          AND APTS_Country_Code_c = 'US'
          AND APTS_Agreement_Sub_Type_c IN ('Cooperative Alliance Agreement', 'Long term strategic partnership', 'Product Specific Pricing', 'Master Purchase Agreement')
          AND RecordType = 'Customer_Framework'
          AND  ((Account.Id= '${memberId}' 
          AND APTS_Customer_Pricelist_Customer_c.Id IN (${formattedAccountIds}))
          OR APTS_Customer_Pricelist_Customer_c.Id IN (${formattedAccountIds}) 
          OR Account.Id in (${formattedAccountIds}))
        `,
        Select: [
          "Id",
          "Name",
          "Account"
        ]
      })
    }
  );
console.log("getAgreementDetailsByIds response", response);
  const result = await response.json();

  return result.Data || [];
}


export async function queryDesignatedContractsByMember(memberId) {
  const token = getAccessToken();
  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_Account_Contract_c",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ObjectName: "APTS_Account_Contract_c",
        Criteria: `APTS_Designated_Flag_c = true AND APTS_Member_c = '${memberId}'`,
        Select: ["Id", "APTS_End_Date_c"]
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch designated account contracts");
  }

  const result = await response.json();
  return result.Data || [];
}

export async function updateAccountContract(id, payload) {
  try {
    const CONTRACT_URL =
      "https://preview-rls09.congacloud.com/api/data/v1/objects/APTS_Account_Contract_c";
    const accessToken = getAccessToken();
    const response = await fetch(`${CONTRACT_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return response.json();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function updateAccount(id, payload) {
  try {
    const CONTRACT_URL =
      "https://preview-rls09.congacloud.com/api/data/v1/objects/Account";
    const accessToken = getAccessToken();
    const response = await fetch(`${CONTRACT_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return response.json();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}



export async function getActiveGPOAgreements(gpoId) {

  const token = getAccessToken();

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/Agreement",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName: "Agreement",
        Criteria: `
          Account.Id = '${gpoId}'
          AND Status = 'Activated'
          AND StatusCategory = 'In Effect'
          AND Apttus_Market_c = 'North America'
          AND APTS_SalesArea_c = 'United States'
          AND APTS_Country_Code_c = 'US'
        `,
        Select: ["*"]
      })
    }
  );

  const result = await response.json();

  return result.Data || [];
}


export async function getCFAMembersByAgreementIds(
  agreementIds = []
) {

  if (!agreementIds.length) return [];

  const token = getAccessToken();

  const formattedIds =
    agreementIds
      .map(id => `'${id}'`)
      .join(",");

  const response = await fetch(
    "https://preview-rls09.congacloud.com/api/data/v1/query/APTS_Account_Contract_c",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ObjectName:
          "APTS_Account_Contract_c",

        Criteria: `
          APTS_Related_Agreement_c
          IN (${formattedIds})
        `,

        Select: [
          "Id",
          "APTS_Member_c",
          "APTS_Related_Agreement_c",
          "APTS_End_Date_c"
        ]
      })
    }
  );

  const result = await response.json();

  return result.Data || [];
}
