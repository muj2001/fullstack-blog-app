from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from app.database import articles_collection
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY


app = FastAPI()

origins = [
    "http://localhost:5173",  # React Vite frontend
    "http://127.0.0.1:5173",  # Alternative localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

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

@app.post("/articles/{id}/summarize")
async def get_article_summary(article: Article):
    article = article.dict()
    messages = [
        {"role": "user",
         "content": """As a content summarizer, generate the a short summary from the content provided to you' \n"""},
    ]
    messages.append({
            "role": "user",
            "content": f"{article["content"]}"
        }
    )
    completion = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=messages
    )
    reply = completion.choices[0].message.content
    return {reply}