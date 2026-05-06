const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret }       = require('firebase-functions/params');
const admin                  = require('firebase-admin');
const { Resend }             = require('resend');

admin.initializeApp();

const RESEND_API_KEY = defineSecret('RESEND_API_KEY');

function buildEmailHtml(link) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Your Taronga Tracka sign-in link</title>
</head>
<body style="margin:0;padding:0;background:#eef3ee;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3ee;padding:32px 16px;">
    <tr><td align="center">

      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.09);">

        <!-- Header -->
        <tr>
          <td style="background:#0A2F1F;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 6px;color:rgba(255,255,255,0.5);font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Taronga Zoo Sydney</p>
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:0.03em;">Taronga Tracka</h1>
            <p style="margin:10px 0 0;color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Teacher Portal</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 28px;">
            <h2 style="margin:0 0 12px;color:#0A2F1F;font-size:20px;font-weight:700;">Your sign-in link is ready</h2>
            <p style="margin:0 0 8px;color:#444;font-size:15px;line-height:1.65;">
              We received a request to sign in to <strong style="color:#0A2F1F;">Taronga Tracka</strong> using this email address.
            </p>
            <p style="margin:0 0 28px;color:#444;font-size:15px;line-height:1.65;">
              Click the button below to access your teacher dashboard — no password needed.
            </p>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;">
              <tr>
                <td align="center">
                  <a href="${link}"
                    style="display:inline-block;padding:15px 40px;background:#1B6B3A;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:40px;letter-spacing:0.07em;text-transform:uppercase;">
                    Sign In to Taronga Tracka &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <!-- Security notice -->
            <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
              <tr>
                <td style="background:#f4f8f5;border-left:3px solid #1B6B3A;border-radius:0 8px 8px 0;padding:14px 18px;">
                  <p style="margin:0 0 4px;color:#0A2F1F;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Security notice</p>
                  <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
                    This link expires in <strong>1 hour</strong> and can only be used <strong>once</strong>.
                    If you didn't request this, you can safely ignore this email — your account remains secure.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Fallback link -->
            <p style="margin:0;color:#aaa;font-size:12px;line-height:1.6;">
              Button not working? Copy and paste this into your browser:<br>
              <a href="${link}" style="color:#1B6B3A;font-size:11px;word-break:break-all;">${link}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f4f8f5;border-top:1px solid #ddeae0;padding:20px 40px;text-align:center;">
            <p style="margin:0 0 3px;color:#0A2F1F;font-size:13px;font-weight:700;">Taronga Tracka</p>
            <p style="margin:0;color:#aaa;font-size:11px;line-height:1.6;">
              An education program by Taronga Zoo Sydney<br>
              This mailbox is not monitored &mdash; please do not reply.
            </p>
          </td>
        </tr>

      </table>

      <p style="color:#bbb;font-size:11px;margin-top:20px;text-align:center;">
        &copy; Taronga Zoo Sydney &middot; Taronga Tracka Education Program
      </p>

    </td></tr>
  </table>
</body>
</html>`;
}

exports.sendMagicLink = onRequest(
  { secrets: [RESEND_API_KEY], region: 'australia-southeast1', cors: true, invoker: 'public' },
  async (req, res) => {
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
    const resend = new Resend(RESEND_API_KEY.value());
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
