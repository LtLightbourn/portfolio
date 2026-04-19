"""
create_watch_movement.py
────────────────────────────────────────────────────────────────────────
Procedurally generates a mechanical watch movement in Blender, then
prepares it for glTF export (to be loaded by the Three.js viewer at
/labs/watch).

HOW TO RUN:
    1. Open Blender (any recent version, 3.6+ recommended).
    2. Switch to the "Scripting" workspace (top of Blender window).
    3. Click "Open" in the text editor → pick this file.
    4. Click "Run Script" (▶ button) — takes ~5 seconds.
    5. Review the result in the 3D viewport.
    6. File → Export → glTF 2.0 (.glb/.gltf).
       - Format: glTF Binary (.glb)
       - Include → Selected Objects: off (export all)
       - Transform → Y Up: ON (important for Three.js)
       - Material: Export (include textures)
       - Save as: portfolio/public/models/watch-movement.glb

WHY BLENDER OVER PROCEDURAL THREE.JS:
    This script uses Blender's shader node system to build materials
    with procedural noise mixed into roughness (creating subtle wear
    patterns). On export, those materials get baked into texture maps
    that Three.js can render — which is the single biggest reason the
    result looks more like a photo than a demo.

UNITS:
    Scaled for a ~30mm real watch movement. In Three.js you may need
    to scale the imported scene up (it'll import in meters, so at
    30mm it'll appear tiny — just scale by ~30).
────────────────────────────────────────────────────────────────────────
"""

import bpy
import bmesh
import math
from mathutils import Vector, Matrix


# ═══════════════════════════════════════════════════════════════════
# SECTION 1 — Scene reset + utilities
# ═══════════════════════════════════════════════════════════════════

