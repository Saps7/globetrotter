import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import Question from './Question';
import FeedbackModal from './FeedbackModal';
import data from '../data/data.json';
import { shuffleArray } from '../utils/shuffleArray';

const QuizContainer = styled(motion.div)`
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

    const getRandomDestination = () => {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    };

    const loadNewQuestion = () => {
        const destination = getRandomDestination();
        const randomClue = destination.clues[Math.floor(Math.random() * destination.clues.length)];

        setCurrentQuestion({
            clue: randomClue,
            correctAnswer: destination.city,
            funFact: destination.fun_fact[0],
            options: shuffleArray([...new Set(data.map(d => d.city))])
        });
    };

    useEffect(() => {
        loadNewQuestion();
    }, []);

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