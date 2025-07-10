import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Suscriptores actuales",
    value: "1,247",
    icon: "👥",
  },
  {
    title: "Views último mes",
    value: "45,678",
    icon: "👁️",
  },
  {
    title: "Engagement rate",
    value: "8.2%",
    icon: "💫",
  },
  {
    title: "Videos analizados",
    value: "23",
    icon: "🎬",
  },
];

export const StatsWidget = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <span className="text-2xl">{stat.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};