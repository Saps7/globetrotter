import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

const Modal = styled(motion.div)`
  position: fixed;
  top: 20%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
  z-index: 1002;

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 500px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    width: 300px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
`;

const ScoreDisplay = styled.div`
  font-size: 4.5rem;
  font-weight: bold;
  color: ${props => props.score >= 4 ? '#48bb78' : props.score >= 2 ? '#ecc94b' : '#f56565'};
  margin: 1.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled(motion.button)`
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  box-shadow: 0 4px 6px rgba(229, 62, 62, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: #c53030;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #4a5568;
  margin: 0.5rem 0;
`;

const ComparisonMessage = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${props => props.won ? '#48bb78' : '#e53e3e'};
  margin: 1rem 0;
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: 0.5s;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const VersusScore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 1.2rem;
  color: #4a5568;

  span {
    font-weight: 600;
    color: #2d3748;
  }
`;

function CompletionModal({ score, onClose, inviterScore }) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasInviter = inviterScore && inviterScore.username;
  const won = hasInviter && score.correct > inviterScore.score.correct;
  const tied = hasInviter && score.correct === inviterScore.score.correct;

  return (
    <AnimatePresence>
      {won && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <Modal
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <Title>
          {won ? '🎉 Congratulations!' : tied ? '🤝 Nice Try!' : '💫 Amazing!'}
        </Title>
        <Message>You have completed your quiz!</Message>
        
        <ScoreDisplay score={score.correct}>
          {score.correct}/{score.total}
        </ScoreDisplay>

        {hasInviter && (
          <>
            <VersusScore>
              <span>VS</span>
              {inviterScore.username}'s score: {inviterScore.score.correct}/{inviterScore.score.total}
            </VersusScore>
            <ComparisonMessage won={won}>
              {won 
                ? "🏆 You beat the challenge!" 
                : tied 
                  ? "🤝 It's a tie!" 
                  : "😅 Better luck next time!"}
            </ComparisonMessage>
          </>
        )}

        <CloseButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          style={{
            background: won ? '#48bb78' : tied ? '#4299e1' : '#e53e3e'
          }}
        >
          {won ? 'Celebrate! 🎉' : 'Try Again 💪'}
        </CloseButton>
      </Modal>
    </AnimatePresence>
  );
}

export default CompletionModal;