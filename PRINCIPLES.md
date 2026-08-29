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

The visitor supplies movement. A static room can still produce rich interaction through:

- walking and turning;
- choosing where to look and how long to remain;
- approaching or withdrawing;
- encountering objects at different scales and distances;
- choosing between doors or routes;
- moving between rooms or vignettes;
- entering an image or graphic threshold;
- experiencing accumulation and juxtaposition;
- encountering a room assembled differently before entry.

Animation should therefore be purposeful rather than a default signifier of interactivity.

## 3. Blank Room is not a game engine

Three.js provides the rendering machinery. Blank Room should remain a thin authoring layer over it.

Do not reinvent mature systems unnecessarily. Physics engines, character animation, particle systems, complex game mechanics and similar features are outside the core purpose unless a specific artwork genuinely requires them.

Blank Room should optimise for small, deliberate, enterable environments rather than games.

## 4. Blank Room is a spatial publishing system

A useful conceptual model is closer to publishing, exhibition-making, installation and graphic composition than to conventional gameplay.

A room can hold images, testimony, objects, text, graphic surfaces and spatial relationships. Architecture becomes part of composition.

Blank Room should make it possible to investigate a spatial grammar for enterable graphics: room, wall, floor, ceiling, doorway, door, window, corridor, alcove, frame, table, chair, plinth and other architectural or furnishing elements can function as compositional vocabulary.

## 5. Separate engine, architecture, objects, skin and content

The system should maintain clear conceptual layers.

### Engine

JavaScript provides capabilities: render geometry, load textures, move the visitor, build configured objects, manage transitions and interactions.

The engine should know **how** to do things, not what a particular artwork looks like.

### Architecture

Configuration describes the physical space: dimensions, walls, openings, doors, floors, ceilings, architectural features and their positions.

### Objects

Reusable geometry describes furnishings and display structures such as tables, chairs, armchairs, benches, frames, plinths and shelves.

### Skin

Configuration and assets describe appearance: paint colours, textures, opacity, flooring, upholstery, surface treatments and UI appearance.

### Content

Images, text, testimony, database records and other material populate the space.

A project should be able to change dramatically by changing configuration and assets without rewriting the engine.

## 6. The non-coder test

The governing modularity rule is:

> If a maker might reasonably want to change it while making a room, it should not require editing JavaScript.

A useful test is:

> Could someone who cannot code create a radically different room by changing configuration values and replacing assets?

If not, something is probably still too hard-coded.

Changeable properties include, where practical:

- dimensions;
- positions;
- rotations;
- colours;
- materials;
- textures;
- texture opacity;
- texture repeat and scale;
- texture orientation;
- lighting;
- camera starting view;
- movement and turning speed;
- furniture selection and placement;
- artwork assets;
- entry-screen appearance.

## 7. Use real-world scale

Blank Room uses metres as its spatial unit.

Gallery dimensions, wall lengths, ceiling heights, door widths, furniture dimensions and artwork placement should therefore be expressible directly in real-world measurements.

This allows a room to range from a speculative vignette to a reasonably faithful exhibition mock-up.

Where exact architectural drawings are unavailable, photographs and known reference dimensions can be used to create plausible approximations. Exact surveying is not required for conceptual prototyping.

## 8. Architecture should be explicit and modular

A room should not be treated permanently as one sealed rectangular box.

Walls, floor, ceiling, wall segments, openings and doors should be configurable architectural objects. A doorway is an opening in architecture; a door is a separate object that may occupy that opening.

This distinction permits open thresholds, closed doors, curtains, arches, glass doors, portals and transitions between spaces without changing the basic architecture model.

Future placement controls should favour human-readable relationships where possible — for example, positioning an artwork relative to a named wall — rather than requiring makers to calculate raw XYZ coordinates for every object.

## 9. Surfaces have paint and skin

A material may contain both:

1. a base colour, analogous to painting a gallery wall; and
2. an optional texture or graphic layer over it.

The overlay may be opaque or transparent, allowing the painted base to remain visible through a PNG or other texture.

The same model should apply consistently to walls, floors, ceilings, doors, furniture and display objects.

Layered surfaces must render cleanly without z-fighting.

## 10. Flooring is a material, not merely a colour

Floors should support both flat colour and image-based materials such as:

- wood;
- parquet;
- tile;
- terrazzo;
- lino;
- carpet;
- painted or illustrated surfaces.

