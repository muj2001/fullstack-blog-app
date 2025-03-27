from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from app.database import articles_collection
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY
client = openai.OpenAI()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"), environment="us-east-1")

index_name = "blogproject"

# Check if the index already exists
existing_indexes = [index["name"] for index in pc.list_indexes()]

if index_name not in existing_indexes:
    # Create the index with the required 'spec' argument
    pc.create_index(
        name=index_name,
        dimension=1536,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")  # Adjust cloud/region as needed
    )
    print(f"Index '{index_name}' created successfully.")
else:
    print(f"Index '{index_name}' already exists.")

index = pc.Index(index_name)  # Initialize the index

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

class ArticleEmbeddingRequest(BaseModel):
    id: str

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
async def get_article_summary(id: str):
    article = await articles_collection.find_one({"_id": ObjectId(id)})
    print(article)
    if article:
        messages = [
            {
                "role": "user",
                "content": "As a content summarizer, generate a short summary from the content provided to you.\n",
            },
            {
                "role": "user",
                "content": article["content"],
            },
        ]
        try:
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
            reply = completion.choices[0].message.content
            return {"summary": reply}
        except:
            raise HTTPException(status_code=500, detail="Summary functionality not working (Check if OpenAI Limit has been exceeded).")
    raise HTTPException(status_code=404, detail="Article not found")

@app.post("/articles/{id}/embed")
async def generate_embeddings(id: str):
    article = await articles_collection.find_one({"_id": ObjectId(id)})
    
    if not article:
        return {"error": "Article not found"}

    # Convert ObjectId to a string
    article["_id"] = str(article["_id"])

    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=article["content"]  # Pass only the content, not the entire document
    )

    embedding = response.data[0].embedding
    index.upsert([(id, embedding)])

    return response

@app.get("/articles/search/")
async def search_article(query: str):
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=query
    )
    # return response
    query_embedding = response.data[0].embedding

    # Search in Pinecone
    search_results = index.query(vector=query_embedding, top_k=5, include_metadata=False)
    # return search_results["matches"]

    # Extract article IDs from search results
    matches = [
        {"id": match["id"], "score": match["score"]}
        for match in search_results["matches"]
    ]

    print(matches)

    # Fetch articles from MongoDB
    article_ids = [ObjectId(match["id"]) for match in matches]
    articles = await articles_collection.find({"_id": {"$in": article_ids}}).to_list()

    # Convert ObjectId to string and attach similarity scores
    articles_with_scores = []
    for article in articles:
        article["_id"] = str(article["_id"])
        # Attach similarity score by matching IDs
        for match in matches:
            if match["id"] == article["_id"]:
                article["score"] = match["score"]
                break
        articles_with_scores.append(article)

    # **Sort articles by similarity score (descending)**
    articles_with_scores.sort(key=lambda x: x["score"], reverse=True)

    return {"query": query, "results": articles_with_scores}