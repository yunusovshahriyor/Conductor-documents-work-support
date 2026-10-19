import {
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  BookUser,
  ChevronRight,
  CircleUser,
  Download,
  FileCheck2,
  FolderLock,
  House,
  Info,
  Languages,
  LifeBuoy,
  Lock,
  NotebookPen,
  Paperclip,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";

export type IconName =
  | "home"
  | "documents"
  | "calendar"
  | "work"
  | "help"
  | "globe"
  | "phone"
  | "shield"
  | "check"
  | "alert"
  | "download"
  | "back"
  | "close"
  | "chevron"
  | "info"
  | "wallet"
  | "profile"
  | "contacts"
  | "journal"
  | "plus"
  | "trash"
  | "lock"
  | "clip"
  | "bell";

const icons: Record<IconName, LucideIcon> = {
  home: House,
  documents: FileCheck2,
  calendar: CalendarClock,
  work: BriefcaseBusiness,
  help: LifeBuoy,
  globe: Languages,
  phone: Phone,
  shield: ShieldCheck,
  check: Check,
  alert: TriangleAlert,
  download: Download,
  back: ArrowLeft,
  close: X,
  chevron: ChevronRight,
  info: Info,
  wallet: FolderLock,
  profile: CircleUser,
  contacts: BookUser,
  journal: NotebookPen,
  plus: Plus,
  trash: Trash2,
  lock: Lock,
  clip: Paperclip,
  bell: Bell,
};

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const Glyph = icons[name];
  return <Glyph size={size} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" />;
}
