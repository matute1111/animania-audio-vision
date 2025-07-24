import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useAirtable } from "@/hooks/useAirtable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

export const VideosAprobadosTable = () => {
  const { records, loading, error } = useAirtable();

  const aprobadosRecords = records.filter(record => record.status === "APPROVED");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">
          Videos Aprobados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="min-w-[700px]">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Crudo</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead>Guión</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aprobadosRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">
                    {record.id.slice(-6)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.raw ? "default" : "secondary"}>
                      {record.raw ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.audio ? "default" : "secondary"}>
                      {record.audio ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.script ? "default" : "secondary"}>
                      {record.script ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate">
                    {record.title || "Sin título"}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate">
                    {record.description || "Sin descripción"}
                  </TableCell>
                  <TableCell>
                    {record.category_id || "Sin categoría"}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Aprobado
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {aprobadosRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No hay videos aprobados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};