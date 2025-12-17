import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

function App() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
