import { BrowserRouter, Routes, Route, redirect,useNavigate } from "react-router-dom";
import "./styles.css";
import Quiz from "./pages/quiz";
import Signup from "./pages/signup";
import Login from "./pages/login";
import SumbmitQues from "./pages/submitQues";
function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz"  element={<Quiz />}></Route>
          <Route path="/newQues"  element={<SumbmitQues />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
