import { Link, useParams } from 'react-router-dom';

import { BoardPreview } from '../../features/game/components/BoardPreview';
import { GuessComposer } from '../../features/game/components/GuessComposer';
import { Keyboard } from '../../features/game/components/Keyboard';
import { MatchSummary } from '../../features/game/components/MatchSummary';
import { useMockMatch } from '../../features/game/hooks/useMockMatch';
import styles from './MatchPage.module.css';

export function MatchPage() {
  const { roomCode = '' } = useParams();
  const {
    match,
    currentGuess,
    timerSeconds,
    yourBoard,
    opponentBoard,
    keyboardState,
    statusMessage,
    canSubmit,
    handleGuessChange,
    handleKeyPress,
    submitGuess,
  } = useMockMatch(roomCode);

  return (
    <section className={styles.layout}>
      <MatchSummary
        roomCode={match.roomCode}
        yourName={match.yourName}
        opponentName={match.opponentName}
        timerSeconds={timerSeconds}
        maskedWord="• • • • •"
      />

      <div className={styles.boardGrid}>
        <BoardPreview
          title="Your Guesses"
          subtitle={`${match.yourName} vs opponent word`}
          rows={yourBoard}
          currentGuess={currentGuess}
        />
        <BoardPreview
          title="Opponent Progress"
          subtitle={`${match.opponentName} vs your word`}
          rows={opponentBoard}
        />
      </div>

      <div className={styles.interactionGrid}>
        <GuessComposer
          currentGuess={currentGuess}
          statusMessage={statusMessage}
          canSubmit={canSubmit}
          onChange={handleGuessChange}
          onSubmit={submitGuess}
        />
        <Keyboard keyStates={keyboardState} onKeyPress={handleKeyPress} />
      </div>

      <div className={styles.footerCard}>
        <div>
          <p className={styles.footerKicker}>Next Slice</p>
          <h3 className={styles.footerHeading}>This mock match now supports local guesses and turn progression.</h3>
          <p className={styles.footerText}>
            The next step is swapping this local state machine for shared
            Supabase-backed room and match state.
          </p>
        </div>

        <div className={styles.actions}>
          <Link className={styles.secondaryAction} to={`/room/${match.roomCode}`}>
            Back to Lobby
          </Link>
        </div>
      </div>
    </section>
  );
}
