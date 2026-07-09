const { onRequest } = require('firebase-functions/v2/https');
const admin         = require('firebase-admin');
const { Resend }    = require('resend');

admin.initializeApp();

function buildEmailHtml(link) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Your Taronga Tracka sign-in link</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#0A2F1F;padding:24px 32px;">
        <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">Taronga Tracka</p>
        <p style="margin:4px 0 0;color:#a8c8b0;font-size:13px;">Taronga Zoo Sydney</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;color:#222222;">
        <h2 style="margin:0 0 16px;font-size:22px;color:#0A2F1F;">Sign in to your account</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
          You requested a sign-in link for Taronga Tracka. Click the button below to access your teacher dashboard. This link will expire in 1 hour.
        </p>
        <p style="margin:0 0 24px;">
          <a href="${link}" style="display:inline-block;padding:12px 28px;background:#1B6B3A;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;border-radius:6px;">Sign in to Taronga Tracka</a>
        </p>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.6;">
          If the button does not work, copy and paste this link into your browser:
        </p>
        <p style="margin:0 0 24px;font-size:13px;word-break:break-all;">
          <a href="${link}" style="color:#1B6B3A;">${link}</a>
        </p>
        <hr style="border:none;border-top:1px solid #dddddd;margin:0 0 24px;">
        <p style="margin:0;font-size:13px;color:#666666;">
          If you did not request this email, you can safely ignore it. No action is needed on your part.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

exports.sendMagicLink = onRequest(
  { region: 'australia-southeast1', invoker: 'public' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { email, redirectUrl } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const actionCodeSettings = {
      url: redirectUrl || 'https://ctr2560-prog.github.io/TarongaTrackaV2/',
      handleCodeInApp: true,
    };

    // Generate the sign-in link server-side via Admin SDK
    let link;
    try {
      link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);
    } catch (err) {
      console.error('generateSignInWithEmailLink error:', err);
      res.status(500).json({ error: 'Failed to generate sign-in link.' });
      return;
    }

    // Send branded email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: 'Taronga Tracka <noreply@tarongatracka.com.au>',
        to: email,
        subject: 'Your Taronga Tracka sign-in link',
        html: buildEmailHtml(link),
      });
    } catch (err) {
      console.error('Email send error:', err);
      res.status(500).json({ error: 'Failed to send email. Please try again.' });
      return;
    }

    res.json({ success: true });
  }
);

// ── Device booking notification ───────────────────────────────────────────────
const { onDocumentCreated } = require('firebase-functions/v2/firestore');

const BOOKING_NOTIFY_EMAIL = 'ctr2560@gmail.com';

exports.onDeviceBookingCreated = onDocumentCreated(
  { document: 'deviceBookings/{bookingId}', region: 'australia-southeast1' },
  async (event) => {
    const b = event.data?.data();
    if (!b) return;

    const dateStr = b.date || 'unknown date';
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: 'Taronga Tracka <noreply@tarongatracka.com.au>',
        to: BOOKING_NOTIFY_EMAIL,
        subject: `Device booking: ${b.schoolName || 'Unknown school'} · ${dateStr}`,
        html: `<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#0A2F1F;padding:24px 32px;">
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">Taronga Tracka</p>
      <p style="margin:4px 0 0;color:#a8c8b0;font-size:13px;">New device booking</p>
    </td></tr>
    <tr><td style="padding:32px;color:#222222;">
      <h2 style="margin:0 0 16px;font-size:20px;color:#0A2F1F;">${b.schoolName || 'Unknown school'} booked Tracka devices</h2>
      <table cellpadding="6" cellspacing="0" style="font-size:14px;line-height:1.5;">
        <tr><td style="color:#666;">Date</td><td><strong>${dateStr}</strong></td></tr>
        <tr><td style="color:#666;">Devices</td><td><strong>${b.devices || '?'}</strong> of 20</td></tr>
        <tr><td style="color:#666;">Teacher</td><td>${b.teacherEmail || 'unknown'}</td></tr>
        ${b.note ? `<tr><td style="color:#666;">Note</td><td>${String(b.note).slice(0, 500)}</td></tr>` : ''}
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#666;">Manage bookings in the staff portal under Device Bookings.</p>
    </td></tr>
  </table>
</body></html>`,
      });
    } catch (err) {
      console.error('Booking notification email failed:', err);
    }
  }
);
