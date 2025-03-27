import editIcon from "../assets/icons/edit_square.svg";
import deleteIcon from "../assets/icons/delete_icon.svg";
import Button from "./Button";

export default function ArticleCard({ article, onSelect, onEdit, onDelete }) {
  return (
    <>
      <article className="flex max-w-xl flex-col items-start justify-between border-gray-200 border-1 rounded-lg !px-6 !py-6 shadow-xl gap-y-8">
        <div className="flex justify-between self-stretch items-center">
          <h3 className="mt-3 text-2xl font-semibold text-gray-900 group-hover:text-gray-600">
            {article.title}
          </h3>
          <div className="flex gap-x-2">
            <button>
              <img
                src={editIcon}
                className="hover:bg-gray-300 !py-2 !px-2 rounded-md duration-75"
                onClick={() => onEdit(article.id)}
              />
            </button>
            <button>
              <img
                src={deleteIcon}
                className="hover:bg-gray-300 !py-2 !px-2 rounded-md duration-75"
                onClick={() => onDelete(article.id)}
              />
            </button>
          </div>
        </div>
        <div className="flex gap-x-3">
          <button className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800">
            Summary
          </button>
          <button
            onClick={() => {
              onSelect(article.id);
            }}
            className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800"
          >
            Open Article
          </button>
        </div>
      </article>
    </>
  );
}
