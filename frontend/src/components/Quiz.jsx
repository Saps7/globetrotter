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

function Quiz({ score, setScore, onComplete, isCompleted, setShowCompletionModal }) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [allDestinations, setAllDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLastQuestion, setIsLastQuestion] = useState(false);

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
        const destination = await getRandomDestination();
        if (!destination) return;

        const randomClue = destination.clues[Math.floor(Math.random() * destination.clues.length)];
        
        setCurrentQuestion({
            clue: randomClue,
            correctAnswer: destination.city,
            funFact: destination.fun_fact[0],
            trivia: destination.trivia[0],
            options: shuffleArray([
                destination.city,
                ...allDestinations
                    .filter(d => d.city !== destination.city)
                    .map(d => d.city)
                    .slice(0, 3)
            ])
        });
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
        >
            {currentQuestion && (
                <Question
                    clue={currentQuestion.clue}
                    options={currentQuestion.options}
                    onAnswer={handleAnswer}
                    disabled={showFeedback}
                />
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