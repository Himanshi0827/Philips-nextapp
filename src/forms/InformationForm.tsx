import { useState } from "react";

function InformationForm({ data,onChange,onComplete }) {
  const [form, setForm] = useState({
    ActivationDate: "",
    ExpirationDate: "",
    Description: "",
    ItemSequence: "",
    LineNumber: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    onChange({
      [e.target.name]:e.target.value,
    });
    console.log(e.target.value);
    setForm({
      ...form,
      [e.target.name]:[e.target.value]
    });
  };

  const handleNext = () => {
    if (
      !data.ActivationDate ||
      !data.ExpirationDate ||
      !data.Description ||
      !data.ItemSequence ||
      !data.LineNumber
    ) {
      setError("Please fill all the fields before proceeding.");
      return;
    }

    setError("");
    onComplete(); // ✅ mark tab completed & move to next tab
  };

  return (
    <div className="form-card">
  
      <div className="two-column">
        <div className="field">
          <label>Activation Date</label>
          <input
            type="date"
            name="ActivationDate"
            value={data.ActivationDate}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Expiration Date</label>
          <input
            type="date"
            name="ExpirationDate"
            value={data.ExpirationDate}
            onChange={handleChange}
            min={data.ActivationDate || undefined}
            disabled={!data.ActivationDate}
          />
        </div>

        <div className="field full">
          <label>Description</label>
          <input
            type="text"
            name="Description"
            value={data.Description}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Item Sequence</label>
          <input
            type="number"
            name="ItemSequence"
            value={data.ItemSequence}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Line Number</label>
          <input
            type="number"
            name="LineNumber"
            value={data.LineNumber}
            onChange={handleChange}
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

export default InformationForm;