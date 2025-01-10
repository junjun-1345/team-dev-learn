// app/github-search/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GitHubUser } from "./github2";

export default function SecondDetail({ params }: { params: { id: any } }) {
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);
  const [, setError] = useState<string | null>(null);

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
  useEffect(() => {
    fetchUserDetails(result4.owner.login);
  }, []);

  const result4 = { owner: { login: params.id.login } };

  console.log(result4);

  const result2 = [
    {
      key: params.id.id,
      href: params.id.html_url,
      name: params.id.full_name,
      description: params.id.description,
      stargazers: params.id.stargazers_count,
      watchers: params.id.watchers_count,
      forks: params.id.forks_count,
      owner: { login: params.id.login },
    },
  ];

  return (
    <div>
      <div>
        {result2.map((result3) => (
          <article
            key={result3.key}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-blue-200"
          >
            <div className="mb-2">
              <a
                href={result3.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-blue-500 hover:underline"
              >
                {result3.name}
              </a>
            </div>
            {result3.description && (
              <p className="text-gray-600 mb-2">{result3.description}</p>
            )}
            <div className="flex gap-4 font-semibold text-gray-600">
              <span title="スター数">
                ★ {result3.stargazers.toLocaleString()}
              </span>
              <span title="ウォッチャー数">
                👀 {result3.watchers.toLocaleString()}
              </span>
              <span title="フォーク数">
                🔄 {result3.forks.toLocaleString()}
              </span>
            </div>
            {/*queryじゃなくてparamsじゃないのか */}
            {/* <Link   
                  href={
                    `./second/${repo.owner.login}/`  */}
          </article>
        ))}
      </div>

      {selectedUser && (
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
      )}
    </div>
  );
}
