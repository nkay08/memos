import { useEffect, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import MemoView from "@/components/MemoView";
import PagedMemoList, { getMemoKey } from "@/components/PagedMemoList";
import { useMemoFilterContext } from "@/contexts/MemoFilterContext";
import { useSpaceContext } from "@/contexts/SpaceContext";
import { useMemoFilters, useMemoSorting } from "@/hooks";
import useCurrentUser from "@/hooks/useCurrentUser";
import useNavigateTo from "@/hooks/useNavigateTo";
import { collectionPathForLocation } from "@/router/routes";
import { State } from "@/types/proto/api/v1/common_pb";
import { Memo } from "@/types/proto/api/v1/memo_service_pb";
import { useTranslate } from "@/utils/i18n";

const YearView = () => {
  const { year: yearParam } = useParams<{ year: string }>();
  const year = Number(yearParam);
  const t = useTranslate();
  const user = useCurrentUser();
  const navigateTo = useNavigateTo();
  const location = useLocation();
  const { setFilters } = useMemoFilterContext();
  const { memoFilter: contextFilter, selectedSpaceName } = useSpaceContext();
  const prevYearRef = useRef<number | undefined>(undefined);

  // Set displayTime filter for the year. Only updates when the year actually changes.
  useEffect(() => {
    if (!Number.isFinite(year) || year < 1000 || year > 9999) return;
    if (prevYearRef.current === year) return;
    prevYearRef.current = year;

    const yearStr = String(year);
    setFilters((prev) => {
      const withoutDisplayTime = prev.filter((f) => f.factor !== "displayTime");
      return [...withoutDisplayTime, { factor: "displayTime", value: yearStr }];
    });
  }, [year, setFilters]);

  const memoFilter = useMemoFilters({
    creatorName: user?.name,
    includeMemoViews: false,
    includePinned: true,
  });

  const { listSort, orderBy } = useMemoSorting({
    pinnedFirst: true,
    state: State.NORMAL,
  });

  const navigateToYear = (targetYear: number) => {
    const basePath = collectionPathForLocation(`/year/${targetYear}`, location.pathname);
    navigateTo(basePath);
  };

  if (!Number.isFinite(year) || year < 1000 || year > 9999) {
    return (
      <div className="w-full min-h-full bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">{t("common.no-data")}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-background text-foreground">
      <div className="w-full max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-accent transition-colors"
            onClick={() => navigateToYear(year - 1)}
          >
            ← {year - 1}
          </button>
          <h1 className="text-2xl font-bold">{year}</h1>
          <button
            className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-accent transition-colors"
            onClick={() => navigateToYear(year + 1)}
          >
            {year + 1} →
          </button>
        </div>
        <PagedMemoList
          renderer={(memo: Memo, { compact }) => (
            <MemoView key={getMemoKey(memo)} memo={memo} showVisibility showPinned showSpace={!selectedSpaceName} compact={compact} />
          )}
          listSort={listSort}
          orderBy={orderBy}
          filter={memoFilter}
          contextFilter={contextFilter}
        />
      </div>
    </div>
  );
};

export default YearView;
