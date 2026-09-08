# Blank Room — Principles

Blank Room is a lightweight, browser-native system for making enterable graphic environments. It is not intended to become a general-purpose game engine. It is a spatial publishing and prototyping system: a reusable room that can be measured, dressed, skinned, populated, entered, and adapted without requiring the maker to edit the engine.

This document records the principles emerging through prototyping. They are provisional by design: useful breakage should refine the specification.

## 1. The visitor moves. The room holds.

Blank Room is primarily concerned with encounter, not manipulation.

Static is a feature, not a limitation. The visitor may move through a space, change position, choose a route, cross a threshold, approach an object, or leave. Objects do not need to animate or perform in response.

The central interaction is not “what can I make this thing do?” but “what happens when I spend time in relation to this thing?”

This is especially important when the material is testimony. Testimony should not become loot, a reward for clicking, or something required to perform for the visitor.

Interaction should primarily alter **access, position, sequence, selection, proximity, juxtaposition, scale, occlusion, duration, or attention**.

## 2. Static does not mean non-interactive

The visitor supplies movement. A static room can still produce rich interaction through walking, turning, proximity, scale, route, thresholds, juxtaposition, accumulation and duration.

Animation should be purposeful rather than a default signifier of interactivity.

## 3. Blank Room is not a game engine

Three.js provides the rendering machinery. Blank Room should remain a thin authoring layer over it. Do not reinvent mature systems unnecessarily.

Blank Room should optimise for small, deliberate, enterable environments rather than games.

## 4. Blank Room is a spatial publishing system

A useful conceptual model is closer to publishing, exhibition-making, installation and graphic composition than to conventional gameplay.

A room can hold images, testimony, objects, text, graphic surfaces and spatial relationships. Architecture becomes part of composition.

## 5. Separate engine, architecture, objects, skin and content

**Engine:** capabilities such as rendering, texture loading, movement and configuration interpretation.

**Architecture:** dimensions, walls, openings, doors, floors, ceilings and traversal structures.

**Objects:** reusable geometry such as furnishings and display structures.

**Skin:** colours, textures, opacity, flooring, surface treatments and UI appearance.

**Content:** images, text, testimony, database records and other material.

A project should be able to change dramatically by changing configuration and assets without rewriting the engine.

## 6. The non-coder test

> If a maker might reasonably want to change it while making a room, it should not require editing JavaScript.

If someone who cannot code cannot create a radically different room by changing configuration values and replacing assets, something is probably still too hard-coded.

## 7. Use real-world scale

Blank Room uses metres as its spatial unit. Gallery dimensions, wall lengths, ceiling heights, door widths, furniture dimensions and artwork placement should therefore be expressible directly in real-world measurements.

## 8. Architecture should be explicit and modular

A room should not be treated permanently as one sealed rectangular box. Walls, floor, ceiling, wall segments, openings, doors and traversal planes should be configurable architectural objects.

A doorway is an opening in architecture; a door is a separate object that may occupy that opening.

## 9. Architecture is also an editorial system

Architecture does not merely contain content. It can determine what is visible, when it becomes visible, what overlaps, what is occluded, what must be approached, and what can only be understood retrospectively.

A plane, aperture or wall therefore has compositional and epistemic consequences as well as geometric ones.

## 10. Content placement must understand architecture

Available surface area is not sufficient information for placing artwork.

Where structures intersect, artwork placement should respect those intersections. An image should not accidentally straddle a traversal plane simply because a wall is mathematically long enough to contain it.

Placement systems should reason in safe segments, openings and architectural relationships.

## 11. Navigation is part of composition

Movement controls are not neutral plumbing. They determine how architecture and content can be encountered.

Forward should be relative to the visitor's view. Turning should behave predictably. Collision should support exploration rather than produce sticky dead ends.

Axis-separated collision is useful because it allows a visitor who meets a plane to slide along it toward an opening.

## 12. Orientation can be designed

A visitor does not need a minimap if the environment provides enough legible cues.

Persistent landmarks, doors, signs, directional flooring, ceiling visibility, contrasting edges, colour and light can all support orientation.

The initial camera position and direction are part of this design. Beginning by facing the exit and asking the visitor to turn away can make departure a remembered destination rather than an abstract boundary.

## 13. Surface design can perform navigational work

Colour, texture, material direction and edge contrast are not merely decorative skin. They can clarify depth, thickness, openings and direction.

A directional wood floor, for example, can quietly reinforce the long axis of a room. Contrasting plane edges can make apertures readable without adding arrows or UI.

## 14. Spatial density is not information quantity

A room can feel dense without containing more information.

Proximity, occlusion, narrow sightlines, layering and compartmentalisation can increase the felt weight of sparse material. Architecture can therefore assign salience procedurally.

