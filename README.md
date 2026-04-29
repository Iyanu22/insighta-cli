# Insighta CLI

Command-line interface for the Insighta Labs+ platform.

## Installation
```bash
npm install -g .
```

## CLI Usage

### Auth
```bash
insighta login        # Login with GitHub
insighta logout       # Logout
insighta whoami       # Show current user
```

### Profiles
```bash
insighta profiles list
insighta profiles list --gender male
insighta profiles list --country NG --age-group adult
insighta profiles list --min-age 25 --max-age 40
insighta profiles list --sort-by age --order desc
insighta profiles list --page 2 --limit 20
insighta profiles get <id>
insighta profiles search "young males from nigeria"
insighta profiles create --name "John Doe"
insighta profiles export --format csv
insighta profiles export --format csv --gender male --country NG
```

## Token Handling
- Tokens stored at `~/.insighta/credentials.json`
- Access token auto-refreshed when expired
- Re-login prompted if refresh token expired