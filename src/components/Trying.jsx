// import { useEffect, useState } from "react";

// function Trying({ prompt }) {
//   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!prompt) return;

//     const fetchGemini = async () => {
//       setLoading(true);
//       setResponse("");

//       try {
//         const res = await fetch(
//           `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               contents: [
//                 {
//                   parts: [{ text: prompt }],
//                 },
//               ],
//             }),
//           }
//         );

//         const data = await res.json();

//         const text =
//           data.candidates?.[0]?.content?.parts?.[0]?.text ||
//           "No response from Gemini";

//         setResponse(text);
//       } catch (err) {
//         console.error("Gemini error:", err);
//         setResponse("Error fetching Gemini response");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGemini();
//   }, [prompt]);

//   if (!prompt) return null;

//   return (
//     <div className="gemini-result">
//       {loading && <p>Gemini is thinking...</p>}
//       {!loading && response && <p>{response}</p>}
//     </div>
//   );
// }

// export default Trying;


import React, { useEffect, useState } from 'react'
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyCVTY0_ilEYXiCSZ99S-R13EbVOWSJIWwU"});



const Trying = () => {

        
    const [geminiData, setGeminiData] = useState("")
    const [input, setInput] = useState("Greet me in a friendly manner")
    const api =async ()=> {
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: input,
            });
            
            setGeminiData(response.text)
          }
    return (
        <div style={{width:"50%", margin:"auto", textAlign:"center", border:"1px solid black", padding:"10px", borderRadius:"10px", marginTop:"20px", height: "90vh"}}>
            <div>
                <h1>Gemini Chat</h1>
            </div>
            <input type="text" style={{width:"100%"}} value={input} onChange={(e)=>setInput(e.target.value)} />
            <button onClick={api}>Generate</button>
            <div>{geminiData}</div>
        </div>
    )
}

export default Trying