import React from "react";
import { Button } from "@/components/ui/button";

interface WorkingTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface WorkingTabsListProps {
  children: React.ReactNode;
}

interface WorkingTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface WorkingTabsContentProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
}

export function WorkingTabs({ value, onValueChange, children }: WorkingTabsProps) {
  return (
    <div className="space-y-8">
      {children}
    </div>
  );
}

export function WorkingTabsList({ children }: WorkingTabsListProps) {
  return (
    <div className="grid w-full grid-cols-5 bg-muted p-1 rounded-md">
      {children}
    </div>
  );
}

export function WorkingTabsTrigger({ value, children, activeTab, onTabChange }: WorkingTabsTriggerProps) {
  return (
    <Button
      variant={activeTab === value ? "default" : "ghost"}
      className="w-full"
      onClick={() => onTabChange(value)}
    >
      {children}
    </Button>
  );
}

export function WorkingTabsContent({ value, activeTab, children }: WorkingTabsContentProps) {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
}