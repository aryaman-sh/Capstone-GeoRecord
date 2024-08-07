/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Search() {
  const auth = useAuth();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL ?? "/api/v1"}/search/?query=${encodeURIComponent(query)}`, {
          method: "GET",
          mode: "cors",
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${auth.jwt}`,
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.message);
        }
        setSearchResults(data.payload.map((item) => ({ name: item.name, url: item.url })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [query, auth.jwt]);

  return (
    <div className="z-[1000] absolute w-8/12 flex flex-row justify-center">
      <div className="mx-auto w-full max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all my-10">
        <Combobox>
          <div className="relative">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <Combobox.Input
              className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Search..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => setQuery("")}
            />
          </div>

          {loading && <p className="p-4 text-sm text-gray-500">Loading...</p>}

          {searchResults.length > 0 && (
            <Combobox.Options
              static
              className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
            >
              {searchResults.map((result, index) => (
                <Combobox.Option
                  key={index}
                  value={result.name}
                  onClick={() => navigate(result.url)}
                  className={({ active }) =>
                    classNames(
                      "cursor-default select-none px-4 py-2",
                      active && "bg-indigo-600 text-white"
                    )
                  }
                >
                  {result.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}

          {query !== "" && searchResults.length === 0 && !loading && (
            <p className="p-4 text-sm text-gray-500">No locations found.</p>
          )}
        </Combobox>
      </div>
    </div>
  );
}