Textures should support repeat/scale and rotation so that materials can appear at believable physical dimensions and directional materials such as floorboards can be oriented correctly.

The same repeat/orientation controls may later be useful for walls, fabrics and other surfaces.

## 11. Furniture should be reusable geometry with changeable surfaces

Blank Room should develop a modest library of useful, generic furniture and display forms rather than requiring a bespoke model for every room.

Likely primitives include:

- central table;
- half-depth table against a wall;
- upright chair;
- desk chair;
- armchair;
- bench;
- plinth;
- shelving or display unit.

Furniture should be skinnable. Where useful, an object may expose multiple material regions — for example frame and upholstery — so the same geometry can take on very different identities.

## 12. Assets should have predictable slots

Human-made assets should live in clear, documented locations and use stable conventions.

A maker should be able to create an image, upload it to an asset slot, reference it in configuration and see it in the room.

Swapping an artwork should ideally mean replacing the artwork file or changing a content/material reference, not touching engine code.

PNG is useful where transparency is required; JPG and WebP are appropriate for opaque imagery and textures. WebP is particularly useful for efficient browser delivery.

## 13. Navigation should be calm

The default Blank Room navigation is deliberately not first-person-shooter navigation.

Mouse-look and pointer lock are excluded from the default prototype because unrestricted mouse camera movement can be disorienting and encourages frantic scanning.

The default controls are deliberate:

- forward;
- backward;
- turn left;
- turn right.

The mouse remains available for ordinary pointing/clicking when future interactions require it.

Movement and turn speeds should remain configurable. Other navigation modes may exist later, but calm navigation is the default.

## 14. The threshold is part of the artwork

The Enter Room screen is not merely technical UI sitting outside the work. It is the visitor's first threshold into the environment.

Its background, opacity, card treatment, text and other presentation should therefore be configurable by the room skin.

When full opacity is desired, the room should not ghost through underneath it.

Future projects may treat this threshold very differently, so Blank Room should provide capability without imposing a house style.

## 15. Prototype by changing one thing at a time

Blank Room is being developed experimentally. Small tests reveal requirements more clearly than designing a large abstract specification in advance.

A useful development sequence is:

1. place an artwork;
2. change architectural paint colours;
3. layer transparent textures over paint;
4. apply repeating floor materials;
5. skin furniture;
6. add architectural openings and doors;
7. expand the reusable architectural and furniture vocabulary;
8. introduce transitions, selection and database-driven content only when the static spatial grammar is sound.

Each experiment should teach one new capability where possible.

## 16. Break the prototype before freezing the template

The current `blank-room` repository is a laboratory and may be abused freely.

Bad textures, implausible dimensions, oversized furniture, conflicting layers and failed experiments are useful because they reveal what the eventual specification needs.

The intended lifecycle is:

> prototype / laboratory → discover requirements → clean neutral v1 → mark as GitHub template → create individual artworks from the template

Once a stable v1 exists, individual projects should be created from the template rather than developing directly inside the canonical Blank Room.

## 17. Individual artworks should remain independent

Blank Room should eventually function as a GitHub template repository.

Projects made with it — for example an exhibition installation, an enterable testimony work or another spatial graphic — should live in their own repositories. They may acquire bespoke logic without contaminating the generic Blank Room starting point.

Blank Room is the reusable system; a particular room is an artwork made with it.

## 18. Database logic may assemble a static encounter

Static presentation does not require the room to be identical on every visit.

A database or selection system may determine which testimony, image or object appears before or between encounters. Once presented, however, the resulting environment can remain still.

This permits combinatorial, fragmentary and non-definitive experiences without turning the encounter into a game.

## 19. Restraint is a design principle

A feature should not be added simply because browser 3D makes it possible.

When considering a new interaction, ask:

- Does it deepen encounter or merely advertise interactivity?
- Does it alter access, position, sequence, selection or attention in a meaningful way?
- Does it support the material, or make the material perform?
- Could stillness do the job better?
- Is this genuinely part of Blank Room, or a bespoke requirement of one artwork?

The aim is not maximal technical capability. The aim is a small, legible vocabulary capable of producing rich spatial encounters.

---

## Current shorthand

**The visitor moves. The room holds.**

**Static does not mean non-interactive.**

**If a maker might reasonably want to change it, it should not require editing JavaScript.**

**Blank Room is a spatial publishing system, not a game engine.**
