import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableComponentProps {
  headers: string[];
  rows: string[][];
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, rows }) => {
  return (
    <Table className="p-4">
      <TableHeader className="p-4">
        <TableRow className="bg-primary hover:bg-primary text-white">
          {headers.map((header, index) => (
            <TableHead key={index} className="text-lg text-white">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell
                key={cellIndex}
                className={cellIndex === 0 ? "font-medium" : ""}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
