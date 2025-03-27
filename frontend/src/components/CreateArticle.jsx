import addIcon from "../assets/icons/add_icon.svg";
import { useNavigate } from "react-router-dom";

export default function CreateArticle() {
  const navigate = useNavigate();

  function handleNew() {
    navigate("/articles/new/");
  }

  return (
    <>
      <div
        onClick={handleNew}
        className="flex max-w-xl flex-col items-center justify-between border-teal-300 border-1 rounded-lg !px-6 !py-2 shadow-xl bg-teal-300 hover:bg-teal-600 hover:border-teal-600 duration-200"
      >
        <img className="w-36 h-auto" src={addIcon} />
      </div>
    </>
  );
}
