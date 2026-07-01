function Sidebar({ activeTab, completedTabs, onSelect }) {
  const tabs = [
  { key: "Agreement Group", label: "Agreement Group", icon: "📦" },
  { key: "Product Selection", label: "Product Selection", icon: "🧾" },
  { key: "Discount Pricing Strategy", label: "Discount Pricing Strategy", icon: "💲" },
  { key: "Agreement Header Information", label: "Agreement Header Information", icon: "📄" },
  { key: "Information", label: "Information", icon: "ℹ️" },
  { key: "Select Billing Plan", label: "Billing Plan", icon: "💳" }, // 👈 changed here
];


  return (
    <div className="sidebar">
      {tabs.map((tab, index) => {
        // Check if tab is completed
        const isCompleted = completedTabs?.includes(tab.key);

        // Check if tab is active
        const isActive = activeTab === tab.key;

        // Enable only if active or completed
        const isDisabled = !isCompleted && !isActive;

        return (
          <div
            key={tab.key}
            className={`sidebar-item
              ${isActive ? "active" : ""}
              ${isCompleted ? "completed" : ""}
              ${isDisabled ? "disabled" : ""}
            `}
            onClick={() => {
              if (!isDisabled) {
                onSelect(tab.key);
              }
            }}
          >
            <span className="icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
