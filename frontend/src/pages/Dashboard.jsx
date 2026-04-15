import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatusCard from "../components/StatusCard";
import { getWorkflowRuns } from "../services/githubApi";
import { getLatestDockerTag } from "../services/dockerApi";

export default function Dashboard() {
  const [buildStatus, setBuildStatus] = useState("Loading...");
  const [deployments, setDeployments] = useState([]);
  const [dockerImage, setDockerImage] = useState("Loading...");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchData = async () => {
    const dockerRepository =
      import.meta.env.VITE_DOCKER_REPOSITORY || import.meta.env.VITE_REPO_NAME;

    try {
      const runs = await getWorkflowRuns();
      const latest = runs[0];

      setBuildStatus(latest?.conclusion || latest?.status || "No Runs Yet");
      setDeployments(
        runs.slice(0, 5).map((run) => ({
          id: run.id,
          status: run.conclusion || run.status || "Running",
          time: run.created_at,
        }))
      );
    } catch (error) {
      console.error("GitHub fetch failed:", error);
      setBuildStatus("GitHub Error");
      setDeployments([]);
    }

    try {
      const latestTag = await getLatestDockerTag(
        import.meta.env.VITE_DOCKER_USERNAME,
        dockerRepository
      );
      setDockerImage(latestTag);
    } catch (error) {
      console.error("Docker fetch failed:", error);
      setDockerImage("Unavailable");
    }

    setLastUpdated(new Date().toLocaleString());
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <StatusCard title="Build Status" status={buildStatus} />
      </div>

      <div style={{ padding: "20px" }}>
        <h3>Deployment History</h3>
        {deployments.length === 0 ? (
          <p>No workflow runs found yet.</p>
        ) : (
          <ul>
            {deployments.map((deployment) => (
              <li key={deployment.id}>
                {deployment.status} -{" "}
                {new Date(deployment.time).toLocaleString()}
              </li>
            ))}
          </ul>
        )}

        <h3>Docker Image</h3>
        <p>Latest Tag: {dockerImage}</p>
        <p>Last updated: {lastUpdated || "Loading..."}</p>
      </div>
    </div>
  );
}
