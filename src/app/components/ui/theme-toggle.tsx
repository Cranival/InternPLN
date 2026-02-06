import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button 
      onClick={toggleTheme}
      className={`
        relative flex items-center
        w-[60px] h-8 p-1 rounded-full
        transition-all duration-300 ease-in-out
        cursor-pointer
        ${isDark 
          ? 'bg-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' 
          : 'bg-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
        }
      `}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {/* Sliding Circle with Icon */}
      <div className={`
        absolute flex items-center justify-center
        w-6 h-6 rounded-full
        transition-all duration-300 ease-in-out
        shadow-lg
        ${isDark 
          ? 'left-[calc(100%-28px)] bg-slate-600' 
          : 'left-1 bg-amber-400'
        }
      `}>
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-slate-200" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-white" />
        )}
      </div>
      
      {/* Background Icons (inactive state) */}
      <div className="flex items-center justify-between w-full px-1.5">
        <div className={`
          w-4 h-4 flex items-center justify-center
          transition-opacity duration-300
          ${isDark ? 'opacity-30' : 'opacity-0'}
        `}>
          <Sun className="h-3 w-3 text-slate-400" />
        </div>
        <div className={`
          w-4 h-4 flex items-center justify-center
          transition-opacity duration-300
          ${!isDark ? 'opacity-30' : 'opacity-0'}
        `}>
          <Moon className="h-3 w-3 text-slate-500" />
        </div>
      </div>
    </button>
  );
}
