"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Briefcase, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

interface Deal {
  id: string;
  company: string;
  stage: "sourcing" | "due-diligence" | "negotiation" | "closing";
  valuation: string;
  lead: string;
  date: string;
}

const mockDeals: Deal[] = [
  {
    id: "1",
    company: "TechVenture Inc.",
    stage: "due-diligence",
    valuation: "$25M",
    lead: "John Doe",
    date: "2026-01-10",
  },
  {
    id: "2",
    company: "HealthCare Solutions",
    stage: "negotiation",
    valuation: "$50M",
    lead: "Jane Smith",
    date: "2026-01-08",
  },
  {
    id: "3",
    company: "FinTech Innovations",
    stage: "sourcing",
    valuation: "$15M",
    lead: "Mike Johnson",
    date: "2026-01-15",
  },
];

const stageColors = {
  sourcing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  "due-diligence": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  closing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
};

const stageLabels = {
  sourcing: "Sourcing",
  "due-diligence": "Due Diligence",
  negotiation: "Negotiation",
  closing: "Closing",
};

export default function DealPipeline() {
  const [deals] = useState<Deal[]>(mockDeals);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const filteredDeals = selectedStage
    ? deals.filter((deal) => deal.stage === selectedStage)
    : deals;

  const dealsByStage = {
    sourcing: deals.filter((d) => d.stage === "sourcing").length,
    "due-diligence": deals.filter((d) => d.stage === "due-diligence").length,
    negotiation: deals.filter((d) => d.stage === "negotiation").length,
    closing: deals.filter((d) => d.stage === "closing").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          Deal Pipeline
        </h2>
        <Button>
          <Briefcase className="h-4 w-4 mr-2" />
          New Deal
        </Button>
      </div>

      {/* Stage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(Object.keys(dealsByStage) as Array<keyof typeof dealsByStage>).map((stage) => (
          <Card
            key={stage}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedStage === stage ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedStage(selectedStage === stage ? null : stage)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {stageLabels[stage]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dealsByStage[stage]}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deal Cards */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{deal.company}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{deal.valuation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{deal.lead}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{deal.date}</span>
                      </div>
                    </div>

                    <Badge className={stageColors[deal.stage]}>
                      {stageLabels[deal.stage]}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
