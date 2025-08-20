import WorkingForm from "@/components/working-form";

interface EmployerApplicationProps {
  onComplete?: () => void;
}

export default function EmployerApplication({ onComplete }: EmployerApplicationProps) {
  return <WorkingForm />;
}