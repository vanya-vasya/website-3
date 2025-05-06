import React from "react";

const ChatInterface = () => {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-6">
      {/* User message */}
      <div className="flex gap-4 max-w-3xl mx-auto">
        <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
          <img
            src="/images/icons/user.png"
            alt="Text Icon"
            width={18}
            height={18}
          />
        </div>{" "}
        <div className="flex-1">
          <div className="font-medium mb-1 text-white">You</div>
          <div className="bg-slate-700 rounded-lg p-4 shadow-sm dark:text-gray-200">
            What would happen if the Earth suddenly stopped rotating?
          </div>
        </div>
      </div>

      {/* Model response */}
      <div className="flex gap-4 max-w-3xl mx-auto">
        <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
          <img
            src="/images/icons/ai.png"
            alt="Text Icon"
            width={20}
            height={20}
          />
        </div>
        <div className="flex-1">
          <div className="font-medium text-white mb-1">Neuvisia</div>
          <div className="bg-slate-700 rounded-lg p-4 shadow-sm dark:text-gray-200">
            If the Earth stopped rotating, gravity, atmospheric pressure, and
            the planet&apos;s environment would change instantly. Oceans and the
            atmosphere would continue moving, creating catastrophic hurricanes
            and tsunamis.{" "}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button className="text-white-300/10">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              5 tokens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
