# JuneBug

JuneBug is a lightweight, drag-and-drop bug reporting tool that’s designed to get more feedback from real users, not just developers.  
It requires **no login**, **no forms**, and **no technical knowledge**. The user simply drags the friendly ladybug icon to where the problem is and hits send.

---

### Why I Built This

I created this with the hope that more people would actually report issues rather than find ways around them. JuneBug lowers the barrier to feedback so teams can catch real problems faster.

---

### Features

- 🐞 Draggable bug icon
- 📸 Optional screenshot support (via `html2canvas`)
- 📝 No form filling for the user - just a message
- 📧 Emails reports directly to your support inbox. Out of the box, it sends emails through JuneBug’s AWS Lambda server, but this behavior can be overridden with a custom function (sendEmailOverrideFunction prop).
- 🌙 Light/dark mode support

---

### Previews

<table>
  <tr>
    <th>Light Mode</th>
    <th>Dark Mode</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/jeffalo13/junebug/blob/main/assets/images/JuneBugIcon.png" width="50" style="vertical-align:middle;margin-right:8px;"/>
      <img src="https://github.com/jeffalo13/junebug/blob/main/assets/images/user-popup-input-light-preview.png" width="250" style="vertical-align:middle;"/>
    </td>
    <td align="center">
      <img src="https://github.com/jeffalo13/junebug/blob/main/assets/images/JuneBugIconDarkMode.png" width="50" style="vertical-align:middle;margin-right:8px;"/>
      <img src="https://github.com/jeffalo13/junebug/blob/main/assets/images/user-popup-input-dark-preview.png" width="250" style="vertical-align:middle;"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/jeffalo13/junebug/blob/main/assets/images/bug-submitted-light-preview.png" width="250"/>
    </td>
    <td align="center">
      <img src="https://github.com/jeffalo13/junebug/blob/main/assets/images/bug-submitted-dark-preview.png" width="250"/>
    </td>
  </tr>
</table>

---

### Example Usage

```tsx
import { JuneBug } from "junebug";

    <div>
      <h1>JuneBug Test</h1>
        <JuneBug
          customIcon="data:image/png;base64,...yourBase64IconHere..."
          iconAlt="Custom Bug Icon Alt Text"
          darkMode={true}
          reporterInfo={{ userId: "myUsername", sessionId: "123456789", userEmail: "email@user.com" }}
          supportInbox="support@myapp.com"
          appName="MyApp"
          subjectPrefix="Special Bug Report"
          disableEmailer={false}
          disableConsoleLogs={false}
          disableScreenshot={false}
          visible={true}
          customLogObject={{ browser: "Chrome", version: "123.0.0", isSpecialButtonPressed: "true" }}
          iconOffset={{ x: 60, y: 80 }}
          onSubmit={(message, screenshot) => {
            console.log("User said:", message);
            if (screenshot) {
              console.log("Screenshot data:", screenshot.slice(0, 50) + "...");
            }
          }}
          sendEmailOverrideFunction={async (rawEmail) => {
            await fetch("https://my-api.com/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rawEmail }),
            });
          }}
        />
    </div>

```

---

### Props

<details>
<summary><strong>Click to expand props table</strong></summary>

<div style="overflow-x: auto; font-size: 13px;">

<!-- BEGIN TABLE -->
<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>customIcon</code></td>
      <td><code>string</code></td>
      <td><code>undefined</code></td>
      <td>Custom image for the bug icon (base64 string or URL).</td>
    </tr>
    <tr>
      <td><code>iconAlt</code></td>
      <td><code>string</code></td>
      <td><code>"Bug Icon"</code></td>
      <td>Alt text for accessibility.</td>
    </tr>
    <tr>
      <td><code>darkMode</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Enables dark mode styling.</td>
    </tr>
    <tr>
      <td><code>reporterInfo</code></td>
      <td><code>any</code></td>
      <td><code>undefined</code></td>
      <td>Extra info to include in the email (e.g. user ID, session ID).</td>
    </tr>
    <tr>
      <td><code>supportInbox</code></td>
      <td><code>string</code></td>
      <td><code>undefined</code></td>
      <td>Email address to send bug reports to.</td>
    </tr>
    <tr>
      <td><code>appName</code></td>
      <td><code>string</code></td>
      <td><code>undefined</code></td>
      <td>Application name (used in email subject).</td>
    </tr>
    <tr>
      <td><code>subjectPrefix</code></td>
      <td><code>string</code></td>
      <td><code>"JuneBug Report"</code></td>
      <td>Custom prefix for the email subject line.</td>
    </tr>
    <tr>
      <td><code>disableEmailer</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Disables the built-in email sending system.</td>
    </tr>
    <tr>
      <td><code>disableConsoleLogs</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Prevents log collection from the console.</td>
    </tr>
    <tr>
      <td><code>disableScreenshot</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Disables screenshot functionality.</td>
    </tr>
    <tr>
      <td><code>visible</code></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
      <td>If false, completely hides the component.</td>
    </tr>
    <tr>
      <td><code>customLogObject</code></td>
      <td><code>any</code></td>
      <td><code>undefined</code></td>
      <td>Object to attach as a customLog.txt file.</td>
    </tr>
    <tr>
      <td><code>iconOffset</code></td>
      <td><code>{ x: number; y: number }</code></td>
      <td><code>{ x: 45, y: 65 }</code></td>
      <td>Position offset from bottom-right of screen.</td>
    </tr>
    <tr>
      <td><code>onSubmit</code></td>
      <td><code>(message, screenshot?) => void</code></td>
      <td><code>undefined</code></td>
      <td>Callback after submit is clicked.</td>
    </tr>
    <tr>
      <td><code>sendEmailOverrideFunction</code></td>
      <td><code>(rawEmail) => Promise&lt;void&gt;</code></td>
      <td><code>undefined</code></td>
      <td>Custom email handler if not using built-in sender.</td>
    </tr>
  </tbody>
</table>
<!-- END TABLE -->

</div>
</details>

---

### Installation

```bash
npm install junebug
