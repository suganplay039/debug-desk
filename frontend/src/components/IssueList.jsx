import IssueCard from "./IssueCard"

export default function IssueList({ issues, onDelete, onEdit }) {

    if (issues.length === 0) {
        return (
            <div className="mt-4 text-gray-500">
                No issues found.
            </div>
        )
    }

    return (
        <div className="mt-4">
        <ul className="divide-y divide-gray-200">
            {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onDelete={onDelete} onEdit={onEdit} />            
            ))}
        </ul>
        </div>
    )
}