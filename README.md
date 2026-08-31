# 3D Print Price Calculator

React + TypeScript + Vite app for estimating 3D printing prices from STL files.

## Current Scope

Implemented:
- STL upload, including binary and ASCII STL
- 3D preview with Three.js
- Bounding box, mesh volume, estimated weight, estimated print time
- Material, infill, layer height, and quantity controls
- Price calculation and price breakdown
- Quote request form
- Supabase Storage upload and `orders` table insert when env values are configured
- Hash route success page for GitHub Pages
- Admin login with Supabase Auth
- Admin dashboard with status/search filters and revenue summary
- Admin order detail with final price, status, internal note, and signed STL download
- Unit tests and visual smoke test
- GitHub Pages workflow

Not implemented yet:
- Email or LINE notifications
- Real slicer backend

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run test
npm run typecheck
npm run build
```

Optional browser smoke test while the dev server is running:

```bash
npm run visual-check
```

## Supabase Setup

The app analyzes STL files locally in the browser. Files are uploaded only after the customer submits the quote form.

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy `.env.example` to `.env`.
5. Set:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

The `quote-stl` bucket is private. Do not use a public bucket for customer STL files.

Admin access uses Supabase Auth. Create admin users in the Supabase dashboard. The MVP RLS allows any authenticated user to read/update orders, so use a dedicated project or tighten policies before inviting non-admin users.

## GitHub Pages

The workflow is in `.github/workflows/deploy.yml`.

For project pages, the workflow sets:

```text
VITE_BASE_PATH=/${{ github.event.repository.name }}/
```

For GitHub Pages deployment with Supabase, add these GitHub Actions variables or secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Then pass them into the build workflow if you want quote submission to work on the deployed site.

## Known Limitations

- Print time is an approximation, not real slicer output.
- Volume assumes a closed STL mesh and millimeter scale.
- If Storage upload succeeds but Database insert fails, an orphan file can remain in the bucket.
- Public quote insertion is intentionally limited by RLS checks, but stronger spam protection should be added before production.

## Next Recommended Step

Next: add email or LINE notification, stricter admin role policies, and optional real slicer backend.
