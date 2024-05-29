import { useEffect, useState } from "react";
import { redirect, useLocation, Link } from "react-router-dom"; //use this for authorization with function
import "../styles.css";
import axiosApiInstance from "./interceptor";

function SumbmitQues() {
  const [length, setNewLength] = useState(0);
  const [email, setNewEmail] = useState("");
  const [message, setNewMessage] = useState("");
  const [ques, setNewques] = useState<{
    question: string;
  }>();
  const [corOpt, setNewCorOpt] = useState<{
    corOption: string;
  }>();
  const [options, setNewoptions] = useState<{
    option1: string;
    option2: string;
    option3: string;
  }>({ option1: "", option2: "", option3: "" });
  const { state } = useLocation();


  function handleChange(event: any): void {
    const name: string = event.target.name;
    const value = event.target.value;
    if (name === "question") {
      setNewques((currentQues) => ({
        ...currentQues,
        question: value,
      }));
    } else {
      setNewoptions((currentOptions) => ({
        ...currentOptions,
        [name]: value,
      }));
    }
  }
  function toggleOption(event: any) {
    setNewCorOpt(event.target.value);
  }
  async function updateInfo() {
    console.log('updateInfo');
    setNewEmail(state);
    let response = await axiosApiInstance.get("http://localhost:3001/addQues");
    setNewLength(response.data.length);
    setNewMessage(response.data.message);
    console.log(response.data)
  }
  useEffect(() => {
    updateInfo();
    console.log("useEffect");
  }, []);


  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    updateInfo();
    // console.log(corOpt,options);
    console.log('handleSubmit');
    let response = await axiosApiInstance.post("http://localhost:3001/addQues", {
      ques: ques,
      options: options,
      corOption: corOpt,
    });
    console.log(response.data.length)
    setNewLength(response.data.length);
    setNewMessage(response.data.message);
    
  }


  return (
    <>
      <div className="sumbitQuesDiv">
        <h2>New Question</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="question">
            <label htmlFor="question">Question:</label>
            <input
              type="text"
              name="question"
              id="question"
              onChange={handleChange}
              required
            />
            <br />
            <span className="red">{message}</span> 
          </div>
          <div className="options">
            <label htmlFor="option1">1st option:</label>
            <input
              type="text"
              name="option1"
              id="option1"
              onChange={handleChange}
              required
            />
            <br />
            <label htmlFor="option2">2nd option:</label>
            <input
              type="text"
              name="option2"
              id="option2"
              onChange={handleChange}
              required
            />
            <br />
            <label htmlFor="option3">3rd option:</label>
            <input
              type="text"
              name="option3"
              id="option3"
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <div className="corOption">
            <input
              type="radio"
              name="corOpt"
              value={options.option1}
              onChange={toggleOption}
            />
            <label>Option 1</label>

            <input
              type="radio"
              name="corOpt"
              value={options.option2}
              onChange={toggleOption}
            />
            <label>Option 2</label>

            <input
              type="radio"
              name="corOpt"
              value={options.option3}
              onChange={toggleOption}
            />
            <label>Option 3</label>
          </div>
          <br />
          <button className="submit-button">Submit</button>
        </form>
        <br />
         <p>Total Questions:{length}</p>
        admin's current email: <br />
        {email} <br />
        <br />
        <Link to="/Login">Login</Link>
      </div>
    </>
  );
}

export default SumbmitQues;
