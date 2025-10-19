import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, GanttChart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sectorPredictions = [
  {
    name: "Technology",
    outlook: "Bullish",
    confidence: 85,
    catalysts: ["AI advancements", "Strong earnings"],
  },
  {
    name: "Healthcare",
    outlook: "Bullish",
    confidence: 78,
    catalysts: ["New drug approvals", "Aging population"],
  },
  {
    name: "Consumer Discretionary",
    outlook: "Neutral",
    confidence: 62,
    catalysts: ["Mixed consumer spending data", "Inflation concerns"],
  },
  {
    name: "Energy",
    outlook: "Bearish",
    confidence: 70,
    catalysts: ["Geopolitical tensions easing", "Increased supply"],
  },
  {
    name: "Financials",
    outlook: "Neutral",
    confidence: 65,
    catalysts: ["Stable interest rates", "Regulatory uncertainty"],
  },
   {
    name: "Real Estate",
    outlook: "Bearish",
    confidence: 75,
    catalysts: ["High interest rates", "Cooling housing market"],
  },
];

const PredictionIcon = ({ outlook }: { outlook: string }) => {
  switch (outlook) {
    case "Bullish":
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    case "Bearish":
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    default:
      return <Minus className="h-5 w-5 text-gray-500" />;
  }
};


export default function PredictionsPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <GanttChart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Market Predictions</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Sector Forecast (Next 3-6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sector</TableHead>
                  <TableHead>Outlook</TableHead>
                  <TableHead className="hidden md:table-cell">Confidence</TableHead>
                  <TableHead className="hidden sm:table-cell">Key Catalysts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectorPredictions.map((pred) => (
                  <TableRow key={pred.name}>
                    <TableCell className="font-medium">{pred.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <PredictionIcon outlook={pred.outlook} />
                        <Badge
                          variant={
                            pred.outlook === "Bullish"
                              ? "default"
                              : pred.outlook === "Bearish"
                              ? "destructive"
                              : "secondary"
                          }
                          className={pred.outlook === "Bullish" ? "bg-green-600/20 text-green-300 border-green-500/30" : ""}
                        >
                          {pred.outlook}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                       <div className="flex items-center gap-2">
                          <span>{pred.confidence}%</span>
                          <div className="w-20 h-2 bg-secondary rounded-full">
                              <div className="h-2 bg-primary rounded-full" style={{width: `${pred.confidence}%`}}></div>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{pred.catalysts.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
