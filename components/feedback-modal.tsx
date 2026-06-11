'use client';

import { useState, useEffect } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

interface FeedbackQuestion {
  id: string;
  question: string;
  position: number;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  eventType?: string;
  onSubmitted?: () => void;
}

export function FeedbackModal({ isOpen, onClose, email, eventType = 'C2C', onSubmitted }: FeedbackModalProps) {
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [userEmail, setUserEmail] = useState(email);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !submitted) {
      fetchQuestions();
      setUserEmail(email); // Update user email when modal opens
    }
  }, [isOpen, email, eventType, submitted]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/feedback/questions?event_type=${eventType}`);
      const data = await response.json();

      if (data.success) {
        setQuestions(data.questions);
        // Initialize answers object
        const initialAnswers: Record<string, string> = {};
        data.questions.forEach((q: FeedbackQuestion) => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      } else {
        setError('Failed to load questions');
      }
    } catch (err) {
      setError('Failed to load questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only validate email if it was provided via URL (not anonymous)
    if (email && userEmail) {
      if (!userEmail.includes('@') || !userEmail.includes('.')) {
        setError('Please enter a valid email address');
        return;
      }
    }

    // Validate all questions are answered
    const unanswered = questions.filter(q => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      setError('Please answer all questions');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail || null, // null for anonymous submissions
          answers,
          eventType
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        onSubmitted?.();
      } else {
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Failed to submit feedback');
      console.error('Error submitting feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setAnswers({});
    setUserEmail('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/10 bg-gradient-to-b from-black/30 to-black/50"
        style={{ fontFamily: 'Trap, Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2
            className="text-xl font-semibold text-white tracking-tight"
            style={{ fontFamily: 'Trap-Bold, Trap, Arial, sans-serif' }}
          >
            Code2Create Feedback
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle size={64} className="mx-auto text-[#48BA86] mb-4" />
              <h3
                className="text-xl font-semibold text-white mb-2"
                style={{ fontFamily: 'Trap-Bold, Trap, Arial, sans-serif' }}
              >
                Thank you for your feedback!
              </h3>
              <p className="text-gray-400 mb-6">
                Your responses have been submitted successfully.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-full font-semibold transition-colors bg-[#48BA86] hover:bg-[#3aa874] text-black border border-[#48BA86]"
              >
                Close
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading questions...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {error && (
                <div className="rounded-lg p-4 bg-red-900/30 border border-red-700/50">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <label className="block text-white font-medium">
                    {index + 1}. {question.question}
                  </label>
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="w-full p-3 rounded-lg text-white placeholder-gray-400 bg-black/30 border border-white/10 focus:border-[#48BA86] focus:outline-none focus:ring-0 resize-none"
                    rows={4}
                    placeholder="Please share your thoughts..."
                    required
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 rounded-full font-semibold transition-colors text-white bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 bg-[#48BA86] hover:bg-[#3aa874] text-black border border-[#48BA86] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
