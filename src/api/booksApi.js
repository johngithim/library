import supabase from "@/src/utils/supabase.js";
const getStudentNameMap = async (studentIds) => {
  if (!studentIds.length) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("students")
    .select("id, full_name")
    .in("id", studentIds);

  if (error) {
    return new Map();
  }

  return new Map(
    (data ?? []).map((student) => [student.id, student.full_name]),
  );
};

export const getBooks = async () => {
  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .order("name", { ascending: true });
  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while getting list of books.");
  }
  return books;
};

export const addBook = async ({ name, author, publisher }) => {
  const { data, error } = await supabase
    .from("books")
    .insert([{ name, author, publisher }])
    .select()
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while adding book.");
  }

  return data;
};

export const getBooksWithAssignment = async () => {
  const books = await getBooks();
  const { data: activeIssues, error } = await supabase
    .from("book_issues")
    .select("book_id, student_id")
    .is("returned_at", null);

  if (error) {
    return books.map((book) => ({
      ...book,
      assignedTo: "Available",
    }));
  }

  const studentIds = Array.from(
    new Set(
      (activeIssues ?? []).map((issue) => issue.student_id).filter(Boolean),
    ),
  );
  const studentNameById = await getStudentNameMap(studentIds);

  const assignmentByBookId = new Map(
    (activeIssues ?? []).map((issue) => [
      issue.book_id,
      studentNameById.get(issue.student_id) ?? "Assigned",
    ]),
  );

  return books.map((book) => ({
    ...book,
    assignedTo: assignmentByBookId.get(book.id) ?? "Available",
  }));
};

export const getAvailableBooks = async () => {
  const books = await getBooks();
  const { data: activeIssues, error } = await supabase
    .from("book_issues")
    .select("book_id")
    .is("returned_at", null);

  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while getting available books.");
  }

  const issuedBookIds = new Set(
    (activeIssues ?? []).map((issue) => issue.book_id),
  );

  return books.filter((book) => !issuedBookIds.has(book.id));
};
