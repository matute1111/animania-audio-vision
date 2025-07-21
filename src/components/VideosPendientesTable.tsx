
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Plus, Upload, Grid3X3, List } from "lucide-react";
import { useAirtable } from "@/hooks/useAirtable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

export const VideosPendientesTable = () => {
  const { records, loading, error } = useAirtable();
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const navigate = useNavigate();

  const pendientesRecords = records.filter(record => record.status !== "APPROVED");

  const handleAddVideo = (recordId: string) => {
    console.log("Agregando video para:", recordId);
    // Aquí implementarías la lógica para agregar un video más
  };

  const handleUpload = async (recordId: string) => {
    setUploadingIds(prev => new Set(prev).add(recordId));
    
    try {
      // Aquí implementarías la lógica de subida
      console.log("Subiendo video:", recordId);
      
      // Simular subida
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error("Error al subir:", error);
    } finally {
      setUploadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(recordId);
        return newSet;
      });
    }
  };

  const handleEditMetadata = (recordId: string) => {
    navigate(`/edit-metadata/${recordId}`);
  };

  const canUpload = (record: any) => {
    return record.raw && record.audio && record.script && record.final;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Videos Pendientes de Aprobación</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-1"
            >
              <List className="h-4 w-4" />
              Tabla
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="flex items-center gap-1"
            >
              <Grid3X3 className="h-4 w-4" />
              Cards
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
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
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendientesRecords.map((record) => (
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
                    <TableCell className="max-w-xs truncate">
                      <div 
                        className="group relative cursor-pointer hover:bg-muted/20 p-1 rounded transition-colors"
                        onClick={() => handleEditMetadata(record.id)}
                      >
                        <span>{record.title || "Sin título"}</span>
                        <Plus className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity inline-block text-primary" />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <div 
                        className="group relative cursor-pointer hover:bg-muted/20 p-1 rounded transition-colors"
                        onClick={() => handleEditMetadata(record.id)}
                      >
                        <span>{record.description || "Sin descripción"}</span>
                        <Plus className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity inline-block text-primary" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="group relative cursor-pointer hover:bg-muted/20 p-1 rounded transition-colors"
                        onClick={() => handleEditMetadata(record.id)}
                      >
                        <span>{record.category_id || "Sin categoría"}</span>
                        <Plus className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity inline-block text-primary" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddVideo(record.id)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Video+
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpload(record.id)}
                          disabled={!canUpload(record) || uploadingIds.has(record.id)}
                          className="flex items-center gap-1"
                        >
                          {uploadingIds.has(record.id) ? (
                            <LoadingSpinner />
                          ) : (
                            <Upload className="h-3 w-3" />
                          )}
                          OK
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pendientesRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No hay videos pendientes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendientesRecords.map((record) => (
              <Card key={record.id} className="bg-card border-border hover:bg-card/80 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono">{record.id.slice(-6)}</CardTitle>
                    <div className="flex gap-1">
                      <Badge variant={record.raw ? "default" : "secondary"} className="text-xs">
                        C
                      </Badge>
                      <Badge variant={record.audio ? "default" : "secondary"} className="text-xs">
                        A
                      </Badge>
                      <Badge variant={record.script ? "default" : "secondary"} className="text-xs">
                        G
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div 
                      className="group relative cursor-pointer hover:bg-muted/20 p-2 rounded transition-colors border border-dashed border-border/50"
                      onClick={() => handleEditMetadata(record.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Título</p>
                          <p className="text-sm font-medium truncate">{record.title || "Sin título"}</p>
                        </div>
                        <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0 ml-2" />
                      </div>
                    </div>
                    
                    <div 
                      className="group relative cursor-pointer hover:bg-muted/20 p-2 rounded transition-colors border border-dashed border-border/50"
                      onClick={() => handleEditMetadata(record.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Descripción</p>
                          <p className="text-sm line-clamp-2">{record.description || "Sin descripción"}</p>
                        </div>
                        <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0 ml-2 mt-1" />
                      </div>
                    </div>
                    
                    <div 
                      className="group relative cursor-pointer hover:bg-muted/20 p-2 rounded transition-colors border border-dashed border-border/50"
                      onClick={() => handleEditMetadata(record.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Categoría</p>
                          <p className="text-sm font-medium truncate">{record.category_id || "Sin categoría"}</p>
                        </div>
                        <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddVideo(record.id)}
                      className="flex items-center gap-1 flex-1"
                    >
                      <Plus className="h-3 w-3" />
                      Video+
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpload(record.id)}
                      disabled={!canUpload(record) || uploadingIds.has(record.id)}
                      className="flex items-center gap-1 flex-1"
                    >
                      {uploadingIds.has(record.id) ? (
                        <LoadingSpinner />
                      ) : (
                        <Upload className="h-3 w-3" />
                      )}
                      OK
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendientesRecords.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No hay videos pendientes
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
