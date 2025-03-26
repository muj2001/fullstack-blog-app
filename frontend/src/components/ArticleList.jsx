import { useNavigate } from "react-router-dom";
import ArticleCard from "./ArticleCard";
import { useState, useEffect } from "react";
import { ColorRing } from "react-loader-spinner";
import Loader from "./Loader";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArticles() {
      setIsLoading(true);
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/articles/`
      );
      const data = await res.json();
      setArticles(data);
      setIsLoading(false);
    }

    fetchArticles();
  }, []);

  function handleSelect(id) {
    navigate(`/articles/${id}`);
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="!mx-auto min-h-fit grid max-w-2xl grid-cols-3 gap-x-8 gap-y-16 border-t border-gray-200 !pb-8 !pt-4 lg:!mx-0 lg:max-w-none">
          {articles.map((article) => (
            <ArticleCard
              article={article}
              key={article.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </>
  );
}
