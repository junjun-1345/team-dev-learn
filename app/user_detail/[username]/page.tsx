"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GitHubRepo, GitHubUser } from "@/app/types/github";
import RepositoryCard from "@/app/components/repositoryCard";

export default function UserDetail() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }),
          fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
              },
            }
          ),
        ]);

        if (!userResponse.ok || !reposResponse.ok) {
          throw new Error(`GitHub API error: ${userResponse.status}`);
        }

        const [userData, reposData] = await Promise.all([
          userResponse.json(),
          reposResponse.json(),
        ]);

        setUser(userData);
        setRepositories(reposData);
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
    <main className="p-4 max-w-6xl mx-auto">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-500 hover:underline"
      >
        ← 検索結果に戻る
      </Link>

      <div className="flex gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">最近更新されたリポジトリ</h2>
          <div className="space-y-4">
            {repositories.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        </div>

        <aside className="sticky top-4 w-80">
          <div className="border rounded-lg p-4 bg-white">
            <h2 className="text-xl font-bold mb-4">制作者プロフィール</h2>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={user.avatar_url}
                alt={`${user.login}のアバター`}
                className="w-16 h-16 rounded-full"
                width={64}
                height={64}
              />
              <div>
                <h3 className="font-bold">{user.name || user.login}</h3>
                <p className="text-gray-600">@{user.login}</p>
              </div>
            </div>

            {user.bio && <p className="mb-2 text-gray-700">{user.bio}</p>}

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>フォロワー: {user.followers.toLocaleString()}</p>
                <p>フォロー中: {user.following.toLocaleString()}</p>
              </div>
              <div>
                <p>公開リポジトリ: {user.public_repos.toLocaleString()}</p>
                <p>場所: {user.location || "未設定"}</p>
              </div>
            </div>

            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            >
              GitHubプロフィールを表示
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
