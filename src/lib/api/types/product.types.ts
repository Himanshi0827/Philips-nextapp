import type { LookupObject } from "./common";

export interface Product {
  Id: string;
  Name: string;
  Description?: string;
  [key: string]: unknown;
}

export interface PriceListItem {
  Id: string;
  Name: string;
  Product?: LookupObject;
  ListPrice?: number;
  [key: string]: unknown;
}

export interface ProductHierarchyNode {
  Id: string;
  Name: string;
  Children?: ProductHierarchyNode[];
  [key: string]: unknown;
}
