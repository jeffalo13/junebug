import { JuneBug } from "../src/components/JuneBug";
localStorage.setItem('juneBugDemoAppFlag', 'true');

console.log("this is a log")
console.warn("this is a warn")
console.info("this is a info")
console.error("this is a err")


const App = () => {
  return (
    <div>
      <h1>JuneBug Test</h1>
      <JuneBug 
        // appName="JuneBug Demo"
        supportInbox="jeffalox@gmail.com"
        iconOffset={{x: 150, y: 150}}
        darkMode={true}
        disableScreenshot={false}
        // subjectPrefix="Testing JuneBug"
        // userInfo={{ fullName: "Your Name", shortName: "your?", otherInfo: "cool!" }}
      />
    </div>
  );
};

export default App;
