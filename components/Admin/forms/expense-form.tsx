import React, { useState } from 'react';
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: ExpenseFormData) => void;
}

interface ExpenseFormData {
  field: string;
  description: string;
  date: string;
  amount: number;
  receiptImage: string;
}

const EXPENSE_FIELDS = [
  "Travel",
  "Office Supplies",
  "Equipment",
  "Software",
  "Utilities",
  "Others"
] as const;

export default function ExpenseForm({ isOpen, onClose, onSubmit }: ExpenseFormProps) {
  const t = useTranslations("ExpenseForm");
  const [formData, setFormData] = useState<ExpenseFormData>({
    field: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    receiptImage: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, field: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary-text">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="field">{t("expenseField")}</Label>
              <Select value={formData.field} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectField")} />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_FIELDS.map((field) => (
                    <SelectItem key={field} value={field}>
                      {t(`fields.${field}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">{t("amount")}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder={t("enterAmount")}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{t("date")}</Label>
              <div className="relative">
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptImage">{t("receiptImage")}</Label>
              <Input
                id="receiptImage"
                name="receiptImage"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t("enterDescription")}
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-accent text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:bg-accent-hover hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              {t("submitExpense")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
