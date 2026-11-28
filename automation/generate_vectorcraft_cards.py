import os
import io
import base64
import math
import subprocess
import qrcode
from PIL import Image

def get_base64_image(image_path, flip_horizontal=False, max_size=None):
    im = Image.open(image_path)
    if flip_horizontal:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if max_size:
        im.thumbnail(max_size, Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

def get_qr_base64(url):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=6,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0B0F19", back_color="#FFFFFF")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

os.makedirs("card", exist_ok=True)

# Generate assets
vclass_b64_flipped = get_base64_image("website/public/images/mercedes-v-class.png", flip_horizontal=True, max_size=(620, 380))
qr_whatsapp_b64 = get_qr_base64("https://wa.me/436606416464")
qr_web_b64 = get_qr_base64("https://petrans-salzburg.at")

W, H = 1004, 650

def generate_checkered_strip(x1, y1, x2, y2, square_size=16, rows=2, color1="#0B0F19", color2="#FFFFFF"):
    dx = x2 - x1
    dy = y2 - y1
    dist = math.hypot(dx, dy)
    angle = math.degrees(math.atan2(dy, dx))
    
    cols = int(dist // square_size) + 4
    
    elements = []
    elements.append(f'<g transform="translate({x1},{y1}) rotate({angle})">')
    for r in range(rows):
        y_offset = (r - rows/2) * square_size
        for c in range(cols):
            x_offset = c * square_size - square_size
            fill = color1 if (r + c) % 2 == 0 else color2
            elements.append(f'<rect x="{x_offset:.1f}" y="{y_offset:.1f}" width="{square_size}" height="{square_size}" fill="{fill}" />')
    elements.append('</g>')
    return "\n".join(elements)

# Diagonal strips
front_checker = generate_checkered_strip(-40, 360, 780, 660, square_size=16, rows=2, color1="#0B0F19", color2="#FFFFFF")
back_checker = generate_checkered_strip(-40, 270, 880, 670, square_size=16, rows=2, color1="#0B0F19", color2="#FFFFFF")

svg_front = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="85mm" height="55mm" viewBox="0 0 {W} {H}">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DFBF77" />
      <stop offset="50%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#9A7B38" />
    </linearGradient>
    <linearGradient id="darkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141B2D" />
      <stop offset="60%" stop-color="#0B0F19" />
      <stop offset="100%" stop-color="#070A10" />
    </linearGradient>
    <linearGradient id="badgeGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#DFBF77" />
      <stop offset="100%" stop-color="#C5A059" />
    </linearGradient>
    
    <pattern id="carbonPattern" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#0B0F19" />
      <circle cx="1.5" cy="1.5" r="0.8" fill="#162032" opacity="0.6" />
      <circle cx="4.5" cy="4.5" r="0.8" fill="#162032" opacity="0.6" />
    </pattern>

    <filter id="carShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
      <feOffset dx="0" dy="18" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.8" />
      </feComponentTransfer>
      <feMerge> 
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Dark Base -->
  <rect width="{W}" height="{H}" fill="url(#darkBg)" />
  <rect width="{W}" height="{H}" fill="url(#carbonPattern)" opacity="0.8" />

  <!-- Champagne Gold Polygon Wedge -->
  <polygon points="0,375 720,650 0,650" fill="url(#goldGrad)" />

  <!-- Checkered Racing Strip -->
  <g id="checkered_strip">
    {front_checker}
  </g>

  <!-- Executive Contact Info -->
  <g transform="translate(55, 70)">
    <text x="0" y="40" font-family="'Plus Jakarta Sans', 'Outfit', sans-serif" font-size="42" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">Omer Farooq</text>
    <text x="0" y="74" font-family="'Outfit', sans-serif" font-size="20" font-weight="600" fill="#C5A059" letter-spacing="2" text-transform="uppercase">CEO &amp; Lead Chauffeur</text>
    <line x1="0" y1="92" x2="260" y2="92" stroke="#C5A059" stroke-width="1.5" opacity="0.4" />

    <g transform="translate(0, 125)" font-family="'Plus Jakarta Sans', sans-serif" font-size="16.5" fill="#CBD5E1">
      <g transform="translate(0, 0)">
        <circle cx="10" cy="-6" r="14" fill="#161F30" stroke="#C5A059" stroke-width="1" />
        <text x="10" y="-1" font-size="14" fill="#C5A059" text-anchor="middle" font-weight="bold">@</text>
        <text x="36" y="0" font-weight="500">farooqcheema64164@gmail.com</text>
      </g>
      <g transform="translate(0, 36)">
        <circle cx="10" cy="-6" r="14" fill="#161F30" stroke="#C5A059" stroke-width="1" />
        <text x="10" y="-1" font-size="13" fill="#C5A059" text-anchor="middle">📍</text>
        <text x="36" y="0" font-weight="500">Salzburg Airport &amp; City Centre</text>
        <text x="36" y="24" font-size="13.5" fill="#94A3B8">5020 Salzburg, Austria</text>
      </g>
      <g transform="translate(0, 92)">
        <circle cx="10" cy="-6" r="14" fill="#161F30" stroke="#C5A059" stroke-width="1" />
        <text x="10" y="-1" font-size="13" fill="#C5A059" text-anchor="middle">🌐</text>
        <text x="36" y="0" font-weight="600" fill="#DFBF77">www.petrans-salzburg.at</text>
      </g>
    </g>
  </g>

  <!-- 24/7 Phone Callout -->
  <g transform="translate(50, 532)">
    <circle cx="28" cy="28" r="24" fill="#0B0F19" />
    <path d="M21 19 C21 18 22 17 23 17 L25 17 C26 17 27 18 27 19 L28 22 C28 23 28 24 27 25 L26 26 C26 27 28 30 31 32 L32 31 C33 30 34 30 35 31 L38 32 C39 32 40 33 40 34 L40 36 C40 37 39 38 38 38 C28 38 19 29 19 19 Z" fill="#DFBF77" />
    
    <text x="66" y="16" font-family="'Outfit', sans-serif" font-size="12" font-weight="700" fill="#0B0F19" letter-spacing="1.5" text-transform="uppercase">24/7 Chauffeur Service</text>
    <text x="66" y="46" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="30" font-weight="800" fill="#0B0F19" letter-spacing="0.5">+43 660 6416464</text>
  </g>

  <!-- Car Ground Shadow -->
  <ellipse cx="715" cy="590" rx="250" ry="22" fill="#000000" opacity="0.85" filter="url(#carShadow)" />

  <!-- Mercedes-Benz V-Class -->
  <g transform="translate(425, 275)">
    <image xlink:href="data:image/png;base64,{vclass_b64_flipped}" width="545" height="338" />
  </g>

  <!-- Brand Badge / Logo -->
  <g transform="translate(680, 50)">
    <path d="M 0 0 L 260 0 C 270 0, 275 5, 275 15 L 275 75 C 275 95, 240 100, 210 100 L 0 100 Z" fill="url(#badgeGold)" />
    <g transform="translate(20, 20)">
      <g transform="translate(0, 2)">
        <rect x="0" y="0" width="8" height="8" fill="#0B0F19" />
        <rect x="8" y="0" width="8" height="8" fill="#FFFFFF" />
        <rect x="16" y="0" width="8" height="8" fill="#0B0F19" />
        <rect x="24" y="0" width="8" height="8" fill="#FFFFFF" />
        <rect x="0" y="8" width="8" height="8" fill="#FFFFFF" />
        <rect x="8" y="8" width="8" height="8" fill="#0B0F19" />
        <rect x="16" y="8" width="8" height="8" fill="#FFFFFF" />
        <rect x="24" y="8" width="8" height="8" fill="#0B0F19" />
      </g>
      <text x="38" y="24" font-family="'Cinzel', serif" font-size="28" font-weight="800" fill="#0B0F19" letter-spacing="3">PETRANS</text>
      <text x="38" y="44" font-family="'Outfit', sans-serif" font-size="12" font-weight="700" fill="#0B0F19" letter-spacing="2">TAXI &amp; TOUR SALZBURG</text>
      <text x="38" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="600" fill="#1E293B" letter-spacing="1">WKO CERTIFIED CHAUFFEUR</text>
    </g>
  </g>
</svg>
'''

svg_back = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="85mm" height="55mm" viewBox="0 0 {W} {H}">
  <defs>
    <linearGradient id="goldGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DFBF77" />
      <stop offset="50%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#9A7B38" />
    </linearGradient>
    <linearGradient id="darkBgBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141B2D" />
      <stop offset="60%" stop-color="#0B0F19" />
      <stop offset="100%" stop-color="#070A10" />
    </linearGradient>
    <pattern id="carbonPatternBack" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#0B0F19" />
      <circle cx="1.5" cy="1.5" r="0.8" fill="#162032" opacity="0.6" />
      <circle cx="4.5" cy="4.5" r="0.8" fill="#162032" opacity="0.6" />
    </pattern>
    <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Dark Base -->
  <rect width="{W}" height="{H}" fill="url(#darkBgBack)" />
  <rect width="{W}" height="{H}" fill="url(#carbonPatternBack)" opacity="0.8" />

  <!-- Champagne Gold Polygon Wedge (Generous height starting at y=270) -->
  <polygon points="0,270 860,650 0,650" fill="url(#goldGradBack)" />

  <!-- Checkered Strip -->
  <g id="checkered_strip_back">
    {back_checker}
  </g>

  <!-- WhatsApp QR Code Card -->
  <g transform="translate(130, 30)" filter="url(#boxShadow)">
    <rect width="170" height="205" rx="12" fill="#FFFFFF" />
    <rect width="170" height="42" rx="12" fill="#C5A059" />
    <rect y="25" width="170" height="17" fill="#C5A059" />
    <text x="85" y="27" font-family="'Outfit', sans-serif" font-size="16" font-weight="800" fill="#0B0F19" text-anchor="middle" letter-spacing="1">WhatsApp</text>
    <image xlink:href="data:image/png;base64,{qr_whatsapp_b64}" x="15" y="50" width="140" height="140" />
  </g>

  <!-- Center Brand Logo Emblem -->
  <g transform="translate(425, 55)">
    <path d="M 0 0 L 225 0 C 245 0, 255 15, 255 35 L 255 65 C 255 90, 220 95, 185 95 L 0 95 Z" fill="url(#goldGradBack)" />
    <g transform="translate(20, 18)">
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="7" height="7" fill="#0B0F19" />
        <rect x="7" y="0" width="7" height="7" fill="#FFFFFF" />
        <rect x="14" y="0" width="7" height="7" fill="#0B0F19" />
        <rect x="21" y="0" width="7" height="7" fill="#FFFFFF" />
        <rect x="0" y="7" width="7" height="7" fill="#FFFFFF" />
        <rect x="7" y="7" width="7" height="7" fill="#0B0F19" />
        <rect x="14" y="7" width="7" height="7" fill="#FFFFFF" />
        <rect x="21" y="7" width="7" height="7" fill="#0B0F19" />
      </g>
      <text x="36" y="22" font-family="'Cinzel', serif" font-size="28" font-weight="800" fill="#0B0F19" letter-spacing="3">PETRANS</text>
      <text x="36" y="42" font-family="'Outfit', sans-serif" font-size="12" font-weight="700" fill="#0B0F19" letter-spacing="2">TAXI &amp; TOUR SALZBURG</text>
      <text x="36" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="600" fill="#1E293B" letter-spacing="1">PREMIUM CHAUFFEUR</text>
    </g>
  </g>

  <!-- Online Booking QR Code Card -->
  <g transform="translate(750, 30)" filter="url(#boxShadow)">
    <rect width="170" height="205" rx="12" fill="#FFFFFF" />
    <rect width="170" height="42" rx="12" fill="#C5A059" />
    <rect y="25" width="170" height="17" fill="#C5A059" />
    <text x="85" y="27" font-family="'Outfit', sans-serif" font-size="16" font-weight="800" fill="#0B0F19" text-anchor="middle" letter-spacing="1">Online Booking</text>
    <image xlink:href="data:image/png;base64,{qr_web_b64}" x="15" y="50" width="140" height="140" />
  </g>

  <!-- Service Badges -->
  <g transform="translate(420, 175)" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#E2E8F0">
    <g transform="translate(0, 0)">
      <rect width="290" height="30" rx="15" fill="#161F30" stroke="#C5A059" stroke-width="1" opacity="0.95" />
      <text x="145" y="20" text-anchor="middle" font-weight="600" fill="#DFBF77">★ Mercedes-Benz V-Class &amp; Vito</text>
    </g>
    <g transform="translate(0, 38)">
      <rect width="290" height="30" rx="15" fill="#161F30" stroke="#C5A059" stroke-width="1" opacity="0.95" />
      <text x="145" y="20" text-anchor="middle" font-weight="600" fill="#DFBF77">✈ Salzburg &amp; Munich Airport Transfers</text>
    </g>
    <g transform="translate(0, 76)">
      <rect width="290" height="30" rx="15" fill="#161F30" stroke="#C5A059" stroke-width="1" opacity="0.95" />
      <text x="145" y="20" text-anchor="middle" font-weight="600" fill="#DFBF77">🏔 Hallstatt • Zell am See • Eagles Nest</text>
    </g>
  </g>

  <!-- Phone Callout & Dispatch (Positioned cleanly with >80px clearance) -->
  <g transform="translate(55, 515)">
    <circle cx="34" cy="34" r="28" fill="#0B0F19" />
    <path d="M25 22 C25 21 26 20 27 20 L29 20 C30 20 31 21 31 22 L33 26 C33 27 33 28 32 29 L31 30 C31 31 34 36 37 39 L38 38 C39 37 40 37 41 38 L45 40 C46 40 47 41 47 42 L47 45 C47 46 46 47 45 47 C33 47 21 35 21 23 Z" fill="#DFBF77" />

    <text x="80" y="20" font-family="'Outfit', sans-serif" font-size="13.5" font-weight="700" fill="#0B0F19" letter-spacing="1.5" text-transform="uppercase">Direct VIP Reservations &amp; Dispatch</text>
    <text x="80" y="58" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="40" font-weight="800" fill="#0B0F19" letter-spacing="1">+43 660 6416464</text>
  </g>
</svg>
'''

with open("card/petrans_visiting_card_front.svg", "w") as f:
    f.write(svg_front)

with open("card/petrans_visiting_card_back.svg", "w") as f:
    f.write(svg_back)

# Convert all using vectorcraft-cli
targets = [
    ("card/petrans_visiting_card_front.svg", "card/petrans_visiting_card_front.vectorcraft"),
    ("card/petrans_visiting_card_back.svg", "card/petrans_visiting_card_back.vectorcraft"),
    ("card/petrans_visiting_card_front.vectorcraft", "card/petrans_visiting_card_front.pdf"),
    ("card/petrans_visiting_card_back.vectorcraft", "card/petrans_visiting_card_back.pdf"),
    ("card/petrans_visiting_card_front.vectorcraft", "card/petrans_visiting_card_front.png"),
    ("card/petrans_visiting_card_back.vectorcraft", "card/petrans_visiting_card_back.png"),
]

for src, dst in targets:
    cmd = ["vectorcraft-cli", "convert", src, dst]
    if dst.endswith(".png"):
        cmd.extend(["--scale", "2"])
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Error on", dst, res.stderr)
    else:
        print("Success:", dst)

