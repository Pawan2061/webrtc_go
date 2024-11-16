import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateRoom } from "./pages/Create";
import { Join } from "./pages/Join";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateRoom />}></Route>
          <Route path="/room/:roomID" element={<Join />}></Route>?
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
