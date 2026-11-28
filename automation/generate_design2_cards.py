import os
import io
import base64
import subprocess
import qrcode
from PIL import Image
import pypdf
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import shutil

def get_base64_image(image_path, flip_horizontal=False, max_size=None):
    im = Image.open(image_path)
    if flip_horizontal:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if max_size:
        im.thumbnail(max_size, Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

def get_qr_base64(url, fill_color="#0B0F19", back_color="#FFFFFF"):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=6,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=fill_color, back_color=back_color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

os.makedirs("card", exist_ok=True)

# Generate assets
# Facing right for the elegant modern look
vclass_b64 = get_base64_image("website/public/images/mercedes-v-class.png", flip_horizontal=False, max_size=(660, 410))
qr_booking_b64 = get_qr_base64("https://petrans-salzburg.at/booking.html")
qr_whatsapp_b64 = get_qr_base64("https://wa.me/436606416464")

W, H = 1004, 650

# --- DESIGN 2: EXECUTIVE ALPINE NOIR (Modern Trending European Chauffeur) ---

svg_front = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="85mm" height="55mm" viewBox="0 0 {W} {H}">
  <defs>
    <linearGradient id="goldLinear" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EEDAA2" />
      <stop offset="45%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#8F6E28" />
    </linearGradient>
    <linearGradient id="goldHLinear" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#EEDAA2" />
      <stop offset="50%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#9A7B38" />
    </linearGradient>
    <linearGradient id="cardDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111827" />
      <stop offset="50%" stop-color="#0B0F19" />
      <stop offset="100%" stop-color="#05070B" />
    </linearGradient>
    
    <!-- Subtle radial podium glow -->
    <radialGradient id="podiumGlow" cx="62%" cy="65%" r="45%">
      <stop offset="0%" stop-color="#C5A059" stop-opacity="0.22" />
      <stop offset="55%" stop-color="#C5A059" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#0B0F19" stop-opacity="0" />
    </radialGradient>

    <!-- Floor Drop Shadow for V-Class -->
    <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
  </defs>

  <!-- Base Slate -->
  <rect width="{W}" height="{H}" fill="url(#cardDark)" />

  <!-- Ambient Gold Spotlight for Vehicle -->
  <ellipse cx="640" cy="430" rx="360" ry="180" fill="url(#podiumGlow)" />

  <!-- Outer Micro-Border (Foil Hairline Accent) -->
  <rect x="24" y="24" width="{W - 48}" height="{H - 48}" rx="8" fill="none" stroke="url(#goldHLinear)" stroke-width="1.2" opacity="0.45" />

  <!-- Minimalist Corner Notch Accents -->
  <path d="M 24 45 L 24 24 L 45 24" fill="none" stroke="#C5A059" stroke-width="2.5" />
  <path d="M {W-24} 45 L {W-24} 24 L {W-45} 24" fill="none" stroke="#C5A059" stroke-width="2.5" />
  <path d="M 24 {H-45} L 24 {H-24} L 45 {H-24}" fill="none" stroke="#C5A059" stroke-width="2.5" />
  <path d="M {W-24} {H-45} L {W-24} {H-24} L {W-45} {H-24}" fill="none" stroke="#C5A059" stroke-width="2.5" />

  <!-- TOP BRAND LOCKUP -->
  <g transform="translate(60, 60)">
    <g transform="translate(0, 0)">
      <!-- Geometric Luxury Monogram Box -->
      <rect x="0" y="0" width="46" height="46" rx="6" fill="#141B2D" stroke="url(#goldLinear)" stroke-width="1.5" />
      <text x="23" y="32" font-family="'Cinzel', serif" font-size="28" font-weight="700" fill="url(#goldLinear)" text-anchor="middle">P</text>
      
      <!-- Brand Name & Salzburg Crest -->
      <text x="62" y="26" font-family="'Cinzel', serif" font-size="24" font-weight="700" fill="#FFFFFF" letter-spacing="3.5">PETRANS</text>
      <text x="62" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="600" fill="#C5A059" letter-spacing="3" text-transform="uppercase">Taxi &amp; Tour Salzburg • Austria</text>
    </g>
  </g>

  <!-- WKO License Ribbon (Top Right) -->
  <g transform="translate({W - 250}, 66)">
    <rect width="190" height="26" rx="13" fill="#162032" stroke="rgba(197, 160, 89, 0.4)" stroke-width="1" />
    <circle cx="15" cy="13" r="4" fill="#10B981" />
    <text x="28" y="17" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="700" fill="#E2E8F0" letter-spacing="1">WKO LICENSED CHAUFFEUR</text>
  </g>

  <!-- Center Vehicle Showcase (Mercedes-Benz V-Class) -->
  <!-- Ground Shadow -->
  <ellipse cx="640" cy="460" rx="270" ry="20" fill="#000000" opacity="0.9" filter="url(#shadowFilter)" />
  <!-- Vehicle Render -->
  <g transform="translate(365, 170)">
    <image xlink:href="data:image/png;base64,{vclass_b64}" width="575" height="355" />
  </g>

  <!-- EXECUTIVE PROFILE & CREDENTIALS (Left) -->
  <g transform="translate(60, 180)">
    <text x="0" y="40" font-family="'Outfit', sans-serif" font-size="38" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">Omer Farooq</text>
    <text x="0" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="14.5" font-weight="600" fill="#C5A059" letter-spacing="2.5" text-transform="uppercase">CEO &amp; Lead Chauffeur</text>
    
    <!-- Accent Line -->
    <line x1="0" y1="88" x2="180" y2="88" stroke="url(#goldHLinear)" stroke-width="2" />

    <!-- Service Bullet Highlights -->
    <g transform="translate(0, 122)" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8">
      <text x="0" y="0">✦ Mercedes-Benz V-Class VIP Fleet</text>
      <text x="0" y="24">✦ Salzburg Airport (SZG) Transfers</text>
      <text x="0" y="48">✦ Hallstatt &amp; Alpine Private Day Tours</text>
    </g>
  </g>

  <!-- BOTTOM CONTACT STRIP (Structured Luxury Card Matrix) -->
  <g transform="translate(60, 520)">
    <!-- Container -->
    <rect width="{W - 120}" height="70" rx="10" fill="#111827" stroke="rgba(197, 160, 89, 0.3)" stroke-width="1" />
    
    <!-- Item 1: Phone -->
    <g transform="translate(30, 24)">
      <circle cx="12" cy="11" r="14" fill="#1F293D" stroke="#C5A059" stroke-width="1" />
      <text x="12" y="16" font-size="12" fill="#C5A059" text-anchor="middle">📞</text>
      <text x="36" y="8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#C5A059" letter-spacing="1" text-transform="uppercase">24/7 Dispatch</text>
      <text x="36" y="26" font-family="'Outfit', sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">+43 660 6416464</text>
    </g>

    <!-- Separator -->
    <line x1="280" y1="15" x2="280" y2="55" stroke="rgba(197, 160, 89, 0.25)" stroke-width="1" />

    <!-- Item 2: Email -->
    <g transform="translate(310, 24)">
      <circle cx="12" cy="11" r="14" fill="#1F293D" stroke="#C5A059" stroke-width="1" />
      <text x="12" y="16" font-size="13" fill="#C5A059" text-anchor="middle">✉</text>
      <text x="36" y="8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#C5A059" letter-spacing="1" text-transform="uppercase">Direct Inquiries</text>
      <text x="36" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#F1F5F9">farooqcheema64164@gmail.com</text>
    </g>

    <!-- Separator -->
    <line x1="600" y1="15" x2="600" y2="55" stroke="rgba(197, 160, 89, 0.25)" stroke-width="1" />

    <!-- Item 3: Web & Base -->
    <g transform="translate(630, 24)">
      <circle cx="12" cy="11" r="14" fill="#1F293D" stroke="#C5A059" stroke-width="1" />
      <text x="12" y="16" font-size="13" fill="#C5A059" text-anchor="middle">🌐</text>
      <text x="36" y="8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#C5A059" letter-spacing="1" text-transform="uppercase">Salzburg, Austria</text>
      <text x="36" y="26" font-family="'Outfit', sans-serif" font-size="15" font-weight="700" fill="#DFBF77">petrans-salzburg.at</text>
    </g>
  </g>
</svg>
'''

svg_back = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="85mm" height="55mm" viewBox="0 0 {W} {H}">
  <defs>
    <linearGradient id="goldLinearBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EEDAA2" />
      <stop offset="45%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#8F6E28" />
    </linearGradient>
    <linearGradient id="cardDarkBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1420" />
      <stop offset="50%" stop-color="#070A10" />
      <stop offset="100%" stop-color="#040608" />
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="48%">
      <stop offset="0%" stop-color="#C5A059" stop-opacity="0.16" />
      <stop offset="60%" stop-color="#C5A059" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#070A10" stop-opacity="0" />
    </radialGradient>
    <filter id="qrShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity="0.65" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="{W}" height="{H}" fill="url(#cardDarkBack)" />
  <circle cx="{W/2}" cy="{H/2}" r="380" fill="url(#centerGlow)" />

  <!-- Micro-Border Hairline -->
  <rect x="24" y="24" width="{W - 48}" height="{H - 48}" rx="8" fill="none" stroke="url(#goldLinearBack)" stroke-width="1.2" opacity="0.45" />

  <!-- Corner Accents -->
  <path d="M 24 45 L 24 24 L 45 24" fill="none" stroke="#C5A059" stroke-width="2.5" />
  <path d="M {W-24} 45 L {W-24} 24 L {W-45} 24" fill="none" stroke="#C5A059" stroke-width="2.5" />
  <path d="M 24 {H-45} L 24 {H-24} L 45 {H-24}" fill="none" stroke="#C5A059" stroke-width="2.5" />
  <path d="M {W-24} {H-45} L {W-24} {H-24} L {W-45} {H-24}" fill="none" stroke="#C5A059" stroke-width="2.5" />

  <!-- LEFT: CENTERPIECE BRAND MONOGRAM & CREST -->
  <g transform="translate(90, 110)">
    <!-- Elegant Gold Ring Monogram -->
    <circle cx="90" cy="90" r="75" fill="#141B2D" stroke="url(#goldLinearBack)" stroke-width="2" />
    <circle cx="90" cy="90" r="67" fill="none" stroke="rgba(197, 160, 89, 0.3)" stroke-width="1" stroke-dasharray="4 3" />
    <text x="90" y="112" font-family="'Cinzel', serif" font-size="64" font-weight="700" fill="url(#goldLinearBack)" text-anchor="middle">P</text>
    
    <!-- Title -->
    <text x="90" y="205" font-family="'Cinzel', serif" font-size="32" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">PETRANS</text>
    <text x="90" y="230" font-family="'Outfit', sans-serif" font-size="13" font-weight="700" fill="#C5A059" text-anchor="middle" letter-spacing="3" text-transform="uppercase">Taxi &amp; Tour Salzburg</text>
    <text x="90" y="255" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="500" fill="#94A3B8" text-anchor="middle" letter-spacing="1">Gewerbeberechtigung • WKO Salzburg</text>
  </g>

  <!-- VERTICAL DIVIDER -->
  <line x1="430" y1="90" x2="430" y2="{H - 90}" stroke="url(#goldLinearBack)" stroke-width="1" opacity="0.3" />

  <!-- RIGHT: DUAL LUXURY QR CODE CARDS & CONCIERGE -->
  <g transform="translate(480, 85)">
    <text x="0" y="20" font-family="'Outfit', sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" letter-spacing="1">Instant Chauffeur Concierge</text>
    <text x="0" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500" fill="#C5A059">Scan with your smartphone camera for live service:</text>

    <!-- QR 1: WhatsApp Direct Concierge -->
    <g transform="translate(0, 70)" filter="url(#qrShadow)">
      <rect width="180" height="235" rx="12" fill="#141B2D" stroke="rgba(197, 160, 89, 0.4)" stroke-width="1.2" />
      <!-- Gold Tab Header -->
      <rect width="180" height="38" rx="12" fill="url(#goldLinearBack)" />
      <rect y="22" width="180" height="16" fill="url(#goldLinearBack)" />
      <text x="90" y="24" font-family="'Outfit', sans-serif" font-size="14" font-weight="800" fill="#0B0F19" text-anchor="middle" letter-spacing="1">WHATSAPP CHAT</text>
      <!-- QR Image Frame -->
      <rect x="18" y="52" width="144" height="144" rx="8" fill="#FFFFFF" />
      <image xlink:href="data:image/png;base64,{qr_whatsapp_b64}" x="20" y="54" width="140" height="140" />
      <text x="90" y="218" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="600" fill="#CBD5E1" text-anchor="middle">+43 660 6416464</text>
    </g>

    <!-- QR 2: Fixed Fare Online Booking -->
    <g transform="translate(225, 70)" filter="url(#qrShadow)">
      <rect width="180" height="235" rx="12" fill="#141B2D" stroke="rgba(197, 160, 89, 0.4)" stroke-width="1.2" />
      <rect width="180" height="38" rx="12" fill="url(#goldLinearBack)" />
      <rect y="22" width="180" height="16" fill="url(#goldLinearBack)" />
      <text x="90" y="24" font-family="'Outfit', sans-serif" font-size="14" font-weight="800" fill="#0B0F19" text-anchor="middle" letter-spacing="1">ONLINE FARES</text>
      <rect x="18" y="52" width="144" height="144" rx="8" fill="#FFFFFF" />
      <image xlink:href="data:image/png;base64,{qr_booking_b64}" x="20" y="54" width="140" height="140" />
      <text x="90" y="218" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="600" fill="#CBD5E1" text-anchor="middle">petrans-salzburg.at</text>
    </g>

    <!-- Bottom Route Pills -->
    <g transform="translate(0, 335)" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#E2E8F0">
      <text x="0" y="20" font-weight="600" fill="#94A3B8">Destinations: <tspan fill="#DFBF77">Salzburg Airport • Hallstatt • Zell am See • Munich • Vienna</tspan></text>
    </g>
  </g>
</svg>
'''

# Write Design 2 SVG files
with open("card/petrans_card_design2_front.svg", "w") as f:
    f.write(svg_front)

with open("card/petrans_card_design2_back.svg", "w") as f:
    f.write(svg_back)

print("Design 2 SVGs written successfully!")

# Convert using vectorcraft-cli
targets = [
    ("card/petrans_card_design2_front.svg", "card/petrans_card_design2_front.vectorcraft"),
    ("card/petrans_card_design2_back.svg", "card/petrans_card_design2_back.vectorcraft"),
    ("card/petrans_card_design2_front.vectorcraft", "card/petrans_card_design2_front.pdf"),
    ("card/petrans_card_design2_back.vectorcraft", "card/petrans_card_design2_back.pdf"),
    ("card/petrans_card_design2_front.vectorcraft", "card/petrans_card_design2_front.png"),
    ("card/petrans_card_design2_back.vectorcraft", "card/petrans_card_design2_back.png"),
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

# Combined 2-Page PDF for Design 2
writer = pypdf.PdfWriter()
writer.append("card/petrans_card_design2_front.pdf")
writer.append("card/petrans_card_design2_back.pdf")
with open("card/petrans_card_design2_complete.pdf", "wb") as f:
    writer.write(f)

# Single Sheet A4 PDF for Design 2
c = canvas.Canvas('card/petrans_card_design2_single_sheet.pdf', pagesize=A4)
c.setTitle('PETRANS Visiting Card Design 2 (Executive Noir) — Print Sheet')
card_w = 85 * mm
card_h = 55 * mm
x = (210 * mm - card_w) / 2
y_front = 170 * mm
y_back = 90 * mm

c.setFont('Helvetica-Bold', 12)
c.drawString(x, y_front + card_h + 4 * mm, 'DESIGN 2 — FRONT SIDE (EXECUTIVE NOIR)')
c.drawImage('card/petrans_card_design2_front.png', x, y_front, width=card_w, height=card_h)

c.drawString(x, y_back + card_h + 4 * mm, 'DESIGN 2 — BACK SIDE (CONCIERGE & QR)')
c.drawImage('card/petrans_card_design2_back.png', x, y_back, width=card_w, height=card_h)

c.setStrokeColorRGB(0.7, 0.6, 0.4)
c.setLineWidth(0.5)
c.rect(x - 1*mm, y_front - 1*mm, card_w + 2*mm, card_h + 2*mm, stroke=1, fill=0)
c.rect(x - 1*mm, y_back - 1*mm, card_w + 2*mm, card_h + 2*mm, stroke=1, fill=0)

c.setFont('Helvetica', 9)
c.drawString(x, 40 * mm, 'PETRANS Taxi & Tour Salzburg • Executive Alpine Noir (Design 2) • Omer Farooq')
c.save()

# Copy all new files into website/public/card/ and design/
files_to_sync = [
    "petrans_card_design2_front.svg",
    "petrans_card_design2_back.svg",
    "petrans_card_design2_front.vectorcraft",
    "petrans_card_design2_back.vectorcraft",
    "petrans_card_design2_front.pdf",
    "petrans_card_design2_back.pdf",
    "petrans_card_design2_front.png",
    "petrans_card_design2_back.png",
    "petrans_card_design2_complete.pdf",
    "petrans_card_design2_single_sheet.pdf",
]

for fname in files_to_sync:
    shutil.copy(f"card/{fname}", f"website/public/card/{fname}")
    shutil.copy(f"card/{fname}", f"design/{fname}")

print("All Design 2 assets compiled and synchronized successfully!")
