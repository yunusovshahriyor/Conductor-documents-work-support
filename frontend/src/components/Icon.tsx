import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronRight,
  Download,
  FileCheck2,
  House,
  Info,
  Languages,
  LifeBuoy,
  Phone,
  ShieldCheck,
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
  | "info";

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
};

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const Glyph = icons[name];
  return <Glyph size={size} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" />;
}
