import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

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

function CompletionModal({ score, onClose }) {
  return (
    <AnimatePresence>
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
        <Title>🎉 Amazing!</Title>
        <Message>You have completed your quiz.</Message>
        <Message>Your final score is:</Message>
        <ScoreDisplay score={score.correct}>
          {score.correct}/{score.total}
        </ScoreDisplay>
        <CloseButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          Close Quiz
        </CloseButton>
      </Modal>
    </AnimatePresence>
  );
}

export default CompletionModal;