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
git clone https://github.com/suganplay039/debug-desk.git
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

## FAQ: ports

### Why port 8001 and 5174 instead of the usual 8000 and 5173?

FastAPI (Uvicorn) normally starts on **8000** and Vite on **5173**. During the live session, another example project with the same setup was already running on those default ports. A port can only be used by one program at a time, so this project was started on the next free ports, **8001** and **5174**, and the code was written to match.

You'll meet the same situation whenever you run two projects at once.

That's why the commands include `--port 8001` and `--port 5174`. If you leave them out, the servers start on the defaults, and the app won't be able to connect.

### Why does the port have to match *exactly*?

The ports are written into the code in two places, and both must agree with the ports you actually run on:

| File | Line | What it controls |
|---|---|---|
| `frontend/src/App.jsx` | `const API_URL = 'http://localhost:8001/issues'` | **Where React sends its requests.** If the backend runs on a different port, every `fetch` fails with `Failed to fetch` / `ERR_CONNECTION_REFUSED` |
| `backend/main.py` | `allow_origins=["http://localhost:5174"]` | **Which website is allowed to call the API (CORS).** The browser blocks the response if the page's address isn't in this list, character for character |

**Why CORS exists:** the React page (`localhost:5174`) and the API (`localhost:8001`) are on different ports, so the browser treats them as **different websites**. For security, a browser won't let one website read data from another unless the server says it's allowed. `allow_origins` is FastAPI telling the browser, "requests from `http://localhost:5174` are OK."

This is also why `http://127.0.0.1:5174` fails even though it's the same computer. To the browser, `localhost` and `127.0.0.1` are different origins.

> Swagger (`/docs`) works even when CORS is wrong, because it's served by the API itself (same origin). If Swagger works but the React app shows nothing, check CORS and the port first.

### How do I run on different ports? (port remap)

Say port 8001 or 5174 is busy on your machine, and you want **8002** for the backend and **5175** for the frontend. Change all four places so they agree:

1. **Backend start command:** `uvicorn main:app --reload --port 8002`
2. **`frontend/src/App.jsx`:** `const API_URL = 'http://localhost:8002/issues'`
3. **Frontend start command:** `npm run dev -- --port 5175`
4. **`backend/main.py`:** `allow_origins=["http://localhost:5175"]` (Uvicorn's `--reload` picks this up when you save)

Rule of thumb: **backend port → goes in `App.jsx`**, **frontend port → goes in `main.py`**.

### Vite says "Port 5174 is in use, trying another one..."

Vite quietly moves to the next free port (for example 5175), but CORS still only allows 5174, so the list stays empty. Either stop the program using 5174, or follow the remap steps above. To make Vite stop with an error instead of switching ports, add `--strictPort`:

```bash
npm run dev -- --port 5174 --strictPort
```

### How do I find what's using a port?

- **Mac / Linux:** `lsof -i :8001`, then stop it with `kill <PID>`
- **Windows (PowerShell):** `netstat -ano | findstr :8001`, then `taskkill /PID <PID> /F`

Usually it's just an old server you forgot in another terminal. Go back to that terminal and press `Ctrl + C`.

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
