import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
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
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface BookingItemProps {
  id: number;
  customerName: string;
  entryDate: string;
  exitDate: string;
  dailyAmount: number;
  numberOfDays: number;
  totalAmount: number;
  bookingMethod: string;
  receiptImage?: string;
  actions?: boolean;
  onUpdate?: (id: number, data: any) => void;
  onDelete?: (id: number) => void;
}

export function BookingItem(props: BookingItemProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    customerName: props.customerName,
    entryDate: props.entryDate,
    exitDate: props.exitDate,
    dailyAmount: props.dailyAmount,
    bookingMethod: props.bookingMethod,
  });

  const t = useTranslations('BookingItem');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-2 items-center">
        <div className="space-y-1 md:col-span-2">
          <div className="font-medium text-primary-text">{props.customerName}</div>
          <div className="text-sm text-muted-gray">{props.bookingMethod}</div>
        </div>
        <div className="text-sm text-muted-gray">
          <span className="md:hidden">{t('entry')}: </span>
          {props.entryDate}
        </div>
        <div className="text-sm text-muted-gray">
          <span className="md:hidden">{t('exit')}: </span>
          {props.exitDate}
        </div>
        <div className="text-sm text-muted-gray">
          <span className="md:hidden">{t('daily')}: </span>{t('currency')}{props.dailyAmount}
        </div>
        <div className="text-sm text-muted-gray">
          <span className="md:hidden">{t('days')}: </span>
          {props.numberOfDays}
        </div>
        <div className="text-sm font-semibold text-primary-text">
          <span className="md:hidden">{t('total')}: </span>{t('currency')}{props.totalAmount}
        </div>

        <div className="flex justify-between md:justify-end items-center">
          {props.receiptImage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowReceipt(!showReceipt)}
              className="text-muted-gray hover:text-primary-text transition-colors duration-200"
            >
              {showReceipt ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          )}
          {props.actions && (
            <div className="flex flex-col pr-2 gap-2">
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
                    <DialogTitle>{t('editBooking')}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="customerName" className="text-right">
                        {t('customerName')}
                      </Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="entryDate" className="text-right">
                        {t('entryDate')}
                      </Label>
                      <Input
                        id="entryDate"
                        name="entryDate"
                        type="date"
                        value={formData.entryDate}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="exitDate" className="text-right">
                        {t('exitDate')}
                      </Label>
                      <Input
                        id="exitDate"
                        name="exitDate"
                        type="date"
                        value={formData.exitDate}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dailyAmount" className="text-right">
                        {t('dailyAmount')}
                      </Label>
                      <Input
                        id="dailyAmount"
                        name="dailyAmount"
                        type="number"
                        value={formData.dailyAmount}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bookingMethod" className="text-right">
                        {t('bookingMethod')}
                      </Label>
                      <Input
                        id="bookingMethod"
                        name="bookingMethod"
                        value={formData.bookingMethod}
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
                        handleUpdate(() => (document.querySelector('dialog')! as HTMLDialogElement).close());
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
          )}
        </div>
      </div>
    </div>
  )
}