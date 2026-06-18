"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface MCQOption {
  letter: string;
  text: string;
}

interface MCQCardProps {
  metadata: string;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  explanation?: string;
}

export function MCQCard({ metadata, question, options, correctAnswer, explanation }: MCQCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (letter: string) => {
    if (showResult) return;
    setSelectedOption(letter);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  const isCorrect = selectedOption === correctAnswer;

  return (
    <div className="my-4 w-full max-w-2xl rounded-xl border border-border bg-card p-5 shadow-xl">
      {/* Header Metadata */}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {metadata}
        </span>
      </div>

      {/* Question */}
      <p className="mb-5 text-base font-medium leading-relaxed text-foreground">{question}</p>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedOption === option.letter;
          const isCorrectOption = option.letter === correctAnswer;
          const showAsCorrect = showResult && isCorrectOption;
          const showAsIncorrect = showResult && isSelected && !isCorrectOption;

          return (
            <button
              key={option.letter}
              onClick={() => handleOptionClick(option.letter)}
              disabled={showResult}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200",
                !showResult && !isSelected && "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary",
                !showResult && isSelected && "border-primary bg-primary/10",
                showAsCorrect && "border-emerald-500 bg-emerald-500/10",
                showAsIncorrect && "border-rose-500 bg-rose-500/10",
                showResult && !isSelected && !isCorrectOption && "opacity-50"
              )}
            >
              {/* Letter Box */}
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors",
                  !showResult && !isSelected && "bg-secondary text-muted-foreground",
                  !showResult && isSelected && "bg-primary text-primary-foreground",
                  showAsCorrect && "bg-emerald-500 text-white",
                  showAsIncorrect && "bg-rose-500 text-white"
                )}
              >
                {showAsCorrect ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : showAsIncorrect ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  option.letter
                )}
              </div>

              {/* Option Text */}
              <span
                className={cn(
                  "text-sm",
                  !showResult && !isSelected && "text-muted-foreground",
                  !showResult && isSelected && "text-foreground",
                  showAsCorrect && "text-emerald-400",
                  showAsIncorrect && "text-rose-400"
                )}
              >
                {option.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-3">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200",
              selectedOption
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "cursor-not-allowed bg-secondary text-muted-foreground"
            )}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Result & Explanation */}
      {showResult && (
        <div
          className={cn(
            "mt-5 rounded-lg border p-4",
            isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-emerald-400">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-rose-500" />
                <span className="font-semibold text-rose-400">
                  Incorrect. The correct answer is {correctAnswer}.
                </span>
              </>
            )}
          </div>
          {explanation && (
            <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p>{explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
