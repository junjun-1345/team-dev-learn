import Link from "next/link";
import { GitHubRepo } from "../types/github";

interface RepositoryCardProps {
  repository: GitHubRepo;
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <article className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-blue-200">
      <div className="mb-2">
        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-blue-500 hover:underline"
        >
          {repository.full_name}
        </a>
      </div>
      {repository.description && (
        <p className="text-gray-600 mb-2">{repository.description}</p>
      )}
      <div className="flex gap-4 font-semibold text-gray-600">
        <span title="スター数">
          ★ {repository.stargazers_count.toLocaleString()}
        </span>
        <span title="ウォッチャー数">
          👀 {repository.watchers_count.toLocaleString()}
        </span>
        <span title="フォーク数">
          🔄 {repository.forks_count.toLocaleString()}
        </span>
      </div>
      <Link
        href={`./user_detail/${repository.owner.login}/`}
        className="mt-2 text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
      >
        制作者の詳細を表示
      </Link>
    </article>
  );
}
