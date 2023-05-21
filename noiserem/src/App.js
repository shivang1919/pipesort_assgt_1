import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Frontpage from "./components/Frontpage/Frontpage"
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Frontpage />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
