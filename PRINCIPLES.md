# Blank Room — Principles

Blank Room is a lightweight, browser-native system for making enterable graphic environments. It is not intended to become a general-purpose game engine. It is a spatial publishing and prototyping system: a reusable room that can be measured, dressed, skinned, populated, entered, and adapted without requiring the maker to edit the engine.

This document records the principles emerging through prototyping. They are provisional by design: Blank Room is currently a laboratory, and useful breakage should refine the specification.

## 1. The visitor moves. The room holds.

Blank Room is primarily concerned with encounter, not manipulation.

Static is a feature, not a limitation. The visitor may move through a space, change position, choose a route, cross a threshold, approach an object, or leave. Objects do not need to animate or perform in response.

The central interaction is not:

> What can I make this thing do?

but:

> What happens when I spend time in relation to this thing?

This is especially important when the material is testimony. Testimony should not become loot, a reward for clicking, or something required to perform for the visitor.

Interaction should primarily alter **access, position, sequence, selection, proximity, juxtaposition, scale, occlusion, duration, or attention**.

## 2. Static does not mean non-interactive

The visitor supplies movement. A static room can still produce rich interaction through walking, turning, proximity, scale, route, thresholds, juxtaposition, accumulation and duration.

Animation should be purposeful rather than a default signifier of interactivity.

## 3. Blank Room is not a game engine

Three.js provides the rendering machinery. Blank Room should remain a thin authoring layer over it.

Do not reinvent mature systems unnecessarily. Physics engines, character animation, particle systems, complex game mechanics and similar features are outside the core purpose unless a specific artwork genuinely requires them.

Blank Room should optimise for small, deliberate, enterable environments rather than games.

## 4. Blank Room is a spatial publishing system

A useful conceptual model is closer to publishing, exhibition-making, installation and graphic composition than to conventional gameplay.

A room can hold images, testimony, objects, text, graphic surfaces and spatial relationships. Architecture becomes part of composition.

Blank Room should make it possible to investigate a spatial grammar for enterable graphics: room, wall, floor, ceiling, doorway, door, window, corridor, alcove, frame, table, chair, plinth and other architectural or furnishing elements can function as compositional vocabulary.

## 5. Separate engine, architecture, objects, skin and content

### Engine
JavaScript provides capabilities: rendering, texture loading, movement and interpreting configuration.

### Architecture
Configuration describes the physical space: dimensions, walls, openings, doors, floors, ceilings and architectural features.

### Objects
Reusable geometry describes furnishings and display structures.

### Skin
Configuration and assets describe appearance: colours, textures, opacity, flooring, upholstery, surface treatments and UI appearance.

### Content
Images, text, testimony, database records and other material populate the space.

A project should be able to change dramatically by changing configuration and assets without rewriting the engine.

## 6. The non-coder test

> If a maker might reasonably want to change it while making a room, it should not require editing JavaScript.

A useful test is:

> Could someone who cannot code create a radically different room by changing configuration values and replacing assets?

If not, something is probably still too hard-coded.

## 7. Use real-world scale

Blank Room uses metres as its spatial unit.

Gallery dimensions, wall lengths, ceiling heights, door widths, furniture dimensions and artwork placement should therefore be expressible directly in real-world measurements.

Where exact architectural drawings are unavailable, photographs and known reference dimensions can be used to create plausible approximations.

## 8. Architecture should be explicit and modular

A room should not be treated permanently as one sealed rectangular box.

Walls, floor, ceiling, wall segments, openings and doors should be configurable architectural objects. A doorway is an opening in architecture; a door is a separate object that may occupy that opening.

Future placement controls should favour human-readable relationships where possible rather than requiring raw XYZ calculations for every object.

## 9. Surfaces have paint and skin

A material may contain both a base colour and an optional texture or graphic layer over it.

The overlay may be opaque or transparent, allowing the painted base to remain visible through a PNG or other texture.

The same model should apply consistently to walls, floors, ceilings, doors, furniture and display objects.

