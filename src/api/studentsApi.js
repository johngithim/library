import supabase from "@/src/utils/supabase.js";

export const getStudents = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while getting students.");
  }

  return data;
};

export const addStudent = async ({ full_name, email }) => {
  const { data, error } = await supabase
    .from("students")
    .insert([{ full_name, email }])
    .select()
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message || "Error while adding student.");
  }

  return data;
};
