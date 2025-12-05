"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import { useFormStatus } from "react-dom";
import { submitContactForm } from "@/lib/actions/contact";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function ContactPage() {
    const [state, formAction] = useActionState(submitContactForm, {
        success: false,
        message: "",
        errors: {}
    });

    const { pending } = useFormStatus();

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            // Optional: Reset form here if needed, but native form reset happens on submission usually if not prevented.
            // Actually with server actions, we might need to manually reset the form ref if we want to clear inputs.
            // For now, let's just show the toast.
            const form = document.getElementById("contact-form") as HTMLFormElement;
            if (form) form.reset();
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">İletişim</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="prose prose-slate">
                            <p className="text-lg text-slate-600">
                                Sorularınız, önerileriniz veya siparişlerinizle ilgili destek almak için bize ulaşabilirsiniz.
                                Uzman ekibimiz size en kısa sürede dönüş yapacaktır.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Telefon</h3>
                                        <p className="text-slate-600">0850 XXX XX XX</p>
                                        <p className="text-xs text-slate-400 mt-1">Hafta içi 09:00 - 18:00</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">E-posta</h3>
                                        <p className="text-slate-600">info@medikalciniz.com</p>
                                        <p className="text-xs text-slate-400 mt-1">7/24 Bize yazabilirsiniz</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Adres</h3>
                                        <p className="text-slate-600">
                                            Medikal Plaza, Kat: 3, No: 12<br />
                                            Konak, İzmir
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="border-slate-200 shadow-lg">
                        <CardContent className="p-8 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">Bize Ulaşın</h2>

                            <form id="contact-form" action={formAction} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Adınız</Label>
                                        <Input id="firstName" name="firstName" placeholder="Adınız" required />
                                        {state.errors?.firstName && <p className="text-sm text-red-500">{state.errors.firstName[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Soyadınız</Label>
                                        <Input id="lastName" name="lastName" placeholder="Soyadınız" required />
                                        {state.errors?.lastName && <p className="text-sm text-red-500">{state.errors.lastName[0]}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta Adresiniz</Label>
                                    <Input id="email" name="email" type="email" placeholder="ornek@email.com" required />
                                    {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Konu</Label>
                                    <Input id="subject" name="subject" placeholder="Mesajınızın konusu" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Mesajınız</Label>
                                    <Textarea id="message" name="message" placeholder="Bize iletmek istediğiniz mesaj..." className="min-h-[120px]" required />
                                    {state.errors?.message && <p className="text-sm text-red-500">{state.errors.message[0]}</p>}
                                </div>

                                <SubmitButton />
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
            {pending ? "Gönderiliyor..." : "Gönder"}
        </Button>
    );
}
