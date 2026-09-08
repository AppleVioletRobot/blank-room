# Blank Room

A deliberately minimal browser-based 3D room for experimenting with **enterable graphics**.

> **If a maker might reasonably want to change it, it should not require editing JavaScript.**

Blank Room separates engine, architecture, skin and content so radically different rooms can be created by editing configuration and replacing assets.

Blank Room uses **metres** as its world unit.

## Current structure

- **Engine** — `src/`: rendering, movement, texture loading and configuration interpretation.
- **Architecture** — `public/config/room.json`: room dimensions, camera/player settings, explicit architectural objects and optional traversal planes.
- **Skin** — `public/config/skin.json`: colours, materials, textures, texture scale/rotation, lighting and entry-screen appearance.
- **Content** — `public/config/content.json`: artwork, signs, galleries, interpretation panels and other placed material.
- **Presets** — `public/config/presets/`: tested configurations that can be reused without making them the default room.

## Navigation

The default navigation is intentionally calm:

- `↑` / `W` — move forward in the direction the visitor is facing
- `↓` / `S` — move backward
- `←` / `A` — turn left
- `→` / `D` — turn right

The mouse does not control the camera by default.

### What traversal testing taught us

Navigation is not merely a control scheme. It is part of the composition.

- **Forward must be camera-relative.** Pressing forward should mean “go where I am looking”, not movement along a fixed world axis.
- **Collision should shepherd rather than snag.** Axis-separated collision lets a visitor slide along a plane until an aperture is found instead of sticking to its face.
- **A route can be legible without a map.** Alternating apertures can produce a gentle, discoverable path through otherwise simple geometry.
- **The starting view matters.** A visitor can begin facing a familiar landmark such as the exit, then be explicitly asked to turn away and explore. Orientation becomes part of the entrance sequence.
- **Persistent landmarks matter.** A door, EXIT sign, distinctive floor direction, ceiling and contrasting plane edges help the visitor maintain orientation.
- **Surface design can do navigational work.** Colour, material, directional texture and edge contrast are not merely decoration; they can make depth, openings and routes readable.
- **Spatial density is not the same as information quantity.** Proximity, occlusion and compartmentalisation can make a small amount of material feel dense and can assign salience without adding more content.
- **Compactness can be productive.** A slightly constrained route can feel deliberately shepherded, provided the visitor can still understand where movement is possible.

The default remains keyboard-only because unrestricted mouse-look can be disorienting. Mouse navigation can be added for a particular audience or artwork without changing the architectural grammar.

## Traversal planes

A room may contain configurable planes that divide the space while leaving apertures for movement. A plane can specify:

```json
{
  "id": "plane-01",
  "z": 2.5,
  "aperturePosition": "left",
  "apertureWidth": 2.2,
  "apertureHeight": 2.55,
  "thickness": 0.24,
  "faceMaterial": "plane_face",
  "edgeMaterial": "plane_edge"
}
```

Current aperture positions are `left`, `right` and `middle`. Plane faces and edges can use different materials so thickness and openings remain visually legible.

The tested three-plane traversal configuration is stored as a preset rather than replacing the default worked example.

## Galleries and artwork placement

Artwork can be placed on ordinary room walls and on traversal planes. Traversal-plane galleries can use both faces; wall galleries can distribute material around the enclosing architecture.

A key lesson from the traversal prototype is:

> **Content placement has to understand architecture, not merely available surface area.**

Where a traversal plane meets a side wall, wall-gallery placement must treat that intersection as a cut rather than allowing an image to straddle the plane. Artwork should be centred inside the resulting safe wall segments.

For fragmentary or non-sequential material, image order may be randomised once when the room loads. The resulting arrangement should then remain stable during that visit: **one entry, one constellation**.

## Interpretation panels and signs

Content may include small wayfinding signs and larger interpretation panels. Interpretation panels support configurable dimensions, position, background and text styling so explanatory material can belong to the exhibition rather than the browser interface.

Threshold text should be treated as part of the artwork. A quiet museum-style instruction on or near a door can orient the visitor without turning the room into a game tutorial.

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

### 2. Manual-repeat mode — fallback/override

Use this when the image has no meaningful real-world scale or when an artistic treatment is more important than physical accuracy:

```json
{
  "texture": "images/floor_tile_03.webp",
  "textureRepeat": [6, 8]
}
```

If both `textureRepeat` and `texturePhysicalSize` are present, **manual `textureRepeat` wins**.

Directional textures can be rotated with `textureRotation` in radians.

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

## Asset formats

- **PNG** — best when transparency matters or artwork needs an irregular silhouette.
- **JPG/WebP** — good for opaque artwork and surface textures.
- **WebP** is especially useful for browser delivery because it is compact.

Keep source artwork separately at working resolution. Browser assets should be exported for the size at which they will actually be encountered rather than uploaded at unnecessarily enormous print resolution.

## Architecture

Architecture is explicit in `room.json`: walls, wall segments, floor, ceiling, doors and traversal planes are configurable rather than being a permanently sealed box.

A doorway is an opening in architecture; a door is a separate object that can occupy that opening.

## Artwork authoring: current state

There is now enough tested geometry to write an artwork-production specification for the three-plane traversal room. The stable facts include room scale, plane dimensions, aperture dimensions and positions, eye level, gallery scale, front/back encounter, transparent-image support, and the way architecture occludes and segments artwork.

The specification should distinguish:

- **architectural skins** — graphics or textures intended to cover a plane, wall, floor, ceiling or door;
- **hung/placed artwork** — discrete images such as the Polaroids;
- **transparent artwork** — PNG/WebP assets whose silhouette or empty areas matter;
- **interpretation/wayfinding** — text panels and signs;
- **state variants** — future inbound/return versions of the same surface.

The inbound/return state system is **not yet implemented**, so state-specific artwork can be designed conceptually but should not yet be treated as a supported engine feature.

## Project structure

```text
blank-room/
├── PRINCIPLES.md
├── README.md
├── public/
│   ├── config/
│   │   ├── room.json
│   │   ├── skin.json
│   │   ├── content.json
│   │   └── presets/
│   └── images/
└── src/
```

## Modularity test

For every new feature, ask:

> **Could a non-coder make a meaningfully different room by changing configuration and replacing assets?**

If not because an artistic choice is buried in JavaScript, that feature probably needs refactoring.

## Development workflow

Blank Room is the stable reusable engine. Individual artwork repositories are the play-labs.

A useful lifecycle is:

> **prototype in an artwork → discover the requirement through navigation/play → make the capability generic → promote it to Blank Room**

Do not promote a mechanic merely because it sounds useful. Let an actual room demonstrate why it is needed and what its configuration needs to expose.

## Concept

Blank Room is not intended to become a general-purpose game engine. It is a small spatial publishing and research scaffold for asking what happens when graphic material becomes enterable.

See [`PRINCIPLES.md`](PRINCIPLES.md) for the evolving design principles.
