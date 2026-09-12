import { React } from './runtime.js';
import './reading.css';

// A sheet lifts from its spine and reveals the next face underneath.
// Retain the outgoing face during the turn so text never swaps mid-animation.
export function FlashcardPaper({ front, back, flipped, index, onFlip }) {
  const latest = { front, back, flipped, index };
  const previous = React.useRef(latest);
  const leaf = React.useRef(null);
  const [outgoing, setOutgoing] = React.useState(null);
  const [direction, setDirection] = React.useState('forward');
  React.useLayoutEffect(() => {
    const old = previous.current;
    previous.current = latest;
    if (old.front === front && old.back === back && old.flipped === flipped && old.index === index) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOutgoing(null); return; }
    setDirection(index === old.index ? (flipped ? 'forward' : 'backward') : index > old.index ? 'forward' : 'backward');
    setOutgoing(old);
  }, [front, back, flipped, index]);
  React.useLayoutEffect(() => {
    if (!outgoing || !leaf.current) return;
    const animation = leaf.current.animate([
      { transform: 'rotateY(0deg) skewY(0deg)', filter: 'brightness(1)', opacity: 1 },
      { transform: `rotateY(${direction === 'forward' ? '-' : ''}48deg) skewY(${direction === 'forward' ? '-' : ''}2deg)`, filter: 'brightness(.94)', opacity: 1, offset: .5 },
      { transform: `rotateY(${direction === 'forward' ? '-' : ''}112deg) skewY(0deg)`, filter: 'brightness(.82)', opacity: 0 }
    ], { duration: 680, easing: 'cubic-bezier(.3,.02,.22,1)', fill: 'forwards' });
    animation.onfinish = () => setOutgoing(null);
    return () => animation.cancel();
  }, [outgoing, direction]);
  const face = (state, isOld = false) => <div className={`flash-paper-face ${state.flipped ? 'answer' : 'question'}`}>
    <span className="flash-paper-label">{state.flipped ? 'Đáp án' : 'Câu hỏi'}</span>
    <p>{state.flipped ? state.back : state.front}</p>
    {!state.flipped && <small>Click hoặc nhấn Space để lật</small>}
    {isOld && <span className="flash-paper-shade" />}
  </div>;
  return <div className="flash-paper" data-testid="flashcard-paper" data-face={flipped ? 'answer' : 'question'} data-turning={!!outgoing}>
    <button type="button" className="flash-paper-button" aria-label={flipped ? 'Xem câu hỏi' : 'Lật xem đáp án'} onClick={onFlip}>
      {face(latest)}
    </button>
    {outgoing && <div ref={leaf} aria-hidden="true" className={`flash-paper-leaf ${direction}`}>{face(outgoing, true)}</div>}
  </div>;
}
