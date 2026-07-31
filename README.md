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
npm run sync:product  # rewrite the generated reference from the pinned release
npm run build         # verify:wallets, the llms.txt generator, tsc -b, vite build
```

The build writes `public/llms.txt` and `public/llms-full.txt` from the pages in
`public/docs`, so a documentation change updates the agent-facing index without
a second step. It also refuses to run if a sponsorship address fails its own
checksum.

## Keeping up with the product

This repository describes a product it does not contain, so its failure mode is
drift rather than a broken build. Three things hold against it.

**One release is described at a time.** `product/pin.json` names it. Bumping the
tag and running `npm run sync:product` is what pulls this site forward: the
script downloads that release, verifies it against its published checksums, asks
the binary what it accepts, and rewrites the `<!-- generated -->` blocks in
`public/docs/commands.md` from the answer. Prose around those blocks is written
by hand and never touched — the reference is derived, the explanation is not.
The diff of a pin bump is the product's changelog as far as this site is
concerned, and therefore the list of prose worth re-reading.

**Nothing new arrives unmentioned.** Every command the binary accepts must have
a section on the commands page or an entry in `product/pin.json` saying why not.
A command added to the product cannot pass through here unnoticed; leaving one
out stays allowed, leaving one out silently does not.

**A clock, not a pull request.** `check:claims` compares the install prompt with
the product's README and the pin with the newest published release, and
`.github/workflows/drift.yml` runs both daily, because drift here is caused by
the product moving rather than by anything happening in this repository. A
failure opens an issue. Both need the network and fail loudly without it — a
check that passes when it did not run is the promise it was meant to replace.

## Shape

| Path | What it is |
|---|---|
| `src/content.ts` | every string the landing page shows |
| `src/theme/` | the Dracula/Alucard theme and the typefaces |
| `public/docs/*.md` | the documentation source, served raw and rendered by `src/Docs.tsx` |
| `product/` | which release this site describes, and the surface generated from it |
| `scripts/` | the checks and the generator: claims, wallets, and the product reference |
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
