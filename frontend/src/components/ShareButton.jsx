import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

const ShareContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const ShareButtonStyled = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

function ShareButton({ user, score }) {
  const [sharing, setSharing] = useState(false);

  const generateShareImage = async () => {
    const element = document.querySelector('.share-content');
    const canvas = await html2canvas(element);
    return canvas.toDataURL('image/png');
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const shareUrl = `${window.location.origin}?inviterId=${user.id}`;
      const imageUrl = await generateShareImage();

      if (navigator.share) {
        await navigator.share({
          title: 'Challenge: Globetrotter Quiz',
          text: `Can you beat ${user.username}'s score of ${score.correct}/${score.total}? Take the challenge!`,
          url: shareUrl
        });
      } else {
        // Fallback to WhatsApp share
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `🌍 Challenge: Globetrotter Quiz\n\nCan you beat ${user.username}'s score of ${score.correct}/${score.total}?\n\nTake the challenge: ${shareUrl}`
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
          disabled={sharing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sharing ? 'Sharing...' : '🎮 Challenge a Friend'}
        </ShareButtonStyled>
      </ShareContainer>
    </>
  );
}

export default ShareButton;