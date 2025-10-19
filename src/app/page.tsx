import { ArrowRight, Pyramid } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background bg-grid">
            <header className="p-4 flex justify-between items-center">
                 <Link href="/dashboard" className="flex items-center gap-3 group">
                    <Pyramid className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-bold text-white font-sans">
                    SamrAI
                    </span>
                </Link>
                <Link href="/sign-in">
                    <Button className="font-serif">
                        Login <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="relative z-10 flex flex-col items-center">
                    <Pyramid className="w-24 h-24 text-primary animate-float mb-8" />
                    <h2 className="text-4xl md:text-7xl font-serif font-extrabold text-white leading-tight mb-6">
                        Intelligent Investing, Powered by AI
                    </h2>
                    <p className="max-w-3xl mx-auto text-md md:text-xl text-gray-400 mb-10 font-sans">
                        SamrAI combines behavioral analytics, predictive forecasting, and personalized advice to help you navigate the markets with confidence.
                    </p>
                    <Link href="/dashboard">
                        <Button size="lg" className="font-serif">
                           Enter SamrAI
                           <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
