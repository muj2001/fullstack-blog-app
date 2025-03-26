from fastapi import FastAPI, HTTPException
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
async def get_article(id: str):
    article = await articles_collection.find_one({"_id": ObjectId(id)})
    if article:
        return {"id": str(article["_id"]), "title": article["title"], "content": article["content"]}
    raise HTTPException(status_code=404, detail="Article not found")

@app.post("/articles/")
async def create_article(article: Article):
    new_article = await articles_collection.insert_one(article.dict())
    return {"id": str(new_article.inserted_id), **article.dict()}

@app.put("/articles/{id}")
async def update_article(id: str, article: Article):
    updated = await articles_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": article.dict()}
    )
    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article updated successfully"}

@app.delete("/articles/{id}")
async def delete_article(id: str):
    deleted = await articles_collection.delete_one({"_id": ObjectId(id)})
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}