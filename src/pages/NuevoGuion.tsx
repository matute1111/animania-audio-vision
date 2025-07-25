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
import { PenTool, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import spaceBanner from "@/assets/space-banner.jpg";
import { TrendyWords } from "@/components/TrendyWords";
import { useCharacters } from "@/hooks/useCharacters";
const NuevoGuion = () => {
  const [tema, setTema] = useState("");
  const [contexto, setContexto] = useState("");
  const [cantidadGuiones, setCantidadGuiones] = useState("1");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [selectedTrendyWords, setSelectedTrendyWords] = useState<string[]>([]);
  const [guionesGenerados, setGuionesGenerados] = useState<string[]>([]);
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
            tema_principal: tema,
            contexto_adicional: contexto || null,
            personaje_seleccionado: selectedCharacter || null,
            cantidad_solicitada: parseInt(cantidadGuiones)
          },
          configuracion: {
            idioma: "es",
            formato_salida: "texto_plano",
            version_api: "1.0"
          }
        }),
      });

      // Con no-cors no podemos leer la respuesta, así que simulamos el resultado
      toast.success("Generando guiones");
      
      // Simulamos guiones mientras se configura el webhook
      const nuevosGuiones = Array.from({
        length: parseInt(cantidadGuiones)
      }, (_, i) => `Guión ${i + 1} sobre "${tema}"\n\nSolicitud enviada al webhook de n8n.\nTema: ${tema}\nContexto: ${contexto || "Sin contexto específico"}\nPersonaje: ${selectedCharacter || "Sin personaje seleccionado"}\n\n[El contenido real vendrá del webhook cuando esté configurado correctamente]`);
      
      setGuionesGenerados(nuevosGuiones);
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
    setCantidadGuiones("1");
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

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

                  <div>
                    <Label htmlFor="cantidad">Cantidad de Guiones</Label>
                    <Select value={cantidadGuiones} onValueChange={setCantidadGuiones}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guión</SelectItem>
                        <SelectItem value="2">2 Guiones</SelectItem>
                        <SelectItem value="3">3 Guiones</SelectItem>
                        <SelectItem value="5">5 Guiones</SelectItem>
                        <SelectItem value="10">10 Guiones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleGenerarGuiones} 
                        disabled={loading || !selectedCharacter} 
                        className="flex-1"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {guionesGenerados.map((guion, index) => (
                      <Card key={index} className="bg-background/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Guión {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {guion}
                          </pre>
                        </CardContent>
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