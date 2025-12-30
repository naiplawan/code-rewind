# CodeRewind

Your 2025 Developer Year in Review - A Spotify Wrapped-style experience for your GitHub and GitLab contributions.

![CodeRewind](https://img.shields.io/badge/CodeRewind-2025-ff6b9d?style=for-the-badge)

## Features

- **Multi-Platform Support**: Connect both GitHub and GitLab accounts
- **Commit Statistics**: Total commits, PRs, issues, and reviews
- **Language Breakdown**: See your top programming languages
- **Top Repositories**: Discover which repos you contributed to most
- **Streak Tracking**: Find your longest contribution streak
- **Developer Personality**: Get a fun personality type based on your coding patterns
- **Shareable Cards**: Download and share your stats on social media
- **City Pop Aesthetic**: Beautiful retro-inspired design with Futura-style typography

## Tech Stack

- **Framework**: SvelteKit 5 with Svelte 5 runes
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Authentication**: OAuth 2.0 (GitHub & GitLab)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/code-rewind.git
cd code-rewind
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure OAuth applications:

   **GitHub OAuth App:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Set callback URL to `http://localhost:5173/auth/github/callback`
   - Copy Client ID and Client Secret to `.env`

   **GitLab OAuth App:**
   - Go to [GitLab Applications](https://gitlab.com/-/user_settings/applications)
   - Create a new application
   - Set callback URL to `http://localhost:5173/auth/gitlab/callback`
   - Required scopes: `read_user`, `read_api`, `read_repository`
   - Copy Application ID and Secret to `.env`

5. Start the development server:
```bash
pnpm dev
```

6. Open [http://localhost:5173](http://localhost:5173)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_APP_URL` | Your application URL (e.g., `http://localhost:5173`) |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `GITLAB_CLIENT_ID` | GitLab OAuth Application ID |
| `GITLAB_CLIENT_SECRET` | GitLab OAuth Application Secret |

## Security Features

- CSRF protection with state tokens
- HTTP-only secure cookies
- Content Security Policy headers
- XSS protection headers
- Input validation on OAuth callbacks

## Building for Production

```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## Deployment

This app is configured for Vercel deployment. Simply connect your repository to Vercel and configure the environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Made with ❤️ using SvelteKit
