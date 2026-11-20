# Debug Desk – Lab Issue Tracker

A simple full-stack CRUD app to report and manage lab issues (API errors, frontend bugs, database or setup problems).

- **Frontend:** React (Vite) + Tailwind CSS, talking to the API with `fetch`
- **Backend:** Python + FastAPI + Pydantic, storing issues in an in-memory list

You can view, create, edit and delete issues. Every action is a real API request.

---

## What you need installed

- **Python 3.9+** → check with `python3 --version` (Windows: `python --version`)
- **Node.js 18+** → check with `node --version`
- **Git** → check with `git --version`

---

## 1. Get the code

```bash
git clone <repo-url>
cd debug-desk
```

The project has two folders, and each one runs in its **own terminal**:

```
debug-desk/
├── backend/     FastAPI server  → http://localhost:8001
└── frontend/    React app       → http://localhost:5174
```

---

## 2. Run the backend (Terminal 1)

```bash
cd backend
python3 -m venv .venv
```

Activate the virtual environment:

| OS | Command |
|---|---|
| Mac / Linux | `source .venv/bin/activate` |
| Windows (PowerShell) | `.\.venv\Scripts\Activate.ps1` |
| Windows (cmd) | `.venv\Scripts\activate` |

Your prompt should now start with `(.venv)`. Then:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

**Check it works:**
- http://localhost:8001/issues → shows two sample issues as JSON
- http://localhost:8001/docs → Swagger UI, where you can try every endpoint

Leave this terminal running.

---

## 3. Run the frontend (Terminal 2)

Open a **new** terminal in the `debug-desk` folder:

```bash
cd frontend
npm install
npm run dev -- --port 5174
```

Open **http://localhost:5174** in your browser. You should see the issue list and the form.

> ⚠️ Use exactly `localhost:5174`. The backend only allows requests from that address (CORS). If you open a different port, or `127.0.0.1` instead of `localhost`, the list will stay empty and the browser console will show a CORS error.

---

## 4. API endpoints

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/issues` | Get all issues |
| POST | `/issues` | Create an issue |
| PUT | `/issues/{issue_id}` | Update an issue |
| DELETE | `/issues/{issue_id}` | Delete an issue (404 if the id doesn't exist) |

Issue shape (the same field names are used in Python and React):

```json
{
  "id": 1,
  "title": "Sample Issue",
  "description": "This is a sample issue for testing.",
  "category": "Bug",
  "status": "Open"
}
```

The backend creates `id`. You send `title`, `description`, `category` and `status`.

---

## 5. Project files

```
backend/
  main.py              FastAPI app: CORS, Issue model, ISSUES list, the 4 routes
  requirements.txt     Python packages
frontend/src/
  App.jsx              Holds the issues + form state and makes every fetch call
  components/
    IssueForm.jsx      One form used for both "Add" and "Update"
    IssueList.jsx      Shows all issues, or a message when there are none
    IssueCard.jsx      One issue with its Edit and Delete buttons
```

**How one action flows:** click a button → `fetch` sends the request → FastAPI validates it with Pydantic → the `ISSUES` list changes → the API returns JSON → React fetches the list again and re-renders.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `uvicorn: command not found` / `No module named 'fastapi'` | The venv isn't active. Activate it (step 2) and run `pip install` again |
| `Address already in use` | An old server is still running. Stop it with `Ctrl + C` |
| Page loads but no issues appear | Is the backend terminal still running? Open DevTools → Console and Network |
| **CORS error** in the console | Open the app at exactly `http://localhost:5174` |
| Your new issues disappeared | Expected: the data lives in memory, so it resets every time the backend restarts |
| Windows: "running scripts is disabled" | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once in PowerShell, then activate again |

Stop either server with `Ctrl + C`.
