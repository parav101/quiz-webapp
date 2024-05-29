import { Outlet, Link, useNavigate } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const[message,setNewMessage] = useState("")
  const [user, setNewUser] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  useEffect(() => {
    let token: any = localStorage.getItem("token");
    if (token) {
      const user: any = jwtDecode(token);
      if (user.role === "admin") {
        navigate("/newQues", { state: user.email });
      } else {
        navigate("/quiz", { state: user.email });
      }
    }
    console.log("useEffect");
  }, []);

  async function handleChange(event: any) {
    // event.preventDefault();

    const name = event.target.name;
    const value = event.target.value;
    setNewUser((currentNewUser) => ({
      ...currentNewUser,
      [name]: value,
    }));
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    try {
      let response = await axios.post("http://localhost:3001/login", {
        email: user.email,
        password: user.password,
      });
      const token: any = response.data.userData.token;
      const info: any = jwtDecode(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // for all requests
      localStorage.setItem("token", token);
      if (info.role === "admin") {
        navigate("/newQues", { state: user.email });
      } else {
        navigate("/quiz", { state: user.email });
      }
    } catch (error:any) {   
      setNewMessage(error.response.data.message)
    }
  }
  return (
    <>
      <div className="container">
        <h2>Login</h2>
        <form action="#" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <input type="submit" value="Login" />
        </form>
        <div className="toggle-btn">
          Don't have an account?<br></br>
          <Link to="/">Signup Here</Link>
        </div>
        <br />
        <span className="red">{message}</span>
      </div>
      <Outlet />
    </>
  );
}

export default Login;
