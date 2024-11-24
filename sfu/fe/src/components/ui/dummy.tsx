// import React, { useEffect } from "react";
// import { usePDFStore } from "../store/pdfStore";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ZoomIn,
//   ZoomOut,
//   Maximize2,
// } from "lucide-react";

// interface PDFControlsProps {
//   className?: string;
//   ws?: WebSocket;
//   isTeacher?: boolean;
// }

// export const PDFControls: React.FC<PDFControlsProps> = ({
//   className = "",
//   ws,
//   isTeacher = false,
// }) => {
//   const { currentPage, numPages, scale, nextPage, prevPage, setScale } =
//     usePDFStore();

//   const sendPDFSignal = (action: string, value?: number) => {
//     if (isTeacher && ws) {
//       console.log("Sending pdf Signal  ", action);
//       ws.send(
//         JSON.stringify({
//           type: "pdf-control",
//           roomId: "room1",
//           action,
//           value,
//         })
//       );
//     }
//   };

//   const handleNextPage = () => {
//     if (isTeacher) {
//       nextPage();
//       sendPDFSignal("next-page");
//     }
//   };

//   const handlePrevPage = () => {
//     if (isTeacher) {
//       prevPage();
//       sendPDFSignal("prev-page");
//     }
//   };

//   const handleZoomIn = () => {
//     console.log(scale);
//     const newScale = Math.min(scale + 0.25, 3);
//     setScale(newScale);
//     if (isTeacher) {
//       sendPDFSignal("zoom-in");
//     }
//   };

//   const handleZoomOut = () => {
//     console.log(scale);
//     const newScale = Math.max(scale - 0.25, 0.5);
//     setScale(newScale);
//     if (isTeacher) {
//       sendPDFSignal("zoom-out");
//     }
//   };

//   useEffect(() => {
//     if (!isTeacher && ws) {
//       const handleMessage = (event: MessageEvent) => {
//         const data = JSON.parse(event.data);
//         console.log("\n Message Received in Control comp : ", data);

//         if (data.type === "pdf-control") {
//           switch (data.action) {
//             case "next-page":
//               nextPage();
//               break;
//             case "prev-page":
//               prevPage();
//               break;
//             case "zoom-in":
//               handleZoomIn();
//               break;
//             case "zoom-out":
//               handleZoomOut();
//               break;
//             default:
//               break;
//           }
//         }
//       };

//       const pdfEventHandler = (event: MessageEvent) => {
//         handleMessage(event);
//       };

//       ws.addEventListener("message", pdfEventHandler);

//       return () => ws.removeEventListener("message", pdfEventHandler);
//     }
//   }, [ws, isTeacher, nextPage, prevPage, setScale]);

//   if (!isTeacher) {
//     return (
//       <div
//         className={`flex items-center gap-4 bg-slate-500 backdrop-blur-sm p-4 rounded-lg shadow-lg ${className}`}
//       >
//         <span className="text-sm font-medium text-white">
//           Page {currentPage} of {numPages} - {Math.round(scale * 100)}%
//         </span>
//       </div>
//     );
//   }
//   return (
//     <div
//       className={`flex items-center gap-4 bg-slate-500 backdrop-blur-sm p-4 rounded-lg shadow-lg ${className}`}
//     >
//       <button
//         onClick={handlePrevPage}
//         disabled={currentPage <= 1}
//         className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//         aria-label="Previous page"
//       >
//         <ChevronLeft className="w-5 h-5" />
//       </button>
//       <span className="text-sm font-medium text-white">
//         Page {currentPage} of {numPages}
//       </span>
//       <button
//         onClick={handleNextPage}
//         disabled={currentPage >= numPages}
//         className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//         aria-label="Next page"
//       >
//         <ChevronRight className="w-5 h-5" />
//       </button>
//       <div className="w-px h-6 bg-gray-300" />
//       <button
//         onClick={handleZoomOut}
//         disabled={scale <= 0.5}
//         className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-white"
//         aria-label="Zoom out"
//       >
//         <ZoomOut className="w-5 h-5" />
//       </button>
//       <span className="text-sm font-medium text-white">
//         {Math.round(scale * 100)}%
//       </span>
//       <button
//         onClick={handleZoomIn}
//         disabled={scale >= 2}
//         className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-white"
//         aria-label="Zoom in"
//       >
//         <ZoomIn className="w-5 h-5" />
//       </button>
//       <div className="w-px h-6 bg-gray-300" />
//       <button
//         onClick={() => document.documentElement.requestFullscreen()}
//         className="p-2 rounded-full hover:bg-gray-100 text-white"
//         aria-label="Enter fullscreen"
//       >
//         <Maximize2 className="w-5 h-5" />
//       </button>
//     </div>
//   );
// };
"use client";
import React, { useState } from "react";

const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {isLogin ? "Login" : "Create Account"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isLogin ? "Login" : "Create Account"}
              </button>
            </form>

            <div className="p-6 border-t bg-gray-50 rounded-b-lg">
              <p className="text-center text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? "Sign up here" : "Login here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;
