# Bulma on Vercel Checklist

This project can be deployed to Vercel in server database mode with Groq, Supabase, and the Alexandria bridge.

## Required environment variables

```bash
DATABASE_URL=postgres://...
APP_URL=https://your-project.vercel.app
AUTH_SECRET=...
JWKS_KEY={"keys":[...]}
KEY_VAULTS_SECRET=...

GROQ_API_KEY=gsk_...
GROQ_MODEL_LIST=-all,+llama-3.1-8b-instant,+llama-3.3-70b-versatile
ENABLED_OPENAI=0
DEFAULT_AGENT_CONFIG=provider=groq;model=llama-3.1-8b-instant

ALEXANDRIA_MCP_URL=https://cgpkfhrqprqptvehatad.supabase.co/functions/v1/alexandria-mcp
ALEXANDRIA_MCP_TOKEN=...
```

## Temporary Vercel URL flow

1. Deploy first to `https://<project>.vercel.app`.
2. Add that exact URL to Supabase auth redirects and site URL where applicable.
3. Validate login, persistence, Groq visibility, Bulma default inbox behavior, and Alexandria lookup.

## Final domain cutover

1. Add `bulma.grupototum.com` to the Vercel project.
2. Update `APP_URL=https://bulma.grupototum.com`.
3. Add `https://bulma.grupototum.com` to Supabase redirects and allowed origins.
4. Redeploy after DNS is pointing to Vercel.

## Expected product behavior

- Inbox agent appears as Bulma with temporary emoji avatar.
- Groq is the default provider through `DEFAULT_AGENT_CONFIG`.
- OpenAI stays hidden when `ENABLED_OPENAI=0`.
- Alexandria tool auto-enables for Bulma when both Alexandria env vars are present.
