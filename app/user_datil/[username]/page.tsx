// app/github-search/[username]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GitHubUser } from "@/app/types/github";

export default function UserDetail() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Fetching user data for:", username);
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "ユーザー情報の取得中にエラーが発生しました。"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return <div className="p-4 text-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (!user) {
    return (
      <div className="p-4 text-center">ユーザーが見つかりませんでした。</div>
    );
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-500 hover:underline"
      >
        ← 検索結果に戻る
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start gap-6">
          <Image
            src={user.avatar_url}
            alt={`${user.login}のアバター`}
            className="w-32 h-32 rounded-full"
            width={128}
            height={128}
          />

          <div>
            <h1 className="text-2xl font-bold mb-2">
              {user.name || user.login}
            </h1>
            {user.bio && <p className="text-gray-600 mb-4">{user.bio}</p>}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h2 className="font-semibold">場所</h2>
                <p>{user.location || "未設定"}</p>
              </div>
              <div>
                <h2 className="font-semibold">Webサイト</h2>
                {user.blog ? (
                  <a
                    href={user.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {user.blog}
                  </a>
                ) : (
                  "未設定"
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-bold">{user.public_repos}</div>
                <div className="text-sm text-gray-600">リポジトリ</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-bold">{user.followers}</div>
                <div className="text-sm text-gray-600">フォロワー</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-bold">{user.following}</div>
                <div className="text-sm text-gray-600">フォロー中</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
