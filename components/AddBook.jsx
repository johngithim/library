import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { addBook } from "@/src/api/booksApi.js";
import { toast } from "sonner";

const initialForm = {
  name: "",
  author: "",
  publisher: "",
};

const AddBook = () => {
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addBookMutation = useMutation({
    mutationFn: addBook,
    onSuccess: async () => {
      toast.success("Book added successfully");
      setForm(initialForm);
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      await queryClient.invalidateQueries({ queryKey: ["available-books"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.author.trim() || !form.publisher.trim()) {
      toast.error("Please fill name, author, and publisher.");
      return;
    }

    addBookMutation.mutate({
      name: form.name.trim(),
      author: form.author.trim(),
      publisher: form.publisher.trim(),
    });
  };

  return (
    <div className={"max-w-xl p-6 bg-white rounded-2xl shadow-md border border-gray-100"}>
      <h1 className={"text-2xl font-bold mb-6"}>Add Book</h1>

      <form onSubmit={handleSubmit} className={"space-y-4"}>
        <Input
          name={"name"}
          placeholder={"Book Name"}
          value={form.name}
          onChange={handleChange}
        />

        <Input
          name={"author"}
          placeholder={"Author"}
          value={form.author}
          onChange={handleChange}
        />

        <Input
          name={"publisher"}
          placeholder={"Publisher"}
          value={form.publisher}
          onChange={handleChange}
        />

        <Button type="submit" className={"w-full"} disabled={addBookMutation.isPending}>
          {addBookMutation.isPending ? "Adding..." : "Add Book"}
        </Button>
      </form>
    </div>
  );
};

export default AddBook;