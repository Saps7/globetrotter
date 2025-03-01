import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import Confetti from 'react-confetti';

const Modal = styled(motion.div)`
  position: fixed;
  top: 30%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 90%;
  margin: 0 auto;
  z-index: 1000;
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
  return (
    <>
      {isCorrect && <Confetti recycle={false} numberOfPieces={200} />}
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
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