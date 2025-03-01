import { useState } from 'react';
import { motion } from 'framer-motion';
import Quiz from './components/Quiz';
import Score from './components/Score';
import styled from '@emotion/styled';

const AppContainer = styled.div`
  // min-height: 100vh;
  // width: 100%;
  overflow-x: hidden;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const ContentWrapper = styled.div`
  width: min(100%, 800px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  color: #2d3748;
  font-size: 2.5rem;
  margin: 0;
  text-align: center;
`;

function App() {
  const [score, setScore] = useState({ correct: 0, total: 0 });

  return (
    <AppContainer>
      <ContentWrapper>
        <Title
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🌍 Globetrotter Quiz
        </Title>
        <Score score={score} />
        <Quiz setScore={setScore} />
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;