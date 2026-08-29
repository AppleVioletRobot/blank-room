# Blank Room

A deliberately minimal browser-based 3D room for experimenting with **enterable graphics**.

> **If a maker might reasonably want to change it, it should not require editing JavaScript.**

Blank Room separates engine, architecture, skin and content so radically different rooms can be created by editing configuration and replacing assets.

## Current structure

- **Engine** — `src/`: rendering, movement, texture loading and configuration interpretation.
- **Architecture** — `public/config/room.json`: room dimensions, camera/player settings and explicit architectural objects such as walls, floor, ceiling and doors.
- **Skin** — `public/config/skin.json`: colours, materials, textures, texture scale/rotation, lighting and entry-screen appearance.
- **Content** — `public/config/content.json`: artwork and other placed objects.

Blank Room uses **metres** as its world unit.

## Navigation

The default navigation is intentionally calm:

- `↑` / `W` — move forward
- `↓` / `S` — move backward
- `←` / `A` — turn left
- `→` / `D` — turn right

The mouse does not control the camera.

## Materials

A material can have a base colour and an optional texture layer:

```json
{
  "baseColor": "#f6c945",
  "texture": "images/example.webp",
  "textureOpacity": 1
}
```

Transparent textures can reveal the base colour underneath.

## Texture scaling

Blank Room supports two texture-scaling modes.

### 1. Physical-size mode — preferred

Use this when you know, or can reasonably estimate, how much real-world surface one copy of the image represents.

```json
{
  "texture": "images/floor_tile_02.webp",
  "texturePhysicalSize": [1.142857, 0.588235]
}
```

The two numbers are **metres represented by one copy of the image**: `[width, height]`.

Blank Room calculates the repeat automatically from the size of the plane:

```text
repeat X = surface width in metres / texture width in metres
repeat Y = surface height in metres / texture height in metres
```

For the current 8 m × 10 m floor, a texture representing roughly 1.142857 m × 0.588235 m produces approximately:

```text
8 / 1.142857  ≈ 7 repeats
10 / 0.588235 ≈ 17 repeats
```

If the room later changes size, the flooring keeps the same apparent physical scale automatically.

### 2. Manual-repeat mode — fallback/override

Use this when the image has no meaningful real-world scale or when an artistic treatment is more important than physical accuracy:

```json
{
  "texture": "images/floor_tile_03.webp",
  "textureRepeat": [6, 8]
}
```

If both `textureRepeat` and `texturePhysicalSize` are present, **manual `textureRepeat` wins**.

### Rotation

Directional textures can be rotated:

```json
{
  "textureRotation": 1.5708
}
```

Rotation is in radians. `1.5708` is approximately 90°.

## How to calibrate a new flooring image

There are three useful cases:

1. **The catalogue gives dimensions.** Use the real dimensions represented by the image as `texturePhysicalSize`.
2. **The image contains a known number of tiles/planks.** Multiply the product dimensions by the number visible in the image.
3. **There is no reliable scale.** Adjust by eye once, note the repeat that looks right, then either keep `textureRepeat` or convert that observation into a physical-size estimate.

To convert an observed repeat into physical size:

```text
texture physical width  = surface width / observed repeat X
texture physical height = surface height / observed repeat Y
```

This is how the current `floor_tile_02.webp` was calibrated from an observed 7 × 17 repeat on an 8 m × 10 m floor.

## Asset formats

- **PNG** — best when transparency matters.
- **JPG/WebP** — good for opaque artwork and surface textures.
- WebP is especially useful for browser delivery because it is compact.

## Architecture

Architecture is explicit in `room.json`: walls, wall segments, floor, ceiling and door are configurable objects rather than a permanently sealed box.

A doorway is an opening in architecture; a door is a separate object that can occupy that opening.

## Project structure

```text
blank-room/
├── PRINCIPLES.md
├── public/
│   ├── config/
│   │   ├── room.json
│   │   ├── skin.json
│   │   └── content.json
│   └── images/
├── src/
│   ├── controls.js
│   ├── main.js
│   ├── room.js
│   └── styles.css
├── index.html
└── README.md
```

## Modularity test

For every new feature, ask:

> **Could a non-coder make a meaningfully different room by changing configuration and replacing assets?**

If not because an artistic choice is buried in JavaScript, that feature probably needs refactoring.

## Concept

Blank Room is not intended to become a general-purpose game engine. It is a small spatial publishing and research scaffold for asking what happens when graphic material becomes enterable.

See [`PRINCIPLES.md`](PRINCIPLES.md) for the evolving design principles.
