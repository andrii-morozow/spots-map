# Spots Map

Next.js App Router application using React, TypeScript, Tailwind CSS, and shadcn/ui.

## Development

Use Node.js 24.x and pnpm 12.9.1, as declared in `package.json`.
Commit `pnpm-lock.yaml` when dependencies change.

```sh
pnpm install --frozen-lockfile
```

Complete the environment setup below before starting the app:

```sh
pnpm dev
```

Open [localhost:3000](http://localhost:3000). Routes live in `src/app`, shared
components in `src/components`, and custom CSS in `src/styles`. The `@/` alias
points to `src/` and is shared by TypeScript, Next.js, and Vitest.

## Environment setup

Set these variables in the Vercel project's **Development** environment:

| Variable                            | Value                                    |
| ----------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk development publishable key        |
| `CLERK_SECRET_KEY`                  | Clerk development secret key             |
| `ADMIN_USER_ID`                     | Clerk user ID allowed to access `/admin` |

Get keys from Clerk's **API keys** page and the user ID from **Users**.
Sign in and link the Vercel project once:

```sh
pnpm exec vercel login
pnpm exec vercel link
pnpm dev
```

`pnpm dev` loads the linked project's Development variables. Without Vercel
access, put the variables in `.env.local` and run `pnpm exec next dev`.
`.env.local` is ignored by Git; never commit secret keys. Restart after changes.
Use Clerk production keys in Vercel's Production environment.

## Checks

| Command                | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `pnpm lint`            | Check JavaScript and TypeScript                                    |
| `pnpm lint:styles`     | Check CSS, including Tailwind directives                           |
| `pnpm lint:styles:fix` | Fix supported CSS lint issues                                      |
| `pnpm type-check`      | Generate Next.js route types and check TypeScript, including tests |
| `pnpm test`            | Run Vitest in watch mode                                           |
| `pnpm test:run`        | Run tests once, suitable for CI                                    |

Vitest uses jsdom, React Testing Library, and jest-dom assertions. Tests are
`*.test.ts(x)` or `*.spec.ts(x)` files under `src`, `components`, or `lib`.
`vitest.setup.ts` registers matchers and cleans up rendered components after each
test. Import test functions from `vitest`; test globals are not enabled.

This setup covers utilities and synchronous React components. Async Server
Components need browser/end-to-end tests instead.

## Production preview

```sh
pnpm build
pnpm start
```

`pnpm build` creates the production build in `.next/`. `pnpm start` runs the
Next.js production server on port 3000. Deploy to a host that supports a Next.js
runtime server, such as Vercel.
