import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Sender } from "./components/Sender";
import Receiver from "./components/Reciever";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sender" element={<Sender />} />
        <Route path="/receiver" element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;