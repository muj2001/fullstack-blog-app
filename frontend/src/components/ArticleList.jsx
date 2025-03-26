import ArticleCard from "./ArticleCard";

export default function ArticleList({ articles, onSelect }) {
  return (
    <div className="!mx-auto grid max-w-2xl grid-cols-3 gap-x-8 gap-y-16 border-t border-gray-200 !pb-8 !pt-4 lg:!mx-0 lg:max-w-none">
      {articles.map((article) => (
        <ArticleCard article={article} key={article.id} onSelect={onSelect} />
      ))}
    </div>
  );
}
