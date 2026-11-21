/**
 * PETRANS Taxi & Tour Salzburg — Transactional Notification & Dispatch Engine
 * 
 * Handles automated dual-channel dispatch:
 * 1. Customer Confirmation Request Email (Branded HTML + Plaintext)
 * 2. Owner Operational Alert (WhatsApp Dispatch Manifest + Email)
 * 3. Outbox persistence in website/data/notifications.json
 */

const fs = require('fs');
const path = require('path');

const NOTIFICATIONS_FILE = path.join(__dirname, 'data', 'notifications.json');

// Ensure notifications store file exists
function loadOutbox() {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('[Notifications] Error reading outbox file, initializing empty store:', err.message);
  }
  return [];
}

function saveOutbox(outbox) {
  try {
    const dir = path.dirname(NOTIFICATIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(outbox.slice(0, 200), null, 2), 'utf8');
  } catch (err) {
    console.error('[Notifications] Failed to persist outbox:', err.message);
  }
}

/**
 * Generate luxury responsive HTML customer confirmation email
 */
function buildCustomerEmail(booking) {
  const isTour = booking.serviceType === 'TOUR';
  const routeText = isTour
    ? (booking.pricing?.appliedRules?.[0] || '8-Hour Private Day Tour')
    : `${booking.pickupAddress} → ${booking.dropoffAddress}`;

  const grossTotal = Number(booking.pricing?.grossTotal || 0).toFixed(2);
  const vatAmount = Number(booking.pricing?.vatAmount || 0).toFixed(2);
  const netTotal = Number(booking.pricing?.netTotal || 0).toFixed(2);

  const pickupDateFormatted = booking.pickupDateTime
    ? new Date(booking.pickupDateTime).toLocaleDateString('de-AT', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Scheduled Date';

  const pickupTimeFormatted = booking.pickupDateTime
    ? new Date(booking.pickupDateTime).toLocaleTimeString('de-AT', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : '14:30';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Request Received — PETRANS Salzburg</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0F19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F8FAFC;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0B0F19; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #161F30; border-radius: 16px; border: 1px solid rgba(197, 160, 89, 0.3); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0B0F19; padding: 28px 32px; border-bottom: 1px solid rgba(197, 160, 89, 0.25); text-align: center;">
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; color: #C5A059; text-transform: uppercase; font-family: Georgia, serif;">PETRANS</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1.5px; color: #94A3B8; text-transform: uppercase;">Taxi &amp; Tour Salzburg • Chauffeur Service</p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding: 24px 32px 8px 32px; text-align: center;">
              <span style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background-color: rgba(197, 160, 89, 0.15); border: 1px solid #C5A059; color: #C5A059; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                Booking Request Received — Pending Operator Confirmation
              </span>
              <p style="margin: 16px 0 0 0; font-size: 14px; color: #E2E8F0; line-height: 1.6;">
                Dear <strong>${escapeHtml(booking.customer?.fullName || 'Valued Guest')}</strong>,<br>
                Thank you for choosing PETRANS Salzburg. Your reservation request has been received and routed directly to our chief chauffeur, <strong>Omer Farooq</strong>.
              </p>
              <div style="margin-top: 12px; font-size: 13px; color: #94A3B8;">
                Booking Reference: <strong style="color: #F8FAFC; font-family: monospace; font-size: 15px;">${escapeHtml(booking.reference)}</strong>
              </div>
            </td>
          </tr>

          <!-- Reservation Summary Box -->
          <tr>
            <td style="padding: 16px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0B0F19; border-radius: 12px; border: 1px solid #334155; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 12px; border-bottom: 1px solid #1E293B;">
                    <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">Service / Route</div>
                    <div style="font-size: 15px; font-weight: 700; color: #F8FAFC; margin-top: 2px;">${escapeHtml(routeText)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1E293B;">
                    <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Date &amp; Time</div>
                    <div style="font-size: 14px; font-weight: 600; color: #F8FAFC; margin-top: 2px;">
                      ${escapeHtml(pickupDateFormatted)} at ${escapeHtml(pickupTimeFormatted)} CET
                      ${booking.flightNumber ? `<span style="color: #34D399; margin-left: 8px;">(Flight: ${escapeHtml(booking.flightNumber)})</span>` : ''}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1E293B;">
                    <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">Fleet &amp; Capacity</div>
                    <div style="font-size: 14px; font-weight: 600; color: #F8FAFC; margin-top: 2px;">
                      ${escapeHtml(booking.vehicleCategory?.replace('_', ' ') || 'Mercedes-Benz V-Class')} • 
                      ${booking.passengerCount} Passengers • ${booking.largeLuggageCount} Suitcases
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                      <div>
                        <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase;">Total Fixed Price (Incl. 20% VAT &amp; Tolls)</div>
                        <div style="font-size: 11px; color: #64748B;">Net: €${netTotal} + VAT (20%): €${vatAmount}</div>
                      </div>
                      <div style="font-size: 22px; font-weight: 700; color: #C5A059; font-family: monospace;">€${grossTotal}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Chauffeur Meeting Point & Flight Delay Policy -->
          <tr>
            <td style="padding: 8px 32px 16px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(197, 160, 89, 0.08); border-left: 3px solid #C5A059; padding: 14px 16px; border-radius: 4px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; color: #C5A059; text-transform: uppercase; letter-spacing: 0.5px;">Chauffeur Meet &amp; Greet Policy</div>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #CBD5E1; line-height: 1.5;">
                      ${booking.pickupAddress?.toLowerCase().includes('airport') || booking.flightNumber
                        ? '<strong>Salzburg Airport Arrival Hall:</strong> Your personal chauffeur will greet you inside the Arrival Hall holding a digital Name Board with your name. We monitor your flight live—<strong>60 minutes complimentary waiting time</strong> is included from actual touchdown.'
                        : '<strong>Direct Hotel / Address Pickup:</strong> Your chauffeur will meet you in the hotel lobby or at your doorstep at the confirmed time, with 10 minutes complimentary waiting included.'}
                    </p>
                    <p style="margin: 6px 0 0 0; font-size: 11px; color: #94A3B8;">
                      Free cancellation or schedule adjustment is permitted up to 24 hours prior to scheduled pickup.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Direct WhatsApp Action Button -->
          <tr>
            <td style="padding: 12px 32px 28px 32px; text-align: center;">
              <a href="https://wa.me/436606416464?text=${encodeURIComponent(`Hello Omer, I received confirmation for booking request ${booking.reference}. Could you please confirm dispatch?`)}"
                 style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                Chat Directly with Chauffeur Omer on WhatsApp
              </a>
              <div style="margin-top: 10px; font-size: 12px; color: #94A3B8;">
                Phone Dispatch: <a href="tel:+436606416464" style="color: #C5A059; text-decoration: none;">+43 660 6416464</a> • Available 24/7
              </div>
            </td>
          </tr>

          <!-- Sub-Footer Legal -->
          <tr>
            <td style="background-color: #0B0F19; padding: 20px 32px; border-top: 1px solid #1E293B; text-align: center; font-size: 11px; color: #64748B; line-height: 1.5;">
              PETRANS Taxi &amp; Tour Salzburg e.U. • Official Austrian Licensed Chauffeur &amp; Passenger Transport.<br>
              In full compliance with Austrian FAGG § 8. Mercedes-Benz, V-Class, and Vito are registered trademarks of Mercedes-Benz Group AG.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `PETRANS Taxi & Tour Salzburg
Booking Request Received [Reference: ${booking.reference}]
Status: PENDING OPERATOR CONFIRMATION

Dear ${booking.customer?.fullName || 'Valued Guest'},

Thank you for choosing PETRANS Salzburg. Your booking request has been received and routed directly to our chief chauffeur, Omer Farooq.

RESERVATION DETAILS:
• Service / Route: ${routeText}
• Date & Time: ${pickupDateFormatted} at ${pickupTimeFormatted} CET ${booking.flightNumber ? `(Flight: ${booking.flightNumber})` : ''}
• Vehicle: ${booking.vehicleCategory}
• Passengers: ${booking.passengerCount} | Large Bags: ${booking.largeLuggageCount}
• Total Fare: €${grossTotal} (Includes 20% Austrian VAT, Vignette & Tolls)
• Payment: ${booking.paymentMethod} (Pay upon chauffeur approval)

MEET & GREET:
${booking.pickupAddress?.toLowerCase().includes('airport') || booking.flightNumber
  ? 'Salzburg Airport Arrival Hall with digital Name Board. 60 minutes free flight delay buffer included from verified touchdown.'
  : 'Your driver will meet you directly at the pickup address with 10 minutes free waiting.'}

Free cancellation up to 24 hours prior to scheduled pickup time.

Direct Chauffeur WhatsApp: https://wa.me/436606416464
Phone Hotline: +43 660 6416464
`;

  return { html, text };
}

/**
 * Generate formatted WhatsApp alert and email manifest for Omer Farooq
 */
function buildOwnerAlert(booking) {
  const isTour = booking.serviceType === 'TOUR';
  const routeText = isTour
    ? (booking.pricing?.appliedRules?.[0] || '8-Hour Private Day Tour')
    : `${booking.pickupAddress} → ${booking.dropoffAddress}`;

  const cleanCustPhone = (booking.customer?.phoneNumber || '').replace(/[^0-9]/g, '');
  const grossTotal = Number(booking.pricing?.grossTotal || 0).toFixed(2);

  const whatsAppText = 
`🚗 *NEW BOOKING REQUEST — PETRANS SALZBURG*
*Reference:* ${booking.reference}
*Status:* PENDING YOUR CONFIRMATION

👤 *Guest:* ${booking.customer?.fullName || 'Guest'}
📞 *Phone:* ${booking.customer?.phoneNumber || 'N/A'}
📧 *Email:* ${booking.customer?.email || 'N/A'}

📍 *Route:* ${routeText}
📅 *Date/Time:* ${booking.pickupDateTime}
✈️ *Flight:* ${booking.flightNumber || 'None'}
🚘 *Vehicle:* ${booking.vehicleCategory}
👥 *Pax/Bags:* ${booking.passengerCount} Pax • ${booking.largeLuggageCount} Bags
👶 *Seats/Ski:* Child: ${booking.childSeatsCount || 0} | Ski: ${booking.skiEquipmentCount || 0}
💶 *Total Fare:* €${grossTotal} (Gross, 20% VAT incl.)
💳 *Payment:* ${booking.paymentMethod}

⚡ *Quick Driver Actions:*
1. Call Customer: tel:${booking.customer?.phoneNumber}
2. WhatsApp Customer: https://wa.me/${cleanCustPhone}
3. Confirm in Dispatch: http://localhost:3000/api/bookings`;

  return {
    recipientPhone: '+436606416464',
    recipientEmail: 'farooqcheema64164@gmail.com',
    whatsAppText,
    subject: `🚨 New Booking Request ${booking.reference}: ${routeText} [€${grossTotal}]`
  };
}

/**
 * Dispatch or queue notifications for a newly created booking
 */
async function dispatchBookingNotifications(booking) {
  const customerEmail = buildCustomerEmail(booking);
  const ownerAlert = buildOwnerAlert(booking);

  const notificationRecord = {
    id: `notif_${Date.now()}_${booking.reference}`,
    bookingReference: booking.reference,
    timestamp: new Date().toISOString(),
    status: 'DISPATCHED_TO_QUEUE',
    channels: {
      customerEmail: {
        to: booking.customer?.email,
        subject: `Booking Request Received: ${booking.reference} [Pending Confirmation] — PETRANS Salzburg`,
        dispatched: true,
        previewText: customerEmail.text.substring(0, 250)
      },
      ownerAlert: {
        toPhone: ownerAlert.recipientPhone,
        toEmail: ownerAlert.recipientEmail,
        subject: ownerAlert.subject,
        whatsAppManifest: ownerAlert.whatsAppText,
        dispatched: true
      }
    }
  };

  // If RESEND_API_KEY is configured in environment, dispatch live email
  if (process.env.RESEND_API_KEY && booking.customer?.email) {
    try {
      // Lazy load fetch for Resend REST API
      const resendResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'PETRANS Salzburg <bookings@petrans-salzburg.at>',
          to: [booking.customer.email],
          subject: `Booking Request Received: ${booking.reference} — PETRANS Salzburg`,
          html: customerEmail.html,
          text: customerEmail.text
        })
      });
      const resendData = await resendResp.json();
      notificationRecord.channels.customerEmail.resendId = resendData.id;
      console.log(`[Notifications] Live email dispatched via Resend: ${resendData.id}`);
    } catch (err) {
      console.warn(`[Notifications] Resend live dispatch error:`, err.message);
      notificationRecord.channels.customerEmail.error = err.message;
    }
  }

  // Persist to notifications outbox store
  const outbox = loadOutbox();
  outbox.unshift(notificationRecord);
  saveOutbox(outbox);

  console.log(`[Notifications] Successfully generated and stored notification dispatch record for ${booking.reference}`);
  return notificationRecord;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  buildCustomerEmail,
  buildOwnerAlert,
  dispatchBookingNotifications,
  loadOutbox
};
