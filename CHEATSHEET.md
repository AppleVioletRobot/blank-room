# Blank Room — Maker Cheat Sheet

This is the **six-months-later document**: the quickest route from “I want to mock up an exhibition” to an enterable room without having to remember how Blank Room works.

## The mental model

You mostly change three files in `public/config/`:

- `room.json` — **where things are and how big the room is**
- `skin.json` — **what surfaces look like**
- `content.json` — **what objects/artworks are in the room**

Images go in `public/images/`.

You should normally **not edit JavaScript** to dress a room.

All physical dimensions are in **metres**.

---

## 1. Change the paint colours

Open:

`public/config/skin.json`

A plain painted material looks like this:

```json
"walls": {
  "baseColor": "#f6c945",
  "texture": null,
  "textureOpacity": 1
}
```

Change `baseColor` to another hex colour.

Useful idea:

- `walls` = wall paint
- `floor` = floor finish
- `ceiling` = ceiling paint
- `door` = door finish

`texture: null` means **paint only**.

---

## 2. Put an image on a wall artwork/panel

Upload the image to:

`public/images/`

For example:

`public/images/my_artwork.webp`

Then make or change a material in `skin.json`:

```json
"panel": {
  "baseColor": "#ffffff",
  "texture": "images/my_artwork.webp",
  "textureOpacity": 1
}
```

The artwork object in `content.json` refers to that material:

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

`size` is `[width, height]` in metres.

---

## 3. Put a transparent graphic over painted colour

Use a PNG with transparent areas.

```json
"special_wall": {
  "baseColor": "#f6c945",
  "texture": "images/wall_graphic.png",
  "textureOpacity": 1
}
```

The base colour behaves like gallery paint. Transparent areas of the PNG reveal that colour beneath it.

To fade the whole graphic:

```json
"textureOpacity": 0.6
```

---

## 4. Add flooring

Upload a flooring image to `public/images/`, preferably JPG, PNG or WebP.

Example:

`public/images/parquet.webp`

There are **two ways** to tell Blank Room how large the pattern should appear.

### Preferred: physical-size mode

Use this when you know or can estimate how much real floor one copy of the image represents.

```json
"parquet": {
  "baseColor": "#ffffff",
  "texture": "images/parquet.webp",
  "textureOpacity": 1,
  "texturePhysicalSize": [1.2, 0.8],
  "textureRotation": 0
}
```

`texturePhysicalSize` means:

`[real width represented by image, real depth represented by image]`

Both numbers are in **metres**.

So `[1.2, 0.8]` means one copy of the source image represents a patch of floor 1.2 m × 0.8 m.

Blank Room calculates how many copies are needed to cover the floor while keeping the pattern at that physical scale.

### Manual-repeat mode

Use this when the source image has no meaningful physical scale, or when you simply want it to look a particular way.

```json
"parquet": {
  "baseColor": "#ffffff",
  "texture": "images/parquet.webp",
  "textureOpacity": 1,
  "textureRepeat": [7, 17],
  "textureRotation": 0
}
```

`textureRepeat: [7, 17]` means repeat the image 7 times in one direction and 17 times in the other.

**If both `textureRepeat` and `texturePhysicalSize` are present, `textureRepeat` wins.**

---

## 5. Work out physical texture size from a catalogue image

Best case: the catalogue gives you dimensions.

Example: the source image contains four 30 cm tiles across and two 30 cm tiles down.

The image represents:

- width = 4 × 0.30 = **1.2 m**
- depth = 2 × 0.30 = **0.6 m**

So enter:

```json
"texturePhysicalSize": [1.2, 0.6]
```

If there is no scale information, tune the repeat visually once.

If an 8 m × 10 m floor looks right at `[7, 17]`, infer the image's approximate physical coverage:

- 8 ÷ 7 = **1.143 m**
- 10 ÷ 17 = **0.588 m**

So the equivalent physical-size setting is approximately:

```json
"texturePhysicalSize": [1.143, 0.588]
```

