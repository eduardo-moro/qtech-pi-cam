import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InstallPWA from '@/components/InstallPWA';

// Define the schema for MJPEG-only stream settings
const formSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.string().regex(/^\d+$/, "Port must be a number"),
  path: z.string(),
  username: z.string().optional(),
  password: z.string().optional(),
  targetFps: z.string().regex(/^\d+$/, "Target FPS must be a number").optional(),
});

export type StreamSettings = z.infer<typeof formSchema>;

const Settings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StreamSettings>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      host: "",
      port: "8888",
      path: "/video",
      targetFps: "30",
    },
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('streamSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      form.reset(parsedSettings);
    }
  }, [form]);

  const onSubmit = (data: StreamSettings) => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('streamSettings', JSON.stringify(data));
      toast({
        title: "Settings saved",
        description: "MJPEG stream settings have been saved.",
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 bg-card">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Stream Settings</h1>
            </div>
            <InstallPWA />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="container max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Connection Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Host</FormLabel>
                          <FormControl>
                            <Input placeholder="192.168.0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            IP or hostname of the stream source
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Port</FormLabel>
                          <FormControl>
                            <Input placeholder="8080" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Path</FormLabel>
                        <FormControl>
                          <Input placeholder="/stream" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Optional"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="targetFps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target FPS</FormLabel>
                        <FormControl>
                          <Input placeholder="25" {...field} />
                        </FormControl>
                        <FormDescription>
                          Desired frames per second for MJPEG stream (e.g., 25 for 25fps)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
