// Refreshes the GitHub star counts that _plugins/github-stars.rb renders at build time.
// If the API is unreachable, the build-time number stays.
document.querySelectorAll("[data-github-stars]").forEach((badge) => {
  fetch(`https://api.github.com/repos/${badge.dataset.githubStars}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((repo) => {
      if (!repo || !Number.isFinite(repo.stargazers_count)) return;
      badge.querySelector(".pub-stars-count").textContent = repo.stargazers_count.toLocaleString("en");
      badge.hidden = false;
    })
    .catch(() => {});
});
