import axios from "axios";

const token = (import.meta.env.VITE_GITHUB_TOKEN || "").trim();
const owner = (import.meta.env.VITE_REPO_OWNER || "").trim();
const repoInput = (import.meta.env.VITE_REPO_NAME || "").trim();

const normalizeRepoName = (value) => {
  if (!value) {
    return "";
  }

  if (!value.includes("github.com")) {
    return value.replace(/\.git$/, "").trim();
  }

  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    return (parts[1] || "").replace(/\.git$/, "").trim();
  } catch {
    return value.replace(/\.git$/, "").trim();
  }
};

const repo = normalizeRepoName(repoInput);

const api = axios.create({
  baseURL: `https://api.github.com/repos/${owner}/${repo}`,
  headers: {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export const getWorkflowRuns = async () => {
  if (!owner || !repo) {
    throw new Error("Missing GitHub repository configuration.");
  }

  const res = await api.get("/actions/runs");
  return res.data.workflow_runs || [];
};

export const getLogs = (runId) => {
  return `${api.defaults.baseURL}/actions/runs/${runId}/logs`;
};
