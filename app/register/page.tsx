"use client";

import Link from "next/link";
import { useState, useEffect, useActionState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { registerUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(registerUser, {
        success: false,
        message: ""
    });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Password Validation State
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false
    });

    useEffect(() => {
        const password = formData.password;
        setPasswordCriteria({
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password)
        });
    }, [formData.password]);

    const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

    useEffect(() => {
        if (formData.confirmPassword) {
            setPasswordsMatch(formData.password === formData.confirmPassword);
        } else {
            setPasswordsMatch(true);
        }
    }, [formData.password, formData.confirmPassword]);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            router.push("/login");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden py-10">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 blur-3xl" />
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-100/40 blur-3xl" />
            </div>

            <Card className="w-full max-w-[500px] shadow-lg border-white/50 bg-white/80 backdrop-blur-xl relative z-10">
                <CardHeader className="text-center space-y-2 pb-6">
                    <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            Medikalciniz
                        </span>
                    </Link>
                    <CardTitle className="text-2xl font-bold text-primary">Kayıt Ol</CardTitle>
                    <CardDescription className="text-slate-500">
                        Medikalciniz dünyasına katılmak için bilgilerinizi girin.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-slate-700 font-medium">Ad</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Ahmet"
                                        className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                        required
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-slate-700 font-medium">Soyad</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Yılmaz"
                                        className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                        required
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-700 font-medium">Telefon Numarası</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="05XX XXX XX XX"
                                    className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">E-posta</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
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
                            <Label htmlFor="password" className="text-slate-700 font-medium">Şifre</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
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

                            {/* Password Criteria Checklist */}
                            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                <CriteriaItem valid={passwordCriteria.length} text="En az 6 karakter" />
                                <CriteriaItem valid={passwordCriteria.uppercase} text="Büyük harf" />
                                <CriteriaItem valid={passwordCriteria.lowercase} text="Küçük harf" />
                                <CriteriaItem valid={passwordCriteria.number} text="Rakam" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Şifre Tekrarı</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`pl-9 pr-10 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${!passwordsMatch ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}`}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {!passwordsMatch && (
                                <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
                                    Şifreler eşleşmiyor.
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isPending || !passwordsMatch || !isPasswordValid || !formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Kayıt Ol
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 pt-6 pb-6">
                    <p className="text-sm text-slate-500">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:text-blue-700 transition-colors">
                            Giriş Yap
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

function CriteriaItem({ valid, text }: { valid: boolean; text: string }) {
    return (
        <div className={`flex items-center gap-1.5 ${valid ? "text-emerald-600" : "text-slate-400"}`}>
            {valid ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
            <span>{text}</span>
        </div>
    );
}
