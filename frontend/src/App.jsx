import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import AppContainer from "./components/AppContainer";
import ArticleList from "./components/ArticleList";
import Article from "./components/Article";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const article = articles.find((article) => article.id === selectedId);

  useEffect(() => {
    async function fetchArticles() {
      setIsLoading(true);
      const res = await fetch(
        `http://${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/articles/`
      );
      const data = await res.json();
      setArticles(data);
      setIsLoading(false);
    }

    fetchArticles();
  }, []);

  function handleSelect(id) {
    setSelectedId(id);
  }

  function handleBack() {
    setSelectedId(null);
  }

  return (
    <AppContainer>
      <Header />
      {isLoading ? (
        <div>Loading</div>
      ) : selectedId ? (
        <Article article={article} onBack={handleBack} />
      ) : (
        <ArticleList articles={articles} onSelect={handleSelect} />
      )}
    </AppContainer>
  );
}

export default App;
