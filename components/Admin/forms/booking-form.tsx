import React, { useEffect, useState } from 'react';
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from 'next-intl';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
}

interface BookingFormData {
  customerName: string;
  entryDate: string;
  exitDate: string;
  dailyAmount: number;
  numberOfDays: number;
  totalAmount: number;
  bookingMethod: string;
  propertyName: string;
  receiptImage: string;
}

const BOOKING_METHODS = ["Online", "In-Person", "Phone"];
const PROPERTIES = ["Sunset Villa", "Ocean View Apartment", "Mountain Lodge"];
const BASE_DAILY_RATES = {
  "Sunset Villa": 200,
  "Ocean View Apartment": 150,
  "Mountain Lodge": 175
};

export default function BookingForm({ isOpen, onClose, onSubmit }: BookingFormProps) {
  const t = useTranslations('BookingForm');
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    entryDate: "",
    exitDate: "",
    dailyAmount: 0,
    numberOfDays: 0,
    totalAmount: 0,
    bookingMethod: "",
    propertyName: "",
    receiptImage: ""
  });

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const days = calculateDays(formData.entryDate, formData.exitDate);
    const dailyAmount = BASE_DAILY_RATES[formData.propertyName as keyof typeof BASE_DAILY_RATES] || 0;
    
    setFormData(prev => ({
      ...prev,
      numberOfDays: days,
      dailyAmount: dailyAmount,
      totalAmount: days * dailyAmount
    }));
  }, [formData.entryDate, formData.exitDate, formData.propertyName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName">{t('customerName')}</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder={t('customerNamePlaceholder')}
                required
              />
            </div>

            {/* Property Selection */}
            <div className="space-y-2">
              <Label>{t('property')}</Label>
              <Select
                value={formData.propertyName}
                onValueChange={(value) => handleSelectChange("propertyName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('propertyPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTIES.map((property) => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entry Date */}
            <div className="space-y-2">
              <Label htmlFor="entryDate">{t('entryDate')}</Label>
              <div className="relative">
                <Input
                  id="entryDate"
                  name="entryDate"
                  type="date"
                  value={formData.entryDate}
                  onChange={handleInputChange}
                  required
                  className="pl-10"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Exit Date */}
            <div className="space-y-2">
              <Label htmlFor="exitDate">{t('exitDate')}</Label>
              <div className="relative">
                <Input
                  id="exitDate"
                  name="exitDate"
                  type="date"
                  value={formData.exitDate}
                  onChange={handleInputChange}
                  required
                  className="pl-10"
                  min={formData.entryDate || new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Booking Method */}
            <div className="space-y-2">
              <Label>{t('bookingMethod')}</Label>
              <Select
                value={formData.bookingMethod}
                onValueChange={(value) => handleSelectChange("bookingMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('bookingMethodPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Receipt Image */}
            <div className="space-y-2">
              <Label htmlFor="receiptImage">{t('receiptImage')}</Label>
              <Input
                id="receiptImage"
                name="receiptImage"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-accent file:text-white
                         hover:file:bg-accent-hover"
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg">{t('bookingSummary')}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t('numberOfDays')}:</span>
                <span className="ml-2 font-medium">{formData.numberOfDays}</span>
              </div>
              <div>
                <span className="text-gray-600">{t('dailyAmount')}:</span>
                <span className="ml-2 font-medium">${formData.dailyAmount}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">{t('totalAmount')}:</span>
                <span className="ml-2 font-medium">${formData.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="bg-accent text-white font-semibold px-4 py-2 rounded-xl
                       transition-all duration-300 hover:bg-accent-hover hover:scale-105
                       active:scale-95 shadow-md hover:shadow-lg"
            >
              {t('createBooking')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}