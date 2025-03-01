import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Quiz from './components/Quiz';
import Score from './components/Score';
import UserRegistration from './components/UserRegistration';
import ShareButton from './components/ShareButton';
import styled from '@emotion/styled';

const AppContainer = styled.div`
  overflow-x: hidden;
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
  padding: 2rem 0;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;

    @media (max-width: 768px) {
      padding: 0;
      width: 100%;
    }
`;

const Title = styled(motion.h1)`
  color: #2d3748;
  font-size: 2.5rem;
  margin: 0;
  text-align: center;
`;

function App() {
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [user, setUser] = useState(null);
  const [inviterId, setInviterId] = useState(null);

  useEffect(() => {
    // Check for inviter's ID in URL params
    const params = new URLSearchParams(window.location.search);
    const id = params.get('inviterId');
    if (id) setInviterId(id);
  }, []);

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
        
        {!user ? (
          <UserRegistration setUser={setUser} inviterId={inviterId} />
        ) : (
          <>
            <Score score={score} username={user.username} />
            <Quiz setScore={setScore} />
            <ShareButton user={user} score={score} />
          </>
        )}
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;