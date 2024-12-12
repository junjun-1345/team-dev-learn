// app/github-search/page.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useState,useEffect } from "react";
import Image from "next/image";
import { GitHubRepo, GitHubUser } from "./github2";
import {ParsedUrlQuery} from "querystring";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";

export default function SecondDetail({ params }: { params: { id: string } }) {
 {/* interface QueryParams extends
  ParsedUrlQuery{ id : string}

  
  const router = useRouter();
  const {id}=router.query as QueryParams;*/}

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<GitHubRepo[]>([]);
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  

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
{/*if(router.query.id===true){fetchUserDetails(router.query.login)}  ここがusernameならいいのか*/}
  
  {/*fetchUserDetails(router.query.login);*/}
  useEffect(()=>{
    
  },[])

  return (
    
    <div>
      
      hello
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
