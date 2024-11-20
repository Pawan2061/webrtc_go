"use client";
import React, { useState } from "react";

export default function PhoneInput() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "United States",
    code: "+1",
    flag: (
      <svg
        fill="none"
        aria-hidden="true"
        className="h-4 w-4 me-2"
        viewBox="0 0 20 15"
      >
        <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
        <mask
          id="a"
          width="20"
          height="15"
          x="0"
          y="0"
          maskUnits="userSpaceOnUse"
        >
          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
        </mask>
        <g mask="url(#a)">
          <path
            fill="#D02F44"
            fillRule="evenodd"
            d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z"
            clipRule="evenodd"
          />
          <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
        </g>
      </svg>
    ),
  });

  const countries = [
    {
      name: "United States",
      code: "+1",
      flag: (
        <svg
          fill="none"
          aria-hidden="true"
          className="h-4 w-4 me-2"
          viewBox="0 0 20 15"
        >
          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
          <mask
            id="a"
            width="20"
            height="15"
            x="0"
            y="0"
            maskUnits="userSpaceOnUse"
          >
            <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
          </mask>
          <g mask="url(#a)">
            <path
              fill="#D02F44"
              fillRule="evenodd"
              d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z"
              clipRule="evenodd"
            />
            <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
          </g>
        </svg>
      ),
    },
    {
      name: "United Kingdom",
      code: "+44",
      flag: (
        <svg className="h-4 w-4 me-2" fill="none" viewBox="0 0 20 15">
          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
          <mask
            id="a"
            width="20"
            height="15"
            x="0"
            y="0"
            maskUnits="userSpaceOnUse"
          >
            <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
          </mask>
          <g mask="url(#a)">
            <path fill="#0A17A7" d="M0 .5h19.6v14H0z" />
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M-.898-.842L7.467 4.8V-.433h4.667V4.8l8.364-5.642L21.542.706l-6.614 4.46H19.6v4.667h-4.672l6.614 4.46-1.044 1.549-8.365-5.642v5.233H7.467V10.2l-8.365 5.642-1.043-1.548 6.613-4.46H0V5.166h4.672L-1.941.706-.898-.842z"
              clipRule="evenodd"
            />
            <path
              stroke="#DB1F35"
              strokeLinecap="round"
              strokeWidth=".667"
              d="M13.067 4.933L21.933-.9M14.009 10.088l7.947 5.357M5.604 4.917L-2.686-.67M6.503 10.024l-9.189 6.093"
            />
            <path
              fill="#E6273E"
              fillRule="evenodd"
              d="M0 8.9h8.4v5.6h2.8V8.9h8.4V6.1h-8.4V.5H8.4v5.6H0v2.8z"
              clipRule="evenodd"
            />
          </g>
        </svg>
      ),
    },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCountry = (country: any) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <form className="w-full mx-auto">
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          >
            {selectedCountry.flag}
            {selectedCountry.code}{" "}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div
              id="dropdown-phone"
              className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdown-phone-button"
              >
                {countries.map((country) => (
                  <li key={country.code}>
                    <button
                      type="button"
                      onClick={() => selectCountry(country)}
                      className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      <span className="inline-flex items-center">
                        {country.flag}
                        {country.name} ({country.code})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="relative w-full">
            <input
              type="text"
              id="phone-input"
              aria-describedby="helper-text-explanation"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-0 border border-gray-300 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-green-500 rounded-xl"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="Enter your verified mobile number"
              required
            />
          </div>
        </div>
        <p
          id="helper-text-explanation"
          className="mt-2 mb-4 text-sm text-gray-500 dark:text-gray-400"
        >
          We will send you an SMS with a verification code.
        </p>
        <button
          type="submit"
          className="text-white w-full bg-green-500 hover:bg-green-400 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 "
        >
          Send verification code
        </button>
      </form>
    </div>
  );
}
