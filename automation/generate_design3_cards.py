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
vclass_b64 = get_base64_image("website/public/images/mercedes-v-class.png", flip_horizontal=False, max_size=(620, 385))
qr_booking_b64 = get_qr_base64("https://petrans-salzburg.at/booking.html", fill_color="#0B0F19", back_color="#FFFFFF")
qr_whatsapp_b64 = get_qr_base64("https://wa.me/436606416464", fill_color="#0B0F19", back_color="#FFFFFF")

W, H = 1004, 650

# --- CONCEPT 3: ALPINE PLATINUM & CHAMPAGNE (Trending Swiss Architectural Minimalist) ---

svg_front = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="85mm" height="55mm" viewBox="0 0 {W} {H}">
  <defs>
    <linearGradient id="platBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9A7B38" />
      <stop offset="50%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#846522" />
    </linearGradient>
    <linearGradient id="goldBar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#DFBF77" />
      <stop offset="50%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#9A7B38" />
    </linearGradient>
    <filter id="lightShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </defs>

  <!-- Clean Platinum White Base -->
  <rect width="{W}" height="{H}" fill="url(#platBg)" />

  <!-- Vertical Champagne Gold Architectural Pillar Accent on Left Edge -->
  <rect x="0" y="0" width="10" height="{H}" fill="url(#goldBar)" />

  <!-- Delicate Hairline Border -->
  <rect x="22" y="22" width="{W - 44}" height="{H - 44}" fill="none" stroke="#E2E8F0" stroke-width="1.2" />

  <!-- TOP HEADER ROW -->
  <g transform="translate(55, 60)">
    <!-- Crest & Brand -->
    <g transform="translate(0, 0)">
      <circle cx="20" cy="20" r="18" fill="#F8FAFC" stroke="#C5A059" stroke-width="1.5" />
      <text x="20" y="27" font-family="'Cinzel', serif" font-size="20" font-weight="700" fill="#9A7B38" text-anchor="middle">P</text>
      
      <text x="50" y="22" font-family="'Cinzel', serif" font-size="26" font-weight="800" fill="#0F172A" letter-spacing="3.5">PETRANS</text>
      <text x="50" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="700" fill="#C5A059" letter-spacing="3" text-transform="uppercase">Taxi &amp; Tour Salzburg • Chauffeur Service</text>
    </g>

    <!-- Accreditation Badge (Right) -->
    <g transform="translate({W - 350}, 2)">
      <rect width="185" height="26" rx="6" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1" />
      <circle cx="14" cy="13" r="3.5" fill="#10B981" />
      <text x="26" y="17" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#475569" letter-spacing="1">WKO SALZBURG CERTIFIED</text>
    </g>
  </g>

  <!-- LEFT EXECUTIVE TYPOGRAPHY -->
  <g transform="translate(55, 180)">
    <text x="0" y="40" font-family="'Outfit', sans-serif" font-size="40" font-weight="800" fill="#0F172A" letter-spacing="-0.5">Omer Farooq</text>
    <text x="0" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#9A7B38" letter-spacing="2" text-transform="uppercase">CEO &amp; Lead Chauffeur</text>
    
    <line x1="0" y1="88" x2="220" y2="88" stroke="#C5A059" stroke-width="2" />

    <!-- Features -->
    <g transform="translate(0, 120)" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#64748B">
      <text x="0" y="0">✓ Premium Mercedes-Benz V-Class (8-Pax)</text>
      <text x="0" y="24">✓ Salzburg &amp; Munich Airport Transfers</text>
      <text x="0" y="48">✓ Private Alpine Tours (Hallstatt • Zell am See)</text>
    </g>
  </g>

  <!-- CAR SHOWCASE (Right Side, Clean Floor Shadow) -->
  <ellipse cx="680" cy="485" rx="260" ry="18" fill="#94A3B8" opacity="0.45" filter="url(#lightShadow)" />
  <g transform="translate(415, 200)">
    <image xlink:href="data:image/png;base64,{vclass_b64}" width="545" height="338" />
  </g>

  <!-- BOTTOM CONTACT BAR -->
  <g transform="translate(55, 530)">
    <rect width="{W - 110}" height="64" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2" />

    <!-- Phone -->
    <g transform="translate(30, 22)">
      <circle cx="10" cy="10" r="13" fill="#0F172A" />
      <text x="10" y="14" font-size="11" fill="#DFBF77" text-anchor="middle">📞</text>
      <text x="32" y="8" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#64748B" letter-spacing="1" text-transform="uppercase">24/7 Phone &amp; WhatsApp</text>
      <text x="32" y="24" font-family="'Outfit', sans-serif" font-size="17" font-weight="800" fill="#0F172A">+43 660 6416464</text>
    </g>

    <line x1="300" y1="12" x2="300" y2="52" stroke="#E2E8F0" stroke-width="1" />

    <!-- Email -->
    <g transform="translate(330, 22)">
      <circle cx="10" cy="10" r="13" fill="#0F172A" />
      <text x="10" y="15" font-size="12" fill="#DFBF77" text-anchor="middle">✉</text>
      <text x="32" y="8" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#64748B" letter-spacing="1" text-transform="uppercase">Email Contact</text>
      <text x="32" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="600" fill="#1E293B">farooqcheema64164@gmail.com</text>
    </g>

    <line x1="640" y1="12" x2="640" y2="52" stroke="#E2E8F0" stroke-width="1" />

    <!-- Web -->
    <g transform="translate(670, 22)">
      <circle cx="10" cy="10" r="13" fill="#0F172A" />
      <text x="10" y="14" font-size="11" fill="#DFBF77" text-anchor="middle">🌐</text>
      <text x="32" y="8" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="#64748B" letter-spacing="1" text-transform="uppercase">Online Booking Portal</text>
      <text x="32" y="24" font-family="'Outfit', sans-serif" font-size="16" font-weight="700" fill="#9A7B38">petrans-salzburg.at</text>
    </g>
  </g>
