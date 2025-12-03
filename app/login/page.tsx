"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success("Giriş başarılı!", {
            description: "Admin paneline yönlendiriliyorsunuz...",
            duration: 2000,
        });

        // Redirect to Admin Panel
        router.push("/admin");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden py-10">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 blur-3xl" />
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-100/40 blur-3xl" />
            </div>

            <Card className="w-full max-w-[400px] shadow-lg border-white/50 bg-white/80 backdrop-blur-xl relative z-10">
                <CardHeader className="text-center space-y-2 pb-6">
                    <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            Medikalciniz
                        </span>
                    </Link>
                    <CardTitle className="text-2xl font-bold text-primary">Giriş Yap</CardTitle>
                    <CardDescription className="text-slate-500">
                        Hesabınıza erişmek için bilgilerinizi girin.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">E-posta</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@sirket.com"
                                    className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Şifre</Label>
                                <Link href="#" className="text-xs font-medium text-primary hover:text-blue-700">
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-9 pr-10 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                            disabled={isLoading || !formData.email || !formData.password}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Giriş Yap
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 pt-6 pb-6">
                    <p className="text-sm text-slate-500">
                        Hesabınız yok mu?{" "}
                        <Link href="/register" className="font-semibold text-primary hover:text-blue-700 transition-colors">
                            Kayıt Ol
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
