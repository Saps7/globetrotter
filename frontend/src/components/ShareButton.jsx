import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

const ShareContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const ShareButtonStyled = styled(motion.button)`
  padding: 0.85rem 2rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(72, 187, 120, 0.2);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #38a169;
    box-shadow: 0 6px 8px rgba(72, 187, 120, 0.3);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ShareCard = styled.div`
  position: fixed;
  left: -9999px;  // Hide off-screen but keep in DOM
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 1rem;
  width: 600px;
  height: 315px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
`;

const ShareTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ShareScore = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  margin: 1rem 0;
`;

const ShareUsername = styled.div`
  font-size: 1.5rem;
  opacity: 0.9;
`;

const DisabledMessage = styled(motion.div)`
  color: #4b5563;
  font-size: 0.9rem;
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

function ShareButton({ user, score, disabled }) {
  const [sharing, setSharing] = useState(false);

  const generateShareImage = async () => {
    const element = document.querySelector('.share-content');
    const canvas = await html2canvas(element);
    return canvas.toDataURL('image/png');
  };

  const handleShare = async () => {
    if (disabled) {
      alert('Please complete your 5 questions first!');
      return;
    }
    
    setSharing(true);
    try {
      // Use the MongoDB _id from user object
      const shareUrl = `${window.location.origin}?inviterId=${user._id}`;
      const imageUrl = await generateShareImage();

      if (navigator.share) {
        await navigator.share({
          title: 'Challenge: Globetrotter Quiz',
          text: `Can you beat ${user.username}'s score of ${score.correct}/${score.total}?`,
          url: shareUrl
        });
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `🌍 Challenge: Globetrotter Quiz\n\n` +
          `Can you beat ${user.username}'s score of ${score.correct}/${score.total}?\n\n` +
          `Take the challenge: ${shareUrl}`
        )}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      {/* Hidden share card that will be captured */}
      <div className="share-content">
        <ShareCard>
          <ShareTitle>🌍 Globetrotter Quiz</ShareTitle>
          <ShareUsername>{user.username}'s Score</ShareUsername>
          <ShareScore>
            {score.correct}/{score.total}
          </ShareScore>
          <div>Can you beat this score?</div>
        </ShareCard>
      </div>

      <ShareContainer>
        <ShareButtonStyled
          onClick={handleShare}
          disabled={disabled || sharing}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          {sharing ? (
            <>⏳ Sharing...</>
          ) : (
            <>🎮 Challenge a Friend</>
          )}
        </ShareButtonStyled>
        
        {disabled && (
          <DisabledMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>⚡</span> Complete the quiz (5 questions) to unlock
          </DisabledMessage>
        )}
      </ShareContainer>
    </>
  );
}

export default ShareButton;