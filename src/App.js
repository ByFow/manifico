import { useEffect, useState } from 'react';
import './App.css';
import { ethers } from "ethers";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState("0")
  const [survey, setSurvey] = useState([]);
  const [allSurvey, setAllSurvey] = useState([]);
  const [textNewSurver, setTextNewSurvey] = useState("");
  const [addSurvey, setAddSurvey] = useState(false);
  const [resultSurvey, setResultSurvey] = useState(false);

  const handleConnection = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    if (signer._isSigner) {
      setIsConnected(true);
      const _balance = await signer.getBalance()

      setBalance(ethers.utils.formatEther(_balance))
    }
  }

  const handleVote = (voteId, voteResult) => {
    // Send Result to API here :)

    setSurvey((prevSurvey) => {
      const newArr = prevSurvey.filter(survey => survey.id !== voteId);
      return [...newArr];
    });
  }

  console.log(survey);

  const handleAddSurvey = () => {
    if (textNewSurver.length > 10) {
      const parsedId = parseInt(survey[survey.length - 1].id) + 1;
      const newObj = {
        id: parsedId,
        question: textNewSurver,
        anwser: false,
        ended: false
      };

      setSurvey((prevSurvey) => {
        const arr = [...prevSurvey];
        arr.push(newObj);
        return arr;
      });
      setTextNewSurvey("");
      setAddSurvey(!addSurvey);
    }
  }

  useEffect(() => {
    const surveyDefault = [
      { id: 1, question: "Est-ce que Micka va réussir à finir son Smart Contract ?", anwser: false, ended: true, voteYes: 10, voteNo: 16 },
      { id: 2, question: "Le micro de Jerôme finira t-il par fonctionner normalement ?", anwser: false, ended: true, voteYes: 90, voteNo: 16 },
      { id: 3, question: "Est-ce que Tahar va être de bonne humeur aujourd'hui ?", anwser: false, ended: false }
    ];
    setSurvey(surveyDefault.filter(survey => survey.anwser === false).filter(survey => survey.ended === false));
    setAllSurvey(surveyDefault.filter(survey => survey.ended === true));
  }, [])

  if (isConnected) {
    if (survey.length > 0) {
      return (
        <div className="App App-header">
          <p className={"accountBalance"}>{balance} ETH</p>
          <p className={"surveyAsk"}>{survey[0].question ? survey[0].question : "..."}</p>
          <div className="SurveyButtons">
            <div onClick={() => handleVote(survey[0].id ? survey[0].id : 0, true)} className={"SurveyButton sayYes"}><p>Oui</p></div>
            <div onClick={() => handleVote(survey[0].id ? survey[0].id : 0, false)} className={"SurveyButton sayNo"}><p>Non</p></div>
          </div>
          <div className={"addSurvey"} style={addSurvey ? { visibility: 'visible' } : { visibility: 'hidden' }}>
            <input type={"text"} placeholder={"Your question here !"} value={textNewSurver} onChange={(e) => setTextNewSurvey(e.target.value)} />
            <button onClick={() => handleAddSurvey()}>Let's Go !</button>
          </div>
          <div className="results" style={resultSurvey ? { visibility: 'visible' } : { visibility: 'hidden' }}>
            <h1>Résultats des votes</h1>
            {allSurvey.map(survey => {
              const percent = survey.voteYes * 100 / (survey.voteNo + survey.voteYes);
              const percentYes = parseFloat(percent).toFixed(2);
              return (
                <div className={"resultContainer"}>
                  <div className={"resultQuestion"}>{survey.question}</div>
                  <div className={"progressBar"} style={{ marginLeft: 20 }}>
                    {percentYes >= 50 ? (
                      <div className={"progressBarResult"} style={{ width: `${percentYes}%`, backgroundColor: '#52c458' }}>OUI ({percentYes}%)</div>
                    ) :
                      (
                        <div className={"progressBarResult"} style={{ width: `${(100 - percentYes)}%`, backgroundColor: '#ef5350' }}>NON ({(100 - percentYes)}%)</div>
                      )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className={"surveyVoted"}>
            <i className="fas fa-fire icons" onClick={() => setResultSurvey(!resultSurvey)}></i><i className="fas fa-plus icons" onClick={() => setAddSurvey(!addSurvey)}></i>
          </div>
        </div>
      )
    } else {
      return (
        <div className="App App-header">
          <p className={"accountBalance"}>{balance} ETH</p>
          <div className="results">
            <h1>Résultats des votes</h1>
            {allSurvey.map(survey => {
              const percent = survey.voteYes * 100 / (survey.voteNo + survey.voteYes);
              const percentYes = parseFloat(percent).toFixed(2);
              return (
                <div className={"resultContainer"}>
                  <div className={"resultQuestion"}>{survey.question}</div>
                  <div className={"progressBar"} style={{ marginLeft: 20 }}>
                    {percentYes >= 50 ? (
                      <div className={"progressBarResult"} style={{ width: `${percentYes}%`, backgroundColor: '#52c458' }}>OUI ({percentYes}%)</div>
                    ) :
                      (
                        <div className={"progressBarResult"} style={{ width: `${(100 - percentYes)}%`, backgroundColor: '#ef5350' }}>NON ({(100 - percentYes)}%)</div>
                      )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  } else {
    return (
      <div className="App App-header">
        <button className={"App-Button"} onClick={() => handleConnection()}>Connectez-vous</button>
      </div>
    );
  }
}

export default App;
