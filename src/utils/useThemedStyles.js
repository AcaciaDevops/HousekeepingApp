import { useMemo } from "react";
import { useAppTheme } from "../context/ThemeContext";

export function useThemedStyles(createStyles) {
  const { tokens } = useAppTheme();

  return useMemo(() => createStyles(tokens), [tokens, createStyles]);
}
