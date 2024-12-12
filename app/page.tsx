// app/github-search/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GitHubRepo, GitHubUser } from "./types/github";
import Link from "next/link";
import { useRouter } from "next/router";

export default function GitHubSearch() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<GitHubRepo[]>([]);
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);
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

  const fetchUserDetails = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      setSelectedUser(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ユーザー情報の取得中にエラーが発生しました。"
      );
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
              <article
                key={repo.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-blue-200"
              >
                <div className="mb-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-blue-500 hover:underline"
                  >
                    {repo.full_name}
                  </a>
                </div>
                {repo.description && (
                  <p className="text-gray-600 mb-2">{repo.description}</p>
                )}
                <div className="flex gap-4 font-semibold text-gray-600">
                  <span title="スター数">
                    ★ {repo.stargazers_count.toLocaleString()}
                  </span>
                  <span title="ウォッチャー数">
                    👀 {repo.watchers_count.toLocaleString()}
                  </span>
                  <span title="フォーク数">
                    🔄 {repo.forks_count.toLocaleString()}
                  </span>
                </div>
                {/*queryじゃなくてparamsじゃないのか */}
                <Link   
                  href={
                    `./second/${repo.owner.login}`                  

          
                  }
                  //onClick={() => fetchUserDetails(repo.owner.login)}
                  className="mt-2 text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                >
                  制作者の詳細を表示
                </Link>
              </article>
            ))
          ) : (
            query !== "" && (
              <p className="text-center text-gray-600">
                検索結果が見つかりませんでした。
              </p>
            )
          )}
        </section>

        {/*{selectedUser && (
          <aside className="sticky top-4">
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-bold mb-4">制作者プロフィール</h2>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={selectedUser.avatar_url}
                  alt={`${selectedUser.login}のアバター`}
                  className="w-16 h-16 rounded-full"
                  width={64}
                  height={64}
                />
                <div>
                  <h3 className="font-bold">
                    {selectedUser.name || selectedUser.login}
                  </h3>
                  <p className="text-gray-600">@{selectedUser.login}</p>
                </div>
              </div>
              {selectedUser.bio && (
                <p className="mb-2 text-gray-700">{selectedUser.bio}</p>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p>フォロワー: {selectedUser.followers.toLocaleString()}</p>
                  <p>フォロー中: {selectedUser.following.toLocaleString()}</p>
                </div>
                <div>
                  <p>
                    公開リポジトリ: {selectedUser.public_repos.toLocaleString()}
                  </p>
                  <p>場所: {selectedUser.location || "未設定"}</p>
                </div>
              </div>
              <a
                href={selectedUser.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              >
                GitHubプロフィールを表示
              </a>
            </div>
          </aside>
        )}*/}
      </div>
    </main>
  );
}
