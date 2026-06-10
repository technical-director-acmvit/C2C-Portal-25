"use client";

import Landing from "./components/landing/landing";
import About from "./components/landing/about-c2c";
import Sponsors from "./components/landing/sponsors";
import FAQs from "./components/landing/faqs";
import Timeline from "./components/landing/timeline";
import AboutACM from "./components/landing/about-acm";
import Statistics from "./components/landing/statistics";
import Footer from "./components/landing/footer";
import Speaker from "./components/landing/speaker";
import TopBar from "./components/landing/top-bar";
import ViewportPortal from "@/components/viewport-portal";
import { FeedbackModal } from "@/components/feedback-modal";
import { useLayoutEffect, useEffect, useState, Suspense, useCallback } from "react";
import { InteractiveHoverButton } from "./components/landing/ui/cta-button";
import { StickyScroll } from "./components/landing/ui/sticky-scroll-reveal";
import Image from "next/image";
import GradientBG from "./components/landing/gradient-bg";
import DotGrid from "./components/landing/dot-grid";
import HeadingText from "./components/landing/HeadingText";
import Tracks from "./components/landing/tracks";
import { useSearchParams } from "next/navigation";
import ReturnAnnouncement from "./components/landing/return-announcement";

const DesktopFeedbackButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
  if (disabled) return null;
  return (
    <div className="hidden md:flex fixed left-1/2 -translate-x-1/2 bottom-[8%] z-[9999]">
      <InteractiveHoverButton
        onClick={onClick}
        className="w-[280px] text-lg px-5 py-2 min-h-[48px] rounded-full font-bold flex items-center justify-center bg-[#48BA86] hover:bg-[#3aa874] text-black border border-[#48BA86] transition-colors"
      >
        Share Feedback
      </InteractiveHoverButton>
    </div>
  );
};

const TRACKS = [
  {
    number: 1,
    title: "I Can Do It Better",
    description:
      "Reimagine and improve widely used software by enhancing usability, adding desired features, or optimizing performance.",
    svgPath: "/tracks/CanDoBetter.svg",
  },
    {
    number: 2,
    title: "I Can Do It Better",
    description:
      "Reimagine and improve widely used software by enhancing usability, adding desired features, or optimizing performance.",
    svgPath: "/tracks/CanDoBetter.svg",
  },
  {
    number: 3,
    title: "Art Attack",
    description:
      "Build tools that reimagine creative expression through technologies that help create music, art, or media in new and exciting ways.",
    svgPath: "/tracks/Art_Attack.svg",
  },
  {
    number: 4,
    title: "Game Over",
    description:
      "Create experiences that redefine gaming through original games and technologies that improve gameplay, performance, or game development.",
    svgPath: "/tracks/Game_Over.svg",
  },
  {
    number: 5,
    title: "Digital Dawn",
    description:
      "Create solutions that uniquely solve Indian challenges at scale, focusing on affordable and inclusive technology for the next billion users.",
    svgPath: "/tracks/Digital_Dawn.svg",
  },
  {
    number: 6,
    title: "AI Solutions",
    description:
      "Build intelligent systems using RunPod's compute services to create practical and scalable AI solutions for real-world problems.",
    svgPath: "/tracks/ai_solutions.svg",
  },
];

const TRACKS_CONTENT = TRACKS.map((track) => ({
  title: track.title,
  description: track.description,
  content: (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      <Image
        src={track.svgPath}
        alt={`${track.title} illustration`}
        fill
        className="object-contain"
        priority={track.number === 1}
        loading={track.number === 1 ? "eager" : "lazy"}
      />
    </div>
  ),
}));

function FeedbackSearchParamGate({ onOpen, disabled }: { onOpen: (email: string) => void; disabled?: boolean }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (disabled) return;
    const feedbackId = searchParams.get('id');
    if (feedbackId) {
      try {
        const decodedEmail = atob(feedbackId);
        if (decodedEmail.includes('@') && decodedEmail.includes('.')) {
          onOpen(decodedEmail);
        }
      } catch (error) {
        console.error('Invalid feedback ID:', error);
      }
    }
  }, [searchParams, onOpen, disabled]);
  return null;
}

