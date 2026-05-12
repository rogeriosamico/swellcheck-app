import React from 'react';
import { cn } from "@/lib/utils";
import { ChevronLeft, Share, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = ({ variant = 'default', title, locationLabel, showShare = false, onBack, onShare, className }) => {
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
        <div className="flex items-center gap-2">
          <h1 className="text-token-title text-[var(--text-primary)] leading-normal">
            Swell Check
          </h1>
        </div>
      ) : variant === 'location' ? (
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          <div className="flex items-center gap-1 text-token-subtitle text-[var(--text-secondary)]">
            <MapPin size={14} />
            <span>{locationLabel || 'Localização ativa'}</span>
          </div>
          <h1 className="text-token-title text-[var(--text-primary)] leading-normal">
            Swell Check
          </h1>
        </div>
      ) : (
        // Beach variant - back button, beach name, share
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-[var(--touch-target)] w-[var(--touch-target)]"
            onClick={onBack}
          >
            <ChevronLeft size={18} />
          </Button>

          <h1 className="text-token-title text-[var(--text-primary)] whitespace-nowrap leading-normal">
            {title || 'Nome da Praia'}
          </h1>

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