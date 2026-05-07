import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button.tsx";
import { getOpenBookIssues, returnBook } from "@/src/api/issuesApi.js";
import { toast } from "sonner";

const ReturnBook = () => {
  const [issueId, setIssueId] = useState("");
  const queryClient = useQueryClient();

  const {
    data: openIssues,
    isPending,
    error,
  } = useQuery({
    queryKey: ["open-issues"],
    queryFn: getOpenBookIssues,
  });

  const selectedIssue = useMemo(() => {
    return openIssues?.find((issue) => String(issue.id) === issueId);
  }, [openIssues, issueId]);

  const returnMutation = useMutation({
    mutationFn: returnBook,
    onSuccess: async () => {
      toast.success("Book returned successfully");
      setIssueId("");
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      await queryClient.invalidateQueries({ queryKey: ["available-books"] });
      await queryClient.invalidateQueries({ queryKey: ["open-issues"] });
      await queryClient.invalidateQueries({ queryKey: ["issue-history"] });
    },
    onError: (mutationError) => {
      toast.error(mutationError.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!issueId) {
      toast.error("Please select an issued book.");
      return;
    }

    returnMutation.mutate(issueId);
  };

  if (error) {
    return (
      <p className={"p-6 text-red-600"}>
        Could not load issued books. Please try again.
      </p>
    );
  }

  return (
    <div className={"max-w-xl p-6 bg-white rounded-2xl shadow-md border border-gray-100"}>
      <h1 className={"text-2xl font-bold mb-6"}>Return Book</h1>

      <form onSubmit={handleSubmit} className={"space-y-4"}>
        <select
          className={"h-8 w-full rounded-lg border border-input px-2.5 text-sm"}
          disabled={isPending || returnMutation.isPending}
          value={issueId}
          onChange={(e) => setIssueId(e.target.value)}
        >
          <option value={""}>Select Issued Book</option>
          {(openIssues ?? []).map((issue) => (
            <option key={issue.id} value={String(issue.id)}>
              {issue.book?.name ?? "Unknown Book"} -{" "}
              {issue.student?.full_name ?? "Unknown Student"}
            </option>
          ))}
        </select>

        {selectedIssue ? (
          <p className={"text-sm text-muted-foreground"}>
            Due date: {new Date(selectedIssue.due_at).toLocaleDateString()}
          </p>
        ) : null}

        {(openIssues ?? []).length === 0 && !isPending ? (
          <p className={"text-sm text-muted-foreground"}>
            There are no books currently issued.
          </p>
        ) : null}

        <Button type="submit" className={"w-full"} disabled={returnMutation.isPending}>
          {returnMutation.isPending ? "Returning..." : "Return Book"}
        </Button>
      </form>
    </div>
  );
};
export default ReturnBook;
