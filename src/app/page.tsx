import { ArrowRight, Pyramid } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background bg-grid">
            <header className="p-3 md:p-4 flex justify-between items-center">
                 <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 group">
                    <Pyramid className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    <span className="text-xl md:text-2xl font-bold text-white font-sans">
                    SamrAI
                    </span>
                </Link>
                <Link href="/sign-in">
                    <Button className="font-serif text-sm md:text-base" size="sm">
                        Login <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                </Link>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 md:p-4">
                <div className="relative z-10 flex flex-col items-center max-w-5xl">
                    <Pyramid className="w-16 h-16 md:w-24 md:h-24 text-primary animate-float mb-6 md:mb-8" />
                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-white leading-tight mb-4 md:mb-6 px-2">
                        Intelligent Investing, Powered by AI
                    </h2>
                    <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-8 md:mb-10 font-sans px-2">
                        SamrAI combines behavioral analytics, predictive forecasting, and personalized advice to help you navigate the markets with confidence.
                    </p>
                    <Link href="/dashboard">
                        <Button size="lg" className="font-serif text-sm md:text-base">
                           Enter SamrAI
                           <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
