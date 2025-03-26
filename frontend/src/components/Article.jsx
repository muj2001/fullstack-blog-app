export default function Article({ article, onBack }) {
  return (
    <div className="!mx-auto !pt-4 max-w-2xl border-t border-gray-200 lg:!mx-0 lg:max-w-none">
      <div className="flex justify-between">
        <h1 className="mt-3 text-4xl font-semibold text-gray-900 group-hover:text-gray-600">
          {article.title}
        </h1>
        <button
          onClick={onBack}
          className="bg-teal-500 !px-4 !py-2 text-white rounded-xl !mt-2 duration-75 hover:bg-teal-800"
        >
          Back
        </button>
      </div>
      <p className="!mt-4">{article.content}</p>
    </div>
  );
}
