<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Demo data lives in the browser: `src/lib/store.ts` (localStorage for shared data, sessionStorage for the signed-in user per tab). Why: a no-server prototype where several tabs act as different roles and update live.
- Components read data only through `useDb`/hooks and change it only through `src/services/*`. Why: swapping in a real backend later means rewriting services, not pages.
- Sample data stays in `src/data/mock-data.ts`; bump `DB_VERSION` when its shape changes. Why: keeps mock data separate and forces old browser copies to reseed.
- Order status rules live in `src/lib/order-workflow.ts` and are covered by `src/test/order-workflow.test.ts`. Why: one source of truth for who can move an order where.
- Brand name and currency come from `src/lib/config.ts`. Why: one place to rebrand for a client.
