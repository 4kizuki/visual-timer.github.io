import type {NextPage} from 'next'
import React from "react";

function useAutoFocus<RefType extends HTMLElement>(): React.RefObject<RefType> {
  const inputRef = React.useRef<RefType>(null);

  React.useEffect(() => {
    const node = inputRef.current;
    if (node) {
      node.focus();
    }
  }, []);

  return inputRef;
}

const Home: NextPage = () => {
  const [intervalText, setIntervalText] = React.useState("");
  const parsedInterval = React.useMemo<{
    type: "Empty" | "Error"
  } | {
    type: "Parsed",
    value: number
  }>(() => {
    if (intervalText === "") return {type: "Empty"};
    const parsed = parseInt(intervalText, 10);
    if (isNaN(parsed)) return {type: "Error"};
    if (`${parsed}` === intervalText) return {type: "Parsed", value: parsed};
    return {type: "Error"};
  }, [intervalText]);

  const [intervalSeconds, setIntervalSeconds] = React.useState<null | number>(null);

  const [ringing, setRinging] = React.useState(false);

  React.useEffect(() => {
    if (!intervalSeconds) return;
    if (ringing) return;

    const intervalId = setInterval(() => {
      setRinging(true);
    }, intervalSeconds * 1000);

    return () => {
      clearInterval(intervalId);
    }
  }, [intervalSeconds, ringing]);

  const ref = useAutoFocus<HTMLInputElement>();

  return (
    <>
      <main>
        <div>
          <br/>
          間隔: <input ref={ref}
                     type="text"
                     value={intervalText}
                     onChange={e => setIntervalText(e.target.value)}
                     onKeyPress={e => {
                       if (e.key == 'Enter') {
                         e.preventDefault()
                         if (parsedInterval.type === "Parsed") setIntervalSeconds(parsedInterval.value)
                       }
                     }
                     }/>秒
          <br/>
          <p>{parsedInterval.type === "Parsed" && parsedInterval.value !== intervalSeconds && <>未保存 - Enter で保存</>}</p>
        </div>
        {ringing && <>
          <p>時間です!! 確認してください!!</p>
          <button onClick={() => { setRinging(false)} }>確認しました</button>
        </>}
      </main>
      <style jsx>{`
        div {
          margin: 5vw;
          padding: 5vw;
          font-size: 4.5vw;
          border: solid 1px black;
          background-color: rgb(200, 200, 255);
          color: #666;
        }
        
        div > p {
          height: 3vw;
          font-size: 2vw;
        }

        input:focus {
          border-bottom: solid 0.5vw ${parsedInterval.type === "Error" ? 'red' : '#666'};
        }

        input {
          color: ${parsedInterval.type === "Error" ? 'red' : '#666'};
          outline: none;
          border-bottom: solid 0.5vw transparent;
        }

        main {
          height: 100%;
        }
        
        main > p {
          font-size: 3vw;
          text-align: center;
        }
        
        main > button {
          font-size: 3vw;
          margin: 5vw auto;
          display: block;
          width: 30vw;
          text-align: center;
          padding: 5vw;
          border: solid 1vw;
        }
      `}</style>
      <style jsx global>{`
        html, body, div#__next {
          height: 100%;
        }

        html {
          animation: ${ringing ? "flash 1s steps(1) infinite" : "none"};
        }

        @keyframes flash {
          0%, 100% {
            background-color: black;
            color: white;
          }
          50% {
            background-color: yellow;
            color: black;
          }
        }
      `}</style>
    </>
  )
}

export default Home