def clear_scene():
    """Wipe everything so the script is idempotent (re-runnable)."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        bpy.data.materials.remove(block)
    for block in bpy.data.images:
        bpy.data.images.remove(block)


def add_bevel_and_subdivision(obj, bevel_width=0.0003, bevel_segments=3,
                              subdiv_levels=2):
    """
    Apply the two modifiers that matter most for realism:
    - Bevel: softens hard 90° edges (real objects don't have them)
    - Subdivision: smooths rounded surfaces
    Modifiers are kept live (not applied) so export can either
    preserve them as high-poly or bake them down.
    """
    bevel = obj.modifiers.new(name="Bevel", type="BEVEL")
    bevel.width = bevel_width
    bevel.segments = bevel_segments
    bevel.limit_method = "ANGLE"
    bevel.angle_limit = math.radians(30)

    if subdiv_levels > 0:
        subsurf = obj.modifiers.new(name="Subsurf", type="SUBSURF")
        subsurf.levels = subdiv_levels
        subsurf.render_levels = subdiv_levels + 1


def shade_smooth(obj):
    """Smooth shading (Phong-style) across the mesh."""
    for poly in obj.data.polygons:
        poly.use_smooth = True


# ═══════════════════════════════════════════════════════════════════
# SECTION 2 — PBR material builders
# ═══════════════════════════════════════════════════════════════════
# Each material uses Blender's Principled BSDF shader node with
# procedural noise feeding into the roughness channel. This creates
# subtle wear variation that reads as "used metal" rather than
# "pristine CG metal."

def make_metal_material(name, base_color, base_roughness, noise_scale=200.0,
                        noise_strength=0.15, anisotropy=0.0):
    """
    Build a PBR metal material with procedural wear.
    - base_color: RGBA tuple (0-1 range)
    - base_roughness: baseline roughness (0=mirror, 1=fully diffuse)
    - noise_scale: higher = finer grain pattern
    - noise_strength: how much noise perturbs the roughness
    - anisotropy: 0 = isotropic, >0 = brushed-metal effect
    """
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Core Principled BSDF shader
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = base_color
    bsdf.inputs["Metallic"].default_value = 1.0
    bsdf.inputs["Roughness"].default_value = base_roughness
    if "Anisotropic" in bsdf.inputs:
        bsdf.inputs["Anisotropic"].default_value = anisotropy

    # Procedural noise feeding into roughness for wear
    tex_coord = nodes.new("ShaderNodeTexCoord")
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = noise_scale
    noise.inputs["Detail"].default_value = 8
    noise.inputs["Roughness"].default_value = 0.6

    # Color ramp to control how the noise maps into roughness values
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.35
    ramp.color_ramp.elements[1].position = 0.75

    # Mix the noise-driven roughness with the base roughness
    mix = nodes.new("ShaderNodeMixRGB")
    mix.blend_type = "MIX"
    mix.inputs["Fac"].default_value = noise_strength
    mix.inputs["Color1"].default_value = (base_roughness,) * 3 + (1,)

    # Final output
    output = nodes.new("ShaderNodeOutputMaterial")

    # Wire it all together
    links.new(tex_coord.outputs["Object"], noise.inputs["Vector"])
    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], mix.inputs["Color2"])
    links.new(mix.outputs["Color"], bsdf.inputs["Roughness"])
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])

    return mat


def make_ruby_material():
    """
    Faceted ruby with real transmission + glow. Rubies aren't just
    red metal — they transmit light, giving them a glassy inner glow.
    """
    mat = bpy.data.materials.new(name="Ruby")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (0.78, 0.13, 0.13, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = 0.05
    bsdf.inputs["IOR"].default_value = 1.76  # Real ruby IOR
    if "Transmission" in bsdf.inputs:
        bsdf.inputs["Transmission"].default_value = 0.55
    if "Transmission Weight" in bsdf.inputs:
        bsdf.inputs["Transmission Weight"].default_value = 0.55
    if "Emission" in bsdf.inputs:
        bsdf.inputs["Emission"].default_value = (0.4, 0.05, 0.05, 1.0)
    if "Emission Strength" in bsdf.inputs:
        bsdf.inputs["Emission Strength"].default_value = 0.3

    output = nodes.new("ShaderNodeOutputMaterial")
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    return mat


def make_blued_steel_material():
    """
    Heat-blued steel (the deep blue used for watch springs and screws).
    Very smooth, highly saturated blue, with a thin clearcoat.
    """
    mat = bpy.data.materials.new(name="BluedSteel")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    links = mat.node_tree.links

    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (0.08, 0.13, 0.48, 1.0)
    bsdf.inputs["Metallic"].default_value = 1.0
    bsdf.inputs["Roughness"].default_value = 0.18
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = 0.5
    if "Coat Roughness" in bsdf.inputs:
        bsdf.inputs["Coat Roughness"].default_value = 0.05

    output = nodes.new("ShaderNodeOutputMaterial")
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    return mat


def assign_material(obj, material):
    if len(obj.data.materials):
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)


# ═══════════════════════════════════════════════════════════════════
# SECTION 3 — Component builders (geometry)
# ═══════════════════════════════════════════════════════════════════

def create_base_plate(radius=0.015, thickness=0.002):
    """
    Main plate — beveled disc with engraved concentric grooves
    (perlage pattern is a step too far for procedural; grooves are
    a simpler signature of a real movement).
    """
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius,
        depth=thickness,
        vertices=128,
        location=(0, 0, 0),
    )
    plate = bpy.context.active_object
    plate.name = "BasePlate"

    # Top surface grooves (concentric rings) — subtle ridges
    for ring_r in [radius * 0.25, radius * 0.45, radius * 0.65, radius * 0.82,
                   radius * 0.95]:
        bpy.ops.mesh.primitive_torus_add(
            major_radius=ring_r,
            minor_radius=0.00008,
            major_segments=256,
            minor_segments=6,
            location=(0, 0, thickness / 2 + 0.00005),
        )
        ring = bpy.context.active_object
        ring.name = f"PlateRing_{ring_r:.3f}"

    add_bevel_and_subdivision(plate, bevel_width=0.0002, subdiv_levels=1)
    shade_smooth(plate)
    return plate


def create_gear(name, teeth, outer_radius, inner_radius, thickness,
                tooth_depth_ratio=0.12, location=(0, 0, 0)):
    """
    Build a gear using bmesh — a more detailed approach than primitives.
    Gears are the signature of a mechanical movement; they need to look
    right. This builds proper trapezoidal teeth around the edge.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    tooth_depth = outer_radius * tooth_depth_ratio
    steps = teeth * 4  # 4 vertices per tooth = 2 flanks + top + bottom
    angle_step = (math.pi * 2) / steps

    # Build the top-face 2D outline: alternating outer/inner radii
    outer_ring = []
    inner_ring = []
    for i in range(steps):
        phase = i % 4
        # Phase 0/1 = outer radius (tooth top), 2/3 = inner (valley)
        if phase == 0 or phase == 1:
            r = outer_radius
        else:
            r = outer_radius - tooth_depth
        a = i * angle_step
        x, y = math.cos(a) * r, math.sin(a) * r
        outer_ring.append(bm.verts.new((x, y, thickness / 2)))
        inner_ring.append(bm.verts.new((x, y, -thickness / 2)))

    # Hub (inner hole) vertices — top and bottom
    hub_top = []
    hub_bot = []
    hub_segs = 32
    for i in range(hub_segs):
        a = i * (math.pi * 2) / hub_segs
        x, y = math.cos(a) * inner_radius, math.sin(a) * inner_radius
        hub_top.append(bm.verts.new((x, y, thickness / 2)))
        hub_bot.append(bm.verts.new((x, y, -thickness / 2)))

    # Side walls (outer edge, between top and bottom rings)
    for i in range(steps):
        j = (i + 1) % steps
        bm.faces.new([outer_ring[i], outer_ring[j], inner_ring[j], inner_ring[i]])

    # Hub walls
    for i in range(hub_segs):
        j = (i + 1) % hub_segs
        bm.faces.new([hub_top[j], hub_top[i], hub_bot[i], hub_bot[j]])

    # Top face (annulus) — fan from hub to outer
    # Simpler: compute nearest hub vert for each outer vert
    def nearest(v, ring):
        angle = math.atan2(v.co.y, v.co.x) % (2 * math.pi)
        idx = int(round(angle / (2 * math.pi) * len(ring))) % len(ring)
        return ring[idx]

    for i in range(steps):
        j = (i + 1) % steps
        h1 = nearest(outer_ring[i], hub_top)
        h2 = nearest(outer_ring[j], hub_top)
        if h1 == h2:
            try:
                bm.faces.new([outer_ring[i], outer_ring[j], h1])
            except ValueError:
                pass  # duplicate face — skip
        else:
            try:
                bm.faces.new([outer_ring[i], outer_ring[j], h2, h1])
            except ValueError:
                pass

    # Bottom face — same pattern, reversed winding
    for i in range(steps):
        j = (i + 1) % steps
        h1 = nearest(inner_ring[i], hub_bot)
        h2 = nearest(inner_ring[j], hub_bot)
        if h1 == h2:
            try:
                bm.faces.new([h1, inner_ring[j], inner_ring[i]])
            except ValueError:
                pass
        else:
            try:
                bm.faces.new([h1, h2, inner_ring[j], inner_ring[i]])
            except ValueError:
                pass

    bm.to_mesh(mesh)
    bm.free()

    obj.location = location
    add_bevel_and_subdivision(obj, bevel_width=0.00008, bevel_segments=2,
                              subdiv_levels=1)
    shade_smooth(obj)
    return obj


def create_balance_wheel(radius=0.004, thickness=0.0005, location=(0, 0, 0)):
    """
    Balance wheel — ring with 3 spokes and a center hub. The signature
    component that oscillates in a real movement.
    """
    # Outer ring
    bpy.ops.mesh.primitive_torus_add(
        major_radius=radius,
        minor_radius=thickness * 0.7,
        major_segments=96,
        minor_segments=12,
        location=location,
    )
    ring = bpy.context.active_object
    ring.name = "BalanceRing"
    add_bevel_and_subdivision(ring, bevel_width=0.00005, subdiv_levels=1)
    shade_smooth(ring)

    # 3 spokes as thin boxes
    spoke_objects = [ring]
    for i in range(3):
        angle = i * (2 * math.pi / 3)
        bpy.ops.mesh.primitive_cube_add(
            size=1,
            location=location,
        )
        spoke = bpy.context.active_object
        spoke.name = f"BalanceSpoke_{i}"
        spoke.scale = (radius * 2.0, radius * 0.08, thickness * 0.6)
        spoke.rotation_euler[2] = angle
        add_bevel_and_subdivision(spoke, bevel_width=0.00005, subdiv_levels=0)
        shade_smooth(spoke)
        spoke_objects.append(spoke)

    # Center hub
    bpy.ops.mesh.primitive_cylinder_add(
        radius=thickness * 1.2,
        depth=thickness * 2.5,
        vertices=32,
        location=location,
    )
    hub = bpy.context.active_object
    hub.name = "BalanceHub"
    add_bevel_and_subdivision(hub, bevel_width=0.00005, subdiv_levels=1)
    shade_smooth(hub)
    spoke_objects.append(hub)

    return spoke_objects


def create_hairspring(center=(0, 0, 0), turns=8, start_radius=0.0005,
                      end_radius=0.0025, thickness=0.00008):
    """
    Hairspring — flat logarithmic spiral. The part that makes a watch tick.
    Built as a curve converted to mesh.
    """
    curve_data = bpy.data.curves.new("HairspringCurve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.bevel_depth = thickness
    curve_data.bevel_resolution = 4
    curve_data.resolution_u = 24

    spline = curve_data.splines.new("POLY")
    points_per_turn = 64
    total_points = turns * points_per_turn
    spline.points.add(total_points)

    for i in range(total_points + 1):
        t = i / total_points
        angle = t * turns * 2 * math.pi
        r = start_radius + (end_radius - start_radius) * t
        x = math.cos(angle) * r + center[0]
        y = math.sin(angle) * r + center[1]
        z = center[2]
        spline.points[i].co = (x, y, z, 1.0)

    obj = bpy.data.objects.new("Hairspring", curve_data)
    bpy.context.collection.objects.link(obj)
    return obj


def create_bridge(name, size, location, rotation=(0, 0, 0)):
    """
    Watch bridge — flat decorative plate that holds gears in place.
    A real giveaway of a mechanical watch. Rounded corners via bevel.
    """
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    bridge = bpy.context.active_object
    bridge.name = name
    bridge.scale = size
    bridge.rotation_euler = rotation

    # Strong bevel for that characteristic rounded-bridge shape
    bevel = bridge.modifiers.new(name="Bevel", type="BEVEL")
    bevel.width = min(size) * 0.15
    bevel.segments = 6
    bevel.limit_method = "ANGLE"
    bevel.angle_limit = math.radians(30)

    shade_smooth(bridge)
    return bridge


def create_jewel(location, setting_radius=0.0004, jewel_radius=0.0003):
    """Ruby jewel bearing in a gold setting ring."""
    # Setting ring
    bpy.ops.mesh.primitive_cylinder_add(
        radius=setting_radius,
        depth=setting_radius * 0.4,
        vertices=24,
        location=location,
    )
    setting = bpy.context.active_object
    setting.name = "JewelSetting"
    shade_smooth(setting)

    # Ruby
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=jewel_radius,
        segments=24,
        ring_count=12,
        location=(location[0], location[1], location[2] + setting_radius * 0.15),
    )
    ruby = bpy.context.active_object
    ruby.name = "Ruby"
    # Slightly flatten the top for a faceted-gem look
    ruby.scale = (1.0, 1.0, 0.7)
    shade_smooth(ruby)

    return setting, ruby


def create_screw(location, radius=0.0005):
    """Countersunk screw with a slot."""
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius,
        depth=radius * 0.8,
        vertices=20,
        location=location,
    )
    screw = bpy.context.active_object
    screw.name = "Screw"
    add_bevel_and_subdivision(screw, bevel_width=radius * 0.1,
                              subdiv_levels=1)
    shade_smooth(screw)

    # Slot (small box cut — visually suggestive, not a real boolean)
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=(location[0], location[1], location[2] + radius * 0.4),
    )
    slot = bpy.context.active_object
    slot.name = "ScrewSlot"
    slot.scale = (radius * 1.3, radius * 0.15, radius * 0.1)
    return screw, slot


