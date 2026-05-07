import { useQuery } from "@tanstack/react-query";
import { getBooksWithAssignment } from "@/src/api/booksApi.js";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { useMemo, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";

const modules = [AllCommunityModule];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const colDefs = useMemo(
    () => [
      { field: "name" },
      { field: "author" },
      { field: "publisher" },
      { field: "assignedTo", headerName: "Assigned To" },
      {
        field: "Edit",
        maxWidth: 100,
        cellRenderer: () => (
          <div className={"py-2"}>
            <Edit color={"gray"} className={"cursor-pointer"} />
          </div>
        ),
      },
      {
        field: "Delete",
        maxWidth: 100,
        cellRenderer: () => (
          <div className={"py-2"}>
            <Trash2 color={"red"} className={"cursor-pointer"} />
          </div>
        ),
      },
    ],
    [],
  );
  const {
    data: books,
    isPending,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: getBooksWithAssignment,
  });

  if (isPending) {
    return <p className={"p-6"}>Loading books...</p>;
  }

  if (error) {
    return (
      <p className={"p-6 text-red-600"}>
        Could not load books. Please try again.
      </p>
    );
  }

  return (
    <AgGridProvider modules={modules}>
      <div>
        <h2
          className={
            "text-center uppercase tracking-wide text-2xl text-primary my-3 font-semibold"
          }
        >
          Book List
        </h2>

        <div className={"px-3 my-3 rounded-md"}>
          <div className={"flex my-3 p-2 max-w-sm"}>
            {/*<Search color={"gray"} />*/}
            <Input
              type={"text"}
              placeholder={"Search by any field"}
              className={"pl-2"}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div style={{ height: 500 }}>
            <AgGridReact
              rowData={books ?? []}
              columnDefs={colDefs}
              pagination={true}
              paginationPageSize={10}
              quickFilterText={searchTerm}
            />
          </div>
        </div>
      </div>
    </AgGridProvider>
  );
};
export default Dashboard;
