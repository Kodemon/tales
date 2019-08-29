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
