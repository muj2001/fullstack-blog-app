import ArticleCard from "./ArticleCard";

export default function ArticleList({ articles }) {
  return (
    <div className="!mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 !pb-8 !pt-4 lg:!mx-0 lg:max-w-none lg:grid-cols-3-4">
      {articles.map((article) => (
        <ArticleCard article={article} key={article.id} />
      ))}
    </div>
  );
}
