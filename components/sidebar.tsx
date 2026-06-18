"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Atom,
  FlaskConical,
  Dna,
  GraduationCap,
  Clock,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Subject = "physics" | "chemistry" | "biology";

interface SidebarProps {
  activeSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const subjects = [
  {
    id: "physics" as Subject,
    name: "Physics",
    icon: Atom,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/50",
  },
  {
    id: "chemistry" as Subject,
    name: "Chemistry",
    icon: FlaskConical,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/50",
  },
  {
    id: "biology" as Subject,
    name: "Biology",
    icon: Dna,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/50",
  },
];

const recentSessions = [
  { id: 1, title: "Mechanics PYQ Practice", subject: "physics", time: "2h ago" },
  { id: 2, title: "Organic Chemistry Basics", subject: "chemistry", time: "5h ago" },
  { id: 3, title: "Human Physiology", subject: "biology", time: "1d ago" },
  { id: 4, title: "Thermodynamics Review", subject: "physics", time: "2d ago" },
];

export function Sidebar({ activeSubject, onSubjectChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-border bg-card transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">NEET AI Tutor</h1>
                <p className="text-xs text-muted-foreground">Your study companion</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Subject Navigation */}
          <div className="p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Subjects
            </p>
            <nav className="space-y-1.5" role="navigation" aria-label="Subject navigation">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                const isActive = activeSubject === subject.id;
                return (
                  <button
                    key={subject.id}
                    onClick={() => {
                      onSubjectChange(subject.id);
                      if (window.innerWidth < 768) onToggle();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? `${subject.bgColor} ${subject.color} border ${subject.borderColor}`
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className={cn("h-4 w-4", isActive && subject.color)} />
                    {subject.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Recent Sessions */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent Sessions
            </p>
            <div className="space-y-1">
              {recentSessions.map((session) => {
                const subjectData = subjects.find((s) => s.id === session.subject);
                return (
                  <button
                    key={session.id}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        subjectData?.color.replace("text-", "bg-")
                      )}
                    />
                    <div className="flex-1 truncate">
                      <p className="truncate text-sm">{session.title}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {session.time}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <p className="text-center text-xs text-muted-foreground">
              Powered by AI • Made for NEET
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

interface TopBarProps {
  activeSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
  onMenuToggle: () => void;
}

export function TopBar({ activeSubject, onSubjectChange, onMenuToggle }: TopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentSubject = subjects.find((s) => s.id === activeSubject)!;
  const Icon = currentSubject.icon;

  return (
    <header className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3 backdrop-blur-md">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Subject Header */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-secondary md:hidden"
          >
            <div className={cn("rounded-lg p-1.5", currentSubject.bgColor)}>
              <Icon className={cn("h-4 w-4", currentSubject.color)} />
            </div>
            <span className="font-medium text-foreground">{currentSubject.name}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Desktop Subject Display */}
          <div className="hidden items-center gap-2 md:flex">
            <div className={cn("rounded-lg p-2", currentSubject.bgColor)}>
              <Icon className={cn("h-5 w-5", currentSubject.color)} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{currentSubject.name}</h2>
              <p className="text-xs text-muted-foreground">NEET Preparation</p>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border border-border bg-card p-1.5 shadow-2xl md:hidden">
              {subjects.map((subject) => {
                const SubIcon = subject.icon;
                return (
                  <button
                    key={subject.id}
                    onClick={() => {
                      onSubjectChange(subject.id);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      activeSubject === subject.id
                        ? `${subject.bgColor} ${subject.color}`
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <SubIcon className="h-4 w-4" />
                    {subject.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Profile Widget */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-500 sm:flex">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-semibold">12 Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
              AS
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">Aarav Sharma</p>
            <p className="text-xs text-muted-foreground">NEET 2025</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export { subjects };