export default function Page() {
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    email: '',
  });
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('c2c_feedback_submitted');
    if (stored === 'true') {
      setHasSubmittedFeedback(true);
    }
  }, []);

  const markFeedbackSubmitted = useCallback(() => {
    setHasSubmittedFeedback(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('c2c_feedback_submitted', 'true');
    }
  }, []);

  useLayoutEffect(() => {
    // ScrollSmoother.create({
    //   wrapper: '#smooth-wrapper',
    //   content: '#smooth-content',
    //   smooth: 1,
    // });
  }, []);

  // Feedback trigger via URL param is handled in Suspense-wrapped gate below

  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      email: '',
    });
  };

  const openFeedbackModal = () => {
    if (hasSubmittedFeedback) return;
    setFeedbackModal({
      isOpen: true,
      email: '', // Empty email for manual entry
    });
  };

  return (
    <div className="relative w-full">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0a0a0a] via-[#161616] to-[#0a0a0a]" />
      <ReturnAnnouncement />

      <ViewportPortal>
        <TopBar />
      </ViewportPortal>

      {/* Watch search params for feedback id inside Suspense boundary */}
      {/* <Suspense fallback={null}>
        <FeedbackSearchParamGate
          disabled={hasSubmittedFeedback}
          onOpen={(email) => setFeedbackModal({ isOpen: true, email })}
        />
      </Suspense> */}

      {/* Feedback Modal via portal to ensure overlay is above all content */}
      {/* <ViewportPortal>
        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={closeFeedbackModal}
          email={feedbackModal.email}
          eventType="C2C"
          onSubmitted={markFeedbackSubmitted}
        />
      </ViewportPortal> */}

      {/* Feedback Button temporarily disabled */}
      {/*
      {!feedbackModal.isOpen && (
        <DesktopFeedbackButton onClick={openFeedbackModal} disabled={hasSubmittedFeedback} />
      )}
      */}

      <div id="smooth-wrapper" className="relative z-0">
        <div id="smooth-content">
          <div className="relative">
            <Landing />
          </div>

          <div className="min-h-screen flex flex-col">
            <div id="about" className="flex-1 w-full">
              <About />
            </div>
          </div>

          <div className=" flex items-center justify-between flex-col">
            <AboutACM />
          </div>
          <div className=" flex items-center justify-between flex-col">
            <Statistics />
          </div>
          <div id="tracks" className="relative w-full">
            {/* Mobile: use the original Tracks component */}
            <div className="lg:hidden">
              <Tracks />
            </div>

            {/* Desktop: GSAP sticky scroll version */}
            <div className="hidden lg:block">
              <div className="min-h-[300vh]">
                <GradientBG>
                  <div className="relative z-10">
                    <HeadingText text="Tracks" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 -z-10">
                    <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" className="h-full w-full" />
                  </div>

                  <div className="w-full max-w-[1080px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
                    <StickyScroll content={TRACKS_CONTENT} />
                  </div>
                </GradientBG>
              </div>
            </div>
          </div>
          {/* <WinnersSection /> */}

          <div id="speakers" className="min-h-screen flex items-center justify-between flex-col">
            <Speaker />
          </div>
          <div id="timeline" className="h-screen flex items-center justify-between flex-col">
            <Timeline />
          </div>
          <div id="sponsors" className="min-h-screen flex items-center justify-between flex-col">
            <Sponsors />
          </div>
          <div id="faqs" className="flex items-center justify-between flex-col">
            <FAQs />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}

function WinnersSection() {
  const WINNERS: { team: string; how: string; github_url?: string }[] = [
    { team: "Aloo Bhujiya", how: "1st Place" },
    { team: "Bangalore Bologanesh", how: "2nd Place" },
    { team: "Agent Forge", how: "3rd Place", github_url: "https://github.com/saran-gangster/AgentForge" },
    { team: "void main ()", how: "Track Winner - Game Over" },
    { team: "Coffee Overflow", how: "Track Winner - I Can Do It Better", github_url: "https://github.com/raghavvag/lucidfiles.git" },
    { team: "Touch Grass.exe", how: "Track Winner - Art Attack" },
    { team: "BehenCode", how: "Track Winner - Digital Dawn", github_url: "https://github.com/itzsam849/Green-Hydrogen-Infrastructure-Optimized-System" },
    { team: "BlindSpot", how: "Track Winner - AI SOLUTIONS" },
    { team: "Disco Diwaane", how: "Best Freshers", github_url: "https://github.com/vai-04/Heartician_DiscoDiwaane_C2C_25" },
  ];

  const content = WINNERS.map((w, idx) => ({
    title: w.team,
    description: w.how,
    content: (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <p className="text-[#efefef] text-xl font-semibold">{w.how}</p>
          {w.github_url ? (
            <a
              href={w.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-[#48BA86] hover:underline break-all"
            >
              {w.github_url}
            </a>
          ) : (
            <p className="mt-3 text-neutral-300 text-sm">Repo link coming soon</p>
          )}
        </div>
      </div>
    ),
  }));

  return (
    <div id="winners" className="relative w-full">
      <div className="lg:hidden">
        <GradientBG>
          <div className="relative z-10">
            <HeadingText text="Winners" />
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10">
            <DotGrid dotSize={2.5} gap={15} baseColor="#a3a3a3" className="h-full w-full" />
          </div>
          <div className="w-full max-w-[1080px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:gap-6 pb-8">
              {WINNERS.map((w, i) => (
                <article key={w.team + i} className="bg-white/10 border border-green-900/40 rounded-[16px] sm:rounded-[20px] overflow-hidden p-4 sm:p-5">
                  <h3 className="text-[#efefef] font-bold font-['Trap'] text-2xl sm:text-3xl">{w.team}</h3>
                  <p className="text-[#efefef] font-['DM_Sans'] text-base sm:text-lg mt-2">{w.how}</p>
                  {w.github_url ? (
                    <a href={w.github_url} target="_blank" rel="noopener noreferrer" className="text-[#48BA86] hover:underline break-all mt-3 inline-block">{w.github_url}</a>
                  ) : (
                    <p className="text-neutral-300 text-sm mt-3">Repo link coming soon</p>
                  )}
                </article>
              ))}
            </div>
          </div>
          <WinnersDisclaimer />
        </GradientBG>
      </div>

      <div className="hidden lg:block">
        <div className="min-h-[240vh]">
          <GradientBG>
            <div className="relative z-10">
              <HeadingText text="Winners" />
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10">
              <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" className="h-full w-full" />
            </div>
            <div className="w-full max-w-[1080px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
              <StickyScroll content={content} />
            </div>
            <WinnersDisclaimer />
          </GradientBG>
        </div>
      </div>
    </div>
  );
}

function WinnersDisclaimer() {
  return (
    <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
      <div className="bg-yellow-200/10 border border-yellow-300/30 text-yellow-200 rounded-md p-4 text-sm leading-relaxed">
        Disclaimer: Winners’ projects are showcased for viewing only and cannot be reused anywhere. Do not copy, repurpose, or publish any part of these projects (code, designs, or ideas) in other hackathons, coursework, or products. Any unauthorized use is strictly prohibited without written permission from the original team and the organizers.
      </div>
    </div>
  );
}
