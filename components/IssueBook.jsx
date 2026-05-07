import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button.tsx";
import { getBooks } from "@/src/api/booksApi.js";
import { issueBookToStudent } from "@/src/api/issuesApi.js";
import { getStudents } from "@/src/api/studentsApi.js";
import { toast } from "sonner";

const emptyForm = {
  bookId: "",
  studentId: "",
};

const IssueBook = () => {
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const {
    data: books,
    isPending: isBooksPending,
    error: booksError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const {
    data: students,
    isPending: isStudentsPending,
    error: studentsError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const selectedBookName = useMemo(() => {
    return books?.find((book) => String(book.id) === form.bookId)?.name ?? "";
  }, [books, form.bookId]);

  const issueMutation = useMutation({
    mutationFn: issueBookToStudent,
    onSuccess: async () => {
      toast.success("Book issued successfully for 2 days");
      setForm(emptyForm);
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      await queryClient.invalidateQueries({ queryKey: ["open-issues"] });
      await queryClient.invalidateQueries({ queryKey: ["issue-history"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.bookId || !form.studentId) {
      toast.error("Please select both book and student.");
      return;
    }

    issueMutation.mutate({
      bookId: form.bookId,
      studentId: form.studentId,
    });
  };

  if (booksError || studentsError) {
    return (
      <p className={"p-6 text-red-600"}>
        Could not load issue form data. Please try again.
      </p>
    );
  }

  return (
    <div className={"max-w-xl p-6 bg-white rounded-2xl shadow-md border border-gray-100"}>
      <h1 className={"text-2xl font-bold mb-6"}>Issue Book</h1>

      <form onSubmit={handleSubmit} className={"space-y-4"}>
        <select
          className={"h-8 w-full rounded-lg border border-input px-2.5 text-sm"}
          value={form.bookId}
          disabled={isBooksPending || issueMutation.isPending}
          onChange={(e) => setForm((prev) => ({ ...prev, bookId: e.target.value }))}
        >
          <option value={""}>Select Book</option>
          {(books ?? []).map((book) => (
            <option key={book.id} value={String(book.id)}>
              {book.name}
            </option>
          ))}
        </select>

        <select
          className={"h-8 w-full rounded-lg border border-input px-2.5 text-sm"}
          value={form.studentId}
          disabled={isStudentsPending || issueMutation.isPending}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, studentId: e.target.value }))
          }
        >
          <option value={""}>Select Student</option>
          {(students ?? []).map((student) => (
            <option key={student.id} value={String(student.id)}>
              {student.full_name}
            </option>
          ))}
        </select>

        {selectedBookName ? (
          <p className={"text-sm text-muted-foreground"}>
            <span className={"font-semibold"}>{selectedBookName}</span> will be
            due in 2 days.
          </p>
        ) : null}

        {(books ?? []).length === 0 && !isBooksPending ? (
          <p className={"text-sm text-muted-foreground"}>
            No books are available to issue right now.
          </p>
        ) : null}

        <Button type="submit" className={"w-full"} disabled={issueMutation.isPending}>
          {issueMutation.isPending ? "Issuing..." : "Issue Book"}
        </Button>
      </form>
    </div>
  );
};
export default IssueBook;
