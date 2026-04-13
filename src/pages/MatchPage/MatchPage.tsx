import { Link, useParams } from 'react-router-dom';

import { BoardPreview } from '../../features/game/components/BoardPreview';
import { GuessComposer } from '../../features/game/components/GuessComposer';
import { Keyboard } from '../../features/game/components/Keyboard';
import { MatchSummary } from '../../features/game/components/MatchSummary';
import { useLiveMatch } from '../../features/game/hooks/useLiveMatch';
import styles from './MatchPage.module.css';

export function MatchPage() {
  const { roomCode = '' } = useParams();
  const {
    room,
    liveMatch,
    currentGuess,
    timerSeconds,
    yourBoard,
    opponentBoard,
    keyboardState,
    statusMessage,
    canSubmit,
    isSubmitting,
    isLoading,
    error,
    yourName,
    opponentName,
    opponentTimerSeconds,
    handleGuessChange,
    handleKeyPress,
    submitGuess,
  } = useLiveMatch(roomCode);

  if (isLoading) {
    return (
      <section className={styles.layout}>
        <div className={styles.footerCard}>
          <div>
            <p className={styles.footerKicker}>Loading Match</p>
            <h3 className={styles.footerHeading}>Syncing room and match state...</h3>
          </div>
        </div>
      </section>
    );
  }

  if (error || !room || !liveMatch) {
    return (
      <section className={styles.layout}>
        <div className={styles.footerCard}>
          <div>
            <p className={styles.footerKicker}>Match Unavailable</p>
            <h3 className={styles.footerHeading}>This room is not ready for live guessing yet.</h3>
            <p className={styles.footerText}>{error ?? 'Both players need to lock words before guesses can start.'}</p>
          </div>
          <div className={styles.actions}>
            <Link className={styles.secondaryAction} to={`/room/${roomCode.toUpperCase()}`}>
              Back to Lobby
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.layout}>
      <MatchSummary
        roomCode={room.code}
        yourName={yourName}
        opponentName={opponentName}
        timerSeconds={timerSeconds}
        maskedWord={`You ${timerSeconds}s | Opponent ${opponentTimerSeconds}s`}
        statusLabel={liveMatch.status === 'finished' ? 'Match Finished' : 'Live Match'}
      />

      <div className={styles.boardGrid}>
        <BoardPreview
          title="Your Guesses"
          subtitle={`${yourName} vs opponent word`}
          rows={yourBoard}
          currentGuess={currentGuess}
        />
        <BoardPreview
          title="Opponent Progress"
          subtitle={`${opponentName} vs your word`}
          rows={opponentBoard}
        />
      </div>

      <div className={styles.interactionGrid}>
        <GuessComposer
          currentGuess={currentGuess}
          statusMessage={statusMessage}
          canSubmit={canSubmit}
          isDisabled={liveMatch.status !== 'active' || isSubmitting}
          onChange={handleGuessChange}
          onSubmit={submitGuess}
        />
        <Keyboard keyStates={keyboardState} onKeyPress={handleKeyPress} />
      </div>

      <div className={styles.footerCard}>
        <div>
          <p className={styles.footerKicker}>Live Round</p>
          <h3 className={styles.footerHeading}>Guesses now persist in Supabase and update both boards in real time.</h3>
          <p className={styles.footerText}>
            Guess validation and scoring now come from the backend. When the
            round ends, head back to the lobby to start the next round with the
            same room and a fresh pair of secret words.
          </p>
        </div>

        <div className={styles.actions}>
          <Link className={styles.secondaryAction} to={`/room/${room.code}`}>
            Back to Lobby
          </Link>
        </div>
      </div>
    </section>
  );
}
