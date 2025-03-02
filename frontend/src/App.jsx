import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Quiz from './components/Quiz';
import Score from './components/Score';
import UserRegistration from './components/UserRegistration';
import ShareButton from './components/ShareButton';
import styled from '@emotion/styled';
import CompletionModal from './components/CompletionModal';

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

const RestartButton = styled(motion.button)`
  background: #805ad5;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(128, 90, 213, 0.2);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;

  &:hover {
    background: #6b46c1;
    box-shadow: 0 6px 8px rgba(128, 90, 213, 0.3);
  }

  span {
    font-size: 1.3rem;
  }
`;

function App() {
  const [searchParams] = useSearchParams();
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [user, setUser] = useState(null);
  const [inviterId, setInviterId] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [inviterData, setInviterData] = useState(null);

  useEffect(() => {
    // Check for inviter's ID in URL params
    const id = searchParams.get('inviterId');
    if (id) {
      setInviterId(id);
      // Fetch inviter's data
      fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setInviterData(data);
          }
        })
        .catch(err => console.error('Error fetching inviter data:', err));
    }

    // Check for user's ID in URL params
    const userId = searchParams.get('userId');
    if (userId) {
      // Fetch user data if ID exists
      fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`)
        .then(res => res.json())
        .then(userData => setUser(userData))
        .catch(err => console.error('Error fetching user:', err));
    }
  }, [searchParams]);

  const handleQuizComplete = async (finalScore) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          score: {
            correct: finalScore.correct,
            total: finalScore.total
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to update score');
      const updatedUser = await response.json();
      setUser(updatedUser);
      
      // Show completion modal only after updating the score
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleRestart = () => {
    setScore({ correct: 0, total: 0 });
    setQuizCompleted(false);
    setShowCompletionModal(false);
  };

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
          <UserRegistration 
            setUser={setUser} 
            inviterId={inviterId}
            inviterData={inviterData} // Pass inviter data
          />
        ) : (
          <>
            <Score 
              score={score} 
              username={user.username} 
              isCompleted={quizCompleted}
            />
            <Quiz 
              score={score}
              setScore={setScore}
              onComplete={handleQuizComplete}
              isCompleted={quizCompleted}
              setShowCompletionModal={setShowCompletionModal}
            />
            {quizCompleted && (
              <RestartButton
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🔄</span> Start New Quiz
              </RestartButton>
            )}
            <ShareButton 
              user={user} 
              score={score} 
              disabled={!quizCompleted}
            />
          </>
        )}
      </ContentWrapper>

      {showCompletionModal && (
        <CompletionModal
          score={score}
          onClose={() => setShowCompletionModal(false)}
          inviterScore={inviterData}
        />
      )}
    </AppContainer>
  );
}

export default App;