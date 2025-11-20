import React, { useState, useEffect, useRef } from 'react';
import { Delete, History, Calculator as CalcIcon, X } from 'lucide-react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);
  const displayRef = useRef(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      
      if (/[0-9]/.test(key)) handleNumber(key);
      if (['+', '-', '*', '/', '%'].includes(key)) handleOperator(key);
      if (key === 'Enter' || key === '=') handleEqual();
      if (key === 'Backspace') handleDelete();
      if (key === 'Escape') handleClear();
      if (key === '.') handleDecimal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, equation, justCalculated]);

  // Auto-scroll display if text gets too long
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [display]);

  const handleNumber = (num) => {
    if (justCalculated) {
      setDisplay(num);
      setEquation('');
      setJustCalculated(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (justCalculated) {
      setDisplay('0.');
      setEquation('');
      setJustCalculated(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op) => {
    if (justCalculated) {
      setEquation(`${display} ${op} `);
      setJustCalculated(false);
      setDisplay('0');
    } else {
      setEquation(`${display} ${op} `);
      setDisplay('0');
    }
  };

  const handleDelete = () => {
    if (justCalculated) {
      setDisplay('0');
      setEquation('');
      setJustCalculated(false);
      return;
    }
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setJustCalculated(false);
  };

  const handleEqual = () => {
    if (!equation && display === '0') return;

    const fullExpression = equation + display;
    
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + fullExpression)();
      const formattedResult = Math.round(result * 100000000) / 100000000;
      
      const newHistoryItem = {
        calculation: fullExpression,
        result: formattedResult.toString()
      };

      setHistory([newHistoryItem, ...history].slice(0, 20));
      setDisplay(formattedResult.toString());
      setEquation('');
      setJustCalculated(true);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
      setJustCalculated(true);
    }
  };

  const Button = ({ label, onClick, type = 'default', className = '' }) => {
    // Responsive sizing: smaller on mobile (h-14), regular (h-16), larger on tablet/desktop (md:h-20)
    const baseStyles = "relative h-14 sm:h-16 md:h-20 text-xl sm:text-2xl md:text-3xl font-medium rounded-2xl transition-all duration-200 active:scale-90 flex items-center justify-center select-none overflow-hidden group";
    
    const variants = {
      default: "bg-slate-800/50 text-white hover:bg-slate-700/60 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px]",
      operator: "bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500 shadow-[0_4px_0_0_#b45309] active:shadow-none active:translate-y-[4px]",
      action: "bg-slate-400/20 text-cyan-200 hover:bg-slate-400/30 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px]",
      equal: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-[0_4px_0_0_#0e7490] active:shadow-none active:translate-y-[4px]"
    };

    return (
      <button 
        onClick={onClick}
        className={`${baseStyles} ${variants[type]} ${className}`}
      >
        <span className="relative z-10">{label}</span>
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl pointer-events-none"></div>
      </button>
    );
  };

  return (
    // Animated background gradient
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-cyan-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Responsive Container: widths adapt from mobile to desktop */}
      <div className="w-full max-w-[320px] sm:max-w-sm md:max-w-md bg-slate-900/60 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden ring-1 ring-white/5 transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 text-slate-400">
          <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-slate-300">
            <CalcIcon size={16} className="text-cyan-400" />
            <span>CALCULATOR</span>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-300 ${showHistory ? 'text-cyan-400 bg-white/5 shadow-inner' : 'hover:text-white'}`}
          >
            <History size={20} />
          </button>
        </div>

        {/* Display Screen - Height and Text Size scale responsively */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-right flex flex-col justify-end h-32 sm:h-40 md:h-48 relative z-10">
          <div className="text-slate-400 text-base sm:text-lg min-h-[1.75rem] font-medium mb-2 truncate transition-all opacity-80">
            {equation}
          </div>
          <div 
            ref={displayRef}
            className={`text-white font-light transition-all overflow-x-auto no-scrollbar whitespace-nowrap drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] 
              ${display.length > 10 
                ? 'text-3xl sm:text-4xl md:text-5xl' 
                : 'text-5xl sm:text-6xl md:text-7xl'}`}
          >
            {display}
          </div>
        </div>

        {/* History Overlay with Glassmorphism */}
        <div className={`absolute inset-0 bg-slate-900/90 backdrop-blur-md z-30 transition-all duration-300 ease-in-out ${showHistory ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'}`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold text-lg tracking-wide">History</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setHistory([])}
                  className="text-xs text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors border border-red-400/20"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-60">
                  <History size={48} strokeWidth={1} />
                  <p>No history yet</p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-4 rounded-2xl text-right border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                       onClick={() => {
                         setDisplay(item.result);
                         setShowHistory(false);
                       }}>
                    <div className="text-slate-400 text-sm mb-1 group-hover:text-cyan-200 transition-colors">{item.calculation} =</div>
                    <div className="text-white text-xl font-medium">{item.result}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Keypad Area */}
        <div className="p-4 sm:p-5 bg-slate-950/40 backdrop-blur-md rounded-t-[2rem] sm:rounded-t-[2.5rem] border-t border-white/5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            <Button label="AC" type="action" onClick={handleClear} className="text-cyan-300" />
            <Button label={<Delete size={24}/>} type="action" onClick={handleDelete} className="text-cyan-300" />
            <Button label="%" type="action" onClick={() => handleOperator('%')} className="text-cyan-300" />
            <Button label="÷" type="operator" onClick={() => handleOperator('/')} />

            <Button label="7" onClick={() => handleNumber('7')} />
            <Button label="8" onClick={() => handleNumber('8')} />
            <Button label="9" onClick={() => handleNumber('9')} />
            <Button label="×" type="operator" onClick={() => handleOperator('*')} />

            <Button label="4" onClick={() => handleNumber('4')} />
            <Button label="5" onClick={() => handleNumber('5')} />
            <Button label="6" onClick={() => handleNumber('6')} />
            <Button label="-" type="operator" onClick={() => handleOperator('-')} />

            <Button label="1" onClick={() => handleNumber('1')} />
            <Button label="2" onClick={() => handleNumber('2')} />
            <Button label="3" onClick={() => handleNumber('3')} />
            <Button label="+" type="operator" onClick={() => handleOperator('+')} />

            <Button label="0" onClick={() => handleNumber('0')} className="col-span-2 w-full" />
            <Button label="." onClick={handleDecimal} />
            <Button label="=" type="equal" onClick={handleEqual} />
          </div>
        </div>
      </div>
    </div>
  );
}