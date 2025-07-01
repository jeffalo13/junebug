const FROM_EMAIL = "donotreply@junebugreports.com";
const FROM_NAME = "JuneBug";
const ENDPOINT = "https://tesseract-api.com/v1/email/send-mail-post";

export interface SendEmailOptions {
  to: string;
  message: string;
  logs?: string[];
  screenshotBase64?: string | null;
  reporter?: any;
  appName?: string;
  subjectPrefix?: string;
  customLogObject?: any;
}

export async function sendEmailReport(options: SendEmailOptions, sendEmailOverride?: Function): Promise<void> {
  const rawEmail = generateRawEmail(options);
  
  if (sendEmailOverride)
  {
    // console.log("custom emailer");
    await sendEmailOverride(rawEmail);
    return;
  }

  else
  {
    // console.log("default emailer");
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawEmail }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to send bug report: ${response.status} ${text}`);
    }
  }


}

function generateRawEmail(options: SendEmailOptions): string {
  const { to, message, logs, screenshotBase64, reporter, appName, customLogObject, subjectPrefix = "JuneBug Report" } = options;

  const subject = appName ? `${subjectPrefix} - ${appName}` : subjectPrefix;
  const boundary = `Boundary_${Date.now()}`;
  const randomFileNameSuffix = Math.random().toString(36).substring(2, 6);
  const now = new Date();

  const logAttachment = buildLogAttachment(logs, boundary, now,  randomFileNameSuffix);
  const customLogAttachment = buildCustomLogObject(customLogObject, boundary, now, randomFileNameSuffix);
  const screenshotAttachment = buildScreenshotAttachment(screenshotBase64, boundary);
  const formattedReporter = formatReporterBlock(reporter);
  const fullBody = `${message}${formattedReporter ? `\n\n${formattedReporter}` : ''}`;

  return `From: "${FROM_NAME}" <${FROM_EMAIL}>
To: ${to}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: 7bit

${fullBody}
${[screenshotAttachment, logAttachment, customLogAttachment].filter(Boolean).join('')}
--${boundary}--`;
}

function buildLogAttachment(logs: string[] | undefined, boundary: string, now: Date, randomSuffix: string): string | null {
  if (!logs || logs.length === 0) return null;

  const logText = logs.join('\n\n');
  const base64Log = btoa(unescape(encodeURIComponent(logText)));


  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const filename = `console-logs-${timestamp}-${randomSuffix}.txt`;

  return `
--${boundary}
Content-Type: text/plain; name="${filename}"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="${filename}"

${base64Log}`;
}

function buildScreenshotAttachment(base64: string | undefined | null, boundary: string): string | null {
  if (!base64) return null;
  const cleanBase64 = base64.replace(/^data:image\/png;base64,/, '');

  return `
--${boundary}
Content-Type: image/png; name="screenshot.png"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="screenshot.png"

${cleanBase64}`;
}

function buildCustomLogObject(customLog: any | undefined, boundary: string, now: Date, randomSuffix: string): string | null {
  if (!customLog) return null;

  // const customLogText = JSON.stringify(customLog);

  const details = Object.entries(customLog)
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
    .join('\n');

  const base64Log = btoa(unescape(encodeURIComponent(details)));


  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const filename = `custom-logs-${timestamp}-${randomSuffix}.txt`;

  return `
--${boundary}
Content-Type: text/plain; name="${filename}"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="${filename}"

${base64Log}`;
}

function formatReporterBlock(reporter?: any): string | null {
  if (!reporter || typeof reporter !== 'object') return null;

  const formatKey = (key: string) =>
    key
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const details = Object.entries(reporter)
    .map(([key, value]) => `${formatKey(key)}: ${value}`)
    .join('\n');

  return `--------User Info--------\n\n${details}`;
}
