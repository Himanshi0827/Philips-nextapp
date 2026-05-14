import { useState } from "react";
 
function HierarchyLookupList({ records, onSelect,check }) {
  const [search, setSearch] = useState("");
  const [status,setStatus]=useState(false);
 
  const filtered = records.filter(r =>
  `${r.Business_Unit_Name_c || ""} ${r.Business_Group_Name_c|| ""}${r.Business_Unit_ID_c || ""} ${r.Business_Group_ID_c|| ""}`
    .toLowerCase()
    .includes(search.toLowerCase())
);
 
 

  return (
    <div>
      <input
        type="text"
        placeholder={`Search by ${check === 'Business Unit' ? 'Business Unit/Group' : check === 'MAG' ? 'Main Article Group/Business Unit' : 'Article Group/Main Article Group'}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
        onFocus={()=>setStatus(true)}
        onBlur={()=>setStatus(false)}
      />
 
      {status && <div className="lookup-dropdownh">
        {filtered.map((r) => (
          <div
            key={r.Id}
            className="list-item selected"
            onClick={() => onSelect(r)}
            onMouseDown={(e)=>
              {
           
                onSelect(r);
              }}
          >
         {/* Business Unit Mode */}
{check === 'Business Unit' && (
  <>
    <strong>
      {r.Business_Unit_Name_c} <small>({r.Business_Unit_ID_c})</small>
    </strong>
    {" / "}
    <span>
      {r.Business_Group_Name_c} <small>({r.Business_Group_ID_c})</small>
    </span>
  </>
)}

{/* Main Article Group (MAG) Mode */}
{check === 'MAG' && (
  <>
    <strong>
      {r.Main_Article_Group_Name_c} <small>({r.Main_Article_Group_ID_c})</small>
    </strong>
    {" / "}
    <span style={{ fontSize: '0.85em', color: '#666' }}>
      {r.Business_Unit_Name_c} ({r.Business_Unit_ID_c})
    </span>
  </>
)}
{check === 'AG' && (
  <>
    <strong>
      {r.Article_Group_Name_c} <small>({r.Article_Group_ID_c})</small>
    </strong>
    {" / "}
    <span style={{ fontSize: '0.85em', color: '#666' }}>
     {r.Main_Article_Group_Name_c} <small>({r.Main_Article_Group_ID_c})</small>
    </span>
  </>
)}
           
          </div>
        ))}
      </div>}
    </div>
  );
}
 
export default HierarchyLookupList;