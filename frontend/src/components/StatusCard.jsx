export default function StatusCard({ title, status }) {
  return (
    <div style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "10px",
      width: "200px"
    }}>
      <h4>{title}</h4>
      <p style={{ color: status === "Success" ? "lightgreen" : "red" }}>
        {status}
      </p>
    </div>
  );
}