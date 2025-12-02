import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetStarted from "./landingpage";
import Blog from "./sites/Blog";
import BlogDetail from "./sites/BlogDetail";
import './static/style/main.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
