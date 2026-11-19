import { profile } from '@/content/profile';

export type Repo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  topics: string[];
};

type GhRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
};

/** Public repos, newest first. Revalidated every 6 hours so new GitHub work appears automatically. */
export async function getRepos(): Promise<{ repos: Repo[]; total: number }> {
  try {
    const headers: HeadersInit = { Accept: 'application/vnd.github+json', 'User-Agent': 'qasim-portfolio' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed&type=owner`, {
      headers,
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { repos: [], total: 0 };
    const data = (await res.json()) as GhRepo[];
    const repos = data
      .filter((r) => !r.fork && !r.archived && r.name !== profile.githubUser)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
        topics: r.topics ?? [],
      }));
    return { repos, total: repos.length };
  } catch {
    return { repos: [], total: 0 };
  }
}
