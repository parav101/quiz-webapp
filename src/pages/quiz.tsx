import { useEffect, useState } from "react";
import { redirect,useLocation,Link, useNavigate  } from "react-router-dom"; //use this for authorization with function
import "../styles.css";
import axiosApiInstance from "./interceptor";
function Quiz() {
  const navigate = useNavigate();
  const[email,setNewEmail]= useState("")
  const [questionSet, setQuestionSet] = useState<
    {
      id: string;
      question: string;
      options: {
        id: string;
        option: string;
      }[];
    }[]
  >([]);
  const [newSelect, setNewSelect] = useState<{ questionId: string; optionId: string }[]>(
    []
  );
  const [score, setNewScore] = useState(0);
  const {state} = useLocation();
  async function updatePage() {
    console.log("update");
    setNewEmail(state)
    try {
      let response = await axiosApiInstance.get("http://localhost:3001/");
      response = response.data;
      setQuestionSet(response.data.values);
      console.log(questionSet);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    updatePage();
    console.log("useEffect");
    
  }, []);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log(newSelect);
  
    let response = await axiosApiInstance.post("http://localhost:3001/", {
      newSelect: newSelect,
    });
    console.log(response)
    setNewScore(response.data.score);
  }

  async function checkIfQuestionExist(questionId: string) {
    let isQuestionPresent = false;
    for (let i = 0; i < newSelect.length; i++) {
      let currentElement = newSelect[i];
      if (currentElement.questionId == questionId) {
        isQuestionPresent = true;
        return isQuestionPresent;
      }
    }

    return isQuestionPresent;
  }

  async function toggleOption(optionId: string, questionId: string) {
    console.log("toggle");
    // let flag = true;

    let isQuestionPresent = await checkIfQuestionExist(questionId);
    // checkId(questionId).then((val)=>{console.log(val)})
    if (isQuestionPresent) {
      console.log("add");
      setNewSelect((currentSelect) => {
        return currentSelect.map((select) => {
          if (select.questionId === questionId) {
            return { ...select, questionId: questionId, optionId: optionId };
          }
          return select;
        });
      });
    } else {
      setNewSelect((currentSelect) => [
        ...currentSelect,
        {
          questionId: questionId,
          optionId: optionId,
        },
      ]);
    }
  }

  const logout = (isItTrue:boolean) => {
    console.log("logout")
    if(isItTrue) {
      localStorage.removeItem("token");
      navigate('/login')
  }
    // setIsLoggedin(false);
  }

  return (
    <>
      <div >
        <h2>Quiz</h2>
        {questionSet.length === 0 && "No Quizes"}
        <form id="quiz-form" onSubmit={handleSubmit}>
          {questionSet.map((que) => {
            return (
              <div className="question">
                <p>{que["question"]}</p>
                {que["options"].map((opt) => {
                  return (
                    <div className="option">
                      <label>
                        <input
                          type="radio"
                          value={opt.option}
                          name={que.id}
                          // checked={newSelect === opt.opt}
                          onChange={(e) => toggleOption(opt["id"], que["id"])}
                        />
                        {opt.option}
                      </label>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <button className="submit-button">Submit</button>
        </form>
        <div id="result" className="result"></div>
        <h3>Your score: {score}</h3>
        <p>logged in email:</p>
        {email}
       
        <br /><br />
            <button className="submit-button" onClick={(e)=>{logout(true)}}>Logout User</button>
      </div>
    </>
  );
}

export default Quiz;
