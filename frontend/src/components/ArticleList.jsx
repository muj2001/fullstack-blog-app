import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ColorRing } from "react-loader-spinner";

import ArticleCard from "./ArticleCard";
import Loader from "./Loader";
import UIBar from "./UIBar";
import CreateArticle from "./CreateArticle";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    async function fetchArticles() {
      setIsLoading(true);
      let url = "";
      if (query) {
        url = `http://${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/articles/search/?query=${query}`;
      } else {
        url = `http://${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/articles/`;
      }
      const res = await fetch(url, { signal: controller.signal });
      const data = await res.json();
      if (query) {
        setArticles(() => {
          return data.results.map((result) => {
            return { ...result, id: result.id };
          });
        });
      } else {
        setArticles(data);
      }
      console.log(data);
      setIsLoading(false);
    }

    fetchArticles();

    return function () {
      controller.abort();
    };
  }, [query]);

  function handleQueryChange(e) {
    setQuery(e.target.value);
  }

  function handleSelect(id) {
    navigate(`/articles/${id}`);
  }

  function handleEdit(id) {
    navigate(`/articles/${id}/edit`);
  }

  function handleDelete(id) {
    console.log(id);
    async function deleteArticle() {
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/articles/${id}`,
        {
          method: "DELETE",
        }
      );
      console.log(res);
      if (res.ok) {
        setArticles((articles) => {
          return articles.filter((article) => article.id !== id);
        });
      }
    }

    deleteArticle();
  }

  return (
    <>
      <UIBar onQueryChange={handleQueryChange} />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="!mx-auto min-h-fit grid max-w-2xl grid-cols-3 gap-x-8 gap-y-16 border-t border-gray-200 !pb-8 !pt-4 lg:!mx-0 lg:max-w-none">
            <CreateArticle />
            {articles.map((article) => (
              <ArticleCard
                article={article}
                key={article.id}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
