import React, { useState, useRef, useEffect } from "react";
import lightModeIcon from "../images/JuneBugIcon.png";
import darkModeIcon from "../images/JuneBugIconDarkMode.png";
import checkmark from "../images/JuneBugCheckmark.png";
import { JuneBugPopUp } from "./JuneBugPopup";
import { SendEmailOptions, sendEmailReport } from "./JuneBugEmailer";
import "./styles/JuneBug.css";
import { prettyPrintLogsForEmail, getCapturedLogs } from "../utils/ConsoleCapture";

const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

preloadImage(checkmark);

export interface JuneBugProps {
  /** Optional custom image for the bug icon */
  customIcon?: string;

  /** Alt text for the bug icon image */
  iconAlt?: string;

  /** Enable dark mode styling */
  darkMode?: boolean;

  /** User information to include in the report */
  userInfo?: any;

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

  /** If false, the component is not rendered. */
  visible?: boolean

  /** Custom object logs to be written to  customLog.txt file.  Any object passed will be iterated thru for each field and displayed as JSON in the file. */
  customLogObject?: any

  /** Custom user function to call after submit clicked */
  onSubmit?: (message: string, screenshotData?: string | null) => void;

  /** Override the default email sending function */
  sendEmailOverrideFunction?: (rawEmail: string) => Promise<void>;
}

export const JuneBug: React.FC<JuneBugProps> = ({
  customIcon,
  iconAlt = "Bug Icon",
  darkMode = false,
  supportInbox,
  userInfo,
  appName,
  subjectPrefix,
  customLogObject,
  disableEmailer = false,
  disableConsoleLogs = false,
  visible = true,
  onSubmit,
  sendEmailOverrideFunction,
  
}) => {
  const iconSize = 40; // px
  const defaultOffset = { x: 45, y: 65 }; // distance from bottom/right edges

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

  const iconSrc = customIcon || (darkMode ? darkModeIcon : lightModeIcon);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartMouse.current = { x: e.clientX, y: e.clientY };
    dragStartOffset.current = offsetFromCorner;
    setDragging(true);
    setToolTipText(toolTipDragging)
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
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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
      reporter: userInfo,
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
            zIndex: 999,
          }}
            onMouseEnter={() => setMouseHovering(true)}
            onMouseLeave={() => setMouseHovering(false)}
        >
          {!dragging && !showPopup && mouseHovering &&(          
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
              />
            )}
          </>
        );
      };