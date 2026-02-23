import { useState, useEffect } from "react";
import { auth, loginWithGoogle, logout } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

/* ------------------ GAME COMPONENT ------------------ */
function Game() {
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10));
  const [answer, setAnswer] = useState("");
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("");

  const generateNewQuestion = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setAnswer("");
  };

  const checkAnswer = () => {
    if (parseInt(answer) === num1 + num2) {
      setStreak((prev) => prev + 1);
      setMessage("✅ Correct! Streak increased.");
    } else {
      setStreak(0);
      setMessage("❌ Wrong! Streak reset.");
    }
    generateNewQuestion();
  };

  return (
    <div className="mt-6 p-5 border rounded shadow-md bg-gray-50">
      <h2 className="text-xl font-bold text-gray-700">Solve the Puzzle</h2>

      <p className="text-lg mt-3">
        {num1} + {num2} = ?
      </p>

      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="mt-3 border p-2 rounded w-24 text-center"
        placeholder="Answer"
      />

      <button
        onClick={checkAnswer}
        className="ml-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Submit
      </button>

      <p className="mt-3 text-sm">{message}</p>

      <p className="mt-2 text-lg font-bold text-orange-600">
        🔥 Streak: {streak}
      </p>
    </div>
  );
}

/* ------------------ MAIN APP ------------------ */
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-blue-600">🧠 Logic Looper</h1>

      {!user ? (
        <button
          onClick={async () => {
            try {
              const u = await loginWithGoogle();
              if (u) setUser(u);
            } catch (e) {
              console.error(e);
            }
          }}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Login with Google
        </button>
      ) : (
        <>
          <p className="mt-4 text-lg font-semibold">
            Welcome, {user.displayName}
          </p>

          {/* GAME UI */}
          <Game />

          <button
            onClick={logout}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}