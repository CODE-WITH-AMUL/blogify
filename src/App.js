import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetStarted from "./landingpage";
// import About from "./About";
// import Blog from "./Blog";
// import Contact from "./Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/blog" element={<Blog />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
