import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { PenTool, Sparkles, X, ChevronUp, ChevronDown, Maximize2, Check, ChevronRight, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import spaceBanner from "@/assets/space-banner.jpg";
import { TrendyWords } from "@/components/TrendyWords";
import { TimelineSteps } from "@/components/TimelineSteps";
import { useCharacters } from "@/hooks/useCharacters";
import { useVideoCreationFlow } from "@/hooks/useVideoCreationFlow";
interface Guion {
  id: string;
  content: string;
  minimized: boolean;
}

interface GuionAprobado {
  id: string;
  content: string;
  title: string;
  expanded: boolean;
}

const NuevoGuion = () => {
  const navigate = useNavigate();
  const { setScript } = useVideoCreationFlow();
  
  const [tema, setTema] = useState("");
  const [contexto, setContexto] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [selectedTrendyWords, setSelectedTrendyWords] = useState<string[]>([]);
  const [guionesGenerados, setGuionesGenerados] = useState<Guion[]>([]);
  const [guionesAprobados, setGuionesAprobados] = useState<GuionAprobado[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGuionForDialog, setSelectedGuionForDialog] = useState<Guion | null>(null);
  
  const { characters, loading: charactersLoading } = useCharacters();

  // Load approved scripts from localStorage
  useEffect(() => {
    const savedApproved = localStorage.getItem('guionesAprobados');
    if (savedApproved) {
      try {
        setGuionesAprobados(JSON.parse(savedApproved));
      } catch (error) {
        console.error('Error loading approved scripts:', error);
      }
    }
  }, []);
  const handleGenerarGuiones = async () => {
    if (!selectedCharacter) {
      toast.error("Por favor selecciona un personaje");
      return;
    }
    setLoading(true);
    try {
      console.log("Enviando solicitud al webhook...");
      const response = await fetch("https://matiasalbaca.app.n8n.cloud/webhook/Guiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solicitud: {
            tipo: "generacion_guiones",
            timestamp: new Date().toISOString(),
            origen: "webapp_historias_infinitas"
          },
          parametros: {
            personaje_seleccionado: selectedCharacter,
            palabras_contexto: `${selectedTrendyWords.join('; ')}${selectedTrendyWords.length > 0 && contexto ? '; ' : ''}${contexto}`.trim()
          },
          configuracion: {
            idioma: "es",
            formato_salida: "texto_plano",
            version_api: "1.0"
          }
        }),
      });

      console.log("Respuesta del webhook:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos:", data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          const nuevosGuiones = data.map((item, index) => ({
            id: `guion-${Date.now()}-${index}`,
            content: item.output || "",
            minimized: false
          }));
          setGuionesGenerados(nuevosGuiones);
          toast.success("Guiones generados exitosamente");
        } else {
          console.error("Formato de datos incorrecto:", data);
          toast.error("Formato de respuesta incorrecto del webhook");
        }
      } else {
        const errorText = await response.text();
        console.error("Error del webhook:", response.status, errorText);
        toast.error(`Error del webhook: ${response.status}`);
      }
    } catch (error) {
      console.error("Error conectando con el webhook:", error);
      if (error instanceof TypeError && error.message.includes('CORS')) {
        toast.error("Error de CORS: Configura el webhook de n8n para permitir peticiones desde este dominio");
      } else {
        toast.error("Error al conectar con el webhook. Verifica la configuración en n8n.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLimpiar = () => {
    setTema("");
    setContexto("");
    setSelectedCharacter("");
    setSelectedTrendyWords([]);
    setGuionesGenerados([]);
  };

  const handleWordClick = (word: string) => {
    setSelectedTrendyWords(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      } else {
        return [...prev, word];
      }
    });
  };

  const handleRemoveTrendyWord = (wordToRemove: string) => {
    setSelectedTrendyWords(prev => prev.filter(w => w !== wordToRemove));
  };

  const handleToggleMinimize = (guionId: string) => {
    setGuionesGenerados(prev => 
      prev.map(guion => 
        guion.id === guionId 
          ? { ...guion, minimized: !guion.minimized }
          : guion
      )
    );
  };

  const handleEditGuion = (guionId: string, newContent: string) => {
    setGuionesGenerados(prev => 
      prev.map(guion => 
        guion.id === guionId 
          ? { ...guion, content: newContent }
          : guion
      )
    );
  };

  const handleOpenDialog = (guion: Guion) => {
    setSelectedGuionForDialog(guion);
    setDialogOpen(true);
  };

  const handleApproveScript = (guion: Guion) => {
    const approvedScript: GuionAprobado = {
      id: `approved-${Date.now()}`,
      content: guion.content,
      title: `Guión Aprobado ${guionesAprobados.length + 1}`,
      expanded: false
    };

    const newApproved = [...guionesAprobados, approvedScript];
    setGuionesAprobados(newApproved);
    localStorage.setItem('guionesAprobados', JSON.stringify(newApproved));

    // Remove from generated scripts
    setGuionesGenerados(prev => prev.filter(g => g.id !== guion.id));
    
    setDialogOpen(false);
    setSelectedGuionForDialog(null);
    toast.success("Guión aprobado exitosamente");
  };

  const handleToggleApprovedScript = (scriptId: string) => {
    setGuionesAprobados(prev => 
      prev.map(script => 
        script.id === scriptId 
          ? { ...script, expanded: !script.expanded }
          : script
      )
    );
  };

  const handleGoToAudio = (script: GuionAprobado) => {
    setScript(script.content);
    toast.success("Guión cargado en la sección de audio");
    navigate('/nuevo-audio');
  };
  return <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background relative" style={{
      backgroundImage: `url(${spaceBanner})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/90 backdrop-blur-sm relative z-30">
            <SidebarTrigger className="ml-4" />
          </header>
          
          <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Timeline Steps */}
            <TimelineSteps />
            
            {/* Título Guión */}
            <h2 className="text-2xl font-bold mb-6">Guión</h2>
            
            {/* Sección de Palabras Trendy */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
              <CardContent className="pt-6">
                <TrendyWords onWordClick={handleWordClick} selectedWords={selectedTrendyWords} />
              </CardContent>
            </Card>

            {/* Panel de Configuración - Horizontal */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
              <CardHeader>
                <CardTitle>
                  Configuración del Guión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                  <div>
                    <Label htmlFor="personaje">Selección de Personaje</Label>
                    <Select value={selectedCharacter} onValueChange={setSelectedCharacter} disabled={charactersLoading}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={charactersLoading ? "Cargando personajes..." : "Selecciona un personaje"} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        {characters.map((character) => (
                          <SelectItem key={character.id} value={character.name}>
                            {character.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleGenerarGuiones} 
                        disabled={loading || !selectedCharacter} 
                        size="sm"
                      >
                        {loading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-1" />
                            Generando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 mr-1" />
                            Generar
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" onClick={handleLimpiar} disabled={loading} size="sm">
                        Limpiar
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="contexto">Contexto Adicional</Label>
                  
                  {/* Tags de palabras trendy seleccionadas */}
                  {selectedTrendyWords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                      {selectedTrendyWords.map((word, index) => (
                        <Badge
                          key={`${word}-${index}`}
                          variant="secondary"
                          className="cursor-pointer flex items-center gap-1"
                          onClick={() => handleRemoveTrendyWord(word)}
                        >
                          {word}
                          <X className="h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Textarea 
                    id="contexto" 
                    value={contexto} 
                    onChange={e => setContexto(e.target.value)} 
                    placeholder="Describe detalles específicos, personajes, ambiente, época..." 
                    className="mt-1 min-h-20" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Panel de Guiones Generados - Abajo */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Guiones Generados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {guionesGenerados.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Los guiones generados aparecerán aquí</p>
                    <p className="text-sm">Completa la configuración y presiona "Generar Guiones"</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {guionesGenerados.map((guion, index) => (
                      <Card key={guion.id} className="bg-background/50 w-full">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                          <CardTitle className="text-sm">Guión {index + 1}</CardTitle>
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => handleApproveScript(guion)}
                              size="sm"
                              className="flex items-center gap-2 h-6 px-2"
                            >
                              <Check className="h-3 w-3" />
                              Aprobar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(guion)}
                              className="h-6 w-6 p-0"
                              title="Abrir en ventana completa"
                            >
                              <Maximize2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleMinimize(guion.id)}
                              className="h-6 w-6 p-0"
                            >
                              {guion.minimized ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronUp className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        {!guion.minimized && (
                          <CardContent>
                            <Textarea
                              value={guion.content}
                              onChange={(e) => handleEditGuion(guion.id, e.target.value)}
                              className="min-h-48 w-full whitespace-pre-wrap text-sm resize-y"
                              placeholder="Contenido del guión..."
                            />
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Panel de Guiones Aprobados */}
            {guionesAprobados.length > 0 && (
              <Card className="mt-8 bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    Guiones Aprobados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guionesAprobados.map((script) => (
                      <div key={script.id} className="border border-border rounded-lg bg-background/30">
                        <Collapsible 
                          open={script.expanded} 
                          onOpenChange={() => handleToggleApprovedScript(script.id)}
                        >
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  {script.expanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                              <div>
                                <h4 className="font-medium text-sm">{script.title}</h4>
                                <p className="text-xs text-muted-foreground truncate max-w-md">
                                  {script.content.substring(0, 100)}...
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleGoToAudio(script)}
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              Ir a Audio
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                          <CollapsibleContent>
                            <div className="px-4 pb-4">
                              <Separator className="mb-4" />
                              <div className="bg-muted/50 p-4 rounded-md">
                                <p className="text-sm whitespace-pre-wrap">{script.content}</p>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información del Agente */}
            <Card className="mt-8 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">🤖 Agente LLM Personalizado</h3>
                  <p className="text-sm text-muted-foreground">
                    Esta página conectará con tu agente LLM entrenado específicamente para generar guiones.
                    El agente utilizará tu entrenamiento personalizado para crear contenido único y adaptado a tus necesidades.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground">
                ✨ Creatividad sin límites con IA ✨
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Dialog for script popup */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {selectedGuionForDialog && 
                `Guión ${guionesGenerados.findIndex(g => g.id === selectedGuionForDialog.id) + 1}`
              }
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {selectedGuionForDialog && (
              <Textarea
                value={selectedGuionForDialog.content}
                onChange={(e) => {
                  const updatedContent = e.target.value;
                  setSelectedGuionForDialog(prev => 
                    prev ? { ...prev, content: updatedContent } : null
                  );
                  handleEditGuion(selectedGuionForDialog.id, updatedContent);
                }}
                className="min-h-[400px] w-full whitespace-pre-wrap text-sm resize-none border-0 focus-visible:ring-0"
                placeholder="Contenido del guión..."
              />
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>;
};
export default NuevoGuion;