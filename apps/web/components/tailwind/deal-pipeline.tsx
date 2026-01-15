"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
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
  Plus,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type DealStage = "sourcing" | "due-diligence" | "negotiation" | "closing" | "closed-won" | "closed-lost";

interface Deal {
  _id: Id<"colab_deals">;
  company: string;
  stage: DealStage;
  valuation?: string;
  lead?: string;
  createdAt: number;
  updatedAt: number;
}

// Mock deals as fallback when Convex is not available
const mockDeals: Deal[] = [
  {
    _id: "mock-1" as Id<"colab_deals">,
    company: "TechVenture Inc.",
    stage: "due-diligence",
    valuation: "$25M",
    lead: "John Doe",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: "mock-2" as Id<"colab_deals">,
    company: "HealthCare Solutions",
    stage: "negotiation",
    valuation: "$50M",
    lead: "Jane Smith",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: "mock-3" as Id<"colab_deals">,
    company: "FinTech Innovations",
    stage: "sourcing",
    valuation: "$15M",
    lead: "Mike Johnson",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const stageColors: Record<DealStage, string> = {
  sourcing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  "due-diligence": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  closing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  "closed-won": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  "closed-lost": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

const stageLabels: Record<DealStage, string> = {
  sourcing: "Sourcing",
  "due-diligence": "Due Diligence",
  negotiation: "Negotiation",
  closing: "Closing",
  "closed-won": "Won",
  "closed-lost": "Lost",
};

const pipelineStages: DealStage[] = ["sourcing", "due-diligence", "negotiation", "closing"];

export default function DealPipeline() {
  const [selectedStage, setSelectedStage] = useState<DealStage | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDealCompany, setNewDealCompany] = useState("");
  const [newDealValuation, setNewDealValuation] = useState("");
  const [newDealLead, setNewDealLead] = useState("");

  // Try to use Convex, fallback to mock data
  const isConvexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;
  
  // Convex queries - will skip if not configured
  const convexDeals = useQuery(
    api.deals.list,
    isConvexConfigured ? {} : "skip"
  );
  
  const createDeal = useMutation(api.deals.create);
  const moveDealStage = useMutation(api.deals.moveStage);

  // Use Convex deals if available, otherwise fallback to mock
  const deals: Deal[] = convexDeals ?? mockDeals;
  const isLoading = isConvexConfigured && convexDeals === undefined;

  const filteredDeals = selectedStage
    ? deals.filter((deal) => deal.stage === selectedStage)
    : deals.filter((deal) => !["closed-won", "closed-lost"].includes(deal.stage));

  const dealsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage] = deals.filter((d) => d.stage === stage).length;
    return acc;
  }, {} as Record<DealStage, number>);

  const handleCreateDeal = async () => {
    if (!newDealCompany.trim()) return;
    
    try {
      await createDeal({
        company: newDealCompany,
        stage: "sourcing",
        valuation: newDealValuation || undefined,
        lead: newDealLead || undefined,
      });
      setNewDealCompany("");
      setNewDealValuation("");
      setNewDealLead("");
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Failed to create deal:", error);
    }
  };

  const handleMoveToNextStage = async (deal: Deal) => {
    const currentIndex = pipelineStages.indexOf(deal.stage);
    if (currentIndex === -1 || currentIndex >= pipelineStages.length - 1) return;
    
    const nextStage = pipelineStages[currentIndex + 1];
    try {
      await moveDealStage({
        id: deal._id,
        stage: nextStage,
      });
    } catch (error) {
      console.error("Failed to move deal:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          Deal Pipeline
          {!isConvexConfigured && (
            <Badge variant="outline" className="ml-2 text-xs">Demo Mode</Badge>
          )}
        </h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={!isConvexConfigured}>
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Company Name *</label>
                <input
                  type="text"
                  value={newDealCompany}
                  onChange={(e) => setNewDealCompany(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Valuation</label>
                <input
                  type="text"
                  value={newDealValuation}
                  onChange={(e) => setNewDealValuation(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="e.g., $10M"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deal Lead</label>
                <input
                  type="text"
                  value={newDealLead}
                  onChange={(e) => setNewDealLead(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Lead person name"
                />
              </div>
              <Button onClick={handleCreateDeal} className="w-full">
                Create Deal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pipelineStages.map((stage) => (
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
              <div className="text-2xl font-bold">{dealsByStage[stage] || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deal Cards */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {filteredDeals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No deals found. {isConvexConfigured ? "Create a new deal to get started." : "Configure Convex to enable persistence."}
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <Card key={deal._id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{deal.company}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {deal.valuation && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{deal.valuation}</span>
                          </div>
                        )}
                        {deal.lead && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{deal.lead}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(deal.createdAt)}</span>
                        </div>
                      </div>

                      <Badge className={stageColors[deal.stage]}>
                        {stageLabels[deal.stage]}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      {isConvexConfigured && pipelineStages.indexOf(deal.stage) < pipelineStages.length - 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveToNextStage(deal)}
                          title="Move to next stage"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
