# Blank Room — Artwork Authoring Kit

This folder is for making artwork **into the architecture**, rather than treating the room as a neutral screen.

The templates are based on the tested three-plane traversal room developed through the Two Unicorns prototype.

## Start here

For each traversal plane choose the matching SVG template:

- `plane-left.svg` — aperture on the left
- `plane-right.svg` — aperture on the right
- `plane-middle.svg` — centred aperture

Open the SVG directly in Inkscape, Krita or another application that preserves its 8:3.4 aspect ratio. Draw on a new layer and keep the guide layer intact until export.

## Physical dimensions

Each complete plane is:

- **8.00 m wide**
- **3.40 m high**
- **0.24 m thick**

Each aperture is:

- **2.20 m wide**
- **2.55 m high**
- floor-to-opening: **0 m**
- remaining header above aperture: **0.85 m**

The visitor eye/camera height in the tested room is **1.65 m**.

The templates use **100 px = 1 m**, so the SVG artboard is 800 × 340 units. This is a convenient drawing scale, not a required final raster resolution.

## Aperture positions

The tested geometry uses a 0.55 m outer margin when an aperture sits at the left or right.

### LEFT

- aperture begins at x = **0.55 m**
- aperture ends at x = **2.75 m**

### RIGHT

- aperture begins at x = **5.25 m**
- aperture ends at x = **7.45 m**

### MIDDLE

- aperture begins at x = **2.90 m**
- aperture ends at x = **5.10 m**

## What the guides mean

Each SVG shows:

- solid outer rectangle — full architectural plane
- grey aperture — space that does not exist as a face surface
- dashed horizontal line — 1.65 m visitor eye line
- dashed inset outline — **advisory text-safe area**, 0.30 m from the plane perimeter and 0.30 m from the aperture
- dimensions and labels on a separate guide layer

The text-safe area is intentionally conservative. Illustration may cross it freely. It exists to stop important words, faces or tiny details accidentally landing against an edge or aperture.

## Designing for an enterable surface

Do not compose the plane as though it were a poster that will be viewed straight-on.

The visitor may:

- first see it obliquely;
- see only part of it around another plane;
- approach it until details become very large;
- see another image or wall through its aperture;
- pass through the composition;
- encounter both physical faces during one traversal;
- turn back and see the same material from a different direction.

That means **occlusion and partial legibility are normal conditions**, not defects.

Large graphic structures, repeated motifs, fragments and relationships that survive cropping are likely to work better than layouts that depend on one perfect frontal view.

## The aperture is part of the composition

Do not merely avoid the hole. Use it.

The aperture can:

- interrupt an image;
- frame material beyond it;
- create a missing element;
- separate two fragments that become related through movement;
- allow another plane to complete or contradict a composition;
- make the visitor physically pass through a graphic structure.

Remember that what is visible through the aperture changes as the visitor moves.

## Front and back

Both faces of a traversal plane are fully encounterable. Do **not** assume that front/back means before/after, clinician/patient, correct/incorrect or any other epistemic opposition.

If the artwork requires a meaningful change in understanding, the intended future grammar is **state/time**, not physical face.

For now, front and back can be designed as two spatially related surfaces. They may match, differ, answer each other, or be independent.

## Future inbound / return states

Blank Room does not yet implement state switching, but artwork can be prepared for it.

Recommended naming:

```text
plane-01_front_inbound.webp
plane-01_back_inbound.webp
plane-01_front_return.webp
plane-01_back_return.webp
```

Use the same dimensions and registration for inbound and return versions so a future state change can replace one with the other without geometry moving.

Do not make a design depend on this capability until the engine implementation has been tested.

## Raster export guidance

There is no single mandatory pixel size because the same physical surface may contain flat colour, photographic material, line art or text.

For a full 8 m × 3.4 m plane, a practical starting export is:

- **2400 × 1020 px** for ordinary graphic work
- **3200 × 1360 px** when line work or readable text needs more detail

Keep the aspect ratio exactly **40:17**.

These are browser-display assets, not print files. Keep your high-resolution source separately and export a web copy.

### File format

- **WebP** — preferred for opaque full-surface artwork and photographs.
- **PNG** — preferred where transparency is structurally important.
- **JPG** — acceptable for opaque photographic imagery where file size matters.

Use sRGB for browser exports.

## Transparency

Transparent artwork can be useful when the painted plane itself should remain visible or when the graphic needs an irregular silhouette.

Do not use transparency simply to recreate the aperture. The aperture belongs to the architecture and is already absent from the physical plane.

## Text

Text must survive oblique viewing and movement. Avoid putting essential text:

- immediately beside the aperture;
- close to the outer plane edges;
- across a region likely to be hidden by another plane from the main approach;
- at a scale that only works in a full-screen flat image.

For substantial explanation, use an interpretation panel rather than forcing the plane artwork to behave like a wall of prose.

## Eye line

The 1.65 m guide is not a compulsory horizon. It marks the visitor's tested camera height.

Use it to judge where faces, focal details, text and interruptions will sit relative to the visitor. Material above and below eye level is useful precisely because the visitor can approach and look through the architecture, but critical details should not all depend on one narrow band.

## Edges and thickness

The plane is 24 cm thick. Its edge is visible while approaching and passing through an aperture. In the tested room, face and edge materials are separate.

A future artwork may deliberately skin or colour the edge differently. Do not assume the plane is infinitely thin.

## Naming convention

For a simple three-plane artwork:

```text
plane-01_front.webp
plane-01_back.webp
plane-02_front.webp
plane-02_back.webp
plane-03_front.webp
plane-03_back.webp
```

Keep editable source files in a separate `source/` folder if they are added to an artwork repository.

## Before export — quick check

1. Is the correct LEFT / RIGHT / MIDDLE template being used?
2. Is the artwork still exactly 40:17?
3. Is anything essential inside the aperture?
4. Does important text/details have breathing room from aperture and outer edges?
5. Will the composition tolerate partial and oblique views?
6. Have you considered what may be visible *through* the aperture?
7. Have you considered the opposite face and the return view?
8. Is transparency intentional?
9. Is the web export reasonably sized while the editable master is preserved?
10. Does this need to be plane artwork at all, or would it work better as a discrete image, interpretation panel, wall skin, floor, ceiling or sound?

## Development rule

These templates describe geometry that has actually been navigated. If future play reveals that an authoring guide is wrong or incomplete, change the guide. The artwork kit should record what making and movement teach us, not freeze assumptions too early.
