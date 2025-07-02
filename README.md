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

**Light Mode:**  
![JuneBug Icon Preview Light Mode](https://github.com/jeffalo13/junebug/blob/main/assets/images/JuneBugIcon.png)
![JuneBug Popup Preview Light Mode](https://github.com/jeffalo13/junebug/blob/main/assets/images/user-popup-input-light-preview.png)
![JuneBug Confirmation Preview Light Mode](https://github.com/jeffalo13/junebug/blob/main/assets/images/bug-submitted-light-preview.png)

**Dark Mode:**  
![JuneBug Icon Preview Dark Mode](https://github.com/jeffalo13/junebug/blob/main/assets/images/JuneBugIconDarkMode.png)
![JuneBug Popup Preview Dark Mode](https://github.com/jeffalo13/junebug/blob/main/assets/images/user-popup-input-dark-preview.png)
![JuneBug Confirmation Preview Dark Mode](https://github.com/jeffalo13/junebug/blob/main/assets/images/bug-submitted-dark-preview.png)

---

### Installation

```bash
npm install junebug
