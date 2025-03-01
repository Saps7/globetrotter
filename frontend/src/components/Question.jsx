import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
`;

const Clue = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #4a5568;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // Changed to always show 2 columns
  gap: 1rem;
  margin-top: 2rem;
  width: 100%; // Ensure full width
  max-width: 600px; // Limit maximum width for better readability
  margin-left: auto;
  margin-right: auto;
`;

const Option = styled(motion.button)`
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%; // Ensure buttons take full width of their grid cell

  &:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function Question({ clue, options, onAnswer, disabled }) {
  return (
    <QuestionContainer>
      <Clue
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        🤔 {clue}
      </Clue>
      <OptionsGrid>
        {options.map((option, index) => (
          <Option
            key={option}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option}
          </Option>
        ))}
      </OptionsGrid>
    </QuestionContainer>
  );
}

export default Question;