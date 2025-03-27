import editIcon from "../assets/icons/edit_square.svg";
import deleteIcon from "../assets/icons/delete_icon.svg";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import Loader from "./Loader";

export default function ArticleCard({
  article,
  onSelect,
  onEdit,
  onDelete,
  onEmbed,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // const [er]

  function open(id) {
    async function openModel() {
      try {
        setError("");
        setIsLoading(true);
        setIsOpen(true);
        const res = await fetch(
          `http://${import.meta.env.VITE_HOST}:${
            import.meta.env.VITE_PORT
          }/articles/${id}/summarize`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        console.log(res);
        console.log(data);
        if (res.ok) {
          setSummary(data.summary);
        } else {
          setError(data.detail);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
      // setSummary(data);
    }

    openModel();
  }

  function close() {
    setIsOpen(false);
  }

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
                onClick={() => onEdit(article["_id"])}
              />
            </button>
            <button>
              <img
                src={deleteIcon}
                className="hover:bg-gray-300 !py-2 !px-2 rounded-md duration-75"
                onClick={() => onDelete(article["_id"])}
              />
            </button>
          </div>
        </div>
        <div className="flex gap-x-3">
          <button
            onClick={() => {
              onEmbed(article["_id"]);
            }}
            className={`${
              article.embed ? "hidden" : ""
            } bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800`}
          >
            Embed
          </button>
          <Button
            onClick={() => {
              open(article["_id"]);
            }}
            className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800"
          >
            Summary
          </Button>
          <button
            onClick={() => {
              onSelect(article["_id"]);
            }}
            className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800"
          >
            Open Article
          </button>
        </div>
      </article>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="!p-16 w-full max-w-md rounded-xl bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              {isLoading ? (
                <Loader />
              ) : error ? (
                <>
                  <DialogTitle
                    as="h3"
                    className="text-3xl font-medium text-gray-600"
                  >
                    Error
                  </DialogTitle>
                  <p className="text-sm/6 text-gray-700 !mt-4">{error}</p>
                  <div className="mt-4">
                    <Button
                      className="!mt-6 inline-flex items-center gap-2 rounded-md bg-gray-700 !py-1.5 !px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                      onClick={close}
                    >
                      Close
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <DialogTitle
                    as="h3"
                    className="text-3xl font-medium text-gray-600"
                  >
                    {article.title}
                  </DialogTitle>
                  <h4 className="text-xl font-medium text-gray-600 !mt-2">
                    Summary
                  </h4>
                  <p className="text-sm/6 text-gray-700 !mt-4">{summary}</p>
                  <div className="mt-4">
                    <Button
                      className="!mt-6 inline-flex items-center gap-2 rounded-md bg-gray-700 !py-1.5 !px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                      onClick={close}
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
