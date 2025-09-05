Keep adding spaces here ->       
## GitHub App Integration

This app supports linking a GitHub App so users can grant access to specific repositories (instead of broad OAuth repo scope). The integration adds a Link GitHub entry under the `/portal` dashboard and a `/portal/integrations/github` page to install the app and browse accessible repos and commits.

### Configure environment

Add the following env vars (server-side values are required only on the server):

- `NEXT_PUBLIC_GH_APP_SLUG`: Your GitHub App slug (public, used to build the install URL)
- `NEXT_PUBLIC_PORTAL_ENABLED`: Toggles `/portal` between full portal (auth + screens) and a Coming Soon page. Set to `true` to enable the portal; any other value shows Coming Soon without auth.
- `NEXT_PUBLIC_REGISTRATIONS_OPEN`: Controls visibility of the homepage "Register" CTA only. Set to `true` to show the CTA; any other value shows "Registrations opening soon".
- `GITHUB_APP_ID`: Your GitHub App ID (server only)
- `GITHUB_APP_PRIVATE_KEY`: The GitHub App private key in PEM format. You can paste with literal `\n` which will be converted to newlines.

Example:

```
NEXT_PUBLIC_GH_APP_SLUG=my-c2c-app
NEXT_PUBLIC_PORTAL_ENABLED=false
NEXT_PUBLIC_REGISTRATIONS_OPEN=false
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n 
```

### GitHub App settings

In your GitHub App settings:

- Permissions: set at least Repository contents (Read-only) and Metadata (Read-only).
- Webhooks: not required for basic browsing.
- Setup URL: set to `https://<your-domain>/portal/integrations/github` (or `http://localhost:3000/portal/integrations/github` for local).

The app will also attempt to pass `redirect_url` in the install link to return to the same page after installation.

### Usage

- Go to `/portal` and click Link GitHub, or open `/portal/integrations/github` directly.
- Click Link GitHub to install the app and grant access to specific repos.
- After installation, you will be redirected back with `installation_id`. The page shows the repositories accessible to the installation and a lightweight commits viewer.

### How it works (Server Actions)

- Server actions in `app/actions/github` perform all GitHub calls on the server using the GitHub App JWT and installation tokens.
- The portal page imports these actions and calls them from the client; tokens never reach the browser.
- The selected installation (and optional repo) persists to the backend via `POST /api/v1/github/installation` in the `c2cbackend` service.
