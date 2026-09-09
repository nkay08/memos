import { type FC } from "react";
import DateTimeInput from "@/components/DateTimeInput";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslate } from "@/utils/i18n";
import { useEditorContext, useEditorSelector } from "../state";

function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export const TimestampPopover: FC = () => {
  const t = useTranslate();
  const { actions, dispatch } = useEditorContext();
  const createTime = useEditorSelector((s) => s.timestamps.createTime);
  const updateTime = useEditorSelector((s) => s.timestamps.updateTime);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="w-auto text-sm text-muted-foreground text-left hover:text-foreground transition-colors cursor-pointer"
          />
        }
      >
        {formatDate(createTime ?? new Date())}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3 space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{t("common.created-at")}</label>
          <DateTimeInput value={createTime ?? new Date()} onChange={(d) => dispatch(actions.setTimestamps({ createTime: d }))} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{t("common.last-updated-at")}</label>
          <DateTimeInput value={updateTime ?? new Date()} onChange={(d) => dispatch(actions.setTimestamps({ updateTime: d }))} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