Layered surfaces must render cleanly without z-fighting.

## 10. Surface textures should understand physical scale

Texture repetition should not be treated only as an arbitrary visual number.

When the real-world size represented by a texture image is known or can be estimated, the material should declare that size in metres. Blank Room can then calculate how many repeats are required from the actual size of the surface.

For a plane:

```text
repeat X = surface width / texture physical width
repeat Y = surface height / texture physical height
```

This means a flooring texture keeps the same apparent physical scale when the room dimensions change.

Manual repeat remains necessary for unscaled source images, deliberately non-realistic treatments and rapid visual calibration. If both physical size and manual repeat are supplied, the manual repeat should override automatic scaling.

Observed repeats can themselves be used to estimate physical texture coverage:

```text
texture physical width = surface width / observed repeat X
texture physical height = surface height / observed repeat Y
```

Texture rotation should remain configurable for directional materials such as wood.

## 11. Flooring is a material, not merely a colour

Floors should support flat colour and image-based materials such as wood, parquet, tile, terrazzo, lino, carpet and painted or illustrated surfaces.

The same physical-scale, repeat and orientation controls may later be useful for walls, fabrics and other surfaces.

## 12. Furniture should be reusable geometry with changeable surfaces

Blank Room should develop a modest library of useful, generic furniture and display forms rather than requiring a bespoke model for every room.

Likely primitives include central table, half-depth wall table, upright chair, desk chair, armchair, bench, plinth and shelving/display units.

Furniture should be skinnable. Where useful, an object may expose multiple material regions such as frame and upholstery.

## 13. Assets should have predictable slots

Human-made assets should live in clear, documented locations and use stable conventions.

A maker should be able to create an image, upload it to an asset slot, reference it in configuration and see it in the room.

PNG is useful where transparency is required; JPG and WebP are appropriate for opaque imagery and textures.

## 14. Navigation should be calm

The default Blank Room navigation is deliberately not first-person-shooter navigation.

Mouse-look and pointer lock are excluded from the default prototype because unrestricted mouse camera movement can be disorienting and encourages frantic scanning.

The default controls are forward, backward, turn left and turn right. The mouse remains available for ordinary pointing/clicking when future interactions require it.

## 15. The threshold is part of the artwork

The Enter Room screen is the visitor's first threshold into the environment. Its background, opacity, card treatment, text and other presentation should therefore be configurable by the room skin.

When full opacity is desired, the room should not ghost through underneath it.

## 16. Prototype by changing one thing at a time

Blank Room is being developed experimentally. Small tests reveal requirements more clearly than designing a large abstract specification in advance.

Each experiment should teach one new capability where possible.

## 17. Break the prototype before freezing the template

The current `blank-room` repository is a laboratory and may be abused freely.

The intended lifecycle is:

> prototype / laboratory → discover requirements → clean neutral v1 → mark as GitHub template → create individual artworks from the template

## 18. Individual artworks should remain independent

Blank Room should eventually function as a GitHub template repository.

Projects made with it should live in their own repositories and may acquire bespoke logic without contaminating the generic Blank Room starting point.

Blank Room is the reusable system; a particular room is an artwork made with it.

## 19. Database logic may assemble a static encounter

Static presentation does not require the room to be identical on every visit.

A database or selection system may determine which testimony, image or object appears before or between encounters. Once presented, however, the resulting environment can remain still.

## 20. Restraint is a design principle

A feature should not be added simply because browser 3D makes it possible.

When considering a new interaction, ask whether it deepens encounter, alters access/position/sequence/selection/attention meaningfully, supports the material rather than making it perform, and genuinely belongs in Blank Room rather than one bespoke artwork.

The aim is not maximal technical capability. The aim is a small, legible vocabulary capable of producing rich spatial encounters.

---

## Current shorthand

**The visitor moves. The room holds.**

**Static does not mean non-interactive.**

**If a maker might reasonably want to change it, it should not require editing JavaScript.**

**Blank Room is a spatial publishing system, not a game engine.**
