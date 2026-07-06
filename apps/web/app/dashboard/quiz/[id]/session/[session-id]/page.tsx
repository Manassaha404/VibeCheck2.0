"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SessionResultsHeader } from '@/components/analytics/quiz/session-results/SessionResultsHeader';
import { SessionHeroStats } from '@/components/analytics/quiz/session-results/SessionHeroStats';
import { QuestionInsights } from '@/components/analytics/quiz/session-results/QuestionInsights';
import { SessionLeaderboard } from '@/components/analytics/quiz/session-results/SessionLeaderboard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data based on design
const mockInsights = [
  { id: '1', title: 'Velocity vs Time Graph Analysis', status: 'High Pass' as const, percentage: 94 },
  { id: '2', title: "Newton's Second Law Application", status: 'Pass' as const, percentage: 88 },
  { id: '3', title: 'Kinetic Energy in Inelastic Collisions', status: 'Fail' as const, percentage: 42 },
  { id: '4', title: 'Projectile Motion Variables', status: 'Warning' as const, percentage: 76 }
];

const mockLeaderboard = [
  { rank: 1, name: 'Albert Einstein', username: '@relativity_rules', score: 100, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwMiG7tgg8ebdw5mE7yX49SeIEU2I5zuXo7s3uoG_443PxoyapcjbUb8cFb-2PhphIF9AqYEVDnnAi6uKhGx4Gbr9_Zbc5FzVCm0Qx5U9LNpfHBH5d7t2czTm1qg4t0iJnGwV3kPt11KlTutvPkiZmD7YYWP7HF1E_unqoXUUzRZttJ416covzdz0XN7Z4EUqVCiZYm8cZ2fxQzOIlpvw9dqbEK6L0b4SWgXtzshY3S6jfUsuVJwz1' },
  { rank: 2, name: 'Isaac Newton', username: '@apple_gravity', score: 98, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwv2L-j9KBmJr_LZeNmqoO3YwCVND39btKT8COUSNToKFKBVFzQC24PUFVEifRKPUNe_juL4PtCjBSAssugRGqK_qjguM8fHuLHI-hnOBir4BrQsBEMEQ_zi_YFDjp5Ib09jnaoif5TbwbDhC1ag6sKW4XLlYO4ucgY1-M85OyrKT-3WwfmNO15sS7oo9__HZEDJNYi6RVXoyg1MrayzTb0simuU5l5yA5vsO6gMdY4t9tFODc4yoW' },
  { rank: 3, name: 'Marie Curie', username: '@radium_girl', score: 96, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0AasbwMQI9Q_Ps-Kef9mcPVwddHf0OOU2ecq9noMOIXLpa0EytOsrXfZJEbBrepuOF967fRBKMLlxz0malPENa0v65oAGTFCSWrtDCHFB845vdbMDW89X6LA5gZSmABzdkPXb6bAnGT6Lpc13bKEWGJAJ8-JP3B1ZUv80Z79jrfnTnecACD0Fy8Q9u9y7cgKScaWAGG28j_TvrcKYz_4GUP9vBeFPYjEddNBVLmdK_BiedzIo2df' },
  { rank: 4, name: 'Galileo Galilei', username: '@stargazer_1564', score: 92, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoVhiIUnoNVHuDcLFVXgIUaHUaHHS3NQ_qA1oUJyuwp-FtpDu1vH8TjvIO0WXndrHLDP4cpb60ctyYYzYPQ3uyug-Y9J3hbkrtoqA0wiHr7ROfK6SUzdwkZHGLn-OlOEo20WXxhu2yqfL2LxGbRRi7yqoprN1uVOgZZ5i9Na6kWYNwYuSotGpGrkUx9XvPl6VCehoGeWjkODVQs7h01kL9xlpBxrFVfKqCtlMdqKzOh3HZzxU4b0Yi' },
];

export default function SessionResultsPage() {
  const params = useParams();

  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />
      
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 pt-16 pb-12 flex flex-col gap-12 animate-fade-up">
        {/* Back Button Container */}
        <div className="w-full flex justify-start mb-2">
          <Link 
            href={`/dashboard/quiz/${params.id}`} 
            className="bg-[var(--color-pure-white)] text-label-md font-body font-bold text-[var(--color-ink-charcoal)] px-6 py-3 border-2 border-ink-charcoal shadow-hard btn-press transition-all flex items-center justify-center gap-2 uppercase self-start w-max"
          >
            <ArrowLeft size={20} />
            Back to session hub
          </Link>
        </div>
        <SessionResultsHeader 
          title="Physics 101 Midterm" 
          date="Oct 24, 2024" 
          id="9482" 
        />
        
        <SessionHeroStats 
          averageScore={82} 
          totalParticipants={1240} 
        />
        
        <QuestionInsights insights={mockInsights} />
        
        <SessionLeaderboard leaderboard={mockLeaderboard} />
      </main>
      
      <Footer />
    </div>
  );
}
