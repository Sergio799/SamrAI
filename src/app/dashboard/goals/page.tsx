'use client';

import { useState } from 'react';
import { Target, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GoalDialog, type Goal } from '@/components/dashboard/GoalDialog';

const initialGoals: Goal[] = [
  {
    id: '1',
    name: 'Retirement Fund',
    target: 1000000,
    current: 250000,
    deadline: new Date('2050-12-31'),
  },
  {
    id: '2',
    name: 'Dream Vacation',
    target: 15000,
    current: 8000,
    deadline: new Date('2025-06-30'),
  },
  {
    id: '3',
    name: 'Home Down Payment',
    target: 150000,
    current: 45000,
    deadline: new Date('2028-01-15'),
  },
];


export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveGoal = (goalToSave: Goal) => {
    if (goalToSave.id) {
      setGoals(goals.map((g) => (g.id === goalToSave.id ? goalToSave : g)));
    } else {
      setGoals([
        ...goals,
        { ...goalToSave, id: new Date().toISOString(), current: 0 },
      ]);
    }
  };

  const openDialogForNew = () => {
    setEditingGoal(undefined);
    setIsDialogOpen(true);
  }

  const openDialogForEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Financial Goals</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const formattedDeadline = goal.deadline.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          });
          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle>{goal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-2xl font-bold text-white">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(goal.current)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      of{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(goal.target)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Deadline: {formattedDeadline}
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => openDialogForEdit(goal)}
                >
                  Adjust Plan
                </Button>
              </CardContent>
            </Card>
          );
        })}
        <Card
          onClick={openDialogForNew}
          className="border-dashed border-2 hover:border-primary hover:bg-accent/20 transition-colors flex items-center justify-center min-h-[260px] cursor-pointer"
        >
          <div className="text-center text-muted-foreground">
            <PlusCircle className="w-10 h-10 mx-auto mb-2" />
            <p className="text-lg font-semibold">Add New Goal</p>
          </div>
        </Card>
      </div>

      <GoalDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />
    </div>
  );
}
