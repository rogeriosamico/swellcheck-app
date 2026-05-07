import React from 'react';
import { cn } from "@/lib/utils";
import { ChevronLeft, Share } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = ({ variant = 'default', title, showShare = false, onBack, onShare, className }) => {
  const isBeach = variant === 'beach';
  
  return (
    <header 
      className={cn(
        "flex items-start w-full p-[var(--spacing-md)]",
        isBeach ? "border-b border-[var(--border-primary)] justify-between" : "flex-col gap-[var(--spacing-xs)]",
        className
      )}
    >
      {variant === 'default' ? (
        // Home variant - Only title
        <div className="flex items-center gap-2">
          <h1 className="text-token-title text-[var(--text-primary)] leading-normal">
            Swell Check
          </h1>
        </div>
      ) : (
        // Beach variant - Logo, beach name, menu
        <div className="flex items-center justify-between w-full">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-[var(--touch-target)] w-[var(--touch-target)]"
            onClick={onBack}
          >
            <ChevronLeft size={18} />
          </Button>
          
          {/* Beach name */}
          <h1 className="text-token-title text-[var(--text-primary)] whitespace-nowrap leading-normal">
            {title || 'Nome da Praia'}
          </h1>
          
          {/* Share button */}
          {showShare ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-[var(--touch-target)] w-[var(--touch-target)]"
              onClick={onShare}
            >
              <Share size={18} />
            </Button>
          ) : (
            <div className="h-[var(--touch-target)] w-[var(--touch-target)]" />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;