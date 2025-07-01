// demo/App.tsx
import React from "react";
import { JuneBug } from "../src/components/JuneBug";

                console.log("this is a log")
                console.info("this is a info")
                console.warn("this is a warn")
                console.error("this is a error")

const App = () => {
  return (
    <div>
      <h1>JuneBug Test</h1>
      <JuneBug
        appName="JuneBug Demo"
        supportInbox="your@email.com"
        subjectPrefix="Testing JuneBug"
        userInfo={{ fullName: "Your Name", shortName: "your?", otherInfo: "cool!" }}
      />
    </div>
  );
};

export default App;
