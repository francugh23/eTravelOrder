"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, TriangleAlert, UserPlus2 } from "lucide-react";

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

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { AddUserSchema } from "@/schemas";
import { createUser } from "@/actions/create-user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useCurrentUser } from "@/hooks/use-current-user";
import { fetchStations } from "@/data/stations";

interface AddUserDialogProps {
  onUpdate: () => void;
}

export function AddUserDialog({ onUpdate }: AddUserDialogProps) {
  const user = useCurrentUser();
  const { edgestore } = useEdgeStore();

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>();
  const [progress, setProgress] = useState(0);

  const [station, setStation] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchStations();
        setStation(res);
      } catch (e) {
        return null;
      }
    }
    fetchData();
  }, []);

  // Initialize the form
  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      stationId: "",
      role: UserRole.CLIENT,
      signature: "",
      positionDesignation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof AddUserSchema>) => {
    try {
      console.log("Payload", { data });
      // const result = await createUser(data);

      // if (result?.error) {
      //   toast("Oops", {
      //     description: result?.error || "An error occurred!",
      //     duration: 5000,
      //     icon: <TriangleAlert className="text-red-500" size={20} />,
      //   });
      // } else {
      //   toast("Success", {
      //     description: result?.success || "User created successfully!",
      //     duration: 5000,
      //     icon: <BadgeCheck className="text-green-500" size={20} />,
      //   });
      //   setOpen(false);
      //   form.reset();
      //   onUpdate();
      // }
    } catch (error) {
      console.error("Error creating user:", error);
      toast("Oops!", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
        icon: <TriangleAlert size={20} />,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          form.reset();
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                          {showPassword ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  type="button"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <EyeOff className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Hide Password</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  type="button"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Eye className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Show Password</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
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
                  name="positionDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Position/Designation
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Teacher I"
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
                  name="stationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Permanent Station
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select a station" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {station.map((station: any) => (
                            <SelectItem key={station.id} value={station.id}>
                              {station.unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                            <div className="flex flex-col items-center gap-2">
                              <SingleImageDropzone
                                width={100}
                                height={100}
                                value={file}
                                dropzoneOptions={{
                                  maxSize: 1 * 1024 * 1024, // 1MB max
                                }}
                                onChange={async () => {
                                  if (file) {
                                    const res =
                                      await edgestore.myPublicImages.upload({
                                        file,
                                        options: {
                                          temporary: true,
                                        },
                                        input: { type: user?.user?.role },
                                        onProgressChange: (progress) => {
                                          setProgress(progress);
                                        },
                                      });
                                    setUrl(res.url);
                                    onChange(res.url);
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                JPG or PNG, max 1MB
                              </p>
                              <button
                                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                                onClick={async () => {
                                  if (file) {
                                    const res =
                                      await edgestore.myPublicImages.upload({
                                        file,
                                        input: { type: user?.user?.role },
                                        onProgressChange: (progress) => {
                                          setProgress(progress);
                                        },
                                      });
                                    setUrl(res.url);
                                    onChange(res.url);
                                  }
                                }}
                                disabled={!file}
                                type="button"
                              >
                                Upload
                              </button>
                            </div>
                            <div
                              className="h-[6px] w-full border rounded overflow-hidden"
                              hidden={!file}
                            >
                              <div
                                className="h-full bg-black transition-all duration-150"
                                style={{ width: `${progress}%` }}
                              />
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
              {!file ? (
                <Button className="w-full" variant="ghost">
                  Don't forget to upload you signature.
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 w-full"
                  disabled={!file}
                  onClick={async () => {
                    if (url) {
                      await edgestore.myPublicImages.confirmUpload({ url });
                    }
                  }}
                >
                  Create
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
