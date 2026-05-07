import { useQuery } from "@tanstack/react-query";
import { getIssueHistory } from "@/src/api/issuesApi.js";

const statusStyles = {
  overdue: "bg-red-100 border-red-300",
  returned: "bg-green-100 border-green-300",
  active: "bg-white border-gray-200",
};

const getIssueStatus = (issue) => {
  if (issue.returned_at) {
    return "returned";
  }

  const dueDate = new Date(issue.due_at);
  if (dueDate < new Date()) {
    return "overdue";
  }

  return "active";
};
const StudentsList = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["issue-history"],
    queryFn: getIssueHistory,
  });

  if (isPending) {
    return <p className={"p-6"}>Loading student list...</p>;
  }

  if (error) {
    return (
      <p className={"p-6 text-red-600"}>
        Could not load student list. Please try again.
      </p>
    );
  }

  return (
    <div className={"p-6"}>
      <h2 className={"text-center uppercase tracking-wide text-2xl text-primary my-3 font-semibold"}>
        Students List
      </h2>

      {(data ?? []).length === 0 ? (
        <p className={"text-sm text-muted-foreground text-center"}>
          No issued books found yet.
        </p>
      ) : (
        <div className={"space-y-3"}>
          {data.map((issue) => {
            const status = getIssueStatus(issue);
            return (
              <div
                key={issue.id}
                className={`rounded-lg border p-4 ${statusStyles[status]}`}
              >
                <div className={"flex flex-wrap justify-between gap-3"}>
                  <div>
                    <p className={"font-semibold"}>{issue.student?.full_name ?? "Unknown Student"}</p>
                    <p className={"text-sm text-muted-foreground"}>
                      {issue.student?.email ?? "No email"}
                    </p>
                  </div>
                  <p className={"text-sm font-semibold uppercase tracking-wide"}>
                    {status}
                  </p>
                </div>

                <p className={"mt-2 text-sm"}>
                  Book: <span className={"font-medium"}>{issue.book?.name ?? "Unknown Book"}</span>
                </p>
                <p className={"text-sm"}>Due: {new Date(issue.due_at).toLocaleDateString()}</p>
                <p className={"text-sm"}>
                  Returned:{" "}
                  {issue.returned_at
                    ? new Date(issue.returned_at).toLocaleDateString()
                    : "Not returned"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default StudentsList;
