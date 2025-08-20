import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Settings, Plus, MoreHorizontal } from "lucide-react";

interface WorkflowData {
  id: number;
  title: string;
  company: string;
  progress: number;
  stage: string;
  applications: number;
  challenges: number;
  interviews: number;
  offers: number;
  status: string;
}

interface WorkflowManagementProps {
  workflows: WorkflowData[];
}

export default function WorkflowManagement({ workflows }: WorkflowManagementProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "paused":
        return "bg-gray-100 text-gray-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-primary";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Workflows</CardTitle>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{workflow.title}</h3>
                    <p className="text-sm text-gray-600">{workflow.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(workflow.status)}
                  >
                    {workflow.status === "active" ? "Active" : 
                     workflow.status === "in_progress" ? "In Progress" :
                     workflow.status === "paused" ? "Paused" : "Completed"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Workflow Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{workflow.stage}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 relative">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(workflow.progress)}`}
                    style={{ width: `${workflow.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Applications</p>
                  <p className="font-semibold text-gray-900">{workflow.applications}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Challenges</p>
                  <p className="font-semibold text-gray-900">{workflow.challenges}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Interviews</p>
                  <p className="font-semibold text-gray-900">{workflow.interviews}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Offers</p>
                  <p className="font-semibold text-gray-900">{workflow.offers}</p>
                </div>
              </div>
            </div>
          ))}
          
          {workflows.length === 0 && (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Workflows</h3>
              <p className="text-gray-600 mb-4">
                Create your first workflow to start managing the hiring process.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
