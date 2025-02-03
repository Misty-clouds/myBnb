import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ExpensesItemProps {
  id: number;
  field: string;
  description: string;
  date: string;
  amount: number;
  receiptImage?: string;
  onUpdate?: (id: number, data: any) => void;
  onDelete?: (id: number) => void;
}


export function ExpensesItem(props: ExpensesItemProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    field: props.field,
    description: props.description,
    date: props.date,
    amount: props.amount,
  });

  const t = useTranslations('ExpensesItem');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (closeDialog: () => void) => {
    if (props.onUpdate) {
      props.onUpdate(props.id, formData);
      closeDialog();
    }
  };

  const handleDelete = async () => {
    if (props.onDelete) {
      props.onDelete(props.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="bg-secondary-bg p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="space-y-1 md:col-span-2">
          <div className="font-medium text-primary-text">{props.field}</div>
          <div className="text-sm text-muted-gray">{props.description}</div>
        </div>
        <div className="text-sm text-muted-gray md:text-center">{props.date}</div>
        <div className="text-sm font-semibold text-primary-text md:text-center">
          {t('currency')}{props.amount}
        </div>
        <div className="md:text-center">
          {props.receiptImage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowReceipt(!showReceipt)}
              className="text-muted-gray hover:text-primary-text transition-colors duration-200"
            >
              {showReceipt ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        <div className="flex justify-end items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-gray hover:text-primary-text transition-colors duration-200"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('editExpense')}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field" className="text-right">
                    {t('field')}
                  </Label>
                  <Input
                    id="field"
                    name="field"
                    value={formData.field}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    {t('description')}
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    {t('date')}
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    {t('amount')}
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdate(
                      () =>
                        (
                          document.querySelector("dialog")! as HTMLDialogElement
                        ).close()
                    );
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  {t('update')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="text-muted-gray hover:text-primary-text transition-colors duration-200"
          >
            <Trash2 className="text-red-500 h-4 w-4" />
          </Button>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('deleteWarning')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {t('delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {showReceipt && props.receiptImage && (
        <div className="mt-4 flex justify-center transition-all duration-300 animate-fadeIn">
          <Image
            src={props.receiptImage || "/placeholder.svg"}
            alt={t('receipt')}
            width={200}
            height={200}
            className="rounded-md object-cover shadow-lg"
          />
        </div>
      )}
    </div>
  );
}