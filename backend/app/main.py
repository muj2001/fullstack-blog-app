from fastapi import FastAPI

app = FastAPI()

@app.get("/articles/")
def read_root():
    return {"message": "Retrieve articles"}

@app.get("/articles/{id}")
def get_article(id):
    return {"message": "article " + str(id)}

@app.post("/articles/")
def create_article():
    return {"message": "article created"}

@app.put("/articles/{id}")
def update_article(id):
    return {"message": "article " + str(id) + " updated"}