This should be used deliberately rather than mistaken for a need to add more content.

## 15. Compact routes can shepherd without railroading

A constrained route can be productive when openings remain discoverable and orientation remains legible.

Alternating apertures can gently require lateral movement and changing viewpoints. The visitor is shepherded by architecture rather than commanded by interface instructions.

## 16. Front and back are spatial properties, not epistemic positions

In an enterable plane, both faces may be encountered during the same traversal. Front/back therefore should not automatically stand for opposing viewpoints such as clinician/patient, correct/incorrect or before/after.

If an artwork needs a meaningful epistemic change, **state or time** is a stronger distinction than physical face.

A future room may therefore distinguish an inbound state from a return state while allowing both sides of each plane to remain fully encounterable in either state.

## 17. The return journey can be part of the work

An exit need not merely terminate the experience.

A future stateful room may use an intentional request to exit as a hinge: the same geometry is traversed again, but material, sound or interpretation has changed.

The useful proposition is not simply “see the other side”; it is **return to the same material differently equipped to read it**.

This capability remains a design requirement, not a currently implemented Blank Room feature.

## 18. Randomisation can assemble a static encounter

Static presentation does not require the room to be identical on every visit.

A database or selection system may determine which testimony, image or object appears before entry. Once presented, however, the resulting environment can remain still.

For fragmentary material, this gives a useful rule: **one entry, one constellation**.

## 19. The threshold is part of the artwork

The Enter Room screen, the first view inside, the door, wayfinding and any instruction to begin moving all form part of the threshold.

Interpretive and navigational text should feel intentionally placed within the exhibition rather than like debug UI or an office notice.

## 20. Surfaces have paint and skin

A material may contain both a base colour and an optional texture or graphic layer over it. The overlay may be opaque or transparent.

The same model should apply consistently to walls, floors, ceilings, doors, furniture and display objects.

## 21. Surface textures should understand physical scale

When the real-world size represented by a texture image is known or can be estimated, the material should declare that size in metres so apparent scale survives changes in room dimensions.

Manual repeat remains useful for unscaled source images and artistic treatments.

## 22. Furniture should be reusable geometry with changeable surfaces

Blank Room should develop a modest library of useful, generic furniture and display forms rather than requiring a bespoke model for every room. Furniture should be skinnable and expose meaningful material regions where useful.

## 23. Assets should have predictable slots

Human-made assets should live in clear, documented locations and use stable conventions. PNG is useful where transparency is required; JPG and WebP are appropriate for opaque imagery and textures.

Artwork specifications should describe the physical surface being authored, not just a pixel rectangle.

## 24. Navigation should be calm

The default Blank Room navigation is deliberately not first-person-shooter navigation.

Mouse-look and pointer lock are excluded from the default because unrestricted mouse camera movement can be disorienting and encourages frantic scanning. Forward, backward and turning are sufficient for the base grammar.

## 25. Prototype by changing one thing at a time

Small tests reveal requirements more clearly than designing a large abstract specification in advance. Each experiment should teach one new capability where possible.

## 26. Discover mechanics through play

Do not fully specify future mechanics from the armchair.

Individual artwork repositories should be allowed to discover requirements through actual navigation, awkwardness, failure and surprise. A mechanic becomes a candidate for Blank Room only after an artwork demonstrates why it is useful and what it needs to expose.

## 27. Promote proven capabilities upstream

Blank Room is the stable reusable engine; individual rooms are play-labs.

The preferred lifecycle is:

> **prototype in an artwork → discover the requirement through play → make the capability generic → promote it to Blank Room**

This prevents the reusable engine accumulating speculative features while allowing artworks to become strange when they need to.

## 28. Individual artworks should remain independent

Projects made with Blank Room should live in their own repositories and may acquire bespoke logic without contaminating the generic starting point.

Blank Room is the reusable system; a particular room is an artwork made with it.

## 29. Restraint is a design principle

A feature should not be added simply because browser 3D makes it possible.

Ask whether it deepens encounter, meaningfully alters access/position/sequence/selection/attention, supports the material rather than making it perform, and genuinely belongs in Blank Room rather than one bespoke artwork.

The aim is a small, legible vocabulary capable of producing rich spatial encounters.

---

## Current shorthand

**The visitor moves. The room holds.**

**Architecture is also editorial.**

**Navigation is part of composition.**

**Content placement must understand architecture.**

**One entry, one constellation.**

**Front/back is spatial; state/time can be epistemic.**

**Discover mechanics through play, then promote them upstream.**

**If a maker might reasonably want to change it, it should not require editing JavaScript.**

**Blank Room is a spatial publishing system, not a game engine.**
