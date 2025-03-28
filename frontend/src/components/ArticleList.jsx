import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ColorRing } from "react-loader-spinner";

import ArticleCard from "./ArticleCard";
import Loader from "./Loader";
import UIBar from "./UIBar";
import CreateArticle from "./CreateArticle";
import ErrorComponent from "./ErrorComponent";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [timeoutID, setTimeoutID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    async function fetchArticles() {
      setError("");
      setIsLoading(true);
      console.log("Here");
      let res = null;
      try {
        let url = "";
        if (query) {
          url = `http://${import.meta.env.VITE_HOST || "localhost"}:${
            import.meta.env.VITE_PORT || "8000"
          }/articles/search/?query=${query}`;
          res = await fetch(url, { signal: controller.signal });
        } else {
          url = `http://${import.meta.env.VITE_HOST || "localhost"}:${
            import.meta.env.VITE_PORT || "8000"
          }/articles/`;
          res = await fetch(url);
        }
        const data = await res.json();
        if (query) {
          setArticles(() => {
            return data.results.map((result) => {
              return { ...result };
            });
          });
        } else {
          setArticles(data);
        }
        console.log(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();

    return function () {
      controller.abort();
    };
  }, [query]);

  function handleQueryChange(e) {
    clearTimeout(timeoutID);
    setTimeoutID(setTimeout(() => setQuery(e.target.value), 1000));
  }

  function handleSelect(id) {
    navigate(`/articles/${id}`);
  }

  function handleEdit(id) {
    navigate(`/articles/${id}/edit`);
  }

  function handleEmbed(id) {
    async function postEmbed() {
      console.log("HERE");
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST || "localhost"}:${
          import.meta.env.VITE_PORT || "8000"
        }/articles/${id}/embed`,
        {
          method: "POST",
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setArticles((articles) =>
          articles.map((article) =>
            article["_id"] === data["_id"] ? data : article
          )
        );
      }
    }

    postEmbed();
  }

  function handleDelete(id) {
    console.log(id);
    async function deleteArticle() {
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST || "localhost"}:${
          import.meta.env.VITE_PORT || "8000"
        }/articles/${id}`,
        {
          method: "DELETE",
        }
      );
      console.log(res);
      if (res.ok) {
        setArticles((articles) => {
          return articles.filter((article) => article["_id"] !== id);
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
      ) : error ? (
        <ErrorComponent message={error} />
      ) : (
        <>
          <div className="!mx-auto min-h-fit grid max-w-2xl grid-cols-3 gap-x-8 gap-y-16 border-t border-gray-200 !pb-8 !pt-4 lg:!mx-0 lg:max-w-none">
            <CreateArticle />
            {articles.map((article) => (
              <ArticleCard
                article={article}
                key={article["_id"]}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onEmbed={handleEmbed}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