You can then reuse that material in differently sized rooms without recalculating repeat counts.

---

## 6. Rotate a texture

`textureRotation` uses radians.

Useful values:

| Desired rotation | Value |
|---|---:|
| 0° | `0` |
| 90° | `1.5708` |
| 180° | `3.1416` |
| 270° | `4.7124` |

Example:

```json
"textureRotation": 1.5708
```

This is particularly useful for wood flooring and other directional patterns.

---

## 7. Change which flooring is active

The floor itself is an architecture object in `room.json` and has a `material` property.

Point that property at the material name you want from `skin.json`.

Conceptually:

```json
{
  "id": "floor",
  "type": "plane",
  "material": "parquet"
}
```

To try another floor, change only:

```json
"material": "floor_tile_03"
```

The geometry stays the same; only its skin changes.

---

## 8. Change room dimensions

Open:

`public/config/room.json`

Room dimensions are expressed in metres:

```json
"dimensions": {
  "width": 8,
  "depth": 10,
  "height": 3.4
}
```

For a real gallery mock-up, use measured or estimated real-world dimensions here.

**Important:** the current architecture is made from explicit wall/floor/ceiling objects. If you change overall dimensions substantially, check that those architecture objects have also been sized and positioned to match. A future Blank Room version should make this more automatic/human-readable.

---

## 9. Position and size objects

For a box:

```json
"size": [width, height, depth]
```

For a plane:

```json
"size": [width, height]
```

Position uses:

```json
"position": [x, y, z]
```

Think of:

- `x` = left/right
- `y` = height from the floor/world origin
- `z` = forward/back

Rotation uses:

```json
"rotation": [x, y, z]
```

in radians.

For now, copy an existing similar object and alter it rather than building coordinates from memory.

---

## 10. Turn an object off without deleting it

```json
"enabled": false
```

Turn it back on with:

```json
"enabled": true
```

Useful for comparing exhibition arrangements.

---

## 11. Change the Enter Room screen

In `skin.json`:

```json
"ui": {
  "entryScreen": {
    "backgroundColor": "#f5f5f5",
    "backgroundOpacity": 1,
    "cardBackgroundColor": "#ffffff",
    "textColor": "#111111",
    "borderColor": "#c9c9c9"
  }
}
```

Use `backgroundOpacity: 1` for a completely opaque threshold with no view of the room underneath.

---

## 12. Navigation

Blank Room's default navigation is deliberately calm:

- `W` or ↑ = forward
- `S` or ↓ = backward
- `A` or ← = turn left
- `D` or → = turn right

The mouse does **not** control the camera.

This is intentional: **the visitor moves; the room holds.**

---

## 13. After changing files on GitHub

GitHub Pages is deployed by GitHub Actions.

Typical sequence:

1. commit/save the change;
2. wait roughly 30 seconds–2 minutes for deployment;
3. refresh the live site;
4. if the old version remains, use a hard refresh (`Ctrl + Shift + R` on Windows).

If it is still unchanged after a few minutes, check the GitHub Actions deployment rather than repeatedly editing the config.

---

## 14. Six-months-later exhibition recipe

If you are opening this repository after forgetting everything, do this:

1. Decide the approximate real dimensions of the exhibition room.
2. Set/check the architecture in `room.json`.
3. Upload artwork and texture files to `public/images/`.
4. Create named materials for paint, flooring and graphics in `skin.json`.
5. Use `texturePhysicalSize` for materials with meaningful real-world scale.
6. Add or duplicate artwork/display objects in `content.json`.
7. Set their sizes and positions in metres.
8. Dress the Enter Room threshold in `skin.json`.
9. Commit, wait for Pages to deploy, walk through it.
10. Adjust by eye. A proposal mock-up needs to communicate the spatial idea; it does not need to be a building survey.

---

## The four rules worth remembering

> **The visitor moves. The room holds.**

> **Static does not mean non-interactive.**

> **If a maker might reasonably want to change it, it should not require editing JavaScript.**

> **Blank Room is a spatial publishing system, not a game engine.**
