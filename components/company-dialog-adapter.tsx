import { CompanyDialog } from "./New/form/dialog/company-dialog"

interface CompanyDialogAdapterProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCompanyAdded?: (newCompany: any) => void // With parameter
}

export function CompanyDialogAdapter({ open, onOpenChange, onCompanyAdded }: CompanyDialogAdapterProps) {
  // Create a callback that matches the expected signature
  const handleCompanyAdded = () => {
    if (onCompanyAdded) {
      // Create a default company object or fetch the actual data
      const newCompany = {
        id: Date.now(),
        name: "New Company",
        logo: "",
        plan: "Basic",
      }

      onCompanyAdded(newCompany)
    }
  }

  return <CompanyDialog open={open} onOpenChange={onOpenChange} onCompanyAdded={handleCompanyAdded} />
}

