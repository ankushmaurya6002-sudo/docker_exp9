const deployments = [
  { version: "v1.0", status: "Success" },
  { version: "v1.1", status: "Success" },
  { version: "v1.2", status: "Failed" }
];

export default function DeploymentList() {
  return (
    <div>
      <h3>📦 Deployment History</h3>
      <ul>
        {deployments.map((d, i) => (
          <li key={i}>
            {d.version} - {d.status}
          </li>
        ))}
      </ul>
    </div>
  );
}