// app/github-search/page.tsx
"use client";

import React, { useState } from "react";
import { GitHubRepo } from "./types/github";
import RepositoryCard from "./components/repositoryCard";

export default function GitHubSearch() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchRepositories = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.items || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "検索中にエラーが発生しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchRepositories();
    }
  };

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="リポジトリを検索..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="検索キーワード"
          />
          <button
            onClick={searchRepositories}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-green-600 transition-colors disabled:bg-blue-300"
            aria-label="検索実行"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {loading ? "検索中..." : "Find"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="text-red-500 mb-4 p-4 bg-red-50 border border-red-200 rounded"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="space-y-4">
          {loading ? (
            <div className="text-center" role="status">
              検索中...
            </div>
          ) : results.length > 0 ? (
            results.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))
          ) : (
            query !== "" && (
              <p className="text-center text-gray-600">
                検索結果が見つかりませんでした。
              </p>
            )
          )}
        </section>
      </div>
    </main>
  );
}
