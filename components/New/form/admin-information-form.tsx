"use client";

import React, { useState, FormEvent, ChangeEvent, DragEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Building2, User, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "./form-message";
import { MessageType } from './types';

interface FormData {
  name: string;
  companyName: string;
  logo?: File;
}

export default function UserDetailsForm() {
  const [formMessage, setFormMessage] = useState<MessageType>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const supabase = createClient();
  

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setFormMessage("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setFormMessage(null);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormMessage("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setFormMessage(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const formData = new FormData(event.currentTarget);
      const {data:{user},error}=await supabase.auth.getUser();
      if (error|| !user){
        throw error;
      }
      const id =user.id;
      formData.append("id",id)
      
      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      

      const response = await fetch('/api/user-details', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setFormMessage({
          type: 'success',
          message: "Details saved successfully!"
        });
        (event.target as HTMLFormElement).reset();
        setSelectedFile(null);
      } else {
        throw new Error('Failed to save details');
      }
    } catch (error) {
      setFormMessage({
        type: 'error',
        message: "Failed to save details. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-24 sm:py-32">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground">
            Please provide your business details to continue
          </p>
        </div>

        <Card className="bg-muted/60 dark:bg-card">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Business Information</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Company Name Input */}
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Acme Inc."
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label htmlFor="logo" className="text-sm font-medium">
                  Company Logo
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
                >
                  <div className="space-y-2 text-center">
                    <div className="mx-auto h-12 w-12 text-muted-foreground">
                      <Upload className="mx-auto h-12 w-12" />
                    </div>
                    <div className="flex text-sm justify-center">
                      <label
                        htmlFor="logo-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                      >
                        <span>Upload a file</span>
                        <input
                          id="logo-upload"
                          name="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1 text-muted-foreground">or drag and drop</p>
                    </div>
                    {selectedFile ? (
                      <p className="text-xs text-primary">
                        Selected: {selectedFile.name}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
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
                {isSubmitting ? "Saving..." : "Save Details"}
              </Button>

              {formMessage && <FormMessage message={formMessage} />}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}