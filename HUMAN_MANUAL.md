# Blank Room — Human Manual

*A maker-first guide for the future moment when you have some images and an idea for a room and cannot remember what any of the JSON means.*

Blank Room is a small enterable web environment for presenting visual work spatially. The important division of labour is simple:

**Your job is to make the images. Blank Room's job is to put them somewhere.**

You do not need to model a gallery in 3D. You do not need print-ready files. You do not need to understand Three.js to prepare artwork. Most projects should begin offline with an image library, then use the configuration files to decide how those images occupy space.

---

## 1. The quick version: I have made some pictures. What now?

1. Prepare the images using the guidance below.
2. Export them, usually as `.webp`.
3. Give a related series a consistent aspect ratio if you want it to hang uniformly.
4. Put project assets into a clearly named subfolder under `public/images/`.
5. Add the filenames to the appropriate section of `public/config/content.json` or point a material in `public/config/skin.json` at the image.
6. Decide the **physical size in metres** inside Blank Room. The source image's pixel dimensions do not determine its gallery dimensions.
7. Refresh the deployed room. If GitHub Pages appears unchanged, try a hard refresh.
8. Walk around it. Check scale, spacing, sightlines, legibility and whether the room feels the way you intended.

---

# PART I — MAKING IMAGES

## 2. The three main kinds of image

Different assets need different preparation. First decide which kind you are making.

### A. Artwork / posters / Polaroids

These are discrete images hung or placed in the room.

Examples:

- Polaroids
- posters
- illustrations
- photographs
- testimony cards
- individual paintings

**Recommended format:** WebP.

**Recommended working size:** roughly 500–1200 px on the long edge for ordinary gallery artwork. This is a practical range, not a hard rule.

**Recommended file weight:** preferably under 500 KB each. Around 100–200 KB per image is excellent for a collection containing dozens of works.

**DPI:** irrelevant for Blank Room. DPI is print metadata. For screen display, care about pixel dimensions, aspect ratio and file size.

**Transparency:** supported. Use transparency when the wall should show around the artwork, for example around an irregular object or a Polaroid with a drop shadow. Do not add a white background unless white is genuinely part of the work.

### Aspect ratio matters more than pixel size

If a series should appear uniform, export every image at the same aspect ratio.

The current Polaroids use a source ratio of:

```text
472 × 536 px
```

That is approximately `0.88 : 1` (portrait).

Blank Room then gives them a physical width such as:

```json
"itemWidth": 0.95
```

This means approximately **95 cm wide in the virtual room**, regardless of whether the source file is 472 px, 944 px or another sensible resolution.

The source image describes the picture. The configuration describes its physical presence.

### When to make artwork larger

Use a larger source image when:

- the work occupies a very large part of a wall;
- visitors can approach it extremely closely;
- small text or fine detail must remain readable;
- it is effectively a mural rather than ordinary wall artwork.

Do not automatically export enormous files "just in case". Forty-five unnecessarily huge images make an unnecessarily huge room download.

---

## 3. Surface skins and repeating textures

These cover a physical surface rather than behaving as a discrete artwork.

Examples:

- floorboards
- tiles
- wallpaper
- fabric
- tablecloth patterns
- repeating painted textures

There are two useful ways to tell Blank Room how a texture behaves.

### Method A: explicit repeat

Use this when visual judgement matters more than exact real-world scale.

```json
"textureRepeat": [4, 6]
```

This means repeat the image four times in one direction and six times in the other.

This is useful for quickly adjusting something until it looks right.

### Method B: real-world physical size

Use this when the image represents something with known dimensions, such as a tile.

```json
"texturePhysicalSize": [0.225, 0.225]
```

This says one repeat represents a **22.5 cm × 22.5 cm** physical object.

Blank Room can then calculate how many repeats are needed to cover the configured surface.

Use metres. `0.225` metres = `22.5` centimetres.

### Preparing a repeating texture

Ideally:

- crop cleanly to one repeat unit or a repeatable catalogue sample;
- avoid unwanted borders;
- keep the image square if the physical unit is square;
- record the real-world dimensions if known;
- check whether the source actually tiles seamlessly.

A sidecar JSON is useful for keeping this information with the image rather than relying on memory.

---

## 4. Large composed images

These are complete images intended to occupy a known large surface without repeating.

Examples:

- murals
- large projected compositions
- a complete illustrated tabletop
- scenic wall imagery
- future Breaking Bread compositions

For these, **aspect ratio is critical** because the complete image is being fitted to a physical rectangle.

If the intended wall area is 4 m wide × 2 m high, make the image at approximately a `2 : 1` aspect ratio.

Pixel dimensions can be substantially larger than ordinary artwork because the image may fill much of the screen. Start sensibly rather than at print resolution: for example 1600–2500 px on the long edge, then test visually.

Again, DPI does not matter.

---

## 5. Image formats

### WebP — default recommendation

Use WebP for most photographic, painted or collage assets.

Advantages:

- small file sizes;
- good image quality;
- supports transparency;
- works well in modern browsers.

### PNG

Use PNG when lossless quality or transparency is important and WebP gives an unacceptable result. PNGs can become much larger, especially with drop shadows, photographic detail and transparency.

### JPEG

Usable for opaque photographic material, but WebP will usually be preferable for this project.

### SVG

Excellent as an editable source format in Inkscape. Do not assume that an SVG needs to be used directly in Blank Room. Exporting a display asset to WebP often gives a simpler, predictable web asset while retaining the SVG as the master.

---

## 6. Transparency

WebP transparency works in Blank Room.

In Inkscape, make sure the exported area/background is genuinely transparent. The page background alpha should be `0` if you do not want a background baked into the export.

For transparent gallery artwork, the Blank Room material must also use:

```json
"transparentBacking": true
```

Otherwise a solid backing plane can show behind the transparent pixels.

This is useful for:

- drop shadows;
- irregular cut-out artwork;
- objects that should visually float against the wall;
- artwork where the wall colour is intentionally part of the presentation.

---

## 7. Naming files

Use predictable lowercase names with underscores and leading zeroes for numbered series.

Good:

```text
polaroid_001.webp
polaroid_002.webp
polaroid_003.webp
```

Also good:

```text
gdr_guest_001.webp
tablecloth_faces_01.webp
mural_layer_01.webp
```

Avoid spaces and mysterious names such as:

```text
finalFINAL2 really final.webp
```

Future-you deserves better.

---

## 8. Folder structure

Keep project image libraries offline while developing them, then import only the assets needed by a Blank Room project.

Within the repository, use project/type subfolders rather than dumping everything into `public/images/`.

Example:

```text
public/
  images/
    polaroids/
      polaroid_001.webp
      polaroid_002.webp
    floors/
      tile_01.webp
      wood_01.webp
    tables/
      tablecloth_01.webp
    breaking-bread/
      guests/
      murals/
      textures/
```

The exact organisation can evolve. The principle is: **a large image library belongs outside the engine; each room imports what it needs.**

---

## 9. Sidecar JSON

A sidecar is a small metadata file stored beside an image. It records facts about the asset that would otherwise be forgotten.

For example:

```text
tile_03.webp
tile_03.json
```

A useful sidecar might contain:

```json
{
  "file": "tile_03.webp",
  "kind": "repeating-texture",
  "pixelSize": [900, 900],
  "physicalSizeMetres": [0.225, 0.225],
  "notes": "One tile = 22.5 cm square"
}
```

For an artwork series:

```json
{
  "kind": "gallery-artwork",
  "aspectRatio": [472, 536],
  "transparent": true,
  "recommendedDisplayWidthMetres": 0.95
}
```

Sidecars are documentation for humans. Blank Room does not currently require every image to have one.

---

# PART II — PUTTING IMAGES IN SPACE

## 10. Units

Blank Room uses **metres** for physical dimensions.

Examples:

```text
1       = 1 metre
0.95    = 95 centimetres
0.225   = 22.5 centimetres
0.02    = 2 centimetres
```

Pixel dimensions describe an image file. Metres describe the room.

Do not try to convert pixels into metres directly.

---

## 11. The three main configuration files

### `public/config/room.json`

The architecture and camera/player space.

Use it for things such as:

- room width, depth and height;
- walls;
- door geometry;
- skirting/baseboards;
- starting camera position;
- movement boundaries.

### `public/config/skin.json`

The visual treatment of surfaces and reusable materials.

Use it for:

- wall colour;
- floor texture;
- ceiling colour;
- door/trim colours;
- artwork materials;
- furniture materials;
- ambient/directional light;
- recessed lighting fixtures.

### `public/config/content.json`

What is placed inside the room.

Use it for:

- artwork collections;
- interpretation panels;
- furniture instances;
- individual configured objects.

A useful mental model:

```text
room.json    = What space exists?
skin.json    = What does it look like?
content.json = What is in it?
```

---

## 12. Hanging a uniform artwork series

The current Polaroid gallery is a useful model.

Important settings include:

```json
{
  "rows": 2,
  "itemWidth": 0.95,
  "aspectRatio": [472, 536],
  "columnGap": 0.32,
  "rowGap": 0.28,
  "verticalCentre": 1.7,
  "itemCount": 44,
  "completeColumns": true,
  "randomiseOrder": true,
  "randomiseSelection": true
}
```

### `rows`

How many horizontal rows of artwork.

### `itemWidth`

Physical width of each artwork in metres.

### `aspectRatio`

The source image ratio. Blank Room uses this with `itemWidth` to calculate display height.

### `columnGap`

Horizontal breathing room between works, in metres.

### `rowGap`

Vertical breathing room between rows, in metres.

### `verticalCentre`

The approximate vertical centre of the whole hanging arrangement.

### `itemCount`

Maximum number of images to display.

### `completeColumns`

Useful with multiple rows. Prevents an orphan image from appearing alone in an incomplete final column.

### `randomiseOrder`

Changes the order each time the room is built.

### `randomiseSelection`

If there are more source images than display slots, randomly chooses which images appear.

The hanging code centres the selected columns on each wall so surplus space is shared between both ends rather than accumulating at one end.

---

## 13. Artwork backing

A gallery material can use:

```json
"transparentBacking": true
```

Use `true` when transparent parts of the image should reveal the wall.

Use a solid backing when the artwork should behave as a rectangular mounted object regardless of image transparency.

---

## 14. Interpretation panels

Interpretation panels are generated inside Blank Room from configured text rather than supplied as image files.

They have configurable:

- physical size;
- position;
- heading/body text;
- border;
- padding;
- type sizes;
- background and text colours.

Reserve wall space for them. Do not allow the artwork grid to create a lonely orphan artwork beside a panel unless that is intentional.

---

# PART III — FURNITURE

## 15. Tables

Blank Room currently has two table types:

```text
dining-table
wall-table
```

A dining table is freestanding with four legs. A wall table is half-depth and intended to meet a wall, with two visible/front legs.

Each table instance can independently configure:

- width;
- depth;
- height;
- tabletop thickness;
- leg size;
- leg inset;
- position;
- rotation;
- tabletop material;
- leg material.

Example:

```json
{
  "id": "wall-table-long",
  "type": "wall-table",
  "width": 3.6,
  "depth": 0.6,
  "height": 0.76,
  "topMaterial": "table_top",
  "legMaterial": "table_legs"
}
```

Multiple tables can use the same component with completely different dimensions.

---

## 16. Skinning furniture

Furniture materials live in `skin.json`.

A plain tabletop:

```json
"table_top": {
  "baseColor": "#7f5f43",
  "texture": null
}
```

A skinned tabletop:

```json
"table_top": {
  "baseColor": "#7f5f43",
  "texture": "images/tables/tablecloth_01.webp",
  "textureOpacity": 1,
  "textureRepeat": [1, 1],
  "textureRotation": 0
}
```

Tabletops and legs can use different materials.

Furniture textures currently support:

- base colour;
- image texture;
- texture opacity;
- repeat;
- rotation;
- transparency.

A tabletop image can therefore be a repeating fabric pattern or a single complete composition.

---

# PART IV — LIGHTING

## 17. Recessed ceiling lights

Blank Room has a reusable `recessedGrid` lighting component.

The current gallery uses two rows of five lights.

Configurable properties include:

- rows;
- columns;
- width/depth span;
- ceiling height;
- fixture radius;
- trim width and colour;
- lamp colour;
- emitted light colour;
- intensity;
- range;
- beam angle;
- penumbra;
- decay;
- target height.

The visible fixture and the actual light are both generated by the component.

Use lighting to make the room spatially legible first. Individual theatrical artwork spotlighting can be added only when a project needs it.

---

# PART V — POSITIONING AND TROUBLESHOOTING

## 18. Position coordinates

Objects use three coordinates:

```json
"position": [x, y, z]
```

Think of them as:

```text
x = left / right
y = up / down
z = forward / back
```

All are measured in metres.

You do not need to calculate every placement perfectly before testing. Put something approximately where it belongs, enter the room, inspect it, and adjust.

---

## 19. Rotation

Rotation is currently expressed in radians.

Useful values:

```text
0                 = 0°
1.5707963268      = 90°
3.1415926536      = 180°
4.7123889804      = 270°
```

A rotation is written:

```json
"rotation": [x, y, z]
```

For ordinary furniture placement, rotation around `y` is usually the one you care about.

---

## 20. What is `normalOffset`?

For wall-mounted artwork, `normalOffset` moves the image a tiny distance away from the wall surface.

Example:

```json
"normalOffset": 0.02
```

means 2 cm away from the wall plane.

This helps prevent rendering artefacts caused by two surfaces occupying effectively the same position.

It is not intended as a dramatic physical gap.

---

## 21. Refresh lag

GitHub Pages deployment and browser caching mean a committed change may not appear instantly.

If a change should have deployed but the room still looks unchanged:

1. wait briefly for GitHub Pages/Actions;
2. reload;
3. if necessary, do a **hard refresh** to bypass the browser cache.

Do not immediately assume the configuration is broken because the old room is still visible.

---

## 22. If the room will not start

If the entry screen says Blank Room could not start or the Enter Room button never becomes available, common causes include:

- malformed JSON (missing comma, quote or bracket);
- a filename/path that does not exist;
- a renamed or moved asset;
- an unsupported component type;
- a JavaScript error introduced during development.

When editing JSON manually, make one small change at a time and commit it. That makes the last working state easy to identify.

---

# PART VI — A SENSIBLE MAKER WORKFLOW

## 23. Start offline

For a new project:

1. Make the artwork first.
2. Keep the master artwork library offline/in your normal project storage.
3. Decide what subset the room actually needs.
4. Export web-display versions.
5. Put those exports into a project folder under `public/images/`.
6. Configure the room using those assets.

Blank Room should not become the master archive for every image you have ever made.

---

## 24. Test one thing before doing fifty things

Before exporting an entire collection:

- test one WebP;
- confirm transparency;
- confirm aspect ratio;
- confirm it looks sharp enough at intended physical size;
- check file weight;
- then batch-export the rest consistently.

This is especially important when changing export settings.

---

## 25. Keep variables separate when experimenting

If you are trying to understand what a design decision does, change one variable at a time.

For example:

1. keep artwork and hanging fixed;
2. change wall colour;
3. inspect;
4. keep the chosen colour;
5. change lighting;
6. inspect.

This makes Blank Room useful as a formal testing environment rather than merely a decorating tool.

---

## 26. Current Blank Room vocabulary

As of this manual's first version, Blank Room supports:

- configurable rectangular room architecture;
- doors and trim;
- baseboards/skirting;
- configurable wall, floor and ceiling materials;
- repeating textures;
- real-world texture scaling;
- transparent artwork;
- uniform multi-row artwork grids;
- randomised artwork order/selection;
- balanced/centred wall hanging;
- interpretation panels;
- freestanding dinner tables;
- half-depth wall tables;
- independently skinnable tabletops and legs;
- ambient/directional lighting;
- modular recessed ceiling-light grids;
- button/keyboard navigation without mouse-look.

Future components should extend this vocabulary rather than hard-code one project's special case whenever possible.

---

# PART VII — CHEAT SHEET

## 27. Image preparation cheat sheet

| Asset | Preferred format | Typical pixels | Transparency | Key requirement |
|---|---|---:|---|---|
| Ordinary wall artwork | WebP | 500–1200 px long edge | Optional | Consistent aspect ratio for uniform series |
| Polaroid/cut-out artwork | WebP | 500–1200 px long edge | Often yes | `transparentBacking: true` |
| Repeating tile/fabric | WebP | Enough to retain texture detail | Usually no | Record repeat or real-world unit size |
| Large mural/composition | WebP | ~1600–2500+ px long edge, test as needed | Optional | Match intended surface aspect ratio |
| Editable master artwork | SVG/source format | As appropriate | As appropriate | Keep outside Blank Room as the master |

These are recommendations, not engine limits. Test the actual work.

## 28. Numbers cheat sheet

```text
1 m    = 1
50 cm  = 0.5
25 cm  = 0.25
10 cm  = 0.1
2 cm   = 0.02
```

```text
90°  = 1.5707963268 radians
180° = 3.1415926536 radians
270° = 4.7123889804 radians
```

## 29. Which file do I edit?

```text
Change room dimensions/door/architecture  → room.json
Change colours/textures/materials          → skin.json
Change artwork/furniture/panels            → content.json
Change source images                       → public/images/...
```

## 30. Before blaming the code

Check:

```text
Is the filename exact?
Is the path exact?
Is the JSON valid?
Has GitHub Pages deployed?
Have I hard-refreshed?
Did I test one image before exporting forty-five?
```

Then blame the code.

---

# Final principle

Blank Room is not intended to make the images for you or decide what the exhibition means. It provides a configurable spatial field in which existing visual material can be encountered differently.

**Make the work. Give it dimensions. Put it in space. Walk around it. See what changes.**
