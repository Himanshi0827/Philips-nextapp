import { useState } from "react";


function ParentProductLookup({ records = [], onSelect }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  
const filtered = records.filter(p =>
    `${p.Name || ""} ${p.ProductCode || ""} ${p.ChildName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search Parent Product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 300)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      {open && filtered.length > 0 && (
        <div className="list-box">
     
{filtered.map(p => (
  <div
    key={p.ChildId} // Use the composite key here!
    className="list-item"
    onMouseDown={() => onSelect(p)}
    style={{ display: 'flex', justifyContent: 'space-between' }}
  >
    <span>
      <strong>{p.Name}</strong> <small>({p.ProductCode})</small>
    </span>
    <span style={{ color: '#007bff' }}>
      → Child: {p.ChildName}({p.ChildProductCode})
    </span>
  </div>
))}
        </div>
      )}
    </div>
  );
}

export default ParentProductLookup;