# ═══════════════════════════════════════════════════════════════════
# SECTION 4 — Scene assembly
# ═══════════════════════════════════════════════════════════════════

def build_movement():
    """Assemble the full movement from the component builders."""

    # Build materials once, reuse across components
    gold = make_metal_material(
        "Gold",
        base_color=(0.83, 0.67, 0.35, 1.0),
        base_roughness=0.28,
        noise_scale=300,
        noise_strength=0.25,
    )
    rose_gold = make_metal_material(
        "RoseGold",
        base_color=(0.79, 0.56, 0.42, 1.0),
        base_roughness=0.22,
        noise_scale=280,
        noise_strength=0.2,
    )
    steel = make_metal_material(
        "Steel",
        base_color=(0.72, 0.72, 0.75, 1.0),
        base_roughness=0.18,
        noise_scale=500,
        noise_strength=0.35,
        anisotropy=0.5,  # Brushed-metal effect
    )
    dark_gold = make_metal_material(
        "DarkGold",
        base_color=(0.55, 0.42, 0.20, 1.0),
        base_roughness=0.55,
        noise_scale=200,
        noise_strength=0.4,
    )
    blued = make_blued_steel_material()
    ruby = make_ruby_material()

    # ─ Base plate ─
    plate = create_base_plate()
    assign_material(plate, gold)

    # Assign darker gold to the decorative rings that were created inside
    # create_base_plate (they're named PlateRing_*)
    for o in bpy.context.collection.objects:
        if o.name.startswith("PlateRing"):
            assign_material(o, dark_gold)

    # ─ Gears ─
    # Positioned to read as a convincing mechanical layout.
    # Millimeters everywhere: 1 Blender unit = 1 meter, so radii are tiny.
    gear_specs = [
        # name,     teeth, r_out,  r_in,    thick,  pos,              material
        ("CenterGear",  60, 0.0058, 0.0008, 0.0007, ( 0.0000, 0.0000, 0.00105), gold),
        ("GearUR",      40, 0.0040, 0.0006, 0.0006, ( 0.0070, 0.0040, 0.00115), rose_gold),
        ("GearUL",      32, 0.0032, 0.0006, 0.0006, (-0.0065, 0.0045, 0.00115), gold),
        ("GearLL",      26, 0.0026, 0.0005, 0.0005, (-0.0075,-0.0045, 0.00115), rose_gold),
        ("GearLR",      22, 0.0022, 0.0004, 0.0005, ( 0.0062,-0.0055, 0.00115), steel),
    ]
    gears = []
    for name, teeth, r_out, r_in, thick, pos, mat in gear_specs:
        gear = create_gear(name, teeth, r_out, r_in, thick, location=pos)
        assign_material(gear, mat)
        gears.append(gear)

    # ─ Balance wheel (with hairspring inside) ─
    balance_pos = (0, -0.0095, 0.00165)
    balance_parts = create_balance_wheel(
        radius=0.0035,
        thickness=0.00045,
        location=balance_pos,
    )
    for part in balance_parts:
        assign_material(part, blued)

    hair = create_hairspring(
        center=(balance_pos[0], balance_pos[1], balance_pos[2] - 0.00015),
        turns=9,
        start_radius=0.0004,
        end_radius=0.0020,
        thickness=0.00005,
    )
    assign_material(hair, blued)

    # ─ Bridges ─
    # Main bridge (spans across upper gears)
    bridge1 = create_bridge(
        "MainBridge",
        size=(0.016, 0.0042, 0.0008),
        location=(0.0005, 0.004, 0.0025),
    )
    assign_material(bridge1, gold)

    # Balance bridge (holds the balance wheel)
    bridge2 = create_bridge(
        "BalanceBridge",
        size=(0.007, 0.002, 0.0007),
        location=(0, -0.0095, 0.0027),
    )
    assign_material(bridge2, gold)

    # Lower-left support bridge
    bridge3 = create_bridge(
        "LowerBridge",
        size=(0.009, 0.0028, 0.0006),
        location=(-0.0040, -0.0025, 0.0022),
        rotation=(0, 0, math.radians(35)),
    )
    assign_material(bridge3, rose_gold)

    # ─ Ruby jewels (at each gear axis + balance) ─
    jewel_positions = [
        (0.0000, 0.0000, 0.00225),
        (0.0070, 0.0040, 0.00245),
        (-0.0065, 0.0045, 0.00245),
        (-0.0075, -0.0045, 0.00230),
        (0.0062, -0.0055, 0.00230),
        (0.0000, -0.0095, 0.00300),
    ]
    for pos in jewel_positions:
        setting, ruby_mesh = create_jewel(pos)
        assign_material(setting, gold)
        assign_material(ruby_mesh, ruby)

    # ─ Screws (bridge fasteners) ─
    screw_positions = [
        (-0.0072, 0.0065, 0.0030),
        ( 0.0078, 0.0065, 0.0030),
        (-0.0072, 0.0015, 0.0030),
        ( 0.0078, 0.0015, 0.0030),
        (-0.0032, -0.0090, 0.0031),
        ( 0.0032, -0.0090, 0.0031),
    ]
    for pos in screw_positions:
        screw, slot = create_screw(pos)
        assign_material(screw, steel)
        # Slot gets a pure black non-metal material
        slot_mat = bpy.data.materials.new(name="SlotBlack")
        slot_mat.use_nodes = True
        slot_bsdf = slot_mat.node_tree.nodes.get("Principled BSDF")
        if slot_bsdf:
            slot_bsdf.inputs["Base Color"].default_value = (0.02, 0.02, 0.02, 1)
            slot_bsdf.inputs["Roughness"].default_value = 0.9
            slot_bsdf.inputs["Metallic"].default_value = 0.0
        assign_material(slot, slot_mat)

    print(f"✓ Built movement: {len(gears)} gears, {len(jewel_positions)} "
          f"jewels, {len(screw_positions)} screws")


