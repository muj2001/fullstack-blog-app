import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/articles/`
      );
      const data = await res.json();
      setArticles(data);
    }

    fetchArticles();
  }, []);

  return (
    <div className="px-12 py-8">
      <Header />
      {articles.map((article) => (
        <div key={article.id}>
          <div>{article.title}</div>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