</svg>
'''

svg_back = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="85mm" height="55mm" viewBox="0 0 {W} {H}">
  <defs>
    <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="60%" stop-color="#0B0F19" />
      <stop offset="100%" stop-color="#020408" />
    </linearGradient>
    <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#DFBF77" />
      <stop offset="50%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#9A7B38" />
    </linearGradient>
    <filter id="softCardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Deep Midnight Slate Base -->
  <rect width="{W}" height="{H}" fill="url(#backGrad)" />

  <!-- Vertical Left Gold Bar -->
  <rect x="0" y="0" width="10" height="{H}" fill="url(#goldAccent)" />

  <!-- Delicate Hairline Border -->
  <rect x="22" y="22" width="{W - 44}" height="{H - 44}" fill="none" stroke="rgba(197, 160, 89, 0.3)" stroke-width="1.2" />

  <!-- LEFT: BIG TYPOGRAPHIC MONOGRAM & STATEMENT -->
  <g transform="translate(65, 80)">
    <!-- Watermark Brand Name in background -->
    <text x="0" y="230" font-family="'Cinzel', serif" font-size="110" font-weight="900" fill="#1E293B" opacity="0.3" letter-spacing="8">PETRANS</text>

    <!-- Forefront Typography -->
    <g transform="translate(0, 30)">
      <text x="0" y="30" font-family="'Cinzel', serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="4">PETRANS</text>
      <text x="0" y="60" font-family="'Outfit', sans-serif" font-size="14" font-weight="700" fill="#DFBF77" letter-spacing="3" text-transform="uppercase">Taxi &amp; Tour Salzburg</text>
      <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="500" fill="#94A3B8">Private Chauffeur Transfers &amp; Alpine Day Trips</text>
    </g>

    <!-- Route Matrix -->
    <g transform="translate(0, 165)" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#E2E8F0">
      <g transform="translate(0, 0)">
        <rect width="180" height="28" rx="6" fill="#1E293B" stroke="rgba(197, 160, 89, 0.3)" stroke-width="1" />
        <text x="90" y="18" text-anchor="middle" font-weight="600" fill="#DFBF77">✈ Salzburg Airport SZG</text>
      </g>
      <g transform="translate(195, 0)">
        <rect width="180" height="28" rx="6" fill="#1E293B" stroke="rgba(197, 160, 89, 0.3)" stroke-width="1" />
        <text x="90" y="18" text-anchor="middle" font-weight="600" fill="#DFBF77">🏔 Hallstatt Day Tour</text>
      </g>
      <g transform="translate(0, 38)">
        <rect width="180" height="28" rx="6" fill="#1E293B" stroke="rgba(197, 160, 89, 0.3)" stroke-width="1" />
        <text x="90" y="18" text-anchor="middle" font-weight="600" fill="#DFBF77">❄ Zell am See Ski Shuttles</text>
      </g>
      <g transform="translate(195, 38)">
        <rect width="180" height="28" rx="6" fill="#1E293B" stroke="rgba(197, 160, 89, 0.3)" stroke-width="1" />
        <text x="90" y="18" text-anchor="middle" font-weight="600" fill="#DFBF77">🚗 Munich &amp; Vienna VIP</text>
      </g>
    </g>

    <!-- Legal & Founder Note -->
    <g transform="translate(0, 390)" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" fill="#64748B">
      <text x="0" y="0">Gewerbeberechtigung für das Mietwagen- &amp; Personentransportgewerbe</text>
      <text x="0" y="18">WKO Salzburg • Registered Carrier Austria</text>
    </g>
  </g>

  <!-- RIGHT: FLOATING WHITE DUAL QR CONCIERGE DOCK -->
  <g transform="translate(580, 70)" filter="url(#softCardShadow)">
    <rect width="360" height="470" rx="16" fill="#FFFFFF" />

    <!-- Card Header -->
    <rect width="360" height="55" rx="16" fill="#F8FAFC" />
    <rect y="35" width="360" height="20" fill="#F8FAFC" />
    <line x1="0" y1="55" x2="360" y2="55" stroke="#E2E8F0" stroke-width="1" />

    <text x="180" y="34" font-family="'Cinzel', serif" font-size="17" font-weight="800" fill="#0F172A" text-anchor="middle" letter-spacing="2">SMART CONCIERGE</text>

    <!-- Subtitle -->
    <text x="180" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#64748B" text-anchor="middle">Scan directly with camera for instant dispatch:</text>

    <!-- QR 1: WhatsApp -->
    <g transform="translate(30, 110)">
      <rect width="140" height="210" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <rect width="140" height="32" rx="10" fill="#059669" />
      <rect y="18" width="140" height="14" fill="#059669" />
      <text x="70" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">WhatsApp</text>
      <image xlink:href="data:image/png;base64,{qr_whatsapp_b64}" x="10" y="42" width="120" height="120" />
      <text x="70" y="185" font-family="'Outfit', sans-serif" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">Direct Chat</text>
      <text x="70" y="200" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="#64748B" text-anchor="middle">+43 660 6416464</text>
    </g>

    <!-- QR 2: Web Booking -->
    <g transform="translate(190, 110)">
      <rect width="140" height="210" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <rect width="140" height="32" rx="10" fill="#C5A059" />
      <rect y="18" width="140" height="14" fill="#C5A059" />
      <text x="70" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#0B0F19" text-anchor="middle">Online Fare</text>
      <image xlink:href="data:image/png;base64,{qr_booking_b64}" x="10" y="42" width="120" height="120" />
      <text x="70" y="185" font-family="'Outfit', sans-serif" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">Fixed Price</text>
      <text x="70" y="200" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="#64748B" text-anchor="middle">petrans-salzburg.at</text>
    </g>

    <!-- Bottom Helpline -->
    <g transform="translate(180, 375)">
      <text x="0" y="0" font-family="'Outfit', sans-serif" font-size="18" font-weight="800" fill="#0F172A" text-anchor="middle">+43 660 6416464</text>
      <text x="0" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="600" fill="#C5A059" text-anchor="middle">24/7 Priority Chauffeur Hotline</text>
    </g>
  </g>
</svg>
'''

