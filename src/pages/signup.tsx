import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { jwtDecode } from "jwt-decode";
//protected routes

function Signup() {
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

  async function handleSubmit(
    this: any,
    event: { preventDefault: () => void }
  ) {
    event.preventDefault();
    // console.log(user);
    try {
      let response: any = await axios.post("http://localhost:3001/signup", {
        email: user.email,
        password: user.password,
      });
      const token = response.data.userData.token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // for all requests
      localStorage.setItem("token", token);
      navigate("/quiz", { state: user.email });
    } catch (error:any) {
      console.log(error)
      setNewMessage(error.response.data.message)
    }
  }

  return (
    <>
      <div className="container">
        <h2>Signup</h2>
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

          <input type="submit" value="Register" />
        </form>
        <div className="toggle-btn">
          Already have an account?<br></br>
          <Link to="/login">Login Here</Link>
        </div>
        <br />
        <span className="red">{message}</span>
      </div>
      <Outlet />
    </>
  );
}

export default Signup;
