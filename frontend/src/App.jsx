import "./App.css";
import Header from "./components/Header";
import AppContainer from "./components/AppContainer";
import ArticleList from "./components/ArticleList";
import Article from "./components/Article";
import ArticleForm from "./components/ArticleForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <AppContainer>
      <Header />
      <Router>
        <Routes>
          <Route exact path="/articles/" element={<ArticleList />} />
          <Route exact path="/articles/:id" element={<Article />} />
          <Route exact path="/articles/:id/edit" element={<ArticleForm />} />
          <Route exact path="/articles/new" element={<ArticleForm />} />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;