# ═══════════════════════════════════════════════════════════════════
# SECTION 5 — Camera + lighting for rendering-in-Blender
# ═══════════════════════════════════════════════════════════════════
# If you just want to export .glb, you can skip this section — Three.js
# will provide its own camera and lights. But if you want to render a
# beautiful still in Blender first (for a marketing image, e.g.), this
# gives you a professional studio setup.

def setup_camera():
    bpy.ops.object.camera_add(
        location=(0.025, -0.030, 0.040),
        rotation=(math.radians(55), 0, math.radians(40)),
    )
    cam = bpy.context.active_object
    cam.data.lens = 80  # Short-tele for flattering perspective
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = 0.050
    cam.data.dof.aperture_fstop = 2.8
    bpy.context.scene.camera = cam


def setup_lighting():
    """Three-light studio setup: key, fill, rim."""
    # Key — bright directional, top-right
    bpy.ops.object.light_add(type="AREA", location=(0.03, -0.02, 0.05))
    key = bpy.context.active_object
    key.name = "KeyLight"
    key.data.energy = 400
    key.data.size = 0.04
    key.rotation_euler = (math.radians(45), math.radians(10), math.radians(30))

    # Fill — softer, blueish, opposite side
    bpy.ops.object.light_add(type="AREA", location=(-0.04, 0.01, 0.03))
    fill = bpy.context.active_object
    fill.name = "FillLight"
    fill.data.energy = 150
    fill.data.color = (0.7, 0.85, 1.0)
    fill.data.size = 0.06

    # Rim — back light for edge separation
    bpy.ops.object.light_add(type="AREA", location=(0, 0.025, 0.02))
    rim = bpy.context.active_object
    rim.name = "RimLight"
    rim.data.energy = 200
    rim.data.color = (1.0, 0.95, 0.8)
    rim.data.size = 0.04

    # World environment — simple gradient sky (for reflections)
    world = bpy.context.scene.world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = 0.3
    bg.inputs["Color"].default_value = (0.05, 0.05, 0.07, 1)
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def setup_render_settings():
    """High-quality render settings. Only matters if you render in Blender."""
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "GPU"  # will fall back to CPU if no GPU
    scene.cycles.samples = 256
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 3840  # 4K
    scene.render.resolution_y = 2160
    scene.render.film_transparent = True  # PNG with alpha


# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    clear_scene()
    build_movement()
    setup_camera()
    setup_lighting()
    setup_render_settings()

    print(
        "\n"
        "════════════════════════════════════════════════════════════\n"
        " WATCH MOVEMENT GENERATED\n"
        "════════════════════════════════════════════════════════════\n"
        " Next steps:\n"
        "   • View in 3D viewport (numpad 0 to see through camera)\n"
        "   • Press F12 to render a still (takes ~1-3 min on GPU)\n"
        "   • Export: File → Export → glTF 2.0 (.glb)\n"
        "     - Transform: +Y Up ✓\n"
        "     - Materials: Export ✓\n"
        "     - Save to: portfolio/public/models/watch-movement.glb\n"
        "════════════════════════════════════════════════════════════\n"
    )
