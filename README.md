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


---

### Installation

```bash
npm install junebug
