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

function Quiz({ setScore }) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [allDestinations, setAllDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

    const handleAnswer = (answer) => {
        setSelectedDestination(answer);
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowFeedback(true);
        setScore(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            total: prev.total + 1
        }));
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
                        onNext={() => {
                            setShowFeedback(false);
                            loadNewQuestion();
                        }}
                    />
                )}
            </AnimatePresence>
        </QuizContainer>
    );
}

export default Quiz;