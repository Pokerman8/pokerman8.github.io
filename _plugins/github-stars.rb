require "json"
require "net/http"

module Jekyll
  # {{ "owner/repo" | github_stars }} returns the repository's star count, fetched
  # from the GitHub API at build time, or "" when it can't be fetched.
  # assets/js/github-stars.js refreshes the number in the browser.
  module GitHubStarsFilter
    STARS = {}

    def github_stars(repo)
      repo = repo.to_s.strip
      return "" if repo.empty?

      STARS[repo] ||= fetch_github_stars(repo)
    end

    private

    def fetch_github_stars(repo)
      uri = URI("https://api.github.com/repos/#{repo}")
      request = Net::HTTP::Get.new(uri, "Accept" => "application/vnd.github+json", "User-Agent" => "jekyll-github-stars")
      token = ENV["GITHUB_TOKEN"]
      request["Authorization"] = "Bearer #{token}" unless token.to_s.empty?

      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 5, read_timeout: 5) do |http|
        http.request(request)
      end
      return "" unless response.is_a?(Net::HTTPSuccess)

      JSON.parse(response.body).fetch("stargazers_count", "").to_s
    rescue StandardError => e
      Jekyll.logger.warn "GitHub stars:", "could not fetch #{repo} (#{e.message})"
      ""
    end
  end
end

Liquid::Template.register_filter(Jekyll::GitHubStarsFilter)
