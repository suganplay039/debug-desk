export default function IssueCard({ issue, onDelete, onEdit }) {
    return (
        <li key={issue.id} className="py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{issue.title}</h3>
                    <p className="text-sm text-gray-500">{issue.description}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">{issue.category}</span>
                    <span
                    className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${
                        issue.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                    >
                    {issue.status}
                    </span>
                </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={() => onEdit(issue)}
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Edit
                    </button>
                </div>
                <div className="mt-2">
                    <button
                        onClick={() => onDelete(issue.id)}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </li>
    )
}