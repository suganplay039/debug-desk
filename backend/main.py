from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

class Issue(BaseModel):
    title: str
    description: str
    category: str
    status: str

app = FastAPI(title="Debug Desk API", description="A simple tool to log your issue tracker and debug your code.", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ISSUES = [
    {
        "id": 1,
        "title": "Sample Issue",
        "description": "This is a sample issue for testing.",
        "category": "Bug",
        "status": "Open"
    },
    {
        "id": 2,
        "title": "Another Issue",
        "description": "This is another sample issue.",
        "category": "Feature Request",
        "status": "In Progress"
    }
]

def next_issue_id():
    if ISSUES:
        return max(issue["id"] for issue in ISSUES) + 1
    return 1

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/issues")
async def get_issues():
    return ISSUES

@app.post("/issues")
async def create_issue(issue: Issue):
    new_issue = {
        "id": next_issue_id(),
        "title": issue.title,
        "description": issue.description,
        "category": issue.category,
        "status": issue.status
    }
    ISSUES.append(new_issue)
    return new_issue

@app.put("/issues/{issue_id}")
async def update_issue(issue_id: int, updated_issue: Issue):
    global ISSUES
    for i, issue in enumerate(ISSUES):
        if issue["id"] == issue_id:
            ISSUES[i] = {**issue, **updated_issue.dict()}
            return ISSUES[i]
    raise HTTPException(status_code=404, detail=f"Issue with id {issue_id} not found.")

@app.delete("/issues/{issue_id}")
async def delete_issue(issue_id: int):
    for i, issue in enumerate(ISSUES):
        if issue["id"] == issue_id:
            ISSUES.pop(i)
            return {"ok": True, "message": f"Issue with id {issue_id} deleted."}
    raise HTTPException(status_code=404, detail=f"Issue with id {issue_id} not found.")
