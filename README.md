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
- 📧 Emails reports directly to your support inbox. Out of the box, it sends emails through JuneBug’s AWS Lambda server, but this behavior can be overridden with a custom function.
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

### Props

| Prop                         | Type                              | Default                  | Description                                                                 |
|------------------------------|-----------------------------------|--------------------------|-----------------------------------------------------------------------------|
| `customIcon`                 | `string`                          | `undefined`              | Custom image for the bug icon (base64 string or URL).                       |
| `iconAlt`                    | `string`                          | `"Bug Icon"`             | Alt text for accessibility.                                                |
| `darkMode`                   | `boolean`                         | `false`                  | Enables dark mode styling.                                                 |
| `reporterInfo`              | `any`                             | `undefined`              | Object with extra info to include in the email (e.g. user ID, session ID). |
| `supportInbox`              | `string`                          | `undefined`              | Email address to send bug reports to.                                      |
| `appName`                    | `string`                          | `undefined`              | Application name (appears in the email subject).                           |
| `subjectPrefix`             | `string`                          | `"JuneBug Report"`       | Custom prefix for the email subject.                                       |
| `disableEmailer`            | `boolean`                         | `false`                  | If `true`, disables the email sending logic entirely.                      |
| `disableConsoleLogs`        | `boolean`                         | `false`                  | If `true`, disables automatic log collection.                              |
| `disableScreenshot`         | `boolean`                         | `false`                  | If `true`, disables screenshot functionality.                              |
| `visible`                   | `boolean`                         | `true`                   | If `false`, completely hides the JuneBug component.                        |
| `customLogObject`           | `any`                             | `undefined`              | Custom object to be serialized and attached as `customLog.txt`.            |
| `iconOffset`                | `{ x: number; y: number }`        | `{ x: 45, y: 65 }`       | Position offset of the bug icon from the bottom-right corner.              |
| `onSubmit`                  | `(message, screenshot?) => void`  | `undefined`              | Custom function to call after the user submits a message.                  |
| `sendEmailOverrideFunction` | `(rawEmail) => Promise<void>`     | `undefined`              | Optional function to override the default email-sending behavior.          |

### Example Usage

```tsx
import { JuneBug } from "junebug";

<JuneBug
  customIcon="data:image/png;base64,...yourBase64IconHere..."
  iconAlt="Custom Bug Icon"
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

---

### Installation

```bash
npm install junebug
