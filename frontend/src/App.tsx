import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pally from "./assets/Pally.png";
import "./index.css";

const App: React.FC = () => {
  const { login, authenticated } = usePrivy();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard");
    }
  }, [authenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white font-sans bg-gradient-to-br from-[#111111] to-[#1A1A1A]">
      {/* Logo */}
      <div className="absolute top-5 left-5">
        <img src={Pally} alt="Logo" className="h-12 w-auto" />
      </div>

      {/* Header Button */}
      <div className="absolute top-5 right-5">
        <button className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-[#6200EE] to-[#BB86FC] text-white rounded-full shadow-lg hover:opacity-90 transition-opacity">
          Link Telegram
        </button>
      </div>

      {/* Content */}
      <div className="text-center space-y-6 px-4 max-w-[700px]">
        <h1 className="text-5xl sm:text-4xl font-bold bg-gradient-to-r from-[#BB86FC] to-[#03DAC6] bg-clip-text text-transparent">
          Pally Trading Assistant
        </h1>
        <p className="text-lg text-gray-300">
          This bot will help you become a better trader. It identifies
          repetitive mistakes and provides actionable advice to help you avoid
          them in the future.
        </p>
      </div>

      {/* Button */}
      <div className="mt-10">
        <button
          onClick={login}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#6200EE] to-[#BB86FC] text-white text-lg font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg"
        >
          <span>Launch App</span>

          <span>View your portfolio</span>
          <span>&rarr;</span>
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 right-5">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-[#BB86FC] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M24 4.557a9.93 9.93 0 01-2.828.775A4.93 4.93 0 0023.337 3c-.948.56-2 .97-3.127 1.184a4.92 4.92 0 00-8.379 4.482c-4.084-.205-7.708-2.162-10.141-5.138a4.822 4.822 0 00-.66 2.476c0 1.708.87 3.213 2.188 4.095a4.904 4.904 0 01-2.228-.616c-.053 2.281 1.581 4.415 3.946 4.89a4.935 4.935 0 01-2.224.085c.623 1.946 2.434 3.36 4.575 3.401a9.868 9.868 0 01-6.102 2.102c-.396 0-.787-.023-1.175-.067A13.94 13.94 0 007.548 21c9.142 0 14.307-7.721 14.307-14.422 0-.22-.005-.438-.014-.656A10.254 10.254 0 0024 4.557z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default App;
