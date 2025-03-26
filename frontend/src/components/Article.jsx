import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";

export default function Article() {
  const [article, setArticle] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true);
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/articles/${id}`
      );
      const data = await res.json();
      setArticle(data);
      setIsLoading(false);
    }

    fetchArticle();
  }, []);

  function handleBack() {
    navigate("/articles/");
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="!mx-auto !pt-4 max-w-2xl border-t border-gray-200 lg:!mx-0 lg:max-w-none">
          <div className="flex justify-between">
            <h1 className="mt-3 text-4xl font-semibold text-gray-900 group-hover:text-gray-600">
              {article.title}
            </h1>
            <button
              onClick={handleBack}
              className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800"
            >
              Back
            </button>
          </div>
          <p className="!mt-4">{article.content}</p>
        </div>
      )}
    </>
  );
}
