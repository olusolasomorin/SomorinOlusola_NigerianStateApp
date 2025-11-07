from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import uvicorn
import os
from sqlalchemy import text
from database import db
from fastapi.middleware.cors import CORSMiddleware
import bcrypt

load_dotenv()

app = FastAPI(title="NIGERIAN STATES API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.get("/")
def home():
    return "Welcome to my API"



class User(BaseModel):
    full_name: str = Field(..., example="sam")
    email: str = Field(..., example="sam@gmail.com")
    password_hash: str = Field(..., example="sam123")

@app.post('/api/signup')
def sign_up(input: User):
    try:
        duplicate_query = text("""
            SELECT * FROM users
            WHERE email = :email
        """)

        existing = db.execute(duplicate_query, {"email": input.email}).fetchone()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exist")

        query = text("""
            INSERT INTO users (full_name, email, password_hash)
            VALUES (:full_name, :email, :password_hash)
        """)

        salt = bcrypt.gensalt()
        hashedPassword = bcrypt.hashpw(input.password_hash.encode('utf-8'), salt)
        
        db.execute(query, {"full_name": input.full_name, "email": input.email, "password_hash": hashedPassword})
        db.commit()

        return {"message": "User created successfully",
                "data": {
                    "name": input.full_name,
                    "email": input.email}}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


class userLogin(BaseModel):
    email: str = Field(..., example="sam@gmail.com")
    password_hash: str = Field(..., example="sam123")

@app.post("/api/login")
def login(input: userLogin):
    try:
        query =text("""
            SELECT * FROM users
            WHERE email = :email
        """)

        result = db.execute(query, {"email": input.email}).fetchone()

        if not result:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        verified_password = bcrypt.checkpw(input.password_hash.encode('utf-8'), result.password_hash.encode('utf-8'))

        if not verified_password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return {
            "message": "Login Successful!"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/api/states")
def states():
    try:
        get_states = text("""
            SELECT * from states;
        """)

        result = db.execute(get_states).mappings().all()

        if not result:
            return "No states yet. Try again later!"
        
        return {"states": result}
    
    except Exception as e:
        return {"details": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv("host"), port=int(os.getenv("port")))