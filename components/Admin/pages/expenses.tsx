import { ExpensesTable } from "../expenses-table";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import MonthCardSpline from "@/components/Admin/forms/month-card";
import { YearSelector, useYearStore } from "../forms/year-selector";
import ExpenseForm from "../forms/expense-form";

interface Expense {
  id: number;
  field: string;
  description: string;
  date: string;
  amount: number;
  receiptImage: string;
}

// Interface for API response
interface APIExpense {
  id: number;
  field: string;
  description: string;
  date: string;
  amount: number;
  receiptImage: string;
}

export default function Expenses() {
  const t = useTranslations('Expenses');
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentMonthIndex = new Date().getMonth();
  const [activeMonth, setActiveMonth] = useState<number>(currentMonthIndex);
  const selectedYear = useYearStore((state) => state.selectedYear);

  // Function to get the first day of the month
  const getFirstDayOfMonth = (date: Date): string => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  };

  // Function to get the last day of the month
  const getLastDayOfMonth = (date: Date): string => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
  };


  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        const targetDate = new Date(selectedYear, activeMonth);
        const firstDayOfMonth = getFirstDayOfMonth(targetDate);
        const lastDayOfMonth = getLastDayOfMonth(targetDate);

        console.log(`Fetching expenses from ${firstDayOfMonth} to ${lastDayOfMonth}`);

        const BASE_URL = 'http://localhost:3000';
        const apiUrl = `${BASE_URL}/api/expenses?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();
        setExpenses(apiData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error'));
        setExpenses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [activeMonth, selectedYear]); // Re-fetch when month or year changes

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-600">{t('loading')}</p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-8">
      <div className="justify-between flex">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-text">{t('title')}</h1>
        </div>
        <button 
          onClick={() => setIsExpenseFormOpen(true)}
          className="bg-accent text-white font-semibold px-3 rounded-xl transition-all duration-300 hover:bg-accent-hover hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          {t('addExpense')}
        </button>
      </div>

      

      <ExpenseForm
        isOpen={isExpenseFormOpen}
        onClose={() => setIsExpenseFormOpen(false)}
        onSubmit={async (expenseData) => {
          try {
            const response = await fetch('/api/expenses', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(expenseData),
            });
            
            if (!response.ok) {
              throw new Error('Failed to create expense');
            }
            
            // Refresh the expenses list
          } catch (error) {
            console.error('Error creating expense:', error);
          }
        }}
      />

      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-gray mb-4">
          {t('trackExpenses')}
        </h2>
        <div className="flex justify-end">
          <YearSelector />
        </div>

        <div className="overflow-x-auto scrollbar-hide flex gap-4 py-2">
          <MonthCardSpline
            activeMonth={activeMonth}
            onMonthChange={setActiveMonth}
            year={selectedYear}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 text-primary-text font-medium border-b-2 border-primary transition-colors duration-200">
          {t('records')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('noExpenses')}
          </div>
        ) : (
          <ExpensesTable expenses={expenses} />
        )}
      </div>
    </main>
  );
}
