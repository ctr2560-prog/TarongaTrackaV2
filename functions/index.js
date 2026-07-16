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

function buildBookingEmailHtml(b) {
  const dateStr   = b.date || 'Unknown date';
  const school    = b.schoolName || 'Unknown school';
  const devices   = b.devices || '?';
  const teacher   = b.teacherEmail || 'Unknown';
  const note      = b.note ? String(b.note).slice(0, 500) : null;
  const isZooSnooz   = (b.sessionType || '').toLowerCase().includes('zoosnooz');
  const sessionLabel = isZooSnooz ? 'ZOOSNOOZ NIGHT SESSION' : 'STANDARD SESSION';
  const accentLight  = isZooSnooz ? '#2E2E4A' : '#2E7D55';
  const icon         = isZooSnooz ? '🌙' : '📱';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Device Booking — ${school}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#EDEAE3;font-family:'DM Sans',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EDEAE3;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 24px 80px rgba(7,30,20,0.16);">

        <!-- Header -->
        <tr><td style="background:#071E14;padding:40px 44px 0;position:relative;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:top;">
                <img src="https://tarongatracka.web.app/images/logo.png" alt="Taronga" height="56" style="display:block;height:56px;width:auto;" />
              </td>
              <td align="right" style="vertical-align:top;padding-top:4px;">
                <span style="display:inline-block;background:${accentLight};color:#ffffff;font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:6px 16px;border-radius:40px;">${icon} ${sessionLabel}</span>
                <br>
                <span style="display:block;font-size:10px;color:#A8C4B2;letter-spacing:0.06em;margin-top:8px;text-align:right;">Device Booking Notification</span>
              </td>
            </tr>
          </table>
          <h1 style="font-family:'DM Sans',Arial,sans-serif;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:0.01em;line-height:1.15;margin:28px 0 0;">${school}</h1>
          <p style="font-size:13px;color:#A8C4B2;margin:8px 0 0;letter-spacing:0.03em;">has booked Taronga Tracka devices</p>
          <!-- Meta bar -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;padding:14px 0;border-top:1px solid rgba(168,196,178,0.2);">
            <tr>
              <td style="font-size:10px;color:#A8C4B2;letter-spacing:0.05em;padding-right:24px;">
                <span style="display:inline-block;width:4px;height:4px;border-radius:50%;background:${accentLight};vertical-align:middle;margin-right:6px;"></span>
                ${dateStr}
              </td>
              <td style="font-size:10px;color:#A8C4B2;letter-spacing:0.05em;padding-right:24px;">
                <span style="display:inline-block;width:4px;height:4px;border-radius:50%;background:${accentLight};vertical-align:middle;margin-right:6px;"></span>
                ${devices} of 20 devices
              </td>
              <td style="font-size:10px;color:#A8C4B2;letter-spacing:0.05em;">
                <span style="display:inline-block;width:4px;height:4px;border-radius:50%;background:${accentLight};vertical-align:middle;margin-right:6px;"></span>
                Taronga Sydney
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 44px;">

          <!-- Booking detail rows -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4EF;border-radius:14px;overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="padding:14px 20px;border-bottom:1px solid #ECE7DD;">
                <span style="font-size:10px;font-weight:700;color:#6B6B62;letter-spacing:0.08em;text-transform:uppercase;">Date</span>
                <span style="float:right;font-size:14px;font-weight:700;color:#1A1A17;">${dateStr}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;border-bottom:1px solid #ECE7DD;">
                <span style="font-size:10px;font-weight:700;color:#6B6B62;letter-spacing:0.08em;text-transform:uppercase;">Devices Requested</span>
                <span style="float:right;font-size:14px;font-weight:700;color:#1A1A17;">${devices} <span style="font-weight:400;color:#6B6B62;font-size:12px;">of 20 available</span></span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;border-bottom:1px solid #ECE7DD;">
                <span style="font-size:10px;font-weight:700;color:#6B6B62;letter-spacing:0.08em;text-transform:uppercase;">Session Type</span>
                <span style="float:right;font-size:14px;font-weight:700;color:#1A1A17;">${isZooSnooz ? '🌙 ZooSnooz Night' : '☀️ Standard Excursion'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;${note ? 'border-bottom:1px solid #ECE7DD;' : ''}">
                <span style="font-size:10px;font-weight:700;color:#6B6B62;letter-spacing:0.08em;text-transform:uppercase;">Teacher</span>
                <span style="float:right;font-size:13px;color:#1A1A17;">${teacher}</span>
              </td>
            </tr>
            ${note ? `<tr>
              <td style="padding:14px 20px;">
                <span style="display:block;font-size:10px;font-weight:700;color:#6B6B62;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">Note</span>
                <span style="font-size:13px;color:#3D3D38;line-height:1.6;">${note}</span>
              </td>
            </tr>` : ''}
          </table>

          <!-- CTA -->
          <p style="margin:0 0 20px;font-size:13px;color:#6B6B62;line-height:1.65;">Manage this booking from the staff portal under the <strong style="color:#1A1A17;">Bookings</strong> tab.</p>
          <a href="https://tarongatracka.web.app/adminDashboard" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#1A5238,#071E14);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.04em;">Open Staff Portal →</a>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F7F4EF;border-top:1px solid #ECE7DD;padding:20px 44px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:11px;color:#1A5238;font-weight:700;letter-spacing:0.06em;">TARONGA TRACKA</td>
              <td align="right" style="font-size:10px;color:#A8C4B2;letter-spacing:0.04em;">For the Wild</td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

exports.onDeviceBookingCreated = onDocumentCreated(
  { document: 'deviceBookings/{bookingId}', region: 'australia-southeast1' },
  async (event) => {
    const b = event.data?.data();
    if (!b) return;

    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: 'Taronga Tracka <noreply@tarongatracka.com.au>',
        to: BOOKING_NOTIFY_EMAIL,
        subject: `📱 Device booking: ${b.schoolName || 'Unknown school'} · ${b.date || 'unknown date'}`,
        html: buildBookingEmailHtml(b),
      });
    } catch (err) {
      console.error('Booking notification email failed:', err);
    }
  }
);

