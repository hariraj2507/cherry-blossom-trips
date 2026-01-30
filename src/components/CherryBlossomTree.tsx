interface CherryBlossomTreeProps {
  side: 'left' | 'right';
}

export function CherryBlossomTree({ side }: CherryBlossomTreeProps) {
  const isRight = side === 'right';
  
  return (
    <div 
      className={`fixed ${isRight ? 'right-0' : 'left-0'} bottom-0 pointer-events-none z-0 opacity-40`}
      style={{ transform: isRight ? 'scaleX(-1)' : 'none' }}
    >
      <svg width="300" height="500" viewBox="0 0 300 500" className="w-48 md:w-72">
        {/* Tree trunk with gentle sway animation */}
        <g className="animate-tree-sway origin-bottom">
          <path 
            d="M150 500 Q140 400 130 350 Q120 300 140 250 Q130 200 150 150" 
            stroke="hsl(var(--foreground))" 
            strokeWidth="12" 
            fill="none"
            opacity="0.6"
          />
          {/* Main branches */}
          <path d="M150 250 Q200 220 250 200" stroke="hsl(var(--foreground))" strokeWidth="6" fill="none" opacity="0.5"/>
          <path d="M140 300 Q80 270 30 250" stroke="hsl(var(--foreground))" strokeWidth="5" fill="none" opacity="0.5"/>
          <path d="M145 200 Q180 170 220 150" stroke="hsl(var(--foreground))" strokeWidth="4" fill="none" opacity="0.5"/>
          <path d="M150 180 Q110 140 70 120" stroke="hsl(var(--foreground))" strokeWidth="4" fill="none" opacity="0.5"/>
          <path d="M150 150 Q170 100 200 80" stroke="hsl(var(--foreground))" strokeWidth="3" fill="none" opacity="0.5"/>
          
          {/* Blossom clusters with pulse animation */}
          <g className="animate-blossom-pulse">
            {/* Right branch blossoms */}
            <circle cx="250" cy="200" r="15" fill="hsl(var(--primary))" opacity="0.7"/>
            <circle cx="240" cy="185" r="12" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
            <circle cx="260" cy="190" r="10" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
            <circle cx="235" cy="210" r="8" fill="hsl(var(--primary))" opacity="0.5"/>
            
            {/* Left branch blossoms */}
            <circle cx="30" cy="250" r="14" fill="hsl(var(--primary))" opacity="0.7"/>
            <circle cx="50" cy="240" r="11" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
            <circle cx="40" cy="265" r="9" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
            <circle cx="20" cy="235" r="7" fill="hsl(var(--primary))" opacity="0.5"/>
            
            {/* Upper right blossoms */}
            <circle cx="220" cy="150" r="13" fill="hsl(var(--primary))" opacity="0.7"/>
            <circle cx="205" cy="140" r="10" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
            <circle cx="230" cy="140" r="8" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
            
            {/* Upper left blossoms */}
            <circle cx="70" cy="120" r="12" fill="hsl(var(--primary))" opacity="0.7"/>
            <circle cx="85" cy="110" r="9" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
            <circle cx="55" cy="130" r="7" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
            
            {/* Top blossoms */}
            <circle cx="200" cy="80" r="11" fill="hsl(var(--primary))" opacity="0.7"/>
            <circle cx="190" cy="70" r="8" fill="hsl(350, 80%, 80%)" opacity="0.8"/>
            <circle cx="210" cy="90" r="6" fill="hsl(350, 70%, 85%)" opacity="0.6"/>
          </g>
          
          {/* Floating petals with individual animations */}
          <circle cx="180" cy="180" r="5" fill="hsl(var(--primary))" opacity="0.4" className="animate-float-petal-1"/>
          <circle cx="100" cy="200" r="4" fill="hsl(350, 80%, 80%)" opacity="0.5" className="animate-float-petal-2"/>
          <circle cx="160" cy="220" r="6" fill="hsl(350, 70%, 85%)" opacity="0.4" className="animate-float-petal-3"/>
          <circle cx="120" cy="280" r="5" fill="hsl(var(--primary))" opacity="0.3" className="animate-float-petal-4"/>
          <circle cx="200" cy="160" r="4" fill="hsl(350, 80%, 80%)" opacity="0.4" className="animate-float-petal-5"/>
        </g>
      </svg>
    </div>
  );
}
