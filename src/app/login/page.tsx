// src/app/login/page.tsx
// login and signup page with supabase auth

"use client";

// React and Next.js imports
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// zod and supabase imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";

// shadcn/ui imports
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
}   from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";


// zod schema for form validation
const authSchema = z.object({

    // form fields
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().optional(),
    fullName: z.string().optional(),

}).refine((data) => {

    // confirm password check - only validate if confirmPassword has a value
    if (data.confirmPassword && data.confirmPassword.length > 0){
        return data.password === data.confirmPassword;
    }
  
  return true;
}, {

    // tell user if passwords don't match
    message: "Passwords don't match",
    path: ["confirmPassword"],
});


// main react component for login page
export default function LoginPage() {

    // Next.js router and useState hooks
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    // define form 
    const form = useForm({

        resolver: zodResolver(authSchema),

        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            fullName: ""
        },
    });

    // define submit handler
    const onSubmit = async (data: z.infer<typeof authSchema>) => {

        setLoading(true);

        try {
            if (isSignUp) {
                
                // call supabase sign up API
                const { data: signUpData, error } = await supabase.auth.signUp({

                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            full_name: data.fullName,
                        }
                    }
                });
                
                // handle response
                if (error) {
                    form.setError("email", { message: error.message });
                } else if (signUpData.user && signUpData.session) {
                    console.log("Signup successful, redirecting...");
                    router.push("/dashboard");
                } else {
                    form.setError("email", { message: "Email already exists or signup failed. Please try a different email or sign in instead." });
                }
            } 
            else {
                
                // call supabase sign in API
                const { data: signInData, error } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });

                // handle response
                if (error) {
                    console.log("Sign in error:", error);
                    form.setError("email", { message: "Invalid email or password" });
                } else if (signInData.user && signInData.session) {
                    console.log("Sign in successful, redirecting...");
                    router.push("/dashboard");
                } else {
                    console.log("Sign in failed: no user or session", signInData);
                    form.setError("email", { message: "Sign in failed. Please try again." });
                }
            }
        } catch (error) {

            form.setError("email", { message: "An unexpected error occurred" });
        }

        setLoading(false);
    };

    // toggle between sign in and sign up forms
    const toggleForm = () => {

        setIsSignUp(!isSignUp);
        form.reset();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-800 via-purple-900 to-gray-900 p-6">
        <div className="w-full max-w-md">
            {/* filler logo */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4 shadow-md">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
                </div>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-1">Salud</h1>
            </div>

            <Card className="w-full shadow-lg border-gray-600 bg-white">
            <CardHeader className="space-y-3">
                <CardTitle className="text-center text-xl font-semibold text-gray-800">
                {isSignUp ? "Create Account" : "Welcome Back"}
                </CardTitle>
                <p className="text-center text-gray-600 text-sm">
                {isSignUp 
                    ? "Sign up to get started" 
                    : "Sign in to your account"
                }
                </p>
            </CardHeader>
            <CardContent className="space-y-5">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {isSignUp && (
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Full Name</FormLabel>
                            <FormControl>
                            <Input
                                type="text"
                                placeholder="John Doe"
                                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    )}
                    
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-gray-700">Email</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                            {...field}
                            />
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
                        <FormLabel className="text-gray-700">Password</FormLabel>
                        <FormControl>
                            <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete={isSignUp ? "new-password" : "current-password"}
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {isSignUp && (
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                            <FormControl>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    )}

                    <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 transition-colors duration-200"
                    disabled={loading}
                    >
                    {loading 
                        ? (isSignUp ? "Creating Account..." : "Signing In...") 
                        : (isSignUp ? "Create Account" : "Sign In")
                    }
                    </Button>
                </form>
                </Form>

                {/* Toggle between sign in and sign up */}
                <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <button
                    type="button"
                    onClick={toggleForm}
                    className="ml-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                    disabled={loading}
                    >
                    {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
                </div>
            </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-6">
            <p className="text-gray-400 text-xs">
                Powered by Next.js & Supabase
            </p>
            </div>
        </div>
        </div>
    );
}