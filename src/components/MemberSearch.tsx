'use client';

import { useEffect, useState } from "react";
import { getAccounts } from "../api/member";

export default function MemberSearch({ value, onChange,type }) {
  const [list, setList] = useState([]);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);

  // Load once
  useEffect(() => {
    const load = async () => {
      let filters = {
        Market_c: "North America",
        Country_c: "United States",
        Inactive_Flag_c: false
      };

      //  MEMBER FILTER
      if (type === "MEMBER") {
        filters = {
          ...filters,
          ERP_Account_Group_c: "0001 - SOLD TO PARTY",
          MP1_Customer_id_1_c: { notNull: true }
        };
      }

      //  GPO FILTER
      if (type === "GPO") {
        filters = {
          ...filters,
          Golden_Record_Key_c: { notNull: true }
        };
      }

      const data = await getAccounts({ filters });
      setList(data);
    };

    load();
  }, [type]);

  useEffect(() => {
  if (value?.Name) {
    setInput(value.Name);
  } else {
    setInput(""); //  THIS FIXES CLEAR ISSUE
  }
}, [value]);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".lookup-container")) {
      setShow(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);
const filtered = list
  .filter(acc =>
    acc.Name?.toLowerCase().includes(input.toLowerCase())
  )
  .sort((a, b) => {
    if (a.Id === value?.Id) return -1;
    if (b.Id === value?.Id) return 1;
    return 0;
  });


  return (
  
    <div className="lookup-container">
       {value && (
      <div className="chip">
        {value.Name}
        <span
          className="chip-close"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
            setInput("");
          }}
        >
          ✕
        </span>
      </div>
    )}

      <input
  value={input}   //  hide text when selected
      placeholder={value ? "" : `Search ${type}`}
     
        onChange={(e) => {
          setInput(e.target.value);
          setShow(true);
          onChange(null);
        }}
      />

      {show && input.length >= 2 && (
        <ul className="lookup-dropdown">
          {filtered.map(acc => (
            <li
              key={acc.Id}
              onClick={() => {
                onChange(acc);
                setInput(acc.Name);
                setShow(false);
              }}
            >
              <div className="lookup-title">{acc.Name}</div>
              <div className="lookup-subtext">
                {acc.MP1_Customer_id_1_c}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}