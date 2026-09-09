import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";
import {
  SIDEBAR_ROW_CLASSES,
  SIDEBAR_ROW_COUNT_RAIL_CLASSES,
  SidebarRowIconSlot,
  sidebarRowStateAttributes,
  sidebarRowStateClasses,
} from "@/components/AppSidebar/SidebarRow";
import SidebarSection from "@/components/AppSidebar/SidebarSection";
import { useMemoFilterContext } from "@/contexts/MemoFilterContext";
import { cn } from "@/lib/utils";
import type { StatisticsData } from "@/types/statistics";
import { useTranslate } from "@/utils/i18n";

interface Props {
  statistics: StatisticsData;
  onSelect?: () => void;
}

interface YearCount {
  year: number;
  count: number;
}

const YearsSection = ({ statistics, onSelect }: Props) => {
  const t = useTranslate();
  const { getFiltersByFactor, addFilter, removeFilter } = useMemoFilterContext();

  const activeYear = getFiltersByFactor("displayTime").find((f) => /^\d{4}$/.test(f.value))?.value;

  const years = useMemo((): YearCount[] => {
    const yearMap = new Map<number, number>();
    for (const [dateStr, count] of Object.entries(statistics.activityStats)) {
      const year = Number(dateStr.slice(0, 4));
      if (Number.isFinite(year)) {
        yearMap.set(year, (yearMap.get(year) ?? 0) + count);
      }
    }
    return Array.from(yearMap.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year - a.year);
  }, [statistics.activityStats]);

  if (years.length === 0) return null;

  const handleYearClick = (year: number) => {
    const yearStr = String(year);
    const isActive = activeYear === yearStr;
    if (isActive) {
      removeFilter((f) => f.factor === "displayTime" && f.value === yearStr);
    } else {
      removeFilter((f) => f.factor === "displayTime");
      addFilter({ factor: "displayTime", value: yearStr });
    }
    onSelect?.();
  };

  return (
    <SidebarSection label={t("common.years", "Years")}>
      {years.map(({ year, count }) => {
        const isActive = activeYear === String(year);
        const state = isActive ? "checked" : "idle";
        return (
          <button
            key={year}
            type="button"
            aria-pressed={isActive || undefined}
            {...sidebarRowStateAttributes(state)}
            className={cn(SIDEBAR_ROW_CLASSES, sidebarRowStateClasses(state))}
            onClick={() => handleYearClick(year)}
          >
            <SidebarRowIconSlot icon={CalendarIcon} />
            <span className="min-w-0 flex-1 truncate">{year}</span>
            <span className={SIDEBAR_ROW_COUNT_RAIL_CLASSES}>{count}</span>
          </button>
        );
      })}
    </SidebarSection>
  );
};

export default YearsSection;
