import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import checkmark from "../../assets/images/JuneBugCheckmark.png";
import "../../assets/styles/JuneBugPopup.css";
// import { getCapturedLogs } from './ConsoleCapture';

interface BugPopupProps {
  onClose: () => void;
  onSubmit?: (
    message: string,
    screenshotDataUrl?: string | null,
    userInfo?: any
  ) => void;
  darkMode?: boolean;
  triggerPosition?: { x: number; y: number } | null;
  disableScreenshot?: boolean
}

export const JuneBugPopUp: React.FC<BugPopupProps> = ({
  onClose,
  onSubmit,
  darkMode = false,
  triggerPosition,
  disableScreenshot
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [enlarged, setEnlarged] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [screenshotAttached, setScreenshotAttached] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [popupHeight, setPopupHeight] = useState<number | undefined>(undefined);
  // const [countdown, setCountdown] = useState(5);

  const offset = useRef({ x: 0, y: 0 });

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
  const checkMarkIcon = addBase64Prefix(checkmark);

  const popupWidth = 400;
  const popupHeightDefault = 300;
  const EDGE_MARGIN = 25;

  const getClampedPosition = (x: number, y: number) => {
    const margin = 8;
    const maxX = window.innerWidth - popupWidth - margin;
    const maxY = window.innerHeight - popupHeightDefault - margin;
    const minX = margin;
    const minY = margin;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const [position, setPosition] = useState(() => {
    if (!triggerPosition) {
      return {
        x: window.innerWidth / 2 - popupWidth / 2,
        y: window.innerHeight / 2 - popupHeightDefault / 2,
      };
    }
    return getClampedPosition(triggerPosition.x, triggerPosition.y);
  });

  //take screenshot when popup opens automatically
  useEffect(() => {
    if (!disableScreenshot) {takeScreenshot();}
    textareaRef.current?.focus();
  }, []);

  //close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  //resize handler
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => getClampedPosition(prev.x, prev.y));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  //initial position
  useEffect(() => {
    if (!triggerPosition || !popupRef.current) return;

    const { offsetWidth, offsetHeight } = popupRef.current;
    const rawX = triggerPosition.x;
    const rawY = triggerPosition.y;

    const clampedX = Math.min(
      Math.max(EDGE_MARGIN, rawX),
      window.innerWidth - offsetWidth - EDGE_MARGIN
    );
    const clampedY = Math.min(
      Math.max(EDGE_MARGIN, rawY),
      window.innerHeight - offsetHeight - EDGE_MARGIN
    );

    setPosition({ x: clampedX, y: clampedY });
  }, [triggerPosition]);

  useEffect(() => {
    if (!screenshot || !popupRef.current) return;

    const { offsetTop, offsetHeight } = popupRef.current;
    const overflowY = offsetTop + offsetHeight - window.innerHeight;

    if (overflowY > 0) {
      const newY = Math.max(position.y - overflowY - EDGE_MARGIN, EDGE_MARGIN);
      setPosition((prev) => ({ ...prev, y: newY }));
    }
  }, [screenshot]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (popupRef.current && e.button === 0) {
      setDragging(true);
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rawX = e.clientX - offset.current.x;
    const rawY = e.clientY - offset.current.y;

    const popupWidthCurrent = popupRef.current?.offsetWidth || 400;
    const popupHeightCurrent = popupRef.current?.offsetHeight || 300;

    const clampedX = Math.min(
      Math.max(EDGE_MARGIN, rawX),
      window.innerWidth - popupWidthCurrent - EDGE_MARGIN
    );
    const clampedY = Math.min(
      Math.max(EDGE_MARGIN, rawY),
      window.innerHeight - popupHeightCurrent - EDGE_MARGIN
    );

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // const startCountdown = (start: number) => {
  //   for (let i = start; i > 0; i--) {
  //     setTimeout(() => setCountdown(i), (start - i) * 1000);
  //   }

  //   setTimeout(() => {
  //     if (submitted)
  //       onClose();
  //     // setSubmitted(false);
  //   }, start * 1000);
  // };

  const takeScreenshot = async () => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const canvas = await html2canvas(document.documentElement, {
      logging: false,
      width: window.innerWidth,
      height: window.innerHeight,
      x: window.scrollX,
      y: window.scrollY,
      scale: window.devicePixelRatio,
      scrollX: 0,
      scrollY: 0,
    });
    const dataUrl = canvas.toDataURL("image/png");
    setScreenshot(dataUrl);
  };

  const handleSubmit = () => {
    if (!message.trim()) return;

    if (popupRef.current) {
      setPopupHeight(popupRef.current.offsetHeight);
    }

    onSubmit?.(message, screenshotAttached ? screenshot : undefined);
    // console.log("cleaning up popup")
    setMessage("");
    setScreenshot(null);
    setEnlarged(false);
    setSubmitted(true);

    // startCountdown(countdown);
  };

  const containerClass = `bug-popup-container${darkMode ? " dark" : ""}`;
  const textareaClass = `bug-popup-textarea${darkMode ? " dark" : ""}`;
  const confirmationMessageClass = `confirmation-message${darkMode ? " dark" : ""}`;

return (
  <div
    className="bug-popup-overlay"
    data-html2canvas-ignore
    onClick={() => {
      if (submitted) onClose();
    }}
  >
    <div
      className={containerClass}
      ref={popupRef}
      onMouseDown={submitted ? undefined : handleMouseDown}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: dragging ? "grabbing" : submitted ? "default" : "grab",
        height: submitted && popupHeight ? `${popupHeight}px` : undefined,
        overflow: "hidden",
        transition: "height 0.2s ease"
      }}
    >
      {/* Header always shown */}
      <div className="bug-header-popup-close-container">
        <span className="header-text">
          {submitted ? "Thank you!" : "Having trouble?"}
        </span>
        <button
          className="bug-popup-close"
          onClick={onClose}
          aria-label="Close Popup"
        >
          ×
        </button>
      </div>

      <div className="bug-popup-body">
        {submitted ? (
          <div className="submit-confirmation">
            <img src={checkMarkIcon} alt="Success" className="confirmation-check" draggable={false} />
            <div className="confirmation-title">Report Received</div>
            <div className={confirmationMessageClass}>
              We are working to fix your issue.
            </div>
            <div className={confirmationMessageClass} style={{fontSize:"0.75em", marginTop:"0.75em"}}>
              Click anywhere to close.
            </div>
          </div>
        ) : (
          <>
            <textarea
              ref={textareaRef}
              className={textareaClass}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what happened..."
              onMouseDown={(e) => e.stopPropagation()}
              rows={4}
            />

            {!disableScreenshot && (
              <label className="screenshot-toggle" >
                <input
                  type="checkbox"
                  checked={screenshotAttached}
                  onChange={() => setScreenshotAttached(!screenshotAttached)}
                />
                <span className="slider" />
                <span className="label-text">Attach Screenshot</span>
              </label>
            )}

            {screenshotAttached && !disableScreenshot && (
              <div className="bug-popup-screenshot-container">
                <div className="bug-popup-image-wrapper">
                  {screenshot ? (
                    <img
                      src={screenshot}
                      alt="Screenshot Preview"
                      onClick={() => setEnlarged(true)}
                      className="bug-popup-preview-img"
                      onMouseDown={(e) => e.stopPropagation()}
                      draggable={false}
                    />
                  ) : (
                    <div className="bug-popup-placeholder-img">
                      Taking Screenshot...
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bug-popup-buttons">
              <div className="tooltip-wrapper">
                <button
                  className={`bug-popup-submit ${message.trim().length === 0 ? "show-tooltip" : ""}`}
                  disabled={message.trim().length === 0}
                  onClick={handleSubmit}
                  onMouseDown={(e) => e.stopPropagation()}
                  data-tip="Describe the issue"
                >
                  Send Report
                </button>
              </div>
            </div>
          </>
        )}
      </div> 

    </div>

    {enlarged && (
      <div className="bug-popup-fullscreen" onClick={() => setEnlarged(false)}>
        <img src={screenshot!} alt="Full Screenshot" />
      </div>
    )}
  </div>

)};
