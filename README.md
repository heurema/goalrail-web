# goalrail-web

The site at [goalrail.dev](https://goalrail.dev). A static React build served by
nginx, deployed to the single-node k3s cluster through Flux.

## Working on it

```sh
npm install
npm run dev
```

```sh
npm run lint          # oxlint
npm run check:claims  # what this page says about the product, against the product
npm run build         # verify:wallets, the llms.txt generator, tsc -b, vite build
```

The build writes `public/llms.txt` and `public/llms-full.txt` from the pages in
`public/docs`, so a documentation change updates the agent-facing index without
a second step. It also refuses to run if a sponsorship address fails its own
checksum.

`check:claims` is the one that exists because of what this repository is. It
describes a product it does not contain, so its failure mode is drift rather
than a broken build: the install prompt is compared with the product's README,
and the `gr doctor` capture with the newest published release, so a release is
what forces a re-capture rather than someone noticing. It needs the network and
fails loudly without it — a check that passes when it did not run is the promise
it was meant to replace.

## Shape

| Path | What it is |
|---|---|
| `src/content.ts` | every string the landing page shows |
| `src/theme/` | the Dracula/Alucard theme and the typefaces |
| `public/docs/*.md` | the documentation source, served raw and rendered by `src/Docs.tsx` |
| `scripts/` | the checks that run before a build: the claims check and the wallet verifier |
| `nginx.conf` | how the routes are served, including the client-route fallback |
| `Dockerfile` | the deployed artifact: nginx with `dist/` inside it |

Components come from [Astryx](https://github.com/facebook/astryx). Its API is
not guessable — run `npx astryx component <Name>` before using one, and
`npx astryx docs tokens` before reaching for a colour.

## Deploying

There is no deploy command. Merging to `main` is the deploy:

1. CI lints, checks the claims against the product, type-checks, builds the
   image, serves it, and asserts what has broken before — the client-route
   fallback, the raw markdown an agent fetches, its content type, a missing
   document answering 404 rather than 200 with the page shell, and the head
   tags a shared link needs, which the page keeps rendering without.
2. Only if that passes, the image is published to
   `ghcr.io/heurema/goalrail-web` tagged `dev-<sha>-<timestamp>`.
3. Flux scans the registry, writes the new tag into the cluster repository, and
   rolls the deployment. A few minutes end to end.

Nothing is built at pod start, and the running pod keeps serving until the new
one is ready, so a bad image cannot take the site down.

Rollback and the cluster-side configuration are documented next to the app in
the infrastructure repository.
