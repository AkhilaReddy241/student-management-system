function CollegeHeader() {
  return (
    <div
      style={{
        width: "100%",
        padding: "15px 25px",
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #0d6efd",
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <div style={{ fontSize: "40px" }}>🏫</div>

      <div>
        <h2 style={{ margin: 0 }}>
          MLR Institute of Technology
        </h2>

        <p style={{ margin: 0, color: "#666" }}>
          Student Management System
        </p>
      </div>
    </div>
  );
}

export default CollegeHeader;