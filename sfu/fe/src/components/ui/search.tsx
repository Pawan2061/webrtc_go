"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

interface Book {
  _id: string;
  title: string;
  authors: string;
  description: string;
}

const testBook: Book = {
  _id: "1",
  title: "The Lord of the Rings",
  authors: "J.R.R. Tolkien",
  description: "A classic book",
};

interface SelectOption {
  value: string;
  label: string;
}

const Search: NextPage = () => {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const loadOptions = async (inputValue: string): Promise<SelectOption[]> => {
    // Implement your actual API call here
    return [{ value: "1", label: "Test Book" }];
  };

  const handleChange = async (option: SelectOption | null) => {
    if (option) {
      console.log("Selected:", option);
    }
  };

  return (
    <div>
      <Head>
        <title>Lookalike search engine</title>
      </Head>
      <div className="container mx-auto p-2">
        {mounted && (
          <AsyncSelect
            defaultOptions
            isClearable={true}
            placeholder="Start typing a book name..."
            // @ts-ignore

            onChange={handleChange}
            loadOptions={loadOptions}
            className="z-10"
          />
        )}
        <div className="py-7">
          <Book book={testBook} />
        </div>
      </div>
    </div>
  );
};

function Book({ book }: { book: Book }) {
  return (
    <div key={book._id} className="border hidden rounded-md shadow px-3 py-2">
      <div className="text-lg text-bold py-2">
        {book.title}{" "}
        <span className="text-sm text-gray-500 ml-3">{book.authors}</span>
      </div>
      <div className="text-sm text-gray-700">ℹ️ {book.description}</div>
    </div>
  );
}

export default Search;
