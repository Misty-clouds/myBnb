"use client";

import React, { useState, FormEvent, ChangeEvent, DragEvent, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Calendar, Home, User, Upload, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormMessage } from "./form-message";
import { MessageType } from './types';
import { insertBookingDetails } from '@/helper-functions';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BookingDetails } from '@/types';
import { useUser } from '@/helper-functions';
import { uploadFile } from './uploadFile';

const BOOKING_METHODS = ["Online", "In-Person", "Phone"];

export default function BookingForm({company_uid}:{company_uid:string}) {
  const [formMessage, setFormMessage] = useState<MessageType>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedReceiptFile, setSelectedReceiptFile] = useState<File | null>(null);
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [bookingDetails, setBookingDetails] = useState<Partial<BookingDetails>>({
    propertyId: null, 
    numberOfDays: 0,
    totalAmount: 0,
    dailyAmount: 0,
    bookingMethod: '',
  });

  const user=useUser()  
  console.log(user)
  // Calculate number of days and total amount whenever dates or daily amount changes
  useEffect(() => {
    if (dateRange.from && dateRange.to && bookingDetails.dailyAmount) {
      const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24));
      
      setBookingDetails(prev => ({
        ...prev,
        numberOfDays: days,
        totalAmount: days * (prev.dailyAmount || 0)
      }));
    }
  }, [dateRange.from, dateRange.to, bookingDetails.dailyAmount]);

  const supabase= createClient();

  const handleReceiptFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setFormMessage("Receipt file size must be less than 10MB");
        return;
      }
      setSelectedReceiptFile(file);
      setFormMessage(null);
      setMessage(null);
    }
  };

  const handleReceiptDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormMessage("Receipt file size must be less than 10MB");
        return;
      }
      setSelectedReceiptFile(file);
      setFormMessage(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: name === 'dailyAmount' || name === 'numberOfDays' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      // Get current user
      const email=user?.email;
      let receiptImageUrl = '';

      // Upload receipt file if selected
      if (selectedReceiptFile) {
        receiptImageUrl = await uploadFile(selectedReceiptFile, user.id);
        if (!receiptImageUrl) {
          throw new Error("Failed to upload receipt file.");
        }
      }
      

      // Prepare booking details
      const finalBookingDetails: Partial<BookingDetails> = {
        ...bookingDetails,
        propertyId:bookingDetails.propertyId  ||null,
        entryDate: dateRange.from?.toISOString(),
        exitDate: dateRange.to?.toISOString(),
        numberOfDays: dateRange.from && dateRange.to ? 
          Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24)) : 
          undefined,
        totalAmount: bookingDetails.totalAmount,
        created_by: String(email),
        receiptImage: receiptImageUrl ,
        company_uid: company_uid,  
      };

      // Insert booking details
      await insertBookingDetails(finalBookingDetails);

      // Reset form
      setFormMessage({
        type: 'success',
        message: "Booking saved successfully!"
      });
      event.currentTarget.reset();
      setDateRange({});
      setSelectedReceiptFile(null);
      setBookingDetails({
        propertyId: null,
        numberOfDays: 0,
        totalAmount: 0,
        dailyAmount: 0,
        bookingMethod: '',
      });

    } catch (error) {
      setFormMessage({
        type: 'error',
        message: "Failed to save booking. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-2 sm:py-2">
      <div className="w-full ">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Create a Booking</h2>
          <p className="text-muted-foreground">
            Please provide your booking details
          </p>
        </div>

        <Card className="bg-muted/60 dark:bg-card w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Booking Information</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Range Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Booking Dates
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className=""
                      classNames={{}}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Customer Name Input */}
              <div className="space-y-2">
                <label htmlFor="customerName" className="text-sm font-medium">
                  Customer Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="customerName"
                    name="customerName"
                    placeholder="John Doe"
                    required
                    className="pl-9"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Property Name Input */}
              <div className="space-y-2">
                <label htmlFor="propertyName" className="text-sm font-medium">
                  Property Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-muted-foreground">
                    <Home className="h-4 w-4" />
                  </div>
                  <Input
                    id="propertyName"
                    name="propertyName"
                    placeholder="Beach House"
                    required
                    className="pl-9"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Booking Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Booking Method
                </label>
                <Select
                  value={bookingDetails.bookingMethod}
                  onValueChange={(value) => handleSelectChange("bookingMethod", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select booking method" />
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

              {/* Daily Amount Input */}
              <div className="space-y-2">
                <label htmlFor="dailyAmount" className="text-sm font-medium">
                  Daily Rate
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-muted-foreground">
                    $
                  </div>
                  <Input
                    id="dailyAmount"
                    name="dailyAmount"
                    type="number"
                    placeholder="100"
                    required
                    className="pl-9"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-muted/80 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-sm">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Number of Days:</span>
                    <span className="ml-2 font-medium">{bookingDetails.numberOfDays || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Daily Rate:</span>
                    <span className="ml-2 font-medium">${bookingDetails.dailyAmount || 0}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="ml-2 font-medium">${bookingDetails.totalAmount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <label htmlFor="receipt" className="text-sm font-medium">
                  Receipt (Optional)
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={handleReceiptDrop}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
                >
                  <div className="space-y-2 text-center">
                    <div className="mx-auto h-12 w-12 text-muted-foreground">
                      <Receipt className="mx-auto h-12 w-12" />
                    </div>
                    <div className="flex text-sm justify-center">
                      <label
                        htmlFor="receipt-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                      >
                        <span>Upload a receipt</span>
                        <input
                          id="receipt-upload"
                          name="receipt"
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleReceiptFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1 text-muted-foreground">or drag and drop</p>
                    </div>
                    {selectedReceiptFile ? (
                      <p className="text-xs text-primary">
                        Selected: {selectedReceiptFile.name}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving Booking..." : "Create Booking"}
              </Button>

              {formMessage && <FormMessage message={formMessage} />}
              {message && (
          <div className={`p-3 mb-4 rounded ${message.type === 'error' ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
            {message.text}
          </div>
        )}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}