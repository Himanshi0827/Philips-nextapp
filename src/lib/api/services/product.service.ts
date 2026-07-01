import { apiClient } from "../client";

const QUERY = "/api/data/v1/query";

interface ParentProductResult {
  Id: string;
  Name: string;
  ChildProductId: string;
  ChildProductName: string;
  ChildProductCode?: string;
}

interface ChildProductInput {
  Id: string;
  Name: string;
  ProductCode?: string;
}

interface ParentProductInput {
  Id: string;
  ChildProductId: string;
  ChildProductName?: string;
  ChildProductCode?: string;
}

interface ProductResult {
  Id: string;
  Name: string;
  ProductCode: string;
  ChildId: string;
  ChildName: string;
  ChildProductCode?: string;
  IsDiscountable: boolean;
}

export const getParentProduct = async (
  childProduct: ChildProductInput,
): Promise<ParentProductResult[] | null> => {
  const { data } = await apiClient().post(`${QUERY}/ProductOptionComponent`, {
    Criteria: `ComponentProduct.Id='${childProduct.Id}'`,
    Select: ["Id", "Name", "ParentProduct.Name", "ParentProduct.Id", "ParentProduct"],
  });

  if (data?.Success && data.Data?.length > 0) {
    const temp = data.Data as Array<{ ParentProduct?: { Id: string; Name: string } }>;
    return temp
      .filter((item) => item.ParentProduct)
      .map((item) => ({
        Id: item.ParentProduct!.Id,
        Name: item.ParentProduct!.Name,
        ChildProductId: childProduct.Id,
        ChildProductName: childProduct.Name,
        ChildProductCode: childProduct?.ProductCode,
      }));
  }

  return null;
};

export const getProductsByParent = async (
  parentProductId: ParentProductInput,
): Promise<ProductResult[]> => {
  const { data } = await apiClient().post(`${QUERY}/Product`, {
    Criteria: `Id='${parentProductId.Id}' AND IsActive=true`,
    Select: ["Id", "Name", "ProductCode", "APTS_Discountable_c"],
  });

  const temp = data.Data as Array<{
    Id: string;
    Name: string;
    ProductCode: string;
    APTS_Discountable_c: boolean;
  }>;

  return temp.map((item) => ({
    Id: item.Id,
    Name: item.Name,
    ProductCode: item.ProductCode,
    ChildId: parentProductId.ChildProductId,
    ChildName: parentProductId.ChildProductName ?? "",
    ChildProductCode: parentProductId?.ChildProductCode,
    IsDiscountable: item.APTS_Discountable_c,
  }));
};
