import { useState, useEffect } from 'react'
import IssueForm from './components/IssueForm'
import IssueList from './components/IssueList'

const EMPTY_FORM = { title: '', description: '', category: 'Bug', status: 'Open' }
const API_URL = 'http://localhost:8001/issues'

function App() {
  const [editingIssueId, setEditingIssueId] = useState(null)
  const [issues, setIssues] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)

  function loadIssues() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setIssues(data)
      })
      .catch((error) => {
        console.error('Error fetching issues:', error)
      })
  }

  useEffect(() => {
    loadIssues()
  }, [])

  function handleSubmit() {
    const body = {
      title: form.title,
      description: form.description,
      category: form.category,
      status: form.status,
    }
    fetch(editingIssueId ? `${API_URL}/${editingIssueId}` : API_URL, {
      method: editingIssueId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        loadIssues()
        setForm(EMPTY_FORM)
        setEditingIssueId(null)
      })
      .catch((error) => {
        console.error('Error creating issue:', error)
      })
  }

  function handleDelete(issueId) {
    fetch(`${API_URL}/${issueId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          loadIssues()
        } else {
          console.error('Error deleting issue:', response.statusText)
          alert('Failed to delete the issue. Please try again.')
        }
      })
      .catch((error) => {
        console.error('Error deleting issue:', error)
        alert('Failed to delete the issue. Please try again.')
      })
  }

  function handleEdit(issue) {
    setEditingIssueId(issue.id)
    setForm({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
    })
    console.log('Editing issue:', issue)
  }

  function cancelEdit() {
    setEditingIssueId(null)
    setForm(EMPTY_FORM)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Debug Desk</h1>
          <p className="mt-2 text-slate-600">A simple tool to log your issue tracker and debug your code.</p>
        </header>

        <IssueForm form={form} setForm={setForm} onSubmit={handleSubmit} editingIssueId={editingIssueId} cancelEdit={cancelEdit} />

        <h2 className="mt-8 text-xl font-bold sm:text-2xl">All Issues</h2>

        <IssueList issues={issues} onDelete={handleDelete} onEdit={handleEdit} />

      </div>
    </div>
  )
}

export default App
