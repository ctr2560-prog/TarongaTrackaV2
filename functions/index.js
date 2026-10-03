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
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
// Sent to Cameron's own inbox only. Designed to be select-all-copied and pasted
// into a fresh email to his mentor — hence the "Hi Paul," greeting baked in and
// no automation disclosure in the body.
const MENTOR_REPORT_EMAIL = 'ctr2560@gmail.com';

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
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Taronga Tracka &amp; Wildly weekly update</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
    <tr>
      <td bgcolor="#0A2F1F" style="background-color:#0A2F1F;padding:28px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="middle" align="left" bgcolor="#0A2F1F" style="background-color:#0A2F1F;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">Taronga Tracka &amp; Wildly</p>
              <p style="margin:4px 0 0;color:#a8c8b0;font-size:13px;">Weekly progress update</p>
            </td>
            <td valign="middle" align="right" bgcolor="#0A2F1F" style="background-color:#0A2F1F;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td valign="middle" style="padding-right:14px;">
                  <img src="https://tarongatracka.web.app/images/logo.png" alt="Taronga Tracka" height="64" style="display:block;height:64px;width:auto;border:0;">
                </td>
                <td valign="middle" style="padding-left:14px;border-left:1px solid rgba(255,255,255,0.25);">
                  <img src="https://tarongatracka.web.app/images/wildly-logo-white.png" alt="Wildly by Taronga" height="48" style="display:block;height:48px;width:auto;border:0;">
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="margin:0 0 18px;font-size:15px;color:#222222;">Hi Paul,</p>
        <table cellpadding="0" cellspacing="0">${body}</table>
      </td>
    </tr>
    <tr>
      <td bgcolor="#0A2F1F" style="background-color:#0A2F1F;padding:16px 32px;">
        <img src="https://tarongatracka.web.app/images/taronga-zoo-white.png" alt="Taronga Zoo — For the Wild" height="24" style="display:block;height:24px;width:auto;border:0;">
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Admin teacher roster (server-verified) ────────────────────────────────────
// The staff portal uses code-based login (no Firebase Auth), so it can't satisfy
// Firestore rules like `isWildlyStaff()`. Direct client reads of the `teachers`
// collection used to be `allow read: if true` so the portal's Users tab could
// list every registered teacher — but that also meant anyone with the Firestore
// SDK could enumerate the entire teacher database with zero login. This function
// moves that one read behind a server-side access-code check (Admin SDK bypasses
// rules), so the Firestore rule for `teachers` can restrict `list` to real
// Firebase-authenticated staff (see firestore.rules) while this stays the only
// way the code-based admin portal can still see the full roster.
// ─────────────────────────────────────────────────────────────────────────────
// Staff identity for the admin endpoints.
//
// ⚠️ The staff portal signs in with a REAL ACCOUNT (Firebase Auth) as of 2026-10-03, not a
// shared access code. These endpoints therefore verify an ID TOKEN and check the email against
// the same allowlist as `isWildlyStaff()` in firestore.rules.
//
// ⚠️ KEEP THIS LIST IN STEP with firestore.rules and src/constants/tarongaStaff.js. All three
//    must agree, and firestore.rules is the one that actually protects the data.
// 🚫 Never fall back to "or a valid access code" here. A shared secret is what these endpoints
//    were moved off: it gave no accountability for who approved, deleted or wiped anything.
// ⚠️ ROOT ADMIN — mirrors isRootAdmin() in firestore.rules. Hard-coded and not removable
//    through the app, so a mistake or a compromised account can never lock Taronga out.
const ROOT_ADMIN_EMAILS = ['thebiologybloke@gmail.com'];

