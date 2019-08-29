import * as Octokit from "@octokit/rest";

export async function createRepo(auth: string) {
  const git = new Octokit({
    auth
  });

  await git.repos.createForAuthenticatedUser({
    name: "tails-sample-site-2",
    description: "A Tales Managed Static Site",
    homepage: "https://tales.netlify.com",
    private: true
  });
}

export async function listRepos(auth: string): Promise<any> {
  const git = new Octokit({
    auth
  });

  const repos = await git.repos.list({ visibility: "private", affiliation: "owner", per_page: 100 });
  return repos.data.filter((f: any) => f.name.startsWith("tails-"));
}
