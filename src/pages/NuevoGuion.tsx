import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { PenTool, Sparkles, X, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import spaceBanner from "@/assets/space-banner.jpg";
import { TrendyWords } from "@/components/TrendyWords";
import { useCharacters } from "@/hooks/useCharacters";
const NuevoGuion = () => {
  const [tema, setTema] = useState("");
  const [contexto, setContexto] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [selectedTrendyWords, setSelectedTrendyWords] = useState<string[]>([]);
  const [guionesGenerados, setGuionesGenerados] = useState<{id: string, content: string, minimized: boolean}[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { characters, loading: charactersLoading } = useCharacters();
  const handleGenerarGuiones = async () => {
    if (!selectedCharacter) {
      toast.error("Por favor selecciona un personaje");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("https://matiasalbaca.app.n8n.cloud/webhook/Guiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
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

      // Handle webhook response
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          const nuevosGuiones = data.map((item, index) => ({
            id: `guion-${Date.now()}-${index}`,
            content: item.output || "",
            minimized: false
          }));
          setGuionesGenerados(nuevosGuiones);
          toast.success("Guiones generados exitosamente");
        }
      } else {
        toast.success("Generando guiones");
        // Simulamos guiones mientras se configura el webhook
        const nuevosGuiones = [{
          id: `guion-${Date.now()}`,
          content: `Guión sobre "${tema}"\n\nSolicitud enviada al webhook de n8n.\nTema: ${tema}\nContexto: ${contexto || "Sin contexto específico"}\nPersonaje: ${selectedCharacter || "Sin personaje seleccionado"}\n\n[El contenido real vendrá del webhook cuando esté configurado correctamente]`,
          minimized: false
        }];
        setGuionesGenerados(nuevosGuiones);
      }
    } catch (error) {
      console.error("Error generando guiones:", error);
      toast.error("Error al conectar con el webhook. Verifica la configuración en n8n.");
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
            {/* Sección de Palabras Trendy */}
            <TrendyWords onWordClick={handleWordClick} selectedWords={selectedTrendyWords} />

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
                        </CardHeader>
                        {!guion.minimized && (
                          <CardContent>
                            <Textarea
                              value={guion.content}
                              onChange={(e) => handleEditGuion(guion.id, e.target.value)}
                              className="min-h-32 w-full whitespace-pre-wrap text-sm resize-none"
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
    </SidebarProvider>;
};
export default NuevoGuion;