from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://agileforcedev:lUCbGVdKlWUU7nph@agileforce-dev.z3e1f.mongodb.net/?retryWrites=true&w=majority&appName=agileforce-dev"
DB_NAME = "article_management_system"

client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]
articles_collection = database.get_collection("articles")