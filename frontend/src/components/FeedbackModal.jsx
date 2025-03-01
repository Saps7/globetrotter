import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import Confetti from 'react-confetti';

const Modal = styled(motion.div)`
  position: fixed;
  top: 35%;
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
    width: 90%;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    width: 95%;
  }
`;

const ConfettiWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
  pointer-events: none; // This allows clicks to pass through
`;

// Add an overlay to dim the background
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const NextButton = styled(motion.button)`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
`;

function FeedbackModal({ isCorrect, funFact, onNext }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onNext();
    }
  };
  return (
    <>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      />
      {isCorrect && (
        <ConfettiWrapper>
          <Confetti
            recycle={false}
            numberOfPieces={200}
          />
        </ConfettiWrapper>
      )}
      <Modal
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
        >
          {isCorrect ? "🎉" : "😢"}
        </motion.div>
        <h2>{isCorrect ? "Correct!" : "Not quite..."}</h2>
        <p>{funFact}</p>
        <NextButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
        >
          Next Question
        </NextButton>
      </Modal>
    </>
  );
}

export default FeedbackModal;