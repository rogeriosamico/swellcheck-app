import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { ChevronLeft, Share, MapPin, Heart, Menu as MenuIcon, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";

const Header = ({
  variant = 'default',
  title,
  locationLabel,
  // beach variant
  showFavorite = false,
  isFavorited = false,
  onFavorite,
  onShare,
  // shared
  onBack,
  onFavorites,
  className,
}) => {
  const isBeach = variant === 'beach';
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    ...(onFavorites ? [{ label: 'Ver favoritos', icon: <Heart size={16} />, onClick: onFavorites }] : []),
    ...(onShare ? [{ label: 'Compartilhar', icon: <Share size={16} />, onClick: onShare }] : []),
    ...(user ? [{ label: 'Sair', icon: <LogOut size={16} />, onClick: handleLogout }] : []),
  ];

  const Menu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-[var(--touch-target)] w-[var(--touch-target)] [&_svg]:!size-[22px]"
          aria-label="Menu"
        >
          <MenuIcon size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuItems.map(({ label, icon, onClick }) => (
          <DropdownMenuItem key={label} onClick={onClick}>
            {icon}
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isBeach) {
    return (
      <header className={cn("flex items-start w-full p-[var(--spacing-md)] border-b border-[var(--border-primary)] justify-between", className)}>
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-[var(--touch-target)] w-[var(--touch-target)] shrink-0 [&_svg]:!size-[22px]"
            onClick={onBack}
            aria-label="Voltar"
          >
            <ChevronLeft size={22} />
          </Button>

          <div className="flex items-center gap-1 flex-1 min-w-0 justify-center">
            <h1
              className="text-token-title text-[var(--text-primary)] whitespace-nowrap leading-normal overflow-hidden text-ellipsis"
              title={title}
            >
              {title || 'Nome da Praia'}
            </h1>
            {showFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-[var(--touch-target)] w-[var(--touch-target)] shrink-0 [&_svg]:!size-[22px]"
                onClick={onFavorite}
                aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart
                  size={22}
                  fill={isFavorited ? 'currentColor' : 'none'}
                  className={isFavorited ? 'text-[var(--text-storm)]' : 'text-[var(--text-primary)]'}
                />
              </Button>
            )}
          </div>

          <Menu />
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "flex items-center justify-between w-full p-[var(--spacing-md)]",
        className
      )}
    >
      {variant === 'default' ? (
        <div className="flex items-center gap-2">
          <h1 className="text-token-title text-[var(--text-primary)] leading-normal">
            Swell Check
          </h1>
        </div>
      ) : (
        // location variant
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          <div className="flex items-center gap-1 text-token-subtitle text-[var(--text-secondary)]">
            <MapPin size={14} />
            <span>{locationLabel || 'Localização ativa'}</span>
          </div>
          <h1 className="text-token-title text-[var(--text-primary)] leading-normal">
            Swell Check
          </h1>
        </div>
      )}
      <Menu />
    </header>
  );
};

export default Header;
