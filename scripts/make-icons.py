#!/usr/bin/env python3
"""Generate PWA icons (teal plate + PA)."""
import struct
import zlib
from pathlib import Path


def png(width: int, height: int, pixels: bytes) -> bytes:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    raw = b""
    for y in range(height):
        raw += b"\x00" + pixels[y * width * 4 : (y + 1) * width * 4]
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def draw(size: int) -> bytes:
    bg = (19, 78, 74, 255)
    fg = (253, 230, 138, 255)
    px = bytearray([0] * size * size * 4)

    def setp(x: int, y: int, c):
        if 0 <= x < size and 0 <= y < size:
            i = (y * size + x) * 4
            px[i : i + 4] = bytes(c)

    r = size // 2 - 2
    cx = cy = size // 2
    for y in range(size):
        for x in range(size):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                setp(x, y, bg)

    # Simple block letters P A
    s = max(1, size // 32)

    def rect(x0, y0, w, h, c):
        for y in range(int(y0), int(y0 + h)):
            for x in range(int(x0), int(x0 + w)):
                setp(x, y, c)

    # P
    ox, oy = size * 0.22, size * 0.28
    rect(ox, oy, 3 * s, 14 * s, fg)
    rect(ox, oy, 8 * s, 3 * s, fg)
    rect(ox + 6 * s, oy, 3 * s, 7 * s, fg)
    rect(ox, oy + 6 * s, 8 * s, 3 * s, fg)
    # A
    ox = size * 0.52
    rect(ox, oy, 3 * s, 14 * s, fg)
    rect(ox + 7 * s, oy, 3 * s, 14 * s, fg)
    rect(ox, oy, 10 * s, 3 * s, fg)
    rect(ox, oy + 6 * s, 10 * s, 3 * s, fg)
    return png(size, size, bytes(px))


out = Path("/workspace/public/icons")
out.mkdir(parents=True, exist_ok=True)
for n in (192, 512):
    (out / f"icon-{n}.png").write_bytes(draw(n))
(out / "apple-touch-icon.png").write_bytes(draw(180))
print("ok")
