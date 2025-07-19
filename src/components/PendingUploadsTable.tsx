import { useAirtable } from "@/hooks/useAirtable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Badge } from "@/components/ui/badge";

export const PendingUploadsTable = () => {
  const { records, loading, error } = useAirtable();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Raw</TableHead>
            <TableHead>Audio</TableHead>
            <TableHead>Script</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category ID</TableHead>
            <TableHead>Final</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No pending uploads found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {record.raw ? (
                    <a 
                      href={record.raw} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {record.audio ? (
                    <a 
                      href={record.audio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Listen
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {record.script || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {record.title || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {record.description || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  {record.category_id || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  {record.final ? (
                    <a 
                      href={record.final} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(record.status)}>
                    {record.status || 'Unknown'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};