"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactInfo = [
    { icon: MapPin, label: "Address", value: "123 Commerce St, San Francisco, CA 94105" },
    { icon: Mail, label: "Email", value: "support@shopnext.com" },
    { icon: Phone, label: "Phone", value: "+1 (800) 555-0100" },
    { icon: Clock, label: "Hours", value: "Mon–Fri, 9am–6pm PST" },
];

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormData>();

    async function onSubmit() {
        await new Promise((r) => setTimeout(r, 800));
        toast.success("Message sent! We'll reply within 24 hours. 📬");
        reset();
    }

    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white py-16 text-center">
                <h1 className="text-4xl font-extrabold mb-2">Contact Us</h1>
                <p className="text-indigo-200 text-lg">We're here to help. Reach out anytime.</p>
            </section>

            <div className="container py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                            <p className="text-muted-foreground">
                                Have a question, feedback, or just want to say hi? We'd love to hear from you. Our team usually responds within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {contactInfo.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{label}</p>
                                        <p className="text-sm text-muted-foreground">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map placeholder */}
                        <div className="rounded-xl overflow-hidden border h-48 bg-slate-100 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <MapPin className="h-10 w-10 mx-auto mb-2 text-primary" />
                                <p className="text-sm font-medium">San Francisco, CA</p>
                                <p className="text-xs">123 Commerce Street</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="text-xl font-bold mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" {...register("name")} placeholder="Your name" required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register("email")} placeholder="you@example.com" required />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" {...register("subject")} placeholder="How can we help?" required />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    {...register("message")}
                                    placeholder="Tell us more..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full font-semibold" disabled={isSubmitting}>
                                {isSubmitting ? "Sending…" : "Send Message →"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
