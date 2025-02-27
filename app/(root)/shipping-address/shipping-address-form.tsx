"use client";

import { IShippingAddress } from "@/type";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { shippingAddressSchema } from "@/lib/validator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";

function ShippingAddressForm({ address }: { address: IShippingAddress }) {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address,
  });

  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }
    });

    router.push("/payment-method");
  };

  return (
    <div>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter and address to ship to
        </p>
        <Form {...form}>
          <form
            method="post"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col  md:flex-row gap-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex flex-col  md:flex-row gap-5">
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Street Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex flex-col  md:flex-row gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex flex-col  md:flex-row gap-5">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex flex-col  md:flex-row gap-5">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ShippingAddressForm;
