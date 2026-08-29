# Blank Room

A deliberately minimal browser-based 3D room for experimenting with **enterable graphics**.

The governing rule is simple:

> **If a maker might reasonably want to change it, it should not require editing JavaScript.**

Blank Room separates the engine from the things a maker changes.

## The four layers

1. **Engine** — JavaScript capabilities: render a room, create primitive objects, apply materials, load textures, move the camera, handle collision.
2. **Architecture** — `room.json`: room size, player position, movement, camera and renderer settings.
3. **Skin** — `skin.json`: base colours, optional texture overlays, texture opacity and lighting.
4. **Content** — `content.json`: which objects exist, their type, size, position, rotation and material assignment.

The aim is that radically different rooms can be made by editing JSON and replacing assets in `public/`, without rewriting the engine.

## Current capabilities

- rectangular enterable room
- first-person movement
- mouse look using pointer lock
- simple collision with room boundaries
- configurable camera and movement
- configurable lighting
- reusable `box` and `plane` objects
- base paint colours for walls, floor, ceiling and objects
- optional transparent texture layer over a base colour
- generic content object list rather than hard-coded plinth/panel logic

## Human-facing asset rules

### Image formats

Use:

- **PNG** when transparency matters or when the base colour should show through
- **JPG or WebP** for fully opaque artwork or textures

A useful default size for repeating surface textures is **2048 × 2048 px**.

For standalone artwork, use the artwork's real aspect ratio. The current wall artwork slot is landscape and is intended for an image around **1600 × 1000 px**.

### Base paint + skin

Every configurable material has this form:

```json
{
  "baseColor": "#f4f4f2",
  "texture": null,
  "textureOpacity": 1
}
```

`baseColor` behaves like painting a gallery wall. `texture` is an optional image placed as a second visual layer. Transparent parts of a PNG reveal the painted base below. `textureOpacity` can fade the whole overlay.

Example:

```json
{
  "baseColor": "#c96f42",
  "texture": "textures/walls/painted-wall.png",
  "textureOpacity": 0.7
}
```

## Configuration

Blank Room reads three files from `public/config/`.

### `room.json`

Defines the physical container and viewing behaviour:

- `dimensions.width`
- `dimensions.depth`
- `dimensions.height`
- `player.start`
- `player.speed`
- `player.collisionMargin`
- camera field of view / clipping distances
- renderer quality settings

### `skin.json`

Defines visual treatment. Materials are named so content objects can refer to them.

Current materials:

- `walls`
- `floor`
- `ceiling`
- `plinth`
- `panel`

These names are not special to the engine: more material entries can be added as new objects need them.

Lighting is also configured here as a list of lights.

### `content.json`

Defines objects placed in the room.

Example:

```json
{
  "id": "artwork-01",
  "type": "plane",
  "enabled": true,
  "size": [2.2, 1.4],
  "position": [0, 1.75, -4.98],
  "rotation": [0, 0, 0],
  "material": "panel"
}
```

The engine currently understands two primitive object types:

- `plane` — useful for artwork, murals and flat graphic surfaces
- `box` — useful for plinths, simple tables, blocks and early furniture prototypes

More reusable furniture types can be added to the engine later while keeping each furniture instance configurable.

## First artwork experiment

The existing wall rectangle has the object id `artwork-01` and uses the material `panel`.

To make it display an image, upload an asset such as:

```text
public/images/artwork-01.png
```

Then change the `panel` material in `skin.json` to:

```json
{
  "baseColor": "#ffffff",
  "texture": "images/artwork-01.png",
  "textureOpacity": 1
}
```

No JavaScript change is required.

## Project structure

```text
blank-room/
├── .github/workflows/deploy-pages.yml
├── public/
│   ├── config/
│   │   ├── room.json
│   │   ├── skin.json
│   │   └── content.json
│   ├── images/
│   ├── textures/
│   └── models/
├── src/
│   ├── controls.js
│   ├── main.js
│   ├── room.js
│   └── styles.css
├── index.html
├── package.json
└── README.md
```

Git does not store empty directories, so `images/`, `textures/` and `models/` appear once they contain assets.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL, click **Enter room**, then use the arrow keys or `W/A/S/D` to move, the mouse to look around, and `Esc` to release the mouse.

## Build

```bash
npm run build
npm run preview
```

GitHub Pages is deployed with GitHub Actions.

## Modularity test

For every new feature, ask:

> **Could a non-coder make a meaningfully different room by changing configuration and replacing assets?**

If the answer is no because an artistic choice is buried in JavaScript, that feature needs refactoring.

Some things properly remain in JavaScript: the algorithms for rendering, movement, loading textures and interpreting object types. Those are capabilities, not room-specific artistic choices.

## Concept

Blank Room is not intended to become a general-purpose game engine. It is a small research scaffold for asking what happens when graphic material becomes spatial and enterable.

The blank room itself is a test object: can architecture stay stable while surfaces, objects, images and behaviours change around it?

## Licence

This project is currently an experimental Apple Violet Robot research project. No licence has yet been assigned.
