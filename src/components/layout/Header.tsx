import { useState } from 'react';
import { Search, Bell, User, LogOut, Menu, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SearchOverlay } from '../SearchOverlay';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  unreadNotifications?: number;
  breadcrumbs?: { label: string; href?: string }[];
  onMobileMenuClick?: () => void;
  onNavigate?: (id: string) => void;
}

export function Header({
  userName = 'Michael Schmidt',
  userRole = 'Außendienst',
  unreadNotifications = 0,
  breadcrumbs = [],
  onMobileMenuClick,
  onNavigate,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavigate = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-background px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
        
        {/* Mobile Menu Trigger */}
        <div className="md:hidden mr-2">
          <Button variant="ghost" size="icon" onClick={onMobileMenuClick}>
              <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex-1 overflow-hidden">
          <Breadcrumb>
            <BreadcrumbList className="flex-nowrap whitespace-nowrap">
              {breadcrumbs.length === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem className={index === breadcrumbs.length - 1 ? "font-semibold" : "hidden sm:inline-flex"}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="truncate max-w-[150px] sm:max-w-none">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href || '#'}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 md:gap-2 ml-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Suche"
            className="hidden sm:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" aria-label="Benachrichtigungen">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="pl-2 pr-2 gap-2 rounded-full h-9">
                 <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate('einstellungen')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('einstellungen')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <SearchOverlay 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
        onNavigate={handleNavigate} 
      />
    </>
  );
}
