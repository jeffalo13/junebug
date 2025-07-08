import React, { useState, useRef, useEffect } from "react";
import lightModeIcon from "../../assets/images/JuneBugIcon.png";
import darkModeIcon from "../../assets/images/JuneBugIconDarkMode.png";
import checkmark from "../../assets/images/JuneBugCheckmark.png";
import { JuneBugPopUp } from "./JuneBugPopup";
import { SendEmailOptions, sendEmailReport } from "./JuneBugEmailer";
import "../../assets/styles/JuneBug.css";
import { prettyPrintLogsForEmail, getCapturedLogs } from "../utils/ConsoleCapture";

export interface JuneBugProps {
  /** Optional custom image for the bug icon in base64 string format */
  customIcon?: string;

  /** Alt text for the bug icon image */
  iconAlt?: string;

  /** Enable dark mode styling */
  darkMode?: boolean;

  /** Reporter information to include in the report */
  reporterInfo?: any;

  /** Email address to send the report to */
  supportInbox?: string;

  /** Optional application name to include in the email subject */
  appName?: string;

  /** Custom subject line prefix for the email */
  subjectPrefix?: string;

  /** Disables emailer if true */
  disableEmailer?: boolean;

  /** Disables log attachment if true */
  disableConsoleLogs?: boolean;

  /** Disables screenshot functionality if true */
  disableScreenshot?: boolean

  /** Disables component if false */
  visible?: boolean

  /** Custom object logs to be written to customLog.txt file.  Any object passed will be iterated through for each field and displayed as JSON in the file. */
  customLogObject?: any

  /** Override offset for position of JuneBug icon from bottom-right of screen (in px). Default is { x: 45, y: 65 } */
  iconOffset?: { x: number; y: number };

  /** Custom function to call after submit clicked */
  onSubmit?: (message: string, screenshotData?: string | null) => void;

  /** Override the default email sending function.  Raw e-mail text will still be automatically generated and then passed to your function instead of default emailer. */
  sendEmailOverrideFunction?: (rawEmail: string) => Promise<void>;
}

export const JuneBug: React.FC<JuneBugProps> = ({
  customIcon,
  iconAlt = "Bug Icon",
  darkMode = false,
  supportInbox,
  reporterInfo,
  appName,
  subjectPrefix,
  customLogObject,
  disableEmailer = false,
  disableConsoleLogs = false,
  disableScreenshot = false,
  visible = true,
  iconOffset,
  onSubmit,
  sendEmailOverrideFunction,

}) => {
  const iconSize = 40; // px
  const defaultOffset = iconOffset ?? { x: 45, y: 65 }; // distance from bottom/right edges

  const toolTipDefault = "Having trouble? Drag me to your issue!"
  // const toolTipDefault = "Drag me to your problem!"
  const toolTipDragging = "Let's fix this bug!"

  const [offsetFromCorner, setOffsetFromCorner] = useState(defaultOffset);
  const [dragging, setDragging] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mouseHovering, setMouseHovering] = useState(false);
  const [toolTipText, setToolTipText] = useState(toolTipDefault);
  const [hidden, setHidden] = useState(!visible);
  const [triggerPosition, setTriggerPosition] = useState<{ x: number; y: number } | null>(null);
  const dragStarted = useRef(false);
  const dragStartMouse = useRef({ x: 0, y: 0 });
  const dragStartOffset = useRef({ x: 0, y: 0 });


  const iconRef = useRef<HTMLImageElement | null>(null);

  // const iconSrc = customIcon || (darkMode ? darkModeIcon : lightModeIcon);

  function addBase64Prefix(base64: string): string {
    if (base64.startsWith('data:image')) return base64;

    // Check if localStorage flag "localDev" is set
    let isLocalDev = false;
    try {
      isLocalDev = localStorage.getItem('juneBugDemoAppFlag') === 'true';
    } catch {
      // localStorage may be unavailable in some contexts, fail gracefully
    }

    // Add prefix only if NOT local dev
    return isLocalDev ? base64 : `data:image/png;base64,${base64}`;
  }

  const iconSrc = customIcon ? customIcon : darkMode ? addBase64Prefix(darkModeIcon) : addBase64Prefix(lightModeIcon);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartMouse.current = { x: e.clientX, y: e.clientY };
    dragStartOffset.current = offsetFromCorner;
    setDragging(true);
    setToolTipText(toolTipDragging)
  };

  const handleTouchStart = (e: React.TouchEvent) => {
  // Only use the first touch
  e.preventDefault();
  const touch = e.touches[0];
  dragStartMouse.current = { x: touch.clientX, y: touch.clientY };
  dragStartOffset.current = offsetFromCorner;
  setDragging(true);
  setToolTipText(toolTipDragging);
};


  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;

      const deltaX = e.clientX - dragStartMouse.current.x;
      const deltaY = e.clientY - dragStartMouse.current.y;

      const newX = dragStartOffset.current.x - deltaX;
      const newY = dragStartOffset.current.y - deltaY;

      setOffsetFromCorner({
        x: Math.max(0, newX),
        y: Math.max(0, newY),
      });
    };


    const handleMouseUp = (e: MouseEvent) => {
      if (dragging) {
        setDragging(false);
        dragStarted.current = false;
        setTriggerPosition({ x: e.clientX, y: e.clientY });
        setShowPopup(true);
      }
    };


      // TOUCH EVENTS
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartMouse.current.x;
      const deltaY = touch.clientY - dragStartMouse.current.y;
      const newX = dragStartOffset.current.x - deltaX;
      const newY = dragStartOffset.current.y - deltaY;
      setOffsetFromCorner({
        x: Math.max(0, newX),
        y: Math.max(0, newY),
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (dragging) {
        setDragging(false);
        dragStarted.current = false;
        // Use the last known position if needed
        setShowPopup(true);
      }
    };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging]);

  const resetPosition = () => {
    setOffsetFromCorner(defaultOffset);
  };

  useEffect(() => {
    if (!showPopup) {
      resetPosition();
      setToolTipText(toolTipDefault);

    }
  }, [showPopup]);

  useEffect(() => {
    if (iconOffset) setOffsetFromCorner(iconOffset);
  }, [iconOffset]);

  const handleSubmit = async (message: string, screenshot?: string | null) => {


    try {

      if (!supportInbox || disableEmailer) return;

      const logsRaw = !disableConsoleLogs ? getCapturedLogs().toArray() : undefined;
      const formattedLogs = prettyPrintLogsForEmail(logsRaw);

      const rawEmail: SendEmailOptions = {
        to: supportInbox,
        message,
        logs: formattedLogs,
        screenshotBase64: screenshot,
        reporter: reporterInfo,
        appName,
        subjectPrefix,
        customLogObject
      };

      await sendEmailReport(rawEmail, sendEmailOverrideFunction);
    } catch (err) {
      console.error("Error sending bug report:", err);
    } finally {
      onSubmit?.(message, screenshot);
    }
  };



  return (
    <>
      {!hidden && (
        <div
          className="junebug-icon-wrapper"
          style={{
            position: "fixed",
            right: `${offsetFromCorner.x}px`,
            bottom: `${offsetFromCorner.y}px`,
            // zIndex: 999,
            // zIndex 
          }}
          onMouseEnter={() => setMouseHovering(true)}
          onMouseLeave={() => setMouseHovering(false)}
        >
          {!dragging && !showPopup && mouseHovering && (
            <button
              className="junebug-close-btn"
              onClick={() => setHidden(true)}
              aria-label="Hide bug icon">×</button>)
          }

          <div className="junebug-tooltip">{toolTipText}</div>
          <img
            ref={iconRef}
            src={iconSrc}
            alt={iconAlt}
            className="junebug-icon-button"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            draggable={false}
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              cursor: dragging ? "grabbing" : "grab",
            }}
          />
        </div>
      )}


      {showPopup && (
        <JuneBugPopUp
          onClose={() => setShowPopup(false)}
          onSubmit={handleSubmit}
          darkMode={darkMode}
          triggerPosition={triggerPosition}
          disableScreenshot={disableScreenshot}
        />
      )}
    </>
  );
};