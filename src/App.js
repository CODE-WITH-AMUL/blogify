import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetStarted from "./landingpage";
import Blog from "./sites/Blog";
import BlogDetail from "./sites/BlogDetail";
import Category from "./sites/Category";
import { ThemeProvider } from "./context/ThemeContext";
import './static/style/main.css'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/category/:categoryName" element={<Category />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
