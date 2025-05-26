
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import type { User, Department } from '@/types';
import { departments } from '@/types'; // Corrected import
import { transformDummyUserToUser } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const userSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  age: z.coerce.number().min(18, { message: "Age must be at least 18." }).max(100),
  department: z.enum(departments as [Department, ...Department[]], { message: "Please select a department." }),
  title: z.string().min(2, { message: "Job title must be at least 2 characters." }),
});

type UserFormData = z.infer<typeof userSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CreateUserModal({ isOpen, onOpenChange }: CreateUserModalProps) {
  const { addUser } = useApp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUserPartial: Partial<User> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      age: data.age,
      company: {
        department: data.department,
        title: data.title,
        name: "HR Glimpse Corp" // Default company name
      },
      // Use dummy values for fields not in form for now
      image: `https://placehold.co/128x128.png?text=${data.firstName[0]}${data.lastName[0]}`,
      username: `${data.firstName.toLowerCase()}${data.lastName.toLowerCase()}`,
      address: { address: '123 Main St', city: 'Anytown', state: 'CA', postalCode: '90210', country: 'USA' },
      phone: '555-1234',
    };
    
    // Use transformDummyUserToUser to fill in other details for a complete User object
    // This is a bit of a hack for this mock scenario.
    // Ideally, the backend would handle creating the full user object.
    const placeholderId = Date.now(); // Temporary ID, AppContext will assign final
    const transformedNewUser = transformDummyUserToUser({ ...newUserPartial, id: placeholderId, company: newUserPartial.company });
    
    addUser({ ...transformedNewUser, ...newUserPartial }); // Ensure form data overrides transformed data

    toast({
      title: "User Created",
      description: `${data.firstName} ${data.lastName} has been added to the system.`,
    });
    reset();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        reset(); // Reset form when closing
        setError(null); // Clear any previous errors
      }
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new employee to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">First Name</Label>
            <div className="col-span-3">
              <Input id="firstName" {...register("firstName")} className="w-full" />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">Last Name</Label>
            <div className="col-span-3">
              <Input id="lastName" {...register("lastName")} className="w-full" />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <div className="col-span-3">
              <Input id="email" type="email" {...register("email")} className="w-full" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">Age</Label>
            <div className="col-span-3">
              <Input id="age" type="number" {...register("age")} className="w-full" />
              {errors.age && <p className="text-xs text-destructive mt-1">{errors.age.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <div className="col-span-3">
               <Controller
                control={control}
                name="department"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.department && <p className="text-xs text-destructive mt-1">{errors.department.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Job Title</Label>
            <div className="col-span-3">
              <Input id="title" {...register("title")} className="w-full" />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>
          </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Employee
            </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
// Helper to clear errors on the form, not directly used here but useful if needed
function setError(arg0: null) {
    // This function is a placeholder, actual error setting is handled by react-hook-form
}

// Controller import (already in react-hook-form)
import { Controller } from 'react-hook-form';
