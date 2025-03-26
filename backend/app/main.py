from fastapi import FastAPI
from pydantic import BaseModel
from bson import ObjectId
from app.database import articles_collection

app = FastAPI()

# Pydantic model
class Article(BaseModel):
    title: str
    content: str

@app.get("/articles/")
async def get_articles():
    articles = await articles_collection.find().to_list(100)
    return [{"id": str(article["_id"]), "title": article["title"], "content": article["content"]} for article in articles]

@app.get("/articles/{id}")
def get_article(id):
    return {"message": f"article {id}"}

@app.post("/articles/")
async def create_article(article: Article):
    new_article = await articles_collection.insert_one(article.dict())
    return {"id": str(new_article.inserted_id), **article.dict()}

@app.put("/articles/{id}")
def update_article(id):
    return {"message": f"article {id} updated"}

@app.delete("/articles/{id}")
def delete_article(id):
    return {"message": f"article {id} deleted"}