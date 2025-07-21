
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { getVideoRecord, updateVideoRecord } from "@/utils/airtable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import spaceBanner from "@/assets/space-banner.jpg";

const EditMetadata = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    category_id: "",
    script: ""
  });

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const record = await getVideoRecord(id);
        setMetadata({
          title: record.title || "",
          description: record.description || "",
          category_id: record.category_id || "",
          script: record.script || ""
        });
      } catch (err) {
        setError("Error al cargar los datos del video");
        console.error("Error fetching record:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    
    setSaving(true);
    try {
      await updateVideoRecord(id, {
        title: metadata.title,
        description: metadata.description,
        category_id: metadata.category_id
      });
      
      toast.success("Metadatos actualizados correctamente");
      navigate("/general");
    } catch (err) {
      toast.error("Error al guardar los cambios");
      console.error("Error updating record:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${spaceBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/general")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-magic bg-clip-text text-transparent">
            Editar Metadatos del Video
          </h1>
          <p className="text-muted-foreground mt-2">
            ID: {id?.slice(-8)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Script Display */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Guión Original</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {metadata.script || "Sin guión disponible"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Metadatos Editables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={metadata.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ingresa el título del video"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={metadata.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe el contenido del video"
                    className="mt-1 min-h-32"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={metadata.category_id}
                    onChange={(e) => handleInputChange("category_id", e.target.value)}
                    placeholder="Ej: Historias, Educativo, General"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <LoadingSpinner />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar Cambios
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/general")}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMetadata;
