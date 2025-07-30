// src/theme/index.ts
import { theme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = theme;

export type AppThemeMode = "light" | "dark";

export const lightTheme = {
  algorithm: defaultAlgorithm,
  // TOKENS GLOBAIS (semente + derivados)
  token: {
    colorPrimary: "#10b981", // primária (emerald)
    colorInfo: "#10b981",
    colorBgBase: "#ffffff", // base do app
    colorBgContainer: "#ffffff", // containers (Card, Header)
    colorTextBase: "#121212",
    borderRadius: 12,
  },
  // OVERRIDES POR COMPONENTE (opcional)
  components: {
    Layout: {
      headerBg: "#ffffff",
      bodyBg: "#f6f8fa",
      siderBg: "#ffffff",
      headerHeight: 56,
    },
    Menu: {
      itemSelectedColor: "#10b981",
      itemSelectedBg: "rgba(16,185,129,0.12)",
      itemActiveBg: "rgba(16,185,129,0.08)",
    },
    Button: {
      colorPrimary: "#10b981",
      colorPrimaryHover: "#0ea371",
      colorPrimaryActive: "#0c8f63",
      controlHeight: 38,
      borderRadius: 10,
    },
    Card: {
      headerBg: "#ffffff",
    },
  },
} as const;

export const darkTheme = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: "#195d9c", // primária (cyan)
    colorInfo: "#195d9c",
    colorBgBase: "#0b1220",
    colorBgContainer: "#0f172a",
    colorTextBase: "#e5e7eb",
    borderRadius: 12,
  },
  components: {
    Layout: {
      headerBg: "#0f172a",
      bodyBg: "#0b1220",
      siderBg: "#0f172a",
    },
    Menu: {
      itemSelectedColor: "#22d3ee",
      itemSelectedBg: "rgba(34,211,238,0.16)",
      itemActiveBg: "rgba(34,211,238,0.12)",
    },
    Button: {
      colorPrimary: "#22d3ee",
      colorPrimaryHover: "#1bc6de",
      colorPrimaryActive: "#15b8cf",
    },
    Card: {
      headerBg: "#0f172a",
    },
  },
} as const;
