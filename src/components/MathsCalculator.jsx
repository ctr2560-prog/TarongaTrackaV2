import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function MathsCalculator() {
  const { classSubject } = useApp();
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [storedValue, setStoredValue] = useState(null);

  if (classSubject !== 'maths') return null;

  const inputDigit = (d) => {
    if (waitingForOperand) {
      setDisplay(String(d));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(d) : display + d);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) { setDisplay('0.'); setWaitingForOperand(false); return; }
    if (!display.includes('.')) setDisplay(display + '.');
  };

  const clear = () => {
    setDisplay('0');
    setWaitingForOperand(false);
    setPendingOperator(null);
    setStoredValue(null);
  };

  const toggleSign = () => setDisplay(d => d.startsWith('-') ? d.slice(1) : (d === '0' ? d : '-' + d));

  const percent = () => {
    const v = parseFloat(display);
    setDisplay(String(parseFloat((v / 100).toFixed(10))));
    setWaitingForOperand(false);
  };

  const calc = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : NaN;
      default:  return b;
    }
  };

  const performOperation = (op) => {
    const val = parseFloat(display);
    if (storedValue !== null && !waitingForOperand) {
      const result = calc(storedValue, val, pendingOperator);
      const str = Number.isFinite(result) ? String(parseFloat(result.toFixed(10))) : 'Error';
      setDisplay(str);
      setStoredValue(result);
    } else {
      setStoredValue(val);
    }
    setWaitingForOperand(true);
    setPendingOperator(op);
  };

  const equals = () => {
    if (pendingOperator === null || storedValue === null) return;
    const val    = parseFloat(display);
    const result = calc(storedValue, val, pendingOperator);
    const str    = Number.isFinite(result) ? String(parseFloat(result.toFixed(10))) : 'Error';
    setDisplay(str);
    setStoredValue(null);
    setWaitingForOperand(true);
    setPendingOperator(null);
  };

  const D = (bg, color = 'white') => ({
    padding: '0.7rem 0',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    background: bg,
    color,
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  });

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(46,125,85,0.08)', border: '1.5px solid rgba(46,125,85,0.3)', borderRadius: '10px', color: '#2E7D55', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', touchAction: 'manipulation' }}
      >
        🧮 Calculator {open ? '▲' : '▼'}
      </button>

      {open && (
        <div style={{ background: '#F4F9F4', border: '1.5px solid rgba(46,125,85,0.2)', borderRadius: '12px', padding: '0.65rem', marginTop: '0.4rem' }}>
          {/* Display */}
          <div style={{ background: 'white', border: '1px solid #D4E8DC', borderRadius: '8px', padding: '0.5rem 0.8rem', marginBottom: '0.55rem', textAlign: 'right', fontSize: '1.5rem', fontWeight: 700, color: '#1a3a2a', fontFamily: 'monospace', minHeight: '2.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {display}
          </div>

          {/* Buttons - standard 4×5 layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
            {/* Row 1 */}
            <button style={D('#6B7280', 'white')} onClick={clear}>C</button>
            <button style={D('#6B7280', 'white')} onClick={toggleSign}>±</button>
            <button style={D('#6B7280', 'white')} onClick={percent}>%</button>
            <button style={D('#2E7D55')} onClick={() => performOperation('÷')}>÷</button>

            {/* Row 2 */}
            {['7','8','9'].map(d => <button key={d} style={D('#F0F4F0', '#1a3a2a')} onClick={() => inputDigit(d)}>{d}</button>)}
            <button style={D('#C4873A')} onClick={() => performOperation('×')}>×</button>

            {/* Row 3 */}
            {['4','5','6'].map(d => <button key={d} style={D('#F0F4F0', '#1a3a2a')} onClick={() => inputDigit(d)}>{d}</button>)}
            <button style={D('#C4873A')} onClick={() => performOperation('−')}>−</button>

            {/* Row 4 */}
            {['1','2','3'].map(d => <button key={d} style={D('#F0F4F0', '#1a3a2a')} onClick={() => inputDigit(d)}>{d}</button>)}
            <button style={{ ...D('#C4873A'), gridRow: 'span 2' }} onClick={() => performOperation('+')}>+</button>

            {/* Row 5 */}
            <button style={{ ...D('#F0F4F0', '#1a3a2a'), gridColumn: 'span 2' }} onClick={() => inputDigit('0')}>0</button>
            <button style={D('#F0F4F0', '#1a3a2a')} onClick={inputDecimal}>.</button>

            {/* = - standalone last row */}
            <button style={{ ...D('#2E7D55'), gridColumn: 'span 4', marginTop: '0.05rem' }} onClick={equals}>=</button>
          </div>
        </div>
      )}
    </div>
  );
}
