export function normalizeGitHubRepoUrl(githubRepo: string) {
  const trimmed = githubRepo.trim().replace(/\/$/, "")

  try {
    const url = new URL(trimmed)
    if (url.hostname !== "github.com") {
      return null
    }

    const [owner, repo] = url.pathname.split("/").filter(Boolean)
    if (!owner || !repo) {
      return null
    }

    return `https://github.com/${owner}/${repo}`
  } catch {
    return null
  }
}
