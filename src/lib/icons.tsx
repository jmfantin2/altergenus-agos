import {
  Book,
  BookOpen,
  BookText,
  Bookmark,
  Scroll,
  FileText,
  Library,
  GraduationCap,
  Feather,
  PenTool,
  Quote,
  MessageSquareQuote,
  Theater,
  Drama,
  Music,
  Palette,
  Crown,
  Sword,
  Scale,
  Gavel,
  Heart,
  Brain,
  Lightbulb,
  Globe,
  Map,
  Compass,
  Mountain,
  Trees,
  Flower2,
  Sun,
  Moon,
  Star,
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Cloud,
  Anchor,
  Ship,
  Building,
  Castle,
  Church,
  Cross,
  Infinity,
  Circle,
  Triangle,
  Square,
  Hexagon,
  User,
  Users,
  Baby,
  Skull,
  Ghost,
  Cat,
  Dog,
  Bird,
  Fish,
  Bug,
  Leaf,
  Apple,
  Grape,
  Cherry,
  Folder,
  FolderOpen,
  Settings,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  Copy,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Search,
  Home,
  List,
  Grid,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Gift,
  DollarSign,
  CreditCard,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { ICON_STROKE_WIDTH } from './constants';

// ============================================================================
// ICON REGISTRY
// Maps string names to Lucide components
// ============================================================================

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  // Books & Reading
  book: Book,
  'book-open': BookOpen,
  'book-text': BookText,
  bookmark: Bookmark,
  scroll: Scroll,
  'file-text': FileText,
  library: Library,
  'graduation-cap': GraduationCap,
  
  // Writing
  feather: Feather,
  'pen-tool': PenTool,
  quote: Quote,
  'message-square-quote': MessageSquareQuote,
  
  // Arts
  theater: Theater,
  drama: Drama,
  music: Music,
  palette: Palette,
  
  // Power & Law
  crown: Crown,
  sword: Sword,
  scale: Scale,
  gavel: Gavel,
  
  // Abstract
  heart: Heart,
  brain: Brain,
  lightbulb: Lightbulb,
  
  // World
  globe: Globe,
  map: Map,
  compass: Compass,
  
  // Nature
  mountain: Mountain,
  trees: Trees,
  flower: Flower2,
  
  // Celestial
  sun: Sun,
  moon: Moon,
  star: Star,
  sparkles: Sparkles,
  
  // Elements
  flame: Flame,
  droplets: Droplets,
  wind: Wind,
  cloud: Cloud,
  
  // Travel
  anchor: Anchor,
  ship: Ship,
  
  // Buildings
  building: Building,
  castle: Castle,
  church: Church,
  
  // Spiritual
  cross: Cross,
  infinity: Infinity,
  
  // Shapes
  circle: Circle,
  triangle: Triangle,
  square: Square,
  hexagon: Hexagon,
  
  // People
  user: User,
  users: Users,
  baby: Baby,
  skull: Skull,
  ghost: Ghost,
  
  // Animals
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  bug: Bug,
  
  // Plants & Food
  leaf: Leaf,
  apple: Apple,
  grape: Grape,
  cherry: Cherry,
  
  // UI - Folders
  folder: Folder,
  'folder-open': FolderOpen,
  
  // UI - Actions
  settings: Settings,
  'log-in': LogIn,
  'log-out': LogOut,
  
  // UI - Navigation
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  x: X,
  check: Check,
  copy: Copy,
  menu: Menu,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
  search: Search,
  home: Home,
  list: List,
  grid: Grid,
  
  // UI - State
  eye: Eye,
  'eye-off': EyeOff,
  lock: Lock,
  unlock: Unlock,
  
  // UI - Commerce
  gift: Gift,
  'dollar-sign': DollarSign,
  'credit-card': CreditCard,
  
  // UI - Feedback
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  info: Info,
  'help-circle': HelpCircle,
};

// ============================================================================
// ICON COMPONENT
// ============================================================================

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ 
  name, 
  size = 24, 
  className = '',
  strokeWidth = ICON_STROKE_WIDTH 
}: IconProps) {
  const IconComponent = ICON_REGISTRY[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }
  
  return (
    <IconComponent 
      size={size} 
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}

// ============================================================================
// GENRE TO ICON MAPPING
// Suggests appropriate icons for book genres/themes
// ============================================================================

export const GENRE_ICONS: Record<string, string> = {
  philosophy: 'brain',
  politics: 'scale',
  tragedy: 'drama',
  comedy: 'theater',
  poetry: 'feather',
  epic: 'sword',
  history: 'scroll',
  religion: 'cross',
  science: 'lightbulb',
  nature: 'leaf',
  love: 'heart',
  adventure: 'compass',
  mystery: 'ghost',
  war: 'crown',
  ethics: 'gavel',
  metaphysics: 'infinity',
  psychology: 'brain',
  education: 'graduation-cap',
  music: 'music',
  art: 'palette',
};

// ============================================================================
// DEFAULT ICONS
// ============================================================================

export const DEFAULT_BOOK_ICON = 'book';
export const DEFAULT_FOLDER_ICON = 'folder';
