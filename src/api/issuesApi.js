import supabase from "@/src/utils/supabase.js";

const ISSUE_PERIOD_DAYS = 2;

const normalizeRelation = (relation) => {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }
  return relation ?? null;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const issueBookToStudent = async ({ bookId, studentId }) => {
  const issuedAt = new Date();
  const dueAt = addDays(issuedAt, ISSUE_PERIOD_DAYS);

  const { data, error } = await supabase
    .from("book_issues")
    .insert([
      {
        book_id: bookId,
        student_id: studentId,
        issued_at: issuedAt.toISOString(),
        due_at: dueAt.toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while issuing book.");
  }

  return data;
};

export const getOpenBookIssues = async () => {
  const { data, error } = await supabase
    .from("book_issues")
    .select(
      "id, book_id, student_id, issued_at, due_at, returned_at, books(id, name), students(id, full_name, email)",
    )
    .is("returned_at", null)
    .order("due_at", { ascending: true });

  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while getting issued books.");
  }

  return (data ?? []).map((issue) => ({
    ...issue,
    book: normalizeRelation(issue.books),
    student: normalizeRelation(issue.students),
  }));
};

export const returnBook = async (issueId) => {
  const { data, error } = await supabase
    .from("book_issues")
    .update({
      returned_at: new Date().toISOString(),
    })
    .eq("id", issueId)
    .is("returned_at", null)
    .select()
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while returning book.");
  }

  return data;
};

export const getIssueHistory = async () => {
  const { data, error } = await supabase
    .from("book_issues")
    .select(
      "id, issued_at, due_at, returned_at, books(id, name), students(id, full_name, email)",
    )
    .order("issued_at", { ascending: false });

  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while getting issue history.");
  }

  return (data ?? []).map((issue) => ({
    ...issue,
    book: normalizeRelation(issue.books),
    student: normalizeRelation(issue.students),
  }));
};
