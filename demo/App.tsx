import { JuneBug } from "../src/components/JuneBug";
localStorage.setItem('juneBugDemoAppFlag', 'true');

const App = () => {
  return (
    <div>
      <h1>JuneBug Test</h1>
      <JuneBug 
        // appName="JuneBug Demo"
        supportInbox="your@email.com"
        iconOffset={{x: 150, y: 150}}
        darkMode={true}
        // subjectPrefix="Testing JuneBug"
        // userInfo={{ fullName: "Your Name", shortName: "your?", otherInfo: "cool!" }}
      />
    </div>
  );
};

export default App;
