import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const stats = [{
  title: "Suscriptores actuales",
  value: "1,247",
  icon: "👥"
}, {
  title: "Views último mes",
  value: "45,678",
  icon: "👁️"
}, {
  title: "Engagement rate",
  value: "8.2%",
  icon: "💫"
}, {
  title: "Videos analizados",
  value: "23",
  icon: "🎬"
}];
export const StatsWidget = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-2">{stat.title}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};