import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { ALIAS_MODE_KEY } from "@/lib/tag";

interface AliasModeContextValue {
  aliasMode: boolean;
  toggleAliasMode: () => void;
}

const AliasModeContext = createContext<AliasModeContextValue>({
  aliasMode: false,
  toggleAliasMode: () => {},
});

export const AliasModeProvider = ({ children }: { children: ReactNode }) => {
  const [aliasMode, setAliasMode] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem(ALIAS_MODE_KEY) ?? "false") as boolean;
    } catch {
      return false;
    }
  });

  const toggleAliasMode = useCallback(() => {
    setAliasMode((prev) => {
      const next = !prev;
      localStorage.setItem(ALIAS_MODE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return <AliasModeContext.Provider value={{ aliasMode, toggleAliasMode }}>{children}</AliasModeContext.Provider>;
};

export const useAliasMode = () => useContext(AliasModeContext);
