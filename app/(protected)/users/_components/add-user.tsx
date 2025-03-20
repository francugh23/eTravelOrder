"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CircleUserRound,
  Eye,
  EyeOff,
  TriangleAlert,
  Upload,
  UserPlus2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { AddUserSchema } from "@/schemas";
import { createUser } from "@/actions/create-user";

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.CLIENT,
    },
  });

  const onSubmit = async (data: z.infer<typeof AddUserSchema>) => {
    try {
      const result = await createUser(data);

      if (result?.error) {
        toast("Oops", {
          description: result?.error || "An error occurred!",
          duration: 5000,
          icon: <TriangleAlert className="text-red-500" size={20} />,
        });
      } else {
        toast("Success", {
          description: result?.success || "User created successfully!",
          duration: 5000,
          icon: <BadgeCheck className="text-green-500" size={20} />,
        });
        setOpen(false);
        form.reset();
        setImagePreview(null);
        setSignaturePreview(null);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast("Oops!", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
        icon: <TriangleAlert size={20} />,
      });
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          form.reset();
          setImagePreview(null);
          setSignaturePreview(null);
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus2 className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New User</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left column */}
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan Dela Cruz"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        This email must be unique across all users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-10 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.CLIENT}>
                            Client
                          </SelectItem>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.SIGNATORY}>
                            Signatory
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Profile Image
                      </FormLabel>
                      <FormControl>
                        <Card className="border-dashed">
                          <CardContent className="p-4 flex flex-col items-center justify-center space-y-4">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={imagePreview || undefined} />
                              <AvatarFallback>
                                <CircleUserRound className="text-gray-400 h-20 w-20" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-center gap-2">
                              <label
                                htmlFor="image-upload"
                                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Image
                              </label>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, onChange)}
                                {...fieldProps}
                              />
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG or GIF, max 2MB
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Signature
                      </FormLabel>
                      <FormControl>
                        <Card className="border-dashed">
                          <CardContent className="p-4 flex flex-col items-center justify-center space-y-4">
                            <div className="h-20 w-40 rounded border bg-muted flex items-center justify-center overflow-hidden">
                              {signaturePreview ? (
                                <img
                                  src={signaturePreview || "/placeholder.svg"}
                                  alt="Signature Preview"
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Signature Preview
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <label
                                htmlFor="signature-upload"
                                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Signature
                              </label>
                              <Input
                                id="signature-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleSignatureChange(e, onChange)
                                }
                                {...fieldProps}
                              />
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG or GIF, max 2MB
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
