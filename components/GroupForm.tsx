"use client"

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";


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
import { createGroup} from "@/actions/group";

type Props = {
  currentUser: any;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: " Name must be at least 2 characters.",
    })
    .max(100, {
      message: " Name must be max 100 characters.",
    }),
  description: z.string().max(500, {
    message: "Description must be max 500 characters.",
  }),

});

const GroupForm = ({ currentUser }: Props) => {
  const router = useRouter();



 

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.name == "" ) {
      toast({
        title: "Missing Values",
        description:
          "Please include a Name for your Group",
      });
      return;
    }

   

    let formData = { ...data, adminOrganisationId: currentUser.organisations[0].id };

    let newGroup=await createGroup(formData);

    router.push(`/group/${newGroup.id}`);
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
            Create Group
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
                      placeholder="Group Name"
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
                      placeholder="Small Description of your Group"
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
              Create Group
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default GroupForm;