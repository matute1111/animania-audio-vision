import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { PenTool, Sparkles } from "lucide-react";
import { toast } from "sonner";
import spaceBanner from "@/assets/space-banner.jpg";
import { TrendyWords } from "@/components/TrendyWords";
const NuevoGuion = () => {
  const [tema, setTema] = useState("");
  const [contexto, setContexto] = useState("");
  const [cantidadGuiones, setCantidadGuiones] = useState("1");
  const [tipoHistoria, setTipoHistoria] = useState("");
  const [guionesGenerados, setGuionesGenerados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const handleGenerarGuiones = async () => {
    if (!tema.trim()) {
      toast.error("Por favor ingresa un tema para el guión");
      return;
    }
    setLoading(true);
    try {
      // Aquí conectarás con tu LLM entrenada
      // Por ahora simulo la respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      const nuevosGuiones = Array.from({
        length: parseInt(cantidadGuiones)
      }, (_, i) => `Guión ${i + 1} sobre "${tema}":\n\nEste es un guión de ejemplo generado por tu agente LLM entrenado. El tema principal es "${tema}" con contexto adicional: ${contexto || "Sin contexto específico"}.\n\nTipo de historia: ${tipoHistoria || "General"}\n\n[Aquí iría el contenido completo del guión generado por tu LLM...]`);
      setGuionesGenerados(nuevosGuiones);
      toast.success(`${cantidadGuiones} guión(es) generado(s) exitosamente`);
    } catch (error) {
      console.error("Error generando guiones:", error);
      toast.error("Error al generar los guiones");
    } finally {
      setLoading(false);
    }
  };
  const handleLimpiar = () => {
    setTema("");
    setContexto("");
    setCantidadGuiones("1");
    setTipoHistoria("");
    setGuionesGenerados([]);
  };

  const handleWordClick = (word: string) => {
    const currentTema = tema.trim();
    if (currentTema && !currentTema.toLowerCase().includes(word.toLowerCase())) {
      setTema(currentTema + ", " + word);
    } else if (!currentTema) {
      setTema(word);
    }
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
          <header className="h-12 flex items-center border-b border-border/50 bg-card/90 backdrop-blur-sm">
            <SidebarTrigger className="ml-4" />
          </header>
          
          <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Sección de Palabras Trendy */}
            <TrendyWords onWordClick={handleWordClick} />

            {/* Panel de Configuración - Horizontal */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Configuración del Guión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <Label htmlFor="tema">Tema Principal *</Label>
                    <Input 
                      id="tema" 
                      value={tema} 
                      onChange={e => setTema(e.target.value)} 
                      placeholder="Ej: Aventura espacial..." 
                      className="mt-1" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipo">Tipo de Historia</Label>
                    <Select value={tipoHistoria} onValueChange={setTipoHistoria}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aventura">Aventura</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="comedia">Comedia</SelectItem>
                        <SelectItem value="terror">Terror</SelectItem>
                        <SelectItem value="ciencia-ficcion">Ciencia Ficción</SelectItem>
                        <SelectItem value="romance">Romance</SelectItem>
                        <SelectItem value="misterio">Misterio</SelectItem>
                        <SelectItem value="fantasia">Fantasía</SelectItem>
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
                        disabled={loading || !tema.trim()} 
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
                  <div className="space-y-4 max-h-96 overflow-y-auto">
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