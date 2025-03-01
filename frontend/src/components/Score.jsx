import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const ScoreContainer = styled(motion.div)`
  margin-bottom: 2rem;
  font-size: 1.25rem;
`;

function Score({ score, username }) {
  return (
    <ScoreContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {username && <p>Player: {username}</p>}
      <p>Score: {score.correct}/{score.total}</p>
    </ScoreContainer>
  );
}

export default Score;