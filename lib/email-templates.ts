const BRAND_COLOR = "#5a9e5d";

export function magicLinkHtml({ url, host }: { url: string; host: string }) {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  return `
<body style="background: #f4f4f5; margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #f4f4f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0"
          style="background: #ffffff; max-width: 480px; margin: auto; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7;">
          <tr>
            <td align="center" style="padding: 32px 32px 0 32px;">
              <span style="font-size: 20px; font-weight: 700; font-family: Helvetica, Arial, sans-serif; color: #18181b;">
                Campaignr
              </span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 32px 8px 32px; font-size: 20px; font-weight: 600; font-family: Helvetica, Arial, sans-serif; color: #18181b;">
              Sign in to your account
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 32px 24px 32px; font-size: 15px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #71717a;">
              Click the button below to sign in to <strong>${escapedHost}</strong>. This link expires in 24 hours and can only be used once.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 32px 32px 32px;">
              <a href="${url}" target="_blank"
                style="display: inline-block; font-size: 15px; font-weight: 600; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; background: ${BRAND_COLOR}; border-radius: 999px; padding: 14px 32px;">
                Sign in
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 32px 32px 32px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: #a1a1aa;">
              If you didn't request this email, you can safely ignore it.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`;
}

export function magicLinkText({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\nThis link expires in 24 hours and can only be used once. If you didn't request this email, you can safely ignore it.\n`;
}
