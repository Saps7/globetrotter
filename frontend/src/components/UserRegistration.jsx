import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 400px;
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ToggleButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#4299e1' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4299e1'};
  border: 2px solid #4299e1;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#3182ce' : '#ebf8ff'};
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.2);

  &:hover {
    background: #3182ce;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ChallengePopup = styled(motion.div)`
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
  backdrop-filter: blur(4px);
`;

const ChallengeScore = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #4299e1;
  margin: 1rem 0;
`;

function UserRegistration({ setUser, inviterId, inviterData }) {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showChallenge, setShowChallenge] = useState(false);
  const navigate = useNavigate();

  // Remove the inviterScore fetch since we're getting it from props
  useEffect(() => {
    if (inviterData) {
      setShowChallenge(true);
    }
  }, [inviterData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, inviterId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setUser(data);
      
      // Preserve existing query parameters and add userId
      const newParams = new URLSearchParams(searchParams);
      newParams.set('userId', data._id);
      navigate(`/?${newParams.toString()}`, { replace: true });
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormContainer>
        <ToggleContainer>
          <ToggleButton
            active={isLogin}
            onClick={() => setIsLogin(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </ToggleButton>
          <ToggleButton
            active={!isLogin}
            onClick={() => setIsLogin(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </ToggleButton>
        </ToggleContainer>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </Form>
      </FormContainer>

      {showChallenge && inviterData && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowChallenge(false)}
          />
          <ChallengePopup
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2>🏆 Score Challenge!</h2>
            <p>Can you beat {inviterData.username}'s score?</p>
            <ChallengeScore>
              {inviterData.score.correct}/{inviterData.score.total}
            </ChallengeScore>
            <Button
              onClick={() => setShowChallenge(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Accept Challenge
            </Button>
          </ChallengePopup>
        </>
      )}
    </>
  );
}

export default UserRegistration;