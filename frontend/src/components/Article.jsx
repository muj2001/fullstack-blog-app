import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import FormattedContent from "./FormattedContent";

export default function Article() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true);
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST || "localhost"}:${
          import.meta.env.VITE_PORT || "8000"
        }/articles/${id}`
      );
      const data = await res.json();
      setArticle(data);
      setIsLoading(false);
    }

    fetchArticle();
  }, [id]);

  function handleBack() {
    navigate("/articles/");
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="!mx-auto !pt-4 max-w-2xl border-t border-gray-200 lg:!mx-0 lg:max-w-none !px-12">
          <div className="flex justify-between items-center">
            <h1 className="font-thin !mt-6 text-6xl text-gray-900 group-hover:text-gray-600">
              {article.title}
            </h1>
            <button
              onClick={handleBack}
              className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800"
            >
              Back
            </button>
          </div>
          {/* <p className="!mt-8">{article.content}</p> */}
          <div>
            <FormattedContent content={article.content} />
          </div>
        </div>
      )}
    </>
  );
}
