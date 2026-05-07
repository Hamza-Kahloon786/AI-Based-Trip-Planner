import React, { useState } from "react";
import { LOGO_TEXT, NAV_LINKS } from "../constant/Constant.js";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const navigate = useNavigate();

  const moveActiveSection = (link) => {
    setActiveLink(link.name);
    navigate(link.href);
   
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-green-600 to-orange-600 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a onClick={()=>navigate("/")} className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/20 border border-white/30 text-white font-bold text-xl shadow-md">
                  H 
                </div>
              </div>
              <div>
                <span className="text-white font-extrabold text-2xl tracking-tight">
                  {LOGO_TEXT}
                </span>
              </div>
            </a>
          </div>

          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                onClick={() => moveActiveSection(link)}
                className={`px-6 py-2.5 mx-1 cursor-pointer font-medium transition-colors duration-200 ${
                  activeLink === link.name
                    ? "text-white  border border-t-0 border-l-0 border-r-0 border-white/30"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center">
            <button  onClick={()=>navigate("/login")} className="hidden cursor-pointer md:flex items-center gap-2 px-6 py-2.5  border text-white font-medium border-white/30 border-t-0 border-l-0 border-r-0   transition-colors duration-200">
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Login</span>
            </button>

            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gradient-to-b from-blue-600 via-green-600 to-orange-600 border-t border-white/20">
          <div className="px-4 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.name);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-3 rounded-xl text-center font-medium ${
                  activeLink === link.name
                    ? "text-white bg-white/20 border border-white/30"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </a>
            ))}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium rounded-xl">
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Login</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
