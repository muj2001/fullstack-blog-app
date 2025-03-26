import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import AppContainer from "./components/AppContainer";
import ArticleList from "./components/ArticleList";

function App() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <AppContainer>
      <Header />
      {isLoading ? <div>Loading</div> : <ArticleList articles={articles} />}
    </AppContainer>
  );
}

export default App;
