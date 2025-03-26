export default function ArticleCard({ article }) {
  return (
    <>
      <article className="flex max-w-xl flex-col items-start justify-between">
        <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
          <p className="text-2xl">{article.title}</p>
        </h3>
        <p className="mt-5 line-clamp-2 text-sm/6 text-gray-600">
          {article.content}
        </p>
      </article>
    </>
  );
}
