"use client"

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { revalidatePath } from "next/cache";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { createOrganisation, isOrganisationUsernameUnique} from "@/actions/organisation";

type Props = {
  currentUser: any;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Display Name must be at least 2 characters.",
    })
    .max(100, {
      message: "Display Name must be max 100 characters.",
    }),
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(100, {
      message: "Username must be max 100 characters.",
    })
    .regex(/^[^\s<>\|\\\/]*$/, {
      message: "Username cannot contain spaces or characters: < > / | \\",
    }),
  description: z.string().max(500, {
    message: "Description must be max 500 characters.",
  }),
  email: z.string().max(500, {
    message: "Email must be max 500 characters.",
  }),
  contactNumber: z.string().max(20, {
    message: "Contact Number must be max 20 characters.",
  }),
});

const OrganisationForm = ({ currentUser }: Props) => {
  const router = useRouter();



  if (currentUser?.organisations?.length > 0) {
    toast({
      title: "Existing Organisation",
      description:
        "Only 1 organisation allowed on this account. Upgrade to create more.",
    });
    router.push("/dashboard");
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      username: "",
      description: "",
      email: "",
      contactNumber: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.name === "" || data.username === "") {
      toast({
        title: "Missing Values",
        description:
          "Please include a Name and Username for your Organisation",
      });
      return;
    }

    data.username = data.username.toLowerCase();

    let isUserNameUnique = await isOrganisationUsernameUnique(data.username);

    if (!isUserNameUnique) {
      toast({
        title: "Username Taken",
        description: "Please try another",
      });
      return;
    }

    let formData = { ...data, organisationMainUser: currentUser.id };

    await createOrganisation(formData, currentUser);
    router.push("/dashboard");
    revalidatePath("/dashboard");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl p-8  shadow-md rounded-lg"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-center t">
            <CalendarIcon className="inline-block h-8 w-8 mr-2" />
            Create Organisation
          </h1>
          <PlusCircle className="text-primary h-10 w-10" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Leadership Council"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Username <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="leadershipCouncil"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Small Description of your organisation"
                      {...field}
                      className="w-full"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="leadership@gmail.com"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="868-123-4567"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary text-white font-semibold py-3 rounded-md transition duration-300"
            >
              Create Organisation
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default OrganisationForm;