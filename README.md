# Blank Room

A deliberately minimal browser-based 3D room for experimenting with **enterable graphics**.

The project separates three concerns:

- **Geometry** — the room and the objects that physically exist in it.
- **Skin** — colours, materials, textures and lighting.
- **Content / behaviour** — images, labels and interactions placed in the room.

The aim is to make one reusable spatial container that can be reskinned and repopulated without rewriting the room engine. A future artwork such as a projected mural, testimony space, exhibition or interactive comic should be able to use the same underlying room.

## v0.1

The first version is intentionally plain:

- rectangular room
- first-person movement
- mouse look using pointer lock
- simple collision with the room boundaries
- one configurable plinth
- one configurable wall panel
- neutral lighting
- room, skin and content settings stored separately as JSON

No artwork is baked into the engine.

## Run locally

You need a recent version of Node.js.

```bash
npm install
npm run dev
```

Vite will print a local URL. Open it in a browser, click **Enter room**, then use:

- `W A S D` or arrow keys to move
- mouse to look around
- `Esc` to release the mouse

## Build

```bash
npm run build
npm run preview
```

## Configuration

The room reads three files from `public/config/`:

```text
public/config/room.json
public/config/skin.json
public/config/content.json
```

### `room.json`

Defines the physical container: dimensions, player start position and fixed architectural settings.

### `skin.json`

Defines visual treatment: background, wall/floor/ceiling colours, lighting and object colours. This is where later room skins can introduce textures.

### `content.json`

Defines things placed into the room, currently a plinth and a wall panel. Later this layer can hold images, testimony fragments, projections, doors, audio or other interactions.

## Project structure

```text
blank-room/
├── .github/workflows/deploy-pages.yml
├── public/
│   └── config/
│       ├── room.json
│       ├── skin.json
│       └── content.json
├── src/
│   ├── controls.js
│   ├── main.js
│   ├── room.js
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Concept

Blank Room is not intended to become a general-purpose game engine. It is a small research scaffold for asking what happens when graphic material becomes spatial and enterable.

The useful constraint is: **can a new experience be made by changing configuration and assets rather than changing the underlying room code?**

That makes the blank room itself a test object. Once the neutral room works, the next experiment is to skin it while keeping its architecture intact.

## Licence

This project is currently an experimental Apple Violet Robot research project. No licence has yet been assigned.
