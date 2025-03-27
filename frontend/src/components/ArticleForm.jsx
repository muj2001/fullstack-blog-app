import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import questionIcon from "../assets/icons/question_icon.svg";

export default function ArticleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true);
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/articles/${id}`
      );
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setIsLoading(false);
    }

    if (id) {
      fetchArticle();
    }
  }, [id]);

  function handleBack() {
    navigate("/articles/");
  }

  function handleSubmit() {
    async function postArticle() {
      if (id) {
        const res = await fetch(
          `http://${import.meta.env.VITE_HOST}:${
            import.meta.env.VITE_PORT
          }/articles/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              title,
              content,
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );
        if (res.ok) {
          navigate("/articles/");
        }
      } else {
        const res = await fetch(
          `http://${import.meta.env.VITE_HOST}:${
            import.meta.env.VITE_PORT
          }/articles/`,
          {
            method: "POST",
            body: JSON.stringify({
              title,
              content,
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );
        if (res.ok) {
          navigate("/articles/");
        }
      }
    }

    postArticle();
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <form className="!mx-auto !pt-4 max-w-2xl border-t border-gray-200 lg:!mx-0 lg:max-w-none !px-12 flex-1 flex flex-col">
          <div className="flex justify-between items-center">
            <input
              className="border-1 border-gray-300 font-thin !mt-6 text-6xl text-gray-900 group-hover:text-gray-600 !py-2 !px-2 rounded-xl"
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></input>
            <div className="flex gap-x-4 items-center">
              <div class="mx-auto flex items-center justify-center">
                <div class="group relative cursor-pointer py-2">
                  <div class="flex items-center justify-between space-x-5">
                    <a
                      class="menu-hover my-2 py-2 text-base font-medium text-black lg:mx-4"
                      onClick=""
                    >
                      <img src={questionIcon} />
                    </a>
                  </div>
                  <div class="invisible absolute z-50 !p-6 !pl-10 w-2xs bg-gray-100 text-gray-800 shadow-xl group-hover:visible">
                    <strong>Help</strong>
                    <ul className="list-disc">
                      <li>To use subheadings, prefix your line with: "# ".</li>
                      <li>
                        To use subsubheadings, prefix your line with: "## ".
                      </li>
                      <li>
                        A new line can be inserted just by pressing "Enter".
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800"
              >
                {id ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800"
              >
                Back
              </button>
            </div>
          </div>
          <textarea
            onChange={(e) => {
              setContent(e.target.value);
            }}
            value={content}
            className="border-1 border-gray-300 flex-1 !mt-8 rounded-xl !p-4"
            placeholder="Enter your article's content here..."
          ></textarea>
        </form>
      )}
    </>
  );
}
