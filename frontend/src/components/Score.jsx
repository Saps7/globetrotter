import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ScoreContainer = styled(motion.div)`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 280px;
`;

const PlayerName = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  span {
    color: #4299e1;
    font-weight: 600;
  }
`;

const ScoreLabel = styled.div`
  font-size: 1rem;
  color: ${props => props.isCompleted ? '#48bb78' : '#4a5568'};
  font-weight: 500;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.isCompleted ? '#48bb78' : '#2d3748'};
  
  span {
    font-size: 1.8rem;
    opacity: 0.7;
  }
`;

const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LogoutButton = styled(motion.button)`
  background: transparent;
  color: #718096;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: #EDF2F7;
    color: #4A5568;
  }
`;

function Score({ score, username, isCompleted }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove userId from URL and redirect to registration
    navigate('/', { replace: true });
    // Force a page reload to reset all states
    window.location.reload();
  };

  return (
    <ScoreContainer
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ScoreHeader>
        <PlayerName>
          🎮 <span>{username}</span>
        </PlayerName>
        <LogoutButton
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>👋</span> Logout
        </LogoutButton>
      </ScoreHeader>
      <ScoreLabel isCompleted={isCompleted}>
        {isCompleted ? 'Final Score' : 'Current Score'}
      </ScoreLabel>
      <ScoreValue isCompleted={isCompleted}>
        {score.correct}<span>/{score.total}</span>
      </ScoreValue>
    </ScoreContainer>
  );
}

export default Score;