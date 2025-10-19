'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect } from 'react';

export const goalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Goal name must be at least 3 characters.'),
  target: z.coerce
    .number({ invalid_type_error: 'Target must be a number.' })
    .positive('Target amount must be positive.'),
  current: z.coerce.number().optional(),
  deadline: z.date({ required_error: 'A deadline is required.' }),
});

export type Goal = z.infer<typeof goalSchema>;

type GoalDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  goal?: Goal;
  onSave: (goal: Goal) => void;
};


export function GoalDialog({
  isOpen,
  setIsOpen,
  goal,
  onSave,
}: GoalDialogProps) {
  const form = useForm<Goal>({
    resolver: zodResolver(goalSchema),
    defaultValues: goal || {
      name: '',
      target: 0,
      deadline: undefined,
    },
  });
  
  useEffect(() => {
    if (isOpen) {
      form.reset(goal || {
        name: '',
        target: undefined,
        deadline: undefined,
        current: 0,
      });
    }
  }, [isOpen, goal, form]);


  const onSubmit = (values: Goal) => {
    onSave(values);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{goal ? 'Adjust Goal' : 'Add New Goal'}</DialogTitle>
          <DialogDescription>
            {goal
              ? "Update the details for your financial goal."
              : "Set up a new financial goal to track your progress."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dream Vacation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                     <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                        <Input type="number" placeholder="10000" className="pl-7" {...field} />
                     </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {goal && (
               <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Current Amount</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                            <Input type="number" placeholder="0" className="pl-7" {...field} />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Goal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
