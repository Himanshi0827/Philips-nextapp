'use client';

import { useState,useEffect,useRef } from "react";
import {toast} from "react-toastify";

import {GetRecords} from "../api/Records";
import {queryAgreementLineItemsByAgreement} from "../api/queryAgreementLineItemsByAgreement";
import { queryHierarchyByCriteria, queryHierarchyMags, queryHierarchyAgs } from "../api/QueryProductHierarchy";
import { GetPicklist } from "../api/GetPicklist";
import { searchLookupRecords, searchHierarchyRecords, dedupeHierarchyResults} from "../api/SearchLookup";
import { getParentProduct } from "../api/GetParentProduct";
import { getProductsByParent } from "../api/GetProductsByParent";

// import HierarchyLookupList from "../components/HierarchyLookupList";
import ParentProductLookup from "../components/ParentProductLookup";
import LookupTypeAhead from "../components/LookupTypeAhead";

const isValid=(checkchild=[] ,checkingparent=[])=>
{

  if(checkchild.length===0) return false;
  const filtered= checkchild.filter(r=>r.Configuration==="Option");
  console.log("Filtered",filtered);
  const childId=new Set(filtered.map(c=>c.Id));
  const parentChildIds=new Set(checkingparent.map(p=>p.ChildId));
  const result=[...childId].filter(id=>!parentChildIds.has(id));
  const resultId= new Set(result);
  const final=filtered.filter(c=>resultId.has(c.Id));
  console.log("hello himu",{isValid:result.length===0,
  final});
  return {isValid:result.length===0,
  final};
}
 
function ProductSelectionForm({ data,onProductsChange , onChange,onComplete }) {
  const [form, setForm] = useState({
    LineType: "",
    MatchProductsBy: "",
    SelectMPGs: ""
  });
 
 const [checkParent,setCheckParent]= useState(false);
// Change these lines:
const [parentProduct, setParentProduct] = useState(null);
const [showParentLookup, setShowParentLookup] = useState(false);
const [allowedParentProducts, setAllowedParentProducts] = useState([]);
 
const [selectedBUs, setSelectedBUs] = useState(data.selectedBUs || []);
const [selectedMAGs, setSelectedMAGs] = useState(data.selectedMAGs || []);
const [selectedAGs, setSelectedAGs] = useState(data.selectedAGs || []);
const [selectedMG3, setSelectedMG3] = useState(data.selectedMG3 || "");
const [selectAllMAGs, setSelectAllMAGs] = useState(false);
const [selectAllAGs, setSelectAllAGs] = useState(false);
const suppressAutoSelectMAGRef = useRef(false);
const suppressAutoSelectAGRef = useRef(false);



const [selectedProducts, setSelectedProducts]=useState(data.selectedProducts ||[]);
  const [linetypes,setLineType]= useState([]);
  const [matchproducts,setMatchProducts]=useState([]);
 const [parentOptions, setParentOptions] = useState([]);
 const [mg3List, setMg3List] = useState([]);
const [mainArticleGroupList, setMainArticleGroupList] = useState([]);
 const [articleGroupList, setArticleGroupList] = useState([]);
 
 
 
const [product , setProduct]=useState([])
const [children, setChildren] = useState([]);
const defaultValue= (value)=>
{
  if(value ==="LineType")
  {
    onChange({"LineType":"Equipment"});
  }
  if (value ==="MG3")
  {
    onChange({"MG3":"None"});
  }
}
const [existingALIs, setExistingALIs] = useState([]);
const [hierarchySearchQuery, setHierarchySearchQuery] = useState("");

useEffect(() => {
  const fetchALI = async () => {
    if (!data.agreementId) return;

    try {
      const res = await queryAgreementLineItemsByAgreement(data.agreementId);
      setExistingALIs(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchALI();
}, [data.agreementId]);

useEffect(() => {
  const refreshParentOptions = async () => {
    if (data.MatchProductsBy === "Product" && data.selectedProducts?.length > 0) {
      
      const resultsArray = await Promise.all(
        data.selectedProducts.map(record => getParentProduct(record))
      );
      
      const allParentData = resultsArray.flat().filter(item => item && item.Id);

      if (allParentData.length > 0) {
        // 1. Get unique Parent IDs by using a string map instead of a Set of objects
        const parentRequests = allParentData.map(async (item) => {
          const detail = await getProductsByParent(item); // item has Id, ChildId, etc.
          return detail;
        });

        const childrenResults = await Promise.all(parentRequests);
        const flattenedResults = childrenResults.flat();

        // 2. Use a Composite Key (ParentId + ChildId) to ensure uniqueness in the UI
        const uniqueMap = new Map();
        flattenedResults.forEach(p => {
          const compositeKey = `${p.Id}-${p.ChildId}`;
          if (!uniqueMap.has(compositeKey)) {
            uniqueMap.set(compositeKey, {
              ...p,
              CompositeKey: compositeKey
            });
          }
        });

        const finalOptions = Array.from(uniqueMap.values());

        // 3. Update State
        setShowParentLookup(true);
        setParentOptions(finalOptions);
        
      
      } else {
        setShowParentLookup(false);
      }
    } else {
      setShowParentLookup(false);
      setParentOptions([]);
    }
  };

  refreshParentOptions();
}, [data.selectedProducts],[data.MatchProductsBy]);

const handleProductSelect = async (record) => {
  handleAddRecord(record);

  const parentData = await getParentProduct(record);

  if (parentData && Array.isArray(parentData)) {
    const allParentIds = [
      ...new Set(
        parentData
          .filter(item => item.ParentProduct?.Id)
          .map(item => item.ParentProduct.Id)
      )
    ];

    if (allParentIds.length > 0) {
      setShowParentLookup(true);

      const results = await Promise.all(
        allParentIds.map(id => getProductsByParent(id))
      );

      const uniqueParents = Array.from(
        new Map(results.flat().map(p => [p.ChildId, p])).values()
      );
      setParentOptions(uniqueParents);

    } else {
      setShowParentLookup(false);
    }
  }
};


useEffect(() => {
  if (data.MatchProductsBy === "Hierarchy") {
 
    loadHierarchyData();
    setSelectedMG3(data.selectedMG3 || "");
    setSelectedBUs(data.selectedBUs || []);
    setSelectedMAGs(data.selectedMAGs || []);
    setSelectedAGs(data.selectedAGs || []);
  }
}, [data.MatchProductsBy]);
const buildHierarchySelectedRecords = async () => {
  const mapped = [];

  for (const bu of selectedBUs) {
    if (selectedMAGs.length === 0 && selectedAGs.length === 0) {
      const res = await queryHierarchyByCriteria({
        criteria: `Business_Unit_ID_c= '${bu.Business_Unit_ID_c}' AND Main_Article_Group_ID_c='' AND Article_Group_ID_c='' AND APTS_MP3_c='${data.MG3 || ""}'`,
        select: [
          "Business_Unit_Name_c",
          "Business_Unit_ID_c",
          "Name",
          "Id"
        ],
      });
      res?.Data?.forEach((row) => mapped.push({
        Id: row.Id ,
        Name: row.Name ,
        Business_Unit_ID_c: row.Business_Unit_ID_c,
        Business_Unit_Name_c: row.Business_Unit_Name_c,
      }));
      continue;
    }

    const buMags = selectedMAGs
      .filter((mag) => mag.Business_Unit_ID_c === bu.Business_Unit_ID_c)
      ;

    for (const mag of buMags) {
      if (selectedAGs.length === 0) {
        const res = await queryHierarchyByCriteria({
          criteria: `Business_Unit_ID_c= '${bu.Business_Unit_ID_c}' AND Main_Article_Group_ID_c='${mag.Main_Article_Group_ID_c}' AND Article_Group_ID_c='' AND APTS_MP3_c='${data.MG3 || ""}'`,
          select: [
            "Business_Unit_Name_c",
            "Main_Article_Group_Name_c",
            "Business_Unit_ID_c",
            "Main_Article_Group_ID_c",
            "Name",
            "Id"
          ],
        });
        res?.Data?.forEach((row) => mapped.push({
          Id: row.Id ,
          Name: row.Name ,
          Business_Unit_ID_c: row.Business_Unit_ID_c,
          Business_Unit_Name_c: row.Business_Unit_Name_c,
          Main_Article_Group_ID_c: row.Main_Article_Group_ID_c,
          Main_Article_Group_Name_c: row.Main_Article_Group_Name_c,
        }));
        continue;
      }

      const magAgs = selectedAGs
          .filter(
            (ag) => ag.Main_Article_Group_ID_c === mag.Main_Article_Group_ID_c
          );

      for (const ag of magAgs) {
        const res = await queryHierarchyByCriteria({
          criteria: `Business_Unit_ID_c= '${bu.Business_Unit_ID_c}' AND Main_Article_Group_ID_c='${mag.Main_Article_Group_ID_c}' AND Article_Group_ID_c='${ag.Article_Group_ID_c}' AND APTS_MP3_c='${data.MG3 || ""}'`,
          select: [
            "Business_Unit_Name_c",
            "Main_Article_Group_Name_c",
            "Article_Group_Name_c",
            "Business_Unit_ID_c",
            "Main_Article_Group_ID_c",
            "Article_Group_ID_c",
            "Name",
            "Id"
          ],
        });
        res?.Data?.forEach((row) => mapped.push({
          Id: row.Id ,
          Name: row.Name ,
          Business_Unit_ID_c: row.Business_Unit_ID_c,
          Business_Unit_Name_c: row.Business_Unit_Name_c,
          Main_Article_Group_ID_c: row.Main_Article_Group_ID_c,
          Main_Article_Group_Name_c: row.Main_Article_Group_Name_c,
          Article_Group_ID_c: row.Article_Group_ID_c,
          Article_Group_Name_c: row.Article_Group_Name_c,
        }));
      }
    }
  }

  const uniqueMapped = Array.from(new Map(mapped.map((r) => [r.Id, r])).values());
 console.log("Mapped Records for Hierarchy", uniqueMapped);
  onChange({
    selectedRecords: uniqueMapped
  });
};
 

 
 
const loadHierarchyData = async () => {
  try {
    const mg3 = await GetPicklist("APTS_MG3_Service_c");
    if (mg3?.Success) {
      setMg3List(mg3.Data.PicklistMetadata[0].PicklistEntries);
      setSelectedMG3(mg3.Data.FieldMetadata[0]?.DefaultValue);
    }
 
    const products = await GetRecords("Product_Hierarchy_c");
    setProduct(products.Data);
    console.log("hierarchy",products.Data)
 
    // ADD THIS: Save the full product data to the parent so NewAgreement can use it for mapping
    onChange({ productData: products.Data });
   
  } catch (err) {
    console.error(err);
  }
};

//trial
// const businessUnits = product.filter(
//   (p, index, self) =>
//     p.Business_Unit_ID_c &&
//     index === self.findIndex(
//       x => x.Business_Unit_ID_c === p.Business_Unit_ID_c
//     ) &&
//     !selectedBUs.some(bu => bu.Business_Unit_ID_c === p.Business_Unit_ID_c)
// );
// console.log("bu",businessUnits);
// const mainArticleGroups = product.filter(
//   (p, index, self) =>
//     selectedBUs.some(
//       bu => bu.Business_Unit_ID_c === p.Business_Unit_ID_c
//     ) &&
//     p.Main_Article_Group_ID_c &&
//     index === self.findIndex(
//       x =>
//         x.Main_Article_Group_ID_c === p.Main_Article_Group_ID_c &&
//         x.Business_Unit_ID_c === p.Business_Unit_ID_c
//     ) &&
//     !selectedMAGs.some(
//       mag => mag.Main_Article_Group_ID_c === p.Main_Article_Group_ID_c
//     )
// );
// const articleGroups = product.filter(
//   (p, index, self) =>
//     selectedMAGs.some(
//       mag =>
//         mag.Main_Article_Group_ID_c === p.Main_Article_Group_ID_c
//     ) &&
//     p.Article_Group_ID_c  &&
//     !selectedAGs.some(
//       ag => ag.Article_Group_ID_c === p.Article_Group_ID_c
//     )
// );
const businessUnits = [];
const mainArticleGroups = [];
const allMainArticleGroups = [];
const articleGroups = [];
const allArticleGroups = [];

const syncSelectedMAGs = (records) => {
  const uniqueMap = new Map(
    records
      .filter((item) => item.Main_Article_Group_ID_c)
      .map((item) => [item.Main_Article_Group_ID_c, item])
  );
  const uniqueRecords = Array.from(uniqueMap.values());
  setSelectedMAGs(uniqueRecords);
  onChange({ selectedMAGs: uniqueRecords });
};

const getUniqueMAGCount = (records) =>
  new Set(records.filter((item) => item.Main_Article_Group_ID_c).map((item) => item.Main_Article_Group_ID_c)).size;

const syncSelectedAGs = (records) => {
  const uniqueMap = new Map(
    records
      .filter((item) => item.Article_Group_ID_c)
      .map((item) => [item.Article_Group_ID_c, item])
  );
  const uniqueRecords = Array.from(uniqueMap.values());
  setSelectedAGs(uniqueRecords);
  onChange({ selectedAGs: uniqueRecords });
};

const getUniqueAGCount = (records) =>
  new Set(records.filter((item) => item.Article_Group_ID_c).map((item) => item.Article_Group_ID_c)).size;

useEffect(() => {
  const allMagCount = getUniqueMAGCount(allMainArticleGroups);
  const selectedMagCount = getUniqueMAGCount(selectedMAGs);

  if (selectAllMAGs) {
    suppressAutoSelectMAGRef.current = false;
    if (allMagCount > 0 && selectedMagCount !== allMagCount) {
      syncSelectedMAGs(allMainArticleGroups);
    }
    return;
  }
  if (suppressAutoSelectMAGRef.current) {
    suppressAutoSelectMAGRef.current = false;
    return;
  }
  if (selectedBUs.length > 0 && allMagCount > 0 && selectedMagCount === allMagCount) {
    setSelectAllMAGs(true);
  }
}, [selectAllMAGs, allMainArticleGroups, selectedBUs.length, selectedMAGs]);

useEffect(() => {
  const allAGCount = getUniqueAGCount(allArticleGroups);
  const selectedAGCount = getUniqueAGCount(selectedAGs);

  if (selectAllAGs) {
    suppressAutoSelectAGRef.current = false;
    if (allAGCount > 0 && selectedAGCount !== allAGCount) {
      syncSelectedAGs(allArticleGroups);
    }
    return;
  }
  if (suppressAutoSelectAGRef.current) {
    suppressAutoSelectAGRef.current = false;
    return;
  }
  if (selectedMAGs.length > 0 && allAGCount > 0 && selectedAGCount === allAGCount) {
    setSelectAllAGs(true);
  }
}, [selectAllAGs, allArticleGroups, selectedMAGs.length, selectedAGs]);





useEffect(()=>
{
  const result= isValid(
    data?.selectedProducts,
    data?.selectedParentProducts
  );
  setCheckParent(result);
  if(result.isValid)
  {
    onProductsChange( data?.selectedProducts);
  }
  else 
  {
    onProductsChange([]);
    result?.final?.forEach(pr=>{
      if(pr.Configuration==="Option")
      {
        toast.warning(`Please select atleast 1 Parent Product for Option product [${pr.Name}. • ${pr.ProductCode}] to enable Create Button`)}
      }
    );
  }

  console.log("Checking Boolean Value",result);

},[data?.selectedProducts],[data?.selectedParentProducts])
 
 
const handleSelectBU = (record) => {
   if (selectedBUs.some((bu) => bu.Business_Unit_ID_c === record.Business_Unit_ID_c)) return;
 
  const newList = [...selectedBUs, record]; // Create the new list first
  setSelectedBUs(newList); // Update local
  onChange({ selectedBUs: newList }); // Sync with parent using the NEW list
  onProductsChange(newList);
  loadDistinctMagsForSelectedBus(newList);
};

const loadDistinctMagsForSelectedBus = async (bus = selectedBUs) => {
  if (!bus.length) {
    setMainArticleGroupList([]);
    return;
  }
  const results = await Promise.all(
    bus.map((bu) => queryHierarchyMags(bu.Business_Unit_ID_c))
  );
  const unique = dedupeHierarchyResults(
    results.flatMap((res) => res?.Data || []),
    "MAG"
  );
  setMainArticleGroupList(unique.filter((row) => row.Main_Article_Group_ID_c));
};

const loadDistinctAgsForSelectedMags = async (mags = selectedMAGs) => {
  if (!mags.length) {
    setArticleGroupList([]);
    return;
  }
  const results = await Promise.all(
    mags.map((mag) => queryHierarchyAgs(mag.Main_Article_Group_ID_c))
  );
  const unique = dedupeHierarchyResults(
    results.flatMap((res) => res?.Data || []),
    "AG"
  );
  setArticleGroupList(unique.filter((row) => row.Article_Group_ID_c));
};

const filterHierarchyResults = (rows, mode) => {
  if (mode === "BU") {
    return rows.filter((row) => row.Business_Unit_ID_c && row.Business_Group_ID_c);
  }

  if (mode === "MAG") {
    const allowedBuIds = new Set(selectedBUs.map((bu) => bu.Business_Unit_ID_c));
    return rows.filter(
      (row) =>
        row.Main_Article_Group_ID_c &&
        allowedBuIds.has(row.Business_Unit_ID_c)
    );
  }

  if (mode === "AG") {
    const allowedMagIds = new Set(
      selectedMAGs.map((mag) => mag.Main_Article_Group_ID_c)
    );
    return rows.filter(
      (row) =>
        row.Article_Group_ID_c &&
        allowedMagIds.has(row.Main_Article_Group_ID_c)
    );
  }

  return rows;
};

const searchHierarchyTypeAhead = async (criteria, mode) => {
  if (!criteria || criteria.length < 3) return [];
  const rows = await searchHierarchyRecords(criteria);
  return dedupeHierarchyResults(filterHierarchyResults(rows, mode), mode);

};
const handleRemoveBU = (buId) => {
  // 1. Update local state so it reappears in the available list
  const updatedList = selectedBUs.filter(item => item.Business_Unit_ID_c !== buId);
  setSelectedBUs(updatedList);
  onProductsChange(updatedList);
  // 2. Clear dependent selections (MAGs and AGs) because the parent BU is gone
  setSelectedMAGs([]);
  setSelectedAGs([]);
   setMainArticleGroupList([]);
  setArticleGroupList([]);
  setSelectAllMAGs(false);
  setSelectAllAGs(false);
 
  // 3. Notify parent component
  onChange({ selectedBUs: updatedList });
};
const handleSelectMAG = (record) => {
  if (!record.Main_Article_Group_ID_c) return;
  if (selectedMAGs.some((mag) => mag.Main_Article_Group_ID_c === record.Main_Article_Group_ID_c)) return;
  const newList = [...selectedMAGs, record];
  setSelectedMAGs(newList);
  setSelectAllMAGs(false);
  onChange({ selectedMAGs: newList });
  loadDistinctAgsForSelectedMags(newList);
  const nextCount = new Set(newList.map((item) => item.Main_Article_Group_ID_c).filter(Boolean)).size;
  if (mainArticleGroupList.length > 0 && nextCount === mainArticleGroupList.filter((item) => item.Main_Article_Group_ID_c).length) {
    setSelectAllMAGs(true);
  }
};
const handleRemoveMAG = (buId) => {
  // 1. Update local state so it reappears in the available list
  const updatedList = selectedMAGs.filter(item => item.Main_Article_Group_ID_c !== buId);
  setSelectedMAGs(updatedList);
 
  // 2. Clear dependent selections (MAGs and AGs) because the parent BU is gone
  //setSelectedMAGs([]);
  setSelectedAGs([]);
 setArticleGroupList([]);
  // 3. Notify parent component
  setSelectAllMAGs(false);
  setSelectAllAGs(false);
  onChange({ selectedMAGs: updatedList });
};
 
const handleSelectAG = (record) => {
   if (!record.Article_Group_ID_c) return;
  if (selectedAGs.some((ag) => ag.Article_Group_ID_c === record.Article_Group_ID_c)) return
  const newList = [...selectedAGs, record];
  setSelectedAGs(newList);
  setSelectAllAGs(false);
  onChange({ selectedAGs: newList });
    const nextCount = new Set(newList.map((item) => item.Article_Group_ID_c).filter(Boolean)).size;
  if (articleGroupList.length > 0 && nextCount === articleGroupList.filter((item) => item.Article_Group_ID_c).length) {
    setSelectAllAGs(true);
  }

};
const handleRemoveAG = (buId) => {
  // 1. Update local state so it reappears in the available list
  const updatedList = selectedAGs.filter(item => item.Article_Group_ID_c!== buId);
  setSelectedAGs(updatedList);
 
  // 2. Clear dependent selections (MAGs and AGs) because the parent BU is gone
 
   setSelectAllAGs(false);
  // 3. Notify parent component
  onChange({ selectedAGs: updatedList });
};

const handleToggleAllMAGs = (checked) => {
  setSelectAllMAGs(checked);
  if (checked) {
    suppressAutoSelectMAGRef.current = false;
    syncSelectedMAGs(mainArticleGroupList.filter((row) => row.Main_Article_Group_ID_c));
    setSelectAllAGs(false);
    loadDistinctAgsForSelectedMags(mainArticleGroupList.filter((row) => row.Main_Article_Group_ID_c));
  } else {
    suppressAutoSelectMAGRef.current = true;
    setSelectedMAGs([]);
    setSelectedAGs([]);
    setArticleGroupList([]);
    onChange({ selectedMAGs: [], selectedAGs: [] });
  }
};

const handleToggleAllAGs = (checked) => {
  setSelectAllAGs(checked);
  if (checked) {
    suppressAutoSelectAGRef.current = false;
    syncSelectedAGs(articleGroupList.filter((row) => row.Article_Group_ID_c));
  } else {
    suppressAutoSelectAGRef.current = true;
    setSelectedAGs([]);
    onChange({ selectedAGs: [] });
  }
};

  useEffect(()=>
  {
  const handleAgreement = async ()=>
  {
    try{
      const res1= await GetPicklist("Line_Type_c");
      const res2= await GetPicklist("APTS_Match_Products_By_c");
      if(res1.Success)
      {
        setLineType(res1.Data.PicklistMetadata[0].PicklistEntries);
      }
      if(res2.Success)
      {
        setMatchProducts(res2.Data.PicklistMetadata[0].PicklistEntries);
      }
    }
    catch(err)
    {
      console.error("Failed to fetch ",err);
    }
  };
  handleAgreement();
},[]);
 
  const [error, setError] = useState("");
 
  const handleChange = (e) => {
    onChange({
      [e.target.name]:e.target.value,
    });
    console.log(e.target.value);
    if(e.target.value==="Hierarchy")
    {
      onChange({ selectedProducts: [] });
      onChange({ selectedParentProducts: []});
      
    }
    else if(e.target.value==="Product")
    {
      console.log("working");

      onChange({ selectedBUs:[]});
      onChange({ selectedMAGs:[]});
      onChange({ selectedAGs:[]});
      onChange({ selectedMG3:""});
      setSelectAllMAGs(false);
      setSelectAllAGs(false);
    }
    setForm({
      ...form,
      [e.target.name]:[e.target.value]
    });
  };
  console.log("Parent Product check ",data?.selectedParentProducts);
 
   const handleAddRecord = async (record) => {
    if (!record) return;
  const alreadyInALI = existingALIs.some(
    ali => ali.Product?.Id === record.Id
  );

  if (alreadyInALI) {
    toast.error(`Product "${record.Name}" already exists in Agreement Line Items`);
    return;
  }
    // prevent duplicates

    const exists = data.selectedProducts?.some(r => r.Id === record.Id);
    if (exists) return;
    const newProducts=[...selectedProducts,record];
    setSelectedProducts(newProducts);
   
    
    onChange({
      selectedProducts: [...(data.selectedProducts || []), record]
    });
    console.log(record.Configuration);
    if(record.Configuration==="Option")
    {

      onProductsChange([]);
    }
    else if((record.Configuration==="Bundle" || record.Configuration==="Standalone") && checkParent){
      
      console.log("bundle check ",checkParent);
      onProductsChange(newProducts);
    }
    
  };
   const handleRemoveRecord=(record) =>
  {
    const newProducts=selectedProducts.filter(item=> item.Id!== record.Id);
    setSelectedProducts(newProducts);
    onChange({selectedProducts:newProducts});
    onProductsChange(newProducts);
  }
 
 
const handleNext = async() => {
 
  if (!data.LineType || !data.MatchProductsBy) {
    setError("Please fill all the fields before proceeding.");
    return;
  }
 
  if (data.MatchProductsBy === "Hierarchy") {
   await buildHierarchySelectedRecords();
 
    onChange({
      Field: "Hierarchy_c"
    });
  }
 
  setError("");
 
  onComplete();
};

 useEffect(() => {
  const validateHierarchy = async () => {
    if (data.MatchProductsBy !== "Hierarchy" || selectedBUs.length === 0) return;

  
    const isDuplicate = existingALIs.some((ali) => {
      return (
        ali.Hierarchy_c?.Business_Unit_ID_c === selectedBUs[0]?.Business_Unit_ID_c &&
        ali.Hierarchy_c?.Main_Article_Group_ID_c === selectedMAGs[0]?.Main_Article_Group_ID_c &&
        ali.Hierarchy_c?.Article_Group_ID_c === selectedAGs[0]?.Article_Group_ID_c
      );
    });

    if (isDuplicate) {
      toast.error("This Hierarchy (BU/MAG/AG) already exists in ALI");

      setSelectedBUs([]);
      setSelectedMAGs([]);
      setSelectedAGs([]);

      onChange({
        selectedBUs: [],
        selectedMAGs: [],
        selectedAGs: []
      });

      return;
    }

   await buildHierarchySelectedRecords();
    onChange({ Field: "Hierarchy_c" });
  };

  validateHierarchy();
}, [selectedBUs, selectedMAGs, selectedAGs, data.MG3, existingALIs]);

  return (
    <div className="form-card">
     
 
      <table className="form-table">
        <tbody>
 
          <tr>
            <td className="label">Line Type</td>
            <td>
              <select 
              
                name="LineType"
             
                value={data.LineType!==""? data.LineType:defaultValue("LineType")}
                onChange={handleChange}
              >
             
                {linetypes.map(linetype => (
                  <option key={linetype.Value}>
                  {linetype.Value}
                  </option>
                ))} </select>
            </td>
          </tr>
 
          <tr>
            <td className="label">Match Products by</td>
            <td>
              <select
                name="MatchProductsBy"
                value={data.MatchProductsBy}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {matchproducts.map(matchproduct => (
                  <option key={matchproduct.Value}>
                  {matchproduct.Value}
                  </option>
                ))}
              </select>
            </td>
          </tr>
 {data.MatchProductsBy === "Hierarchy" && (
  <>
    {/* MG3 */}
    <tr>
      <td className="label">MG3</td>
      <td>
        
<select
        name="MG3"
        value={data.MG3!==""? data.MG3: defaultValue("MG3")}
        onChange={handleChange}
    
>
       
          {mg3List.map(mg => (
            <option key={mg.Value} value={mg.Value}>
              {mg.Value}
            </option>
          ))}
        </select>
      </td>
    </tr>
 
    {/* Hierarchy Search List */}
    <tr>
    <td className="label">Select Business Unit</td>
    <td>
      {/* <HierarchyLookupList
        // BusinessUnits filter will now automatically include items removed from selectedBUs
        records={businessUnits}
        onSelect={handleSelectBU}
        check ='Business Unit'
      /> */}
       <LookupTypeAhead
        field={{
          DisplayName: "Business Unit",
          LookupObjectName: "Product_Hierarchy_c",
          hierarchyMode: "BU",
          selectedItems: selectedBUs,
        }}
        value={null}
        onChange={handleSelectBU}
        searchFn={(criteria) => searchHierarchyTypeAhead(criteria, "BU")}
      />
    </td>
  </tr>
   
   {/* SELECTED BUs DISPLAY */}
  {selectedBUs.length > 0 && (
    <tr>
      <td className="label">Selected Business Units</td>
      <td>
        <div className="list-box">
          {selectedBUs.map((bu) => (
            <div key={bu.Business_Unit_ID_c} className="list-item selected">
              {/* FIX: Showing Name and ID */}
              <span>{bu.Business_Unit_Name_c} /{bu.Business_Unit_ID_c}</span>
              <span
                className="remove"
                style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                onClick={() => handleRemoveBU(bu.Business_Unit_ID_c)}
              >
                ✖
              </span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  )}
 
  {/* MAIN ARTICLE GROUP SECTION */}
  {selectedBUs.length > 0 && (
    <tr>
      <td className="label">Main Article Group</td>
      <td>
        {/* <HierarchyLookupList
          records={mainArticleGroups}
          onSelect={handleSelectMAG}
          check='MAG'
        /> */}
         <LookupTypeAhead
          field={{
            DisplayName: "Main Article Group",
            LookupObjectName: "Product_Hierarchy_c",
            hierarchyMode: "MAG",
            selectedItems: selectedMAGs,
          }}
          value={null}
          onChange={handleSelectMAG}
          searchFn={(criteria) => searchHierarchyTypeAhead(criteria, "MAG")}
        />
        <label className="toggle-row toggle-control" style={{ paddingTop: "10px" }}>
          <span style={{ marginRight: "10px" }}>Select All MAG(s)</span>
          <span className="switch">
            <input
              type="checkbox"
              checked={selectAllMAGs}
              onChange={(e) => handleToggleAllMAGs(e.target.checked)}
            />
            <span className="slider round"></span>
          </span>
        </label>
      </td>
    </tr>
  )}
 
{selectedMAGs.length > 0 && (
    <tr>
      <td className="label">Selected MAGs</td>
      <td>
        <div className="list-box">
          {selectedMAGs.map((bu) => (
            <div key={bu.Main_Article_Group_ID_c} className="list-item selected">
              {/* FIX: Showing Name and ID */}
             {bu.Main_Article_Group_Name_c} /{bu.Main_Article_Group_ID_c}
              <span
                className="remove"
                style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                onClick={() => handleRemoveMAG(bu.Main_Article_Group_ID_c)}
              >
                ✖
              </span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  )}
{selectedMAGs.length > 0 && (
   <tr>
    <td className="label">Article Group</td>
    <td>
  {/* <HierarchyLookupList
    records={articleGroups}
    onSelect={handleSelectAG}
    check='AG'
  /> */}
      <LookupTypeAhead
    field={{
      DisplayName: "Article Group",
      LookupObjectName: "Product_Hierarchy_c",
      hierarchyMode: "AG",
      selectedItems: selectedAGs,
    }}
    value={null}
    onChange={handleSelectAG}
    searchFn={(criteria) => searchHierarchyTypeAhead(criteria, "AG")}
  />
  <label className="toggle-row toggle-control" style={{ paddingTop: "10px" }}>
    <span style={{ marginRight: "10px" }}>Select All AG(s)</span>
    <span className="switch">
      <input
        type="checkbox"
        checked={selectAllAGs}
        onChange={(e) => handleToggleAllAGs(e.target.checked)}
      />
      <span className="slider round"></span>
    </span>
  </label>
   </td>
  </tr>
)}
 
{selectedAGs.length > 0 && (
    <tr>
      <td className="label">Selected AGs</td>
      <td>
        <div className="list-box">
          {selectedAGs.map((bu) => (
            <div key={bu.Article_Group_ID_c} className="list-item selected">
              {/* FIX: Showing Name and ID */}
             {bu.Article_Group_Name_c} /{bu.Article_Group_ID_c}
              <span
                className="remove"
                style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                onClick={() => handleRemoveAG(bu.Article_Group_ID_c)}
              >
                ✖
              </span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  )}
 
  </>
)}
 
          {data.MatchProductsBy === "MPG" && (
          <tr>
          <td className="label">Select MPGs</td>
          <td>
          <LookupTypeAhead
              field={{
                DisplayName: "Select MPG",
                LookupObjectName: "SelectMPG_c"
                }}
              value={null}   // always empty to allow multi add
              onChange={(record) => {
                  onChange({ Field: "SelectMPGs_c" });
                  handleAddRecord(record);
                }}
              searchFn={searchLookupRecords}
            />
          </td>
        </tr> )}
 
 
       
 
     
 {data.MatchProductsBy === "Product" && (
  <tr>
    <td className="label">Select Product</td>
    <td>
      <LookupTypeAhead
        field={{
          DisplayName: "Select Product",
          LookupObjectName: "Product",
          isProductLookup: true
        }}
        value={null}
        onChange={handleProductSelect}
        searchFn={searchLookupRecords}
      />
    </td>
  </tr>
)}
 
 
  {data.selectedProducts?.length > 0 && data.MatchProductsBy === "Product" && (
  <tr className="manual-selection-row">
    <td className="label"> Selected Product</td>
    <td>
      <div className="list-box manual-box">
        {/* {data.selectedRecords.map((r, i) => ( */}
           {data.selectedProducts.map((r, i) => (
          <div key={i} className="list-item manual">
           <span>📦 {r.Name} • {r.ProductCode}</span>
            <span
              className="remove"
              onClick={() => {
  const updated = selectedProducts.filter(p => p.Id !== r.Id);
  setSelectedProducts(updated);
  onChange({ selectedProducts: updated });
  onProductsChange(updated);
}}
              
            >✖</span>
          </div>
        ))}
      </div>
    </td>
  </tr>
)}

{data.MatchProductsBy === "Product" && showParentLookup && data.selectedProducts?.length>0 &&(
  <tr>
    <td className="label">Select Parent Product</td>
    <td>
      <ParentProductLookup
        records={parentOptions}
        onSelect={(parent) => {
      const current = data.selectedParentProducts || [];
    
  if (!current.some(p => p.Id === parent.Id && p.ChildId === parent.ChildId)) {
    onChange({
      selectedParentProducts: [...current, parent]
    });
    // checkerFunc(parent);
    console.log(checkParent);
    if(checkParent)
    {
      onProductsChange(data.selectedProducts);
    }
  }
}}

      />
    </td>
  </tr>
)}


{data.MatchProductsBy === "Product" && data.selectedParentProducts?.length > 0 && (
  <tr>
    <td className="label">Selected Parent Products</td>
    <td>
      <div className="list-box">
        {data.selectedParentProducts.map(p => (
          <div key={p.Id} className="list-item">
            🧩 [{p.Name}•{p.ProductCode}] --&gt;[{p.ChildName}•{p.ChildProductCode}]
            <span
              className="remove"
              onClick={() =>{
                onChange({
                  selectedParentProducts: data.selectedParentProducts.filter(x => x.Id !== p.Id)
                });
                const update=data.selectedParentProducts.filter(x=>x.Id!==p.Id);
              
                onProductsChange(update);
              }
              }
            >✖</span>
          </div>
        ))}
      </div>
    </td>
  </tr>
)}

 
          {data.MatchProductsBy==="Pricing Family" && <tr>
            <td className="label">Select Pricing Family</td>
            <td>
            <LookupTypeAhead
            field={{
              DisplayName: "Select Pricing Family",
              LookupObjectName: "PricingFamily_c"}}
            value={data.FieldName}   // { Id, Name }
            onChange={(record) =>
              onChange({
                FieldName: record,        // store full object
                FieldId: record?.Id,
                Field:"PricingFamily_c"   // store Id separately if needed
              })}
            searchFn={searchLookupRecords}
            />
            </td>
          </tr>}
 
 
        </tbody>
      </table>
 
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error}
        </div>
      )}
 
      
    </div>
  );
}
 
export default ProductSelectionForm;