// ── Weekly mentor report email ────────────────────────────────────────────────
const MENTOR_REPORT_EMAIL = 'cameron.rodgers3@det.nsw.edu.au';
const MENTOR_REPORT_CC = 'pmaguire@zoo.nsw.gov.au';

function buildMentorReportHtml(reportText) {
  const safe = reportText
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const body = safe.split('\n').map(line => {
    const l = line.trim();
    if (!l) return '';
    if (l.startsWith('- ')) {
      return `<tr><td style="padding:2px 0 2px 8px;font-size:14px;line-height:1.6;color:#222222;">&bull;&nbsp; ${l.slice(2)}</td></tr>`;
    }
    return `<tr><td style="padding:14px 0 4px;font-size:15px;font-weight:bold;color:#0A2F1F;">${l}</td></tr>`;
  }).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Taronga Tracka weekly update</title></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#0A2F1F;padding:24px 32px;">
        <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">Taronga Tracka</p>
        <p style="margin:4px 0 0;color:#a8c8b0;font-size:13px;">Weekly progress update</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <table cellpadding="0" cellspacing="0">${body}</table>
        <hr style="border:none;border-top:1px solid #dddddd;margin:24px 0 12px;">
        <p style="margin:0;font-size:12px;color:#666666;">Automated weekly summary generated from the Taronga Tracka project history.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

exports.sendMentorReport = onRequest(
  { region: 'australia-southeast1', invoker: 'public' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const { token, report, subject, notifyMentor } = req.body || {};
    if (!process.env.MENTOR_REPORT_TOKEN || token !== process.env.MENTOR_REPORT_TOKEN) {
      res.status(401).json({ error: 'Unauthorised' });
      return;
    }
    if (!report || typeof report !== 'string' || report.length > 20000) {
      res.status(400).json({ error: 'A report body is required.' });
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: 'Taronga Tracka <noreply@tarongatracka.com.au>',
        to: MENTOR_REPORT_EMAIL,
        ...(notifyMentor ? { cc: MENTOR_REPORT_CC } : {}),
        subject: subject || 'Taronga Tracka — Weekly Update',
        html: buildMentorReportHtml(report),
      });
    } catch (err) {
      console.error('Mentor report email failed:', err);
      res.status(500).json({ error: 'Failed to send email.' });
      return;
    }

    res.json({ success: true });
  }
);
