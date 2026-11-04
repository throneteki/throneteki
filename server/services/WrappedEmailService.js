import crypto from 'crypto';

import defaultDb from '../db/index.js';
import logger from '../log.js';
import EmailService from './EmailService.js';
import { AvailableForSql, WrappedVersion } from './WrappedService.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FactionNames = {
    baratheon: 'House Baratheon',
    greyjoy: 'House Greyjoy',
    lannister: 'House Lannister',
    martell: 'House Martell',
    thenightswatch: "The Night's Watch",
    stark: 'House Stark',
    targaryen: 'House Targaryen',
    tyrell: 'House Tyrell'
};

const escapeHtml = (value) =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export function unsubscribeToken(secret, userId) {
    return crypto.createHmac('sha256', secret).update(`UNSUBSCRIBE ${userId}`).digest('hex');
}

export function isValidUnsubscribeToken(secret, userId, token) {
    if (!secret || !/^\d{1,18}$/.test(String(userId)) || typeof token !== 'string') {
        return false;
    }

    const expected = Buffer.from(unsubscribeToken(secret, userId));
    const given = Buffer.from(token);

    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

export function renderWrappedEmail({ appName, publicUrl, user, wrapped, token }) {
    const year = wrapped.year;
    const wrappedUrl = `${publicUrl}/white-book/${year}`;
    // A fixed path in public/, as built assets have hashed names
    const logoUrl = `${publicUrl}/email/logo.png`;
    const unsubscribeUrl = `${publicUrl}/unsubscribe?id=${user.id}&token=${token}`;
    const oneClickUrl = `${publicUrl}/api/unsubscribe?id=${user.id}&token=${token}`;
    const hours = Math.round(wrapped.seconds / 3600);
    const faction = wrapped.favouriteFaction
        ? FactionNames[wrapped.favouriteFaction.faction] || null
        : null;

    const facts = [
        ['Battles', wrapped.games],
        ['Victories', wrapped.wins],
        ['Hours', hours]
    ];

    const subject = `Your ${year} page in the White Book is ready`;

    const text =
        `Hi ${user.username},\n\n` +
        `Your page in the ${year} White Book has been written: ${wrapped.games} battles, ${wrapped.wins} victories and about ${hours} hours at the table` +
        (faction ? `, mostly as ${faction}` : '') +
        '.\n\n' +
        `Read it, and share it: ${wrappedUrl}\n\n` +
        `${appName} team\n\n` +
        `You're getting this because you played on ${appName} this year. To stop these emails: ${unsubscribeUrl}\n`;

    const ink = '#2a1f14';
    const gold = '#8a6424';
    const parchment = '#f3e9cf';
    const serif = "Georgia,'Times New Roman',serif";

    const cell = ([label, value]) =>
        '<td align="center" style="padding:12px 4px;">' +
        `<div style="font-family:${serif};font-size:32px;line-height:36px;font-weight:700;color:${ink};">${escapeHtml(
            value.toLocaleString('en')
        )}</div>` +
        `<div style="font-family:${serif};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${gold};">${escapeHtml(
            label
        )}</div></td>`;

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#1a140d;font-family:${serif};color:${ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a140d;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${parchment};border:4px double ${gold};border-radius:6px;">
<tr><td align="center" style="background:${ink};padding:18px 28px;">
<a href="${escapeHtml(publicUrl)}" style="text-decoration:none;"><img src="${escapeHtml(
        logoUrl
    )}" width="300" height="20" alt="${escapeHtml(
        appName
    )}" style="display:block;margin:0 auto;width:300px;max-width:100%;height:auto;border:0;color:${parchment};font-size:14px;"></a>
</td></tr>
<tr><td align="center" style="padding:32px 28px 8px;">
<div style="font-size:15px;letter-spacing:6px;text-transform:uppercase;color:${gold};">The White Book</div>
<div style="font-size:56px;line-height:62px;font-weight:700;color:${ink};padding-top:6px;">${year}</div>
<p style="font-size:18px;line-height:26px;font-style:italic;margin:16px 0 4px;">Hi ${escapeHtml(
        user.username
    )}, your page has been written.</p>
</td></tr>
<tr><td style="padding:8px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${gold};border-bottom:1px solid ${gold};"><tr>${facts
        .map(cell)
        .join('')}</tr></table>
</td></tr>
${
    faction
        ? `<tr><td align="center" style="padding:12px 28px 0;font-size:17px;line-height:24px;">Sworn to <strong>${escapeHtml(
              faction
          )}</strong></td></tr>`
        : ''
}
<tr><td align="center" style="padding:28px 28px 36px;">
<a href="${escapeHtml(
        wrappedUrl
    )}" style="display:inline-block;background:${ink};color:${parchment};font-size:17px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:999px;">Read your ${year} page</a>
</td></tr>
</table>
<p style="max-width:520px;font-size:12px;line-height:18px;color:#a8987a;margin:20px auto 0;">You're getting this because you played on ${escapeHtml(
        appName
    )} this year. <a href="${escapeHtml(
        unsubscribeUrl
    )}" style="color:#d6c7a4;">Stop these emails</a>.</p>
</td></tr>
</table>
</body>
</html>
`;

    return {
        subject,
        text,
        html,
        headers: [
            { Name: 'List-Unsubscribe', Value: `<${oneClickUrl}>` },
            { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' }
        ]
    };
}

class WrappedEmailService {
    constructor(configService, emailService = new EmailService(configService), db = defaultDb) {
        this.db = db;
        this.emailService = emailService;
        this.appName = configService.getValue('appName');
        this.publicUrl = (configService.getValue('origin') || '').replace(/\/+$/, '');
        this.hmacSecret = configService.getValue('hmacSecret');
    }

    getRecipients(year, username) {
        return this.db.query(
            `SELECT w.user_id, u.username, u.email, w.data FROM user_wrapped w
            JOIN users u ON u.id = w.user_id
            WHERE w.year = $1 AND w.version = $3 AND w.generated_at > now() - ${AvailableForSql}
                AND w.emailed_at IS NULL AND NOT u.disabled AND u.verified
                AND u.email_updates AND u.email IS NOT NULL
                AND ($2::text IS NULL OR lower(u.username) = lower($2))
            ORDER BY w.user_id`,
            [year, username || null, WrappedVersion]
        );
    }

    render(recipient) {
        return renderWrappedEmail({
            appName: this.appName,
            publicUrl: this.publicUrl,
            user: { id: recipient.user_id, username: recipient.username },
            wrapped: recipient.data,
            token: unsubscribeToken(this.hmacSecret, recipient.user_id)
        });
    }

    // unrecorded lists players who were emailed but couldn't be marked as emailed, so a re-run would email them again
    async send({ year, username, dryRun = false, perSecond = 10, progress = () => {} }) {
        if (!this.publicUrl || !this.hmacSecret) {
            throw new Error('origin and hmacSecret must be configured to send emails');
        }

        const recipients = await this.getRecipients(year, username);
        const result = { recipients: recipients.length, sent: 0, failed: 0, unrecorded: [] };
        progress(`${recipients.length} players to email`);

        if (recipients.length > 0) {
            result.sample = this.render(recipients[0]);
        }

        if (dryRun) {
            return result;
        }

        for (const recipient of recipients) {
            const started = Date.now();
            const email = this.render(recipient);
            const sent = await this.emailService.sendEmail(
                recipient.email,
                email.subject,
                email.text,
                { html: email.html, headers: email.headers }
            );

            if (sent) {
                result.sent++;

                if (!(await this.markEmailed(recipient.user_id, year))) {
                    result.unrecorded.push(recipient.username);
                }
            } else {
                result.failed++;
                logger.error('Unable to send the White Book email to %s', recipient.username);
            }

            if ((result.sent + result.failed) % 100 === 0) {
                progress(`${result.sent + result.failed} of ${recipients.length}`);
            }

            await sleep(Math.max(0, 1000 / perSecond - (Date.now() - started)));
        }

        return result;
    }

    // Retries, as a re-run would otherwise email them again
    async markEmailed(userId, year, attempts = 3) {
        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                await this.db.query(
                    'UPDATE user_wrapped SET emailed_at = now() WHERE user_id = $1 AND year = $2',
                    [userId, year]
                );

                return true;
            } catch (err) {
                logger.error(
                    'Unable to record the White Book email to user %s as sent (attempt %s) %s',
                    userId,
                    attempt,
                    err
                );

                if (attempt < attempts) {
                    await sleep(1000 * attempt);
                }
            }
        }

        return false;
    }

    async unsubscribe(userId, token) {
        if (!isValidUnsubscribeToken(this.hmacSecret, userId, token)) {
            return false;
        }

        await this.db.query('UPDATE users SET email_updates = false WHERE id = $1', [
            String(userId)
        ]);

        return true;
    }
}

export default WrappedEmailService;
