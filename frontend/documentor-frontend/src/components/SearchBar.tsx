import React, { useState } from "react";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setAnswer("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        setAnswer(accumulated);
      }
    } catch (error) {
      console.error("Search error:", error);
      setAnswer("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">🔍 Search Across Documents</h2>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Search for keywords like 'bonus policy'..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="mt-2">🔄 Searching...</p>}
      {answer && <div className="answer-box mt-2">{answer}</div>}
    </div>
  );
};

export default SearchBar;
