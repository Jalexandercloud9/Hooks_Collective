/* ==========================================================================
   submission-created — runs automatically on every Netlify Forms submission
   (Netlify's own naming convention: any function called exactly
   "submission-created" is invoked with the submission payload, no manual
   webhook wiring needed).

   Netlify's built-in email notification can't give each email a custom,
   per-submission subject line — it's a fixed format. This function sends
   the actual notification itself via Resend instead, so the subject can be
   "{First} {Last}, Hooks Collective Request" every time.

   Requires the RESEND_API_KEY environment variable to be set in Netlify's
   dashboard (Site configuration > Environment variables). Nothing else
   changes about the form itself — Netlify still stores every submission
   in its own Forms UI regardless of what this function does.
   ========================================================================== */

exports.handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch (err) {
    console.error('submission-created: could not parse event body', err);
    return { statusCode: 400, body: 'Bad payload' };
  }

  // Only act on the contact form — harmless guard if another form is ever
  // added to the site later.
  if (payload.form_name !== 'inquiry') {
    return { statusCode: 200, body: 'Ignored (not the inquiry form)' };
  }

  const data = payload.data || {};

  // Honeypot: Netlify still calls this function for spam-flagged
  // submissions, so re-check the honeypot field ourselves before sending
  // anything.
  if (data['bot-field']) {
    return { statusCode: 200, body: 'Ignored (honeypot triggered)' };
  }

  const firstName = (data.firstName || '').trim();
  const lastName = (data.lastName || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'New inquiry';
  const subject = `${fullName}, Hooks Collective Request`;

  const escapeHtml = (value) =>
    String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const row = (label, value) =>
    value
      ? `<tr><td style="padding:6px 12px 6px 0;color:#6B645E;font-family:sans-serif;font-size:13px;vertical-align:top;white-space:nowrap;"><strong>${label}</strong></td><td style="padding:6px 0;color:#141414;font-family:sans-serif;font-size:14px;">${escapeHtml(value).replace(/\n/g, '<br/>')}</td></tr>`
      : '';

  const html = `
    <table cellpadding="0" cellspacing="0" style="max-width:600px;">
      ${row('Name', fullName)}
      ${row('Email', data.email)}
      ${row('Organization', data.organization)}
      ${row('Interested in', data.interest)}
      ${row('Message', data.message)}
    </table>
  `;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('submission-created: RESEND_API_KEY is not set');
    return { statusCode: 500, body: 'Missing RESEND_API_KEY' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Hooks Collective Website <hello@thehookscollective.com>',
        to: 'hello@thehookscollective.com',
        reply_to: data.email || undefined,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('submission-created: Resend API error', res.status, text);
      return { statusCode: 502, body: 'Resend API error' };
    }
  } catch (err) {
    console.error('submission-created: fetch to Resend failed', err);
    return { statusCode: 502, body: 'Failed to reach Resend' };
  }

  return { statusCode: 200, body: 'Sent' };
};
