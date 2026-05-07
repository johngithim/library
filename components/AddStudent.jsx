import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { addStudent } from "@/src/api/studentsApi.js";
import { toast } from "sonner";

const initialForm = {
  full_name: "",
  email: "",
};

const AddStudent = () => {
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addStudentMutation = useMutation({
    mutationFn: addStudent,
    onSuccess: async () => {
      toast.success("Student added successfully");
      setForm(initialForm);
      await queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.full_name.trim() || !form.email.trim()) {
      toast.error("Please fill student name and email.");
      return;
    }

    addStudentMutation.mutate({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
    });
  };

  return (
    <div className={"max-w-xl p-6 bg-white rounded-2xl shadow-md border border-gray-100"}>
      <h1 className={"text-2xl font-bold mb-6"}>Add Student</h1>

      <form onSubmit={handleSubmit} className={"space-y-4"}>
        <Input
          name={"full_name"}
          placeholder={"Student Name"}
          value={form.full_name}
          onChange={handleChange}
        />

        <Input
          name={"email"}
          type={"email"}
          placeholder={"Email"}
          value={form.email}
          onChange={handleChange}
        />

        <Button type="submit" className={"w-full"} disabled={addStudentMutation.isPending}>
          {addStudentMutation.isPending ? "Adding..." : "Add Student"}
        </Button>
      </form>
    </div>
  );
};

export default AddStudent;