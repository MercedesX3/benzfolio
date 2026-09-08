# Raw models

Drop unoptimised `.glb` files here. This folder is gitignored — only the
compressed output in `public/models/` is committed.

## Why this exists

The four models that started the desk arrived at **24.9 MB / 620,000 triangles**
between them. A desk — a box on two legs — was 299,623 triangles and 12.7 MB on
its own. That is normal for AI-generated and marketplace models: they are
exported for offline rendering, where nobody is waiting on a download.

Run through the optimiser they become **0.45 MB / 27,000 triangles** — a 98%
reduction, with no visible difference at the size they appear on screen.

## Optimising a model

    npm run models --in=raw-name.glb --out=clean-name.glb

What that does, and why each part matters:

| flag | effect |
|---|---|
| `--compress draco` | Geometry compression. The decoder is served from `public/draco/` — a local copy, so the site does not depend on a Google CDN staying up. |
| `--texture-compress webp` | Re-encodes textures; typically 3-5× smaller than the PNGs these exports ship with. |
| `--texture-size 1024` | Caps texture resolution. A lamp occupying 200px on screen gains nothing from a 4K map. |
| `--simplify-error 0.002` | Mesh decimation, capped at 0.2% shape deviation. This is the flag doing the heavy lifting. |

## Check the result before committing

Decimation is lossy. Raise `--simplify-error` and shapes start to visibly
deform — thin parts (lamp stems, laptop hinges, chair legs) go first. After
optimising, open the model and compare it against the original. If it looks
wrong, rerun with a smaller error, e.g. `--simplify-error 0.0005`.
