import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const owner = searchParams.get("owner")
  const repo = searchParams.get("repo")

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing owner or repo parameter" }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 })
  }

  try {
    // Fetch repo stats
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!repoResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch repo" }, { status: repoResponse.status })
    }

    const repoData = await repoResponse.json()

    // Fetch commits count
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    let commitsCount = 0
    let lastCommitAt = ""

    if (commitsResponse.ok) {
      const commitsData = await commitsResponse.json()
      commitsCount = commitsData.length

      // Get total commits from API
      const statsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/stats/participation`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        commitsCount = stats.total || 0
      }

      if (commitsData.length > 0) {
        lastCommitAt = commitsData[0].commit.committer.date
      }
    }

    return NextResponse.json({
      commits: commitsCount,
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      lastCommitAt,
      filesChanged: repoData.size || 0,
    })
  } catch (error) {
    console.error("Error fetching GitHub metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
