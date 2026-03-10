# RetailTwin Analytics

Retail Media Operating System — a full-stack analytics platform for a portfolio of 27 South African shopping malls with digital twin visualization, digital marketing asset management (300 assets), audience analytics, portfolio-wide reporting in ZAR, multi-tenant RBAC, and a programmatic media marketplace.

## Architecture

- **Frontend**: React 19 + Vite, TailwindCSS v4, shadcn/ui, Recharts, Three.js (@react-three/fiber + @react-three/drei), Leaflet (vanilla, not react-leaflet due to React 19 hook conflict), wouter for routing, TanStack Query for data fetching
- **Backend**: Express 5, Drizzle ORM, PostgreSQL
- **Shared**: Drizzle schema in `shared/schema.ts` used by both frontend types and backend storage

## Database Schema

- `tenants` — Multi-tenant organizations (media_owner, advertiser, mall_operator)
- `users` — Users with RBAC roles (admin, internal, sales, advertiser, mall_partner)
- `malls` — 27 South African shopping malls with geo coordinates
- `assets` — 300 digital advertising assets (billboards, screens, lightboxes, etc.) with 3D positions
- `campaigns` — Advertiser campaigns with budget, dates, audience targeting
- `analytics_data` — Time-series portfolio analytics (impressions, footfall)

## Key Files

- `shared/schema.ts` — Drizzle database schema + Zod validation schemas
- `server/db.ts` — PostgreSQL connection pool + Drizzle instance
- `server/storage.ts` — DatabaseStorage class implementing IStorage interface
- `server/routes.ts` — Express API routes (all prefixed with `/api`)
- `server/seed.ts` — Database seeding script (run with `npx tsx server/seed.ts`)
- `client/src/lib/api.ts` — TanStack Query hooks for all API endpoints
- `client/src/lib/auth.tsx` — AuthProvider with role-switcher backed by `/api/users`
- `client/src/lib/queryClient.ts` — TanStack Query client configuration

## API Endpoints

- `GET /api/tenants` — All tenants
- `GET /api/users` — All users (passwords excluded)
- `GET /api/malls` — All 27 malls
- `GET /api/assets?mallId=&tenantId=&type=` — Assets with optional filters
- `POST /api/assets` — Create a single asset
- `POST /api/assets/bulk` — Bulk import assets (body: `{ assets: [...] }`, returns `{ created, errors }`)
- `GET /api/campaigns?tenantId=` — Campaigns, optionally filtered by tenant
- `POST /api/campaigns` — Create a new campaign
- `GET /api/analytics?days=` — Time-series analytics data
- `GET /api/portfolio/stats` — Aggregate portfolio stats (totalMalls, totalAssets, totalImpressions, totalFootfall)

## Frontend Pages

- `/` — Dashboard (Portfolio/Campaign/Mall views based on role)
- `/explorer` — 3D Mall Explorer with digital twin, heatmap overlay, asset analytics panel
- `/analytics` — Portfolio Analytics (admin/internal only) with AI Insights
- `/assets` — Asset Inventory with search/filter, Add Asset form, CSV bulk import
- `/campaigns` — My Campaigns / All Campaigns list (role-dependent view)
- `/marketplace` — Programmatic Media Marketplace with dynamic pricing
- `/campaign` — Campaign Builder with AI optimizer and 2-step booking flow

## RBAC Roles

1. **admin** — Full access, portfolio-wide
2. **internal** — Analytics + asset management
3. **sales** — Asset management + campaign simulator
4. **advertiser** — Campaign dashboard + marketplace + campaign builder
5. **mall_partner** — Restricted to their assigned mall(s) only

## Design System

- Dark mode, Inter + JetBrains Mono fonts
- Primary blue: `217 91% 60%`, Accent teal: `180 100% 40%`
- Currency: ZAR (R prefix)

## Important Notes

- **AuthProvider** must wrap Layout inside Router, not wrapping Router itself
- Vanilla Leaflet used (NOT react-leaflet) due to React 19 hook compatibility issues
- 3D heatmap: floor at Y=-0.01, heatmap planes at Y=0.01 with `depthWrite={false}` to avoid z-fighting
- Dynamic pricing in Marketplace: Billboard R25k, Screen R12k, others R5k; ±20% modifier based on engagement/impressions
- Database seeding is idempotent (checks if data exists before inserting)
