'use client';

import { useEffect, useState } from "react";
import { searchLookupRecords } from "../api/SearchLookup";

function AgreementGroupSelector({ agreementId, value = [], onChange }) {
  const [groups, setGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch Agreement Groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await searchLookupRecords("", "APTS_Agreement_Groups_c");

        let data = res || [];

        if (agreementId) {
          data = data.filter(
            (g) => g?.APTS_Agreement_c === agreementId
          );
        }

        setGroups(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
  }, [agreementId]);

  // Select (Add to list)
  const handleSelect = (group) => {
    // prevent duplicates
    if (value.some((v) => v.Id === group.Id)) return;

   
    onChange([...value, group]);
setShowDropdown(false);
  };

  //  Remove
  const handleRemove = (id) => {
    const updated = value.filter((v) => v.Id !== id);
    onChange(updated);
  };

  return (
    <div className="lookup-container">

      {/* Input Box */}
      <div
        className="lookup-input"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        Search by Agreement Group Name...
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="lookup-dropdown">
          {groups.length > 0 ? (
            // groups.map((g) => (
                groups
  .filter((g) => !value.some((v) => v.Id === g.Id))
  .map((g) => (
              <div
                key={g.Id}
                className="dropdown-item"
                onClick={() => handleSelect(g)}
              >
                {g.Name}
              </div>
            ))
          ) : (
            <div className="dropdown-item">No records found</div>
          )}
        </div>
      )}

      {/* Selected Tags */}
      <div className="selected-tags">
        {value.map((group) => (
          <div key={group.Id} className="selected-tag">
            {group.Name}
            <span
              className="remove-tag"
              onClick={() => handleRemove(group.Id)}
            >
              ✕
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AgreementGroupSelector;