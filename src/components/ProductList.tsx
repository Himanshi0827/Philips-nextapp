
import { useState, useMemo } from "react";

function ProductList({
  products,
  onOpenDiscount,
  data,
  isParentTable = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    const term = searchTerm.toLowerCase();

    return products.filter((p) => {
      // product table search
      if (!isParentTable) {
        return (
          p?.Name?.toLowerCase().includes(term) ||
          p?.ProductCode?.toLowerCase().includes(term)
        );
      }

      // parent table search (parent + child)
      return (
        p?.Name?.toLowerCase().includes(term) ||
        p?.ProductCode?.toLowerCase().includes(term) ||
        p?.ChildName?.toLowerCase().includes(term) ||
        p?.ChildProductCode?.toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm, isParentTable]);

  return (
    <>
      <div className="table-toolbar">
          <p style={{ margin: 0 }}>Search Products</p>  
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="producttable-container">
        <table className="product-table">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>{isParentTable ? "Parent Product" : "Products"}</th>
              <th>{isParentTable ? "Parent Product Code" : "Product Code"}</th>

              {isParentTable && (
                <>
                  <th>Child Product Name</th>
                  <th>Child Product Code</th>
                </>
              )}

              <th>Discount Type</th>
              <th>%Tier 1</th>
              <th>%Tier 2</th>
              <th>%Tier 3</th>
              <th>%Tier 4</th>
              <th>%Tier 5</th>
              <th>NPO1</th>
              <th>NPO2</th>
              <th>NPO3</th>
              <th>NPO4</th>
              <th>NPO5</th>
              <th>NPO6</th>
              <th>NPO7</th>
              <th>Scale Discount T1</th>
              <th>Scale Discount T2</th>
              <th>Scale Discount T3</th>
              <th>Scale Discount T4</th>
              <th>Scale Discount T5</th>
              <th>Vol Threshold 1</th>
              <th>Vol Threshold 2</th>
              <th>Vol Threshold 3</th>
              <th>Vol Threshold 4</th>
              <th>Vol Threshold 5</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, index) => (
              <tr key={p.CompositeKey || p.Id || index}>
                <td> {index + 1}</td>
                <td>
                  <button onClick={() => onOpenDiscount(index)}>⚙️</button>
                  {/* <button>📋</button> */}
                </td>
                <td>{p.Name}</td>
                <td>{p.ProductCode || "N/A"}</td>

                {isParentTable && (
                  <>
                    <td style={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}>
                      {p.ChildName || "N/A"}
                    </td>
                    <td style={{ backgroundColor: "#f9f9f9" }}>
                      {p.ChildProductCode || "N/A"}
                    </td>
                  </>
                )}

                <td>{p.DiscountType}</td>

                {[0, 1, 2, 3, 4].map((i) => (
                  <td key={`tier-${i}`}>
                    {p.DiscountType === "Tier Discount" &&
                    !Array.isArray(p?.Discounts?.[i])
                      ? (p?.Discounts?.[i] ?? "")
                      : ""}
                    {p.DiscountType === "Tier Discount % + Scaled"
                      ? (p?.Discounts?.[0]?.TierDiscount?.[i] ?? "")
                      : ""}
                  </td>
                ))}

                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <td key={`npo-${i}`}>
                    {p.DiscountType === "Net Price Override" &&
                    !Array.isArray(p?.Discounts?.[i])
                      ? (p?.Discounts?.[i] ?? "")
                      : ""}
                    {p.DiscountType === "Net Price Override + Scaled" && i < 5
                      ? (p?.Discounts?.[0]?.NetPrice?.[i] ?? "")
                      : ""}
                  </td>
                ))}

                {[0, 1, 2, 3, 4].map((i) => (
                  <td key={`scaled-${i}`}>
                    {p.DiscountType === "Tier Discount % + Scaled"
                      ? (p?.Discounts?.[1]?.scaledDiscount?.[i] ?? "")
                      : ""}
                    {p.DiscountType === "Net Price Override + Scaled"
                      ? (p?.Discounts?.[1]?.ScaledDiscountAmt?.[i] ?? "")
                      : ""}
                  </td>
                ))}

                {[0, 1, 2, 3, 4].map((i) => (
                  <td key={`vol-${i}`}>
                    {(p.DiscountType === "Tier Discount % + Scaled" ||
                      p.DiscountType === "Net Price Override + Scaled")
                      ? (p?.Discounts?.[2]?.VolumeThreshold?.[i] ?? "")
                      : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ProductList;
