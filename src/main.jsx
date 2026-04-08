// this file is the bridge between the HTML and the React application
// it's only job is mounting the app

// StrictMode is a react development tool
// it's a wrapper component that intentionally activates additional checks and warnings during development only
// it's most important behavior is that it deliberately renders components twice in development to help you catch side effects that shouldn't be running more than once
// it has no effect on production build
import { StrictMode } from "react";

// createRoot is React 18's API for mounting a React application
// the /client at the end is important — react-dom has multiple entry points for different environments
// /client specifies you're targeting the browser DOM
import { createRoot } from "react-dom/client";

// root component
// App is the top of the component tree — everything else in the application is a child, grandchild, or deeper descendant of App
import App from "./App.jsx";

// createRoot needs an actual DOM node — a real JavaScript object representing an HTML element
// it finds the <div id="root"> in index.html and creates a React root there
// then .render() renders the App component inside StrictMode into the root
// everything users will ever see flows from this single render call
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