// ⚠️ Mirrors isWildlyStaff() in firestore.rules: the hard-coded root admin, OR an entry in
//    `staffAdmins` (which only existing staff can write). Both must stay in step — the rules are
//    what protect the data, this is what protects the admin endpoints.
async function verifyStaff(req) {
  const header = req.headers.authorization || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!idToken) return { ok: false, status: 403, error: 'Staff sign-in required.' };
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = (decoded.email || '').toLowerCase();
    if (!email) return { ok: false, status: 403, error: 'Staff sign-in required.' };

    if (ROOT_ADMIN_EMAILS.includes(email)) return { ok: true, email, root: true };

    const snap = await admin.firestore().collection('staffAdmins').doc(email).get();
    if (!snap.exists) {
      return { ok: false, status: 403, error: 'That account does not have staff access.' };
    }
    return { ok: true, email, root: false };
  } catch {
    return { ok: false, status: 403, error: 'Staff sign-in required.' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Staff administrators — invite, list and remove.
//
// ⚠️ Staff access lives in the `staffAdmins` collection, writable ONLY by existing staff
// (firestore.rules). The privilege-escalation bug fixed on 2026-10-03 existed because staff
// status lived in `teachers/{email}.role`, a field on a document the SUBJECT could write. Here
// the subject has no write access at all.
//
// ⚠️ The ROOT ADMIN is hard-coded in firestore.rules and cannot be removed through the app. It is
// the guarantee that a mistake, or a compromised staff account removing the others, can never
// lock Taronga out of its own project.

// ── Branded email shell ──────────────────────────────────────────────────────────────────────
// The header and footer are lifted from buildMentorReportHtml (the Friday report), which is the
// look Cameron wants on everything: deep green banner, white title, muted green subtitle, logos
// right-aligned, and the "For the Wild" lockup in the footer banner.
//
// ⚠️ The techniques below are not decoration, they are what makes it survive real mail clients:
//   · TABLES, not flexbox or grid. Outlook's rendering engine is Word and ignores modern CSS.
//   · INLINE styles. Gmail strips <style> blocks.
//   · bgcolor="" attributes ALONGSIDE background-color, so Outlook's dark-mode colour remapping
//     does not invert the banners.
//   · color-scheme / supported-color-schemes meta, same reason.
//   · Images are absolute https URLs on tarongatracka.web.app. A relative path shows a broken
//     image in every client.
//
// ⚠️ buildMentorReportHtml deliberately still has its own copy. It is the one email Cameron
//    relies on weekly, and refactoring a working thing to save duplication is not worth the risk
//    of breaking it. If the brand changes, change both.
// Returns JUST the table. This is what gets copied to the clipboard as `text/html` so it can be
// pasted straight into Gmail or Outlook with the banners intact — mail clients strip <html>,
// <head> and <body> anyway, so a fragment is what actually survives a paste.
function brandedEmailTable({ title, subtitle, bodyHtml }) {
  return `  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td bgcolor="#0A2F1F" style="background-color:#0A2F1F;padding:28px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="middle" align="left" bgcolor="#0A2F1F" style="background-color:#0A2F1F;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">${title}</p>
              <p style="margin:4px 0 0;color:#a8c8b0;font-size:13px;">${subtitle}</p>
            </td>
            <td valign="middle" align="right" bgcolor="#0A2F1F" style="background-color:#0A2F1F;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td valign="middle" style="padding-right:14px;">
                  <img src="https://tarongatracka.web.app/images/logo.png" alt="Taronga Tracka" height="64" style="display:block;height:64px;width:auto;border:0;">
                </td>
                <td valign="middle" style="padding-left:14px;border-left:1px solid rgba(255,255,255,0.25);">
                  <img src="https://tarongatracka.web.app/images/wildly-logo-white.png" alt="Wildly by Taronga" height="48" style="display:block;height:48px;width:auto;border:0;">
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">${bodyHtml}</td>
    </tr>
    <tr>
      <td bgcolor="#0A2F1F" style="background-color:#0A2F1F;padding:16px 32px;">
        <img src="https://tarongatracka.web.app/images/taronga-zoo-white.png" alt="Taronga Zoo — For the Wild" height="24" style="display:block;height:24px;width:auto;border:0;">
      </td>
    </tr>
  </table>`;
}

function brandedEmailShell({ title, subtitle, bodyHtml, previewTitle }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${previewTitle || title}</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#ffffff;">
${brandedEmailTable({ title, subtitle, bodyHtml })}
</body>
</html>`;
}

function staffInviteParts({ link, invitedBy }) {
  // Both logos on purpose: a staff administrator has access across Tracka AND Wildly, since the
  // two share one Firebase project and one staff check.
  const body = `
        <p style="margin:0 0 16px;font-size:18px;font-weight:bold;color:#0A2F1F;">You have been added as a staff administrator.</p>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#222222;">
          ${invitedBy} has given you administrator access to the Taronga Tracka staff portal.
          Set a password to finish setting up your account.
        </p>
        <table cellpadding="0" cellspacing="0"><tr>
          <td bgcolor="#1A5238" style="background-color:#1A5238;border-radius:999px;">
            <a href="${link}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">Set my password</a>
          </td>
        </tr></table>
        <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#6B6B62;">
          This link can be used once and will expire. If it has, ask ${invitedBy} to send another.
        </p>
        <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#9A9A92;">
          The staff portal can read every class and school, so keep this password to yourself and
          do not reuse one from another service. If you were not expecting this, tell ${invitedBy}.
        </p>`;
  const meta = {
    title: 'Taronga Tracka &amp; Wildly',
    subtitle: 'Staff portal invitation',
    previewTitle: 'You have been added as a staff administrator',
    bodyHtml: body,
  };
  // Plain text companion. Always paired with the HTML on the clipboard, because some mail
  // clients and some recipients' settings take the text/plain flavour instead.
  const text = [
    'You have been added as a staff administrator.',
    '',
    `${invitedBy} has given you administrator access to the Taronga Tracka staff portal.`,
    'Set a password to finish setting up your account:',
    '',
    link,
    '',
    'This link can be used once and will expire.',
    'The staff portal can read every class and school, so keep this password to yourself.',
  ].join('\n');
  return { html: brandedEmailShell(meta), table: brandedEmailTable(meta), text };
}

function staffInviteHtml(args) {
  return staffInviteParts(args).html;
}

exports.manageStaffAdmins = onRequest(
  { region: 'australia-southeast1', invoker: 'public' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const staff = await verifyStaff(req);
    if (!staff.ok) { res.status(staff.status).json({ error: staff.error }); return; }

    const db = admin.firestore();
    const { action, email, sendEmail } = req.body || {};
    const target = (email || '').trim().toLowerCase();

    try {
      if (action === 'list') {
        const snap = await db.collection('staffAdmins').get();
        const admins = snap.docs.map((d) => ({
          email: d.id,
          invitedBy: d.data().invitedBy || null,
          addedAt: d.data().addedAt ? d.data().addedAt.toDate().toISOString() : null,
          accepted: !!d.data().accepted,
        }));
        res.json({ ok: true, admins, rootAdmins: ROOT_ADMIN_EMAILS });
        return;
      }

      if (action === 'remove') {
        if (!target.includes('@')) { res.status(400).json({ error: 'An email is required.' }); return; }
        // ⚠️ The root admin is not removable. Without this an administrator could remove every
        //    other administrator including the owner and lock the project out of its own portal.
        if (ROOT_ADMIN_EMAILS.includes(target)) {
          res.status(403).json({ error: 'The root administrator cannot be removed.' });
          return;
        }
        await db.collection('staffAdmins').doc(target).delete();
        console.warn(`[manageStaffAdmins] ${staff.email} removed admin ${target}`);
        res.json({ ok: true, removed: target });
        return;
      }

      if (action === 'invite') {
        if (!target.includes('@')) { res.status(400).json({ error: 'A valid email is required.' }); return; }

        // Create the sign-in account if they do not have one yet. A long random password they
        // never learn: the set-password link below is the only way in, so there is no weak
        // interim credential sitting on the account.
        let created = false;
        try {
          await admin.auth().getUserByEmail(target);
        } catch {
          await admin.auth().createUser({
            email: target,
            password: require('crypto').randomBytes(24).toString('base64url'),
          });
          created = true;
        }

        await db.collection('staffAdmins').doc(target).set({
          invitedBy: staff.email,
          addedAt: admin.firestore.FieldValue.serverTimestamp(),
          accepted: false,
        }, { merge: true });

        const link = await admin.auth().generatePasswordResetLink(target);
        const parts = staffInviteParts({ link, invitedBy: staff.email });

        // ⚠️ SENDING IS OPT-IN and OFF by default. Resend reports success and the message is then
        //    silently dropped by DoE and zoo.nsw.gov.au gateways — confirmed again on 2026-10-03,
        //    when an invite to a @det.nsw.edu.au address logged emailed=true and never arrived.
        //    The default path is therefore: the administrator copies the email and sends it from
        //    their own address, which the recipient's gateway already trusts.
        let emailed = false;
        let emailError = null;
        if (sendEmail) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const sent = await resend.emails.send({
              from: 'Taronga Tracka <noreply@tarongatracka.com.au>',
              to: target,
              subject: 'You have been added as a Taronga Tracka staff administrator',
              html: parts.html,
            });
            emailed = !sent?.error;
            if (sent?.error) emailError = sent.error.message || 'Email provider rejected the message.';
          } catch (err) {
            emailError = err.message;
          }
        }

        console.warn(`[manageStaffAdmins] ${staff.email} invited ${target} (newAccount=${created}, sendEmail=${sendEmail}, emailed=${emailed})`);
        // `table` is the fragment the client puts on the clipboard as text/html; `text` is its
        // plain-text companion. Both always returned, send or no send.
        res.json({ ok: true, email: target, created, emailed, emailError, link,
                   emailTable: parts.table, emailText: parts.text,
                   subject: 'You have been added as a Taronga Tracka staff administrator' });
        return;
      }

      res.status(400).json({ error: 'Unknown action.' });
    } catch (err) {
      console.error('manageStaffAdmins failed:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// cleanupRawClips — retention for the intermediate footage, NOT for the keepsakes.
//
// ⚠️⚠️ THIS IS AN AUTOMATED DELETER POINTED AT REAL CHILDREN'S MEDIA. Read all of this before
// changing a single line of it. Getting the filter wrong destroys the thing it exists to protect.
//
// THE POLICY it implements (agreed 2026-10-03):
//   · The STITCHED FILM is the keepsake and is kept indefinitely. Students are meant to have it
//     forever, and the Year 7 → Year 12 comparison depends on it still being there in six years.
//   · The RAW PER-CHAPTER CLIPS are intermediate working files. Once they have been stitched into
//     a film nobody ever opens them again. Those are what this removes.
//
// FOUR SAFETY RULES, every one of them load-bearing:
//   1. DRY RUN IS THE DEFAULT. Deleting requires an explicit `dryRun: false`. A caller who forgets
//      the flag gets a report and nothing else.
//   2. NOTHING IS DELETED FROM A FOLDER WITH NO FILM IN IT. If the stitch failed, or is still in
//      progress, the clips are all the student has and they must survive.
//   3. THE FILM ITSELF IS NEVER A CANDIDATE. KEEP_PATTERNS is checked before anything else.
//   4. AGE THRESHOLD. Nothing recent is touched, so a class mid-excursion is never affected.
//
// 🚫 Do NOT add a "delete everything" or "force" mode. There is no legitimate use for one, and
//    its existence is the risk.
const KEEP_PATTERNS = [/^film\./i, /^documentary\./i];
const CLIP_ROOTS = ['zoosnooz', 'evolve', 'wildestDreams'];
const DEFAULT_RETAIN_DAYS = 365;

function isKeeper(fileName) {
  return KEEP_PATTERNS.some((re) => re.test(fileName));
}

exports.cleanupRawClips = onRequest(
  { region: 'australia-southeast1', invoker: 'public', timeoutSeconds: 540 },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const staff = await verifyStaff(req);
    if (!staff.ok) { res.status(staff.status).json({ error: staff.error }); return; }

    // ⚠️ Default TRUE. Only an explicit `false` deletes anything.
    const dryRun = req.body?.dryRun !== false;
    const retainDays = Number(req.body?.retainDays) > 0
      ? Math.floor(Number(req.body.retainDays))
      : DEFAULT_RETAIN_DAYS;
    // ⚠️ Floor of 30 days so a typo (or a 0) can never mean "delete everything from today".
    const effectiveDays = Math.max(30, retainDays);
    const cutoff = Date.now() - effectiveDays * 24 * 60 * 60 * 1000;

    try {
      const bucket = admin.storage().bucket();
      const report = {
        dryRun, retainDays: effectiveDays,
        scanned: 0, keptFilms: 0, eligible: 0, deleted: 0, bytes: 0,
        skippedNoFilm: 0, skippedTooRecent: 0,
        folders: [],
      };

      for (const root of CLIP_ROOTS) {
        const [files] = await bucket.getFiles({ prefix: `${root}/` });
        // Group by the student folder: {root}/{classCode}/{studentId}/
        const folders = new Map();
        for (const f of files) {
          const parts = f.name.split('/');
          if (parts.length < 4) continue;              // not a student-level file
          const folder = parts.slice(0, 3).join('/');
          if (!folders.has(folder)) folders.set(folder, []);
          folders.get(folder).push(f);
        }

        for (const [folder, items] of folders) {
          report.scanned += items.length;
          const film = items.find((f) => isKeeper(f.name.split('/').pop()));
          if (!film) {
            // ⚠️ Rule 2. No film means the clips are all the student has.
            report.skippedNoFilm += items.length;
            continue;
          }
          report.keptFilms += 1;

          const candidates = [];
          for (const f of items) {
            const name = f.name.split('/').pop();
            if (isKeeper(name)) continue;              // ⚠️ Rule 3.
            const created = Date.parse(f.metadata?.timeCreated || '') || 0;
            if (!created || created > cutoff) {        // ⚠️ Rule 4.
              report.skippedTooRecent += 1;
              continue;
            }
            candidates.push({ name: f.name, size: Number(f.metadata?.size || 0), file: f });
          }
          if (!candidates.length) continue;

          report.eligible += candidates.length;
          report.bytes += candidates.reduce((n, c) => n + c.size, 0);
          report.folders.push({
            folder,
            film: film.name.split('/').pop(),
            clips: candidates.map((c) => c.name.split('/').pop()),
          });

          if (!dryRun) {
            for (const c of candidates) {
              await c.file.delete();
              report.deleted += 1;
            }
          }
        }
      }

      console.warn(`[cleanupRawClips] ${staff.email} dryRun=${dryRun} retainDays=${effectiveDays} ` +
                   `scanned=${report.scanned} eligible=${report.eligible} deleted=${report.deleted}`);
      res.json({ ok: true, ...report });
    } catch (err) {
      console.error('cleanupRawClips failed:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// generateStaffPasswordReset — Cameron resets staff passwords, staff do not self-serve.
//
// ⚠️ The staff login has NO "forgot password" link, on purpose. Self-service reset is right for
// teachers (there are many of them, and their account only reaches their own classes) and wrong
// for staff (there are very few, and the account can read every school and wipe all data).
// A staff member who is locked out contacts the administrator, who generates a link here.
//
// ⚠️ TWO CHECKS, both necessary:
//   1. the CALLER must be signed in as staff (verifyStaff), and
//   2. the TARGET must itself be on the staff allowlist.
// Without (2) this becomes an account-takeover tool for any teacher account in the project.
//
// Returns the link rather than emailing it. Email to DoE and zoo.nsw.gov.au addresses has been
// silently dropped by their gateways before (see the mentor-report notes), and a reset that
// fails silently is worse than one the administrator passes on themselves.
exports.generateStaffPasswordReset = onRequest(
  { region: 'australia-southeast1', invoker: 'public' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const staff = await verifyStaff(req);
    if (!staff.ok) { res.status(staff.status).json({ error: staff.error }); return; }

    const { email } = req.body || {};
    const target = (email || '').trim().toLowerCase();
    if (!target || !target.includes('@')) {
      res.status(400).json({ error: 'A staff email is required.' });
      return;
    }
    if (!TARONGA_STAFF_EMAILS.includes(target)) {
      res.status(403).json({ error: 'That address is not a Taronga staff account.' });
      return;
    }

    try {
      const link = await admin.auth().generatePasswordResetLink(target);
      console.warn(`[generateStaffPasswordReset] ${staff.email} generated a reset link for ${target}`);
      res.json({ ok: true, email: target, link });
    } catch (err) {
      console.error('generateStaffPasswordReset failed:', err);
      res.status(500).json({ error: 'Could not generate a reset link for that account.' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// verifyAdminCode — server-side check of the staff portal access code.
//
// ⚠️ WHY THIS EXISTS. The staff portal code used to be verified IN THE BROWSER by
// reading `adminAccess/{code}` directly, and that collection was world-readable. The
// document ID *is* the code, so listing the collection returned the password. Verified
// against the live project on 2026-10-02: an unauthenticated 15-line script read it in
// 1.4 seconds. That was a complete authentication bypass for the staff portal.
//
// The client now posts the code here and never reads the collection; `adminAccess` is
// denied to clients entirely in firestore.rules. The Admin SDK bypasses rules, so only
// this function (and getAdminTeacherRoster, which does the same check) can see it.
//
// ⚠️ Moving the check server-side is NOT sufficient on its own — without throttling it
// just converts "read the code" into "guess the code a thousand times a second". Hence
// the lockout below. Attempts are tracked per IP in `adminAuthAttempts`, which clients
// cannot read or write.
const ADMIN_MAX_ATTEMPTS = 10;
const ADMIN_WINDOW_MS = 15 * 60 * 1000;

async function checkAdminCode(db, rawCode, ip) {
  const key = String(ip || 'unknown').replace(/[^a-zA-Z0-9.:_-]/g, '_').slice(0, 120) || 'unknown';
  const attemptRef = db.collection('adminAuthAttempts').doc(key);
  const now = Date.now();

  const snap = await attemptRef.get();
  const rec = snap.exists ? snap.data() : null;
  const fresh = rec && (now - (rec.windowStart || 0)) < ADMIN_WINDOW_MS;
  const count = fresh ? (rec.count || 0) : 0;
  if (count >= ADMIN_MAX_ATTEMPTS) return { ok: false, locked: true };

  const code = String(rawCode || '').trim().toLowerCase();
  const codeSnap = await db.collection('adminAccess').doc(code).get();
  const ok = codeSnap.exists && codeSnap.data().active === true;

  if (ok) {
    if (snap.exists) await attemptRef.delete();
  } else {
    await attemptRef.set({ count: count + 1, windowStart: fresh ? rec.windowStart : now, lastAt: now }, { merge: true });
  }
  return { ok, locked: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// adminWipeAllData — the staff Control Room "wipe all data" button.
//
// ⚠️ WHY THIS MOVED SERVER-SIDE (2026-10-02). This used to run in the browser, deleting
// every class and every student document directly, and it worked because `classes` and
// `students` were `allow write: if true` — i.e. ANYONE could run the same deletion, with or
// without the staff portal. firestore.rules now requires Firebase Auth to delete, and the
// staff portal has no Firebase Auth, so the operation lives here instead and is gated on the
// access code verified with the Admin SDK.
//
// ⚠️ The Control Room's own password is HARDCODED IN THE CLIENT as a plain string. Anyone
// reading the JS bundle can see it. It is a UI speed bump, NOT a security control, and must
// never be the only thing standing in front of a destructive action — which is exactly why
// this function re-checks the real access code server-side regardless of what the UI did.
//
// This is the most destructive operation in the system. It requires the access code AND an
// explicit confirm string, and it logs who ran it.
// ⚠️ `setTeacherRole` was added and then REMOVED on 2026-10-03, deliberately. It granted
// Taronga staff roles behind the shared admin access code. It is gone because staff is now an
// explicit EMAIL ALLOWLIST inside firestore.rules (`isWildlyStaff()`), which cannot be
// escalated into: changing who is staff requires deploying the rules, which requires access to
// the Firebase project. An always-on endpoint whose only job is handing out privilege, gated by
// a shared secret, is exactly the pattern being retired.
// 🚫 Do not reintroduce an "appoint staff" endpoint. To appoint someone, add their email to the
//    allowlist in firestore.rules and deploy. Slow on purpose.

exports.adminWipeAllData = onRequest(
  { region: 'australia-southeast1', invoker: 'public' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const { confirm } = req.body || {};
    if (confirm !== 'WIPE') {
      res.status(400).json({ error: 'Confirmation text did not match.' });
      return;
    }

    // ⚠️ The most destructive action in the system. It requires a signed-in STAFF ACCOUNT and
    //    an explicit confirm string, and it logs the email that ran it — which is the whole
    //    point of moving off a shared code: "who wiped the data?" now has an answer.
    const staff = await verifyStaff(req);
    if (!staff.ok) { res.status(staff.status).json({ error: staff.error }); return; }

    const db = admin.firestore();
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip;

    try {
      let classes = 0, students = 0;
      const classesSnap = await db.collection('classes').get();
      for (const classDoc of classesSnap.docs) {
        const studentsSnap = await db.collection('classes').doc(classDoc.id).collection('students').get();
        // Firestore caps a batch at 500 writes.
        let batch = db.batch(), n = 0;
        for (const s of studentsSnap.docs) {
          batch.delete(s.ref); students++;
          if (++n >= 450) { await batch.commit(); batch = db.batch(); n = 0; }
        }
        batch.delete(classDoc.ref); classes++;
        await batch.commit();
      }
      console.warn(`[adminWipeAllData] WIPED ${classes} classes and ${students} students by ${staff.email} (ip=${ip})`);
      res.json({ ok: true, classes, students });
    } catch (err) {
      console.error('adminWipeAllData failed:', err);
      res.status(500).json({ error: 'Wipe failed: ' + err.message });
    }
  }
);

exports.verifyAdminCode = onRequest(
  { region: 'australia-southeast1', invoker: 'public' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const { code } = req.body || {};
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'An access code is required.' });
      return;
    }

    try {
      const db = admin.firestore();
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip;
      const { ok, locked } = await checkAdminCode(db, code, ip);

      if (locked) {
        res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
        return;
      }
      if (!ok) {
        // Deliberately slow and deliberately vague: no hint about whether the code
        // exists but is inactive, which would halve an attacker's search.
        await new Promise((r) => setTimeout(r, 600));
        res.status(403).json({ error: 'Invalid or inactive access code.' });
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      console.error('Admin code verification failed:', err);
      res.status(500).json({ error: 'Failed to verify access code.' });
    }
  }
);

exports.getAdminTeacherRoster = onRequest(
  { region: 'australia-southeast1', invoker: 'public' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    // Staff identity, not a shared code (2026-10-03).
    const staff = await verifyStaff(req);
    if (!staff.ok) { res.status(staff.status).json({ error: staff.error }); return; }

    const db = admin.firestore();

    try {
      const snap = await db.collection('teachers').get();
      const teachers = snap.docs.map((d) => {
        const data = d.data() || {};
        return {
          email: data.email || d.id,
          schoolName: data.schoolName || null,
          commsOptIn: data.commsOptIn ?? null,
          role: data.role || null,
        };
      });
      res.json({ teachers });
    } catch (err) {
      console.error('Failed to load teacher roster:', err);
      res.status(500).json({ error: 'Failed to load teacher roster.' });
    }
  }
);

exports.sendMentorReport = onRequest(
  { region: 'australia-southeast1', invoker: 'public' },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const { token, report, subject } = req.body || {};
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