# Write Design 3 SVGs
with open("card/petrans_card_design3_front.svg", "w") as f:
    f.write(svg_front)

with open("card/petrans_card_design3_back.svg", "w") as f:
    f.write(svg_back)

print("Design 3 SVGs written successfully!")

# Convert using vectorcraft-cli
targets = [
    ("card/petrans_card_design3_front.svg", "card/petrans_card_design3_front.vectorcraft"),
    ("card/petrans_card_design3_back.svg", "card/petrans_card_design3_back.vectorcraft"),
    ("card/petrans_card_design3_front.vectorcraft", "card/petrans_card_design3_front.pdf"),
    ("card/petrans_card_design3_back.vectorcraft", "card/petrans_card_design3_back.pdf"),
    ("card/petrans_card_design3_front.vectorcraft", "card/petrans_card_design3_front.png"),
    ("card/petrans_card_design3_back.vectorcraft", "card/petrans_card_design3_back.png"),
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

# Combined 2-Page PDF for Design 3
writer = pypdf.PdfWriter()
writer.append("card/petrans_card_design3_front.pdf")
writer.append("card/petrans_card_design3_back.pdf")
with open("card/petrans_card_design3_complete.pdf", "wb") as f:
    writer.write(f)

# Single Sheet A4 PDF for Design 3
c = canvas.Canvas('card/petrans_card_design3_single_sheet.pdf', pagesize=A4)
c.setTitle('PETRANS Visiting Card Design 3 (Alpine Platinum) — Print Sheet')
card_w = 85 * mm
card_h = 55 * mm
x = (210 * mm - card_w) / 2
y_front = 170 * mm
y_back = 90 * mm

c.setFont('Helvetica-Bold', 12)
c.drawString(x, y_front + card_h + 4 * mm, 'DESIGN 3 — FRONT SIDE (ALPINE PLATINUM)')
c.drawImage('card/petrans_card_design3_front.png', x, y_front, width=card_w, height=card_h)

c.drawString(x, y_back + card_h + 4 * mm, 'DESIGN 3 — BACK SIDE (SMART CONCIERGE DOCK)')
c.drawImage('card/petrans_card_design3_back.png', x, y_back, width=card_w, height=card_h)

c.setStrokeColorRGB(0.7, 0.6, 0.4)
c.setLineWidth(0.5)
c.rect(x - 1*mm, y_front - 1*mm, card_w + 2*mm, card_h + 2*mm, stroke=1, fill=0)
c.rect(x - 1*mm, y_back - 1*mm, card_w + 2*mm, card_h + 2*mm, stroke=1, fill=0)

c.setFont('Helvetica', 9)
c.drawString(x, 40 * mm, 'PETRANS Taxi & Tour Salzburg • Alpine Platinum Minimalist (Design 3) • Omer Farooq')
c.save()

# Copy all new files into website/public/card/ and design/
files_to_sync = [
    "petrans_card_design3_front.svg",
    "petrans_card_design3_back.svg",
    "petrans_card_design3_front.vectorcraft",
    "petrans_card_design3_back.vectorcraft",
    "petrans_card_design3_front.pdf",
    "petrans_card_design3_back.pdf",
    "petrans_card_design3_front.png",
    "petrans_card_design3_back.png",
    "petrans_card_design3_complete.pdf",
    "petrans_card_design3_single_sheet.pdf",
]

for fname in files_to_sync:
    shutil.copy(f"card/{fname}", f"website/public/card/{fname}")
    shutil.copy(f"card/{fname}", f"design/{fname}")

print("All Design 3 assets compiled and synchronized successfully!")
