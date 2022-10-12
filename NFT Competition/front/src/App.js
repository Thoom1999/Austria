import { Routes, Route } from "react-router-dom";
import Vote from "./pages/Vote";
import Submit from "./pages/Submit";
import Result from "./pages/Result";
import Mint from "./pages/Mint";
import NoPage from "./pages/NoPage";
import Navigation from "./components/Navigation";
import Admin from "./pages/Admin";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="e12137112/" element={<Vote/>}/>
        <Route path="e12137112/submit" element={<Submit/>}/>        
        <Route path="e12137112/result" element={<Result/>}/>
        <Route path="e12137112/mint" element={<Mint/>}/>
        <Route path="e12137112/admin" element={<Admin/>}/>
        <Route path="*" element={<NoPage/>}/>
      </Routes>
    </>
  );
}

export default App;
