'use client';

import { useEffect, useState } from "react";

function EditInformationForm({ data, onChange, onComplete }) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (
      !data.APTS_Activation_Date_c ||
      !data.APTS_Expiration_Date_c ||
      !data.Description ||
      !data.ItemSequence ||
      !data.LineNumber
    ) {
      setError("Please fill all required fields before proceeding.");
      return;
    }

    setError("");
    onComplete();
  };

  return (
    <div className="form-card">

      <div className="two-column">

        <div className="field">
          <label>Activation Date</label>
          <input
            type="date"
            value={data.APTS_Activation_Date_c || ""}
            onChange={(e) =>
              onChange("APTS_Activation_Date_c", e.target.value)
            }
          />
        </div>

        <div className="field">
          <label>Expiration Date</label>
          <input
            type="date"
            value={data.APTS_Expiration_Date_c || ""}
            min={data.APTS_Activation_Date_c || undefined}
            onChange={(e) =>
              onChange("APTS_Expiration_Date_c", e.target.value)
            }
          />
        </div>

        <div className="field full">
          <label>Description</label>
          <input
            type="text"
            value={data.Description || ""}
            onChange={(e) =>
              onChange("Description", e.target.value)
            }
          />
        </div>

        <div className="field">
          <label>Item Sequence</label>
          <input
            type="number"
            value={data.ItemSequence || ""}
            onChange={(e) =>
              onChange("ItemSequence", e.target.value)
            }
          />
        </div>

        <div className="field">
          <label>Line Number</label>
          <input
            type="number"
            value={data.LineNumber || ""}
            onChange={(e) =>
              onChange("LineNumber", e.target.value)
            }
          />
        </div>

      </div>

      {error && (
        <div style={{ color: "red", marginTop: "12px" }}>
          {error}
        </div>
      )}

 
    </div>
  );
}

export default EditInformationForm;
