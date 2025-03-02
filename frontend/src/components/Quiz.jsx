import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import Question from './Question';
import FeedbackModal from './FeedbackModal';
import { shuffleArray } from '../utils/shuffleArray';

const QuizContainer = styled(motion.div)`
    width: 80%;
    max-width: 800px;
    margin: 0;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  z-index: 10;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4299e1;
  border-radius: 50%;
`;

function Quiz({ score, setScore, onComplete, isCompleted, setShowCompletionModal }) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [allDestinations, setAllDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const QUESTIONS_LIMIT = 5;

    // Fetch all destinations on component mount
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/destinations`);
                if (!response.ok) throw new Error('Failed to fetch destinations');
                const data = await response.json();
                setAllDestinations(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    const getRandomDestination = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/destinations/random`);
            if (!response.ok) throw new Error('Failed to fetch random destination');
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    const loadNewQuestion = async () => {
        setIsLoadingQuestion(true);
        const destination = await getRandomDestination();
        if (!destination) {
            setIsLoadingQuestion(false);
            return;
        }

        const randomClue = destination.clues[Math.floor(Math.random() * destination.clues.length)];
        const options = shuffleArray([
            destination.city,
            ...allDestinations
                .filter(d => d.city !== destination.city)
                .map(d => d.city)
                .slice(0, 3)
        ]);

        // Use setTimeout to ensure smooth transition
        setTimeout(() => {
            setCurrentQuestion({
                clue: randomClue,
                correctAnswer: destination.city,
                funFact: destination.fun_fact[0],
                trivia: destination.trivia[0],
                options
            });
            setIsLoadingQuestion(false);
        }, 500);
    };

    useEffect(() => {
        if (!loading && allDestinations.length > 0) {
            loadNewQuestion();
        }
    }, [loading, allDestinations]);

    useEffect(() => {
        if (score.total === QUESTIONS_LIMIT && !isCompleted) {
            onComplete(score);
        }
    }, [score, isCompleted]);

    const handleAnswer = (answer) => {
        if (isCompleted) return;

        setSelectedDestination(answer);
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowFeedback(true);
        
        const newScore = {
            correct: score.correct + (correct ? 1 : 0),
            total: score.total + 1
        };
        setScore(newScore);

        // Check if this is the last question
        setIsLastQuestion(newScore.total === QUESTIONS_LIMIT);
    };

    const handleFeedbackClose = () => {
        setShowFeedback(false);
        
        if (isLastQuestion) {
            // Only call onComplete after closing the last feedback modal
            onComplete(score);
            setShowCompletionModal(true);
        } else {
            loadNewQuestion();
        }
    };

    if (loading) {
        return (
            <QuizContainer>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Loading quiz...
                </motion.div>
            </QuizContainer>
        );
    }

    if (error) {
        return (
            <QuizContainer>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Error: {error}
                </motion.div>
            </QuizContainer>
        );
    }

    return (
        <QuizContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'relative' }}
        >
            {currentQuestion && (
                <>
                    <AnimatePresence>
                        {isLoadingQuestion && (
                            <LoadingOverlay
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <LoadingSpinner
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                            </LoadingOverlay>
                        )}
                    </AnimatePresence>
                    <Question
                        clue={currentQuestion.clue}
                        options={currentQuestion.options}
                        onAnswer={handleAnswer}
                        disabled={showFeedback || isLoadingQuestion}
                    />
                </>
            )}
            <AnimatePresence>
                {showFeedback && (
                    <FeedbackModal
                        isCorrect={isCorrect}
                        funFact={currentQuestion.funFact}
                        trivia={currentQuestion.trivia}
                        onNext={handleFeedbackClose}
                    />
                )}
            </AnimatePresence>
        </QuizContainer>
    );
}

export default Quiz;