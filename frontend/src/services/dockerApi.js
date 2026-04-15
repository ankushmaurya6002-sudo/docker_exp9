import axios from "axios";

const api = axios.create({
  baseURL: "https://hub.docker.com/v2",
});

const normalizeRepositoryName = (value) => {
  if (!value) {
    return "";
  }

  if (!value.includes("github.com")) {
    return value.replace(/\.git$/, "").trim().toLowerCase();
  }

  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    return (parts[1] || "").replace(/\.git$/, "").trim().toLowerCase();
  } catch {
    return value.replace(/\.git$/, "").trim().toLowerCase();
  }
};

export const getLatestDockerTag = async (username, repository) => {
  if (!username) {
    return "Unavailable";
  }

  const repoName = normalizeRepositoryName(repository);

  if (repoName) {
    try {
      const tagRes = await api.get(
        `/repositories/${username}/${repoName}/tags?page_size=1&ordering=last_updated`
      );

      return tagRes.data.results?.[0]?.name || "No Tag Yet";
    } catch (error) {
      if (error.response?.status === 404) {
        return "No Tag Yet";
      }
      throw error;
    }
  }

  const repoRes = await api.get(
    `/repositories/${username}/?page_size=1&ordering=last_updated`
  );
  const latestRepo = repoRes.data.results?.[0];

  if (!latestRepo?.name) {
    return "No Repository";
  }

  const tagRes = await api.get(
    `/repositories/${username}/${latestRepo.name}/tags?page_size=1&ordering=last_updated`
  );

  return tagRes.data.results?.[0]?.name || "No Tag Yet";
};
