import type { IconType } from "react-icons";
import { BiCheckCircle, BiSolidStar, BiTestTube, BiTrendingUp } from "react-icons/bi";
import type { SupportLevel } from "./supportLevel";

/** Icons for the NEW and readiness tags over each card title; shared with the filters and the About legend. */
export const NEW_TAG_ICON: IconType = BiSolidStar;

export const SUPPORT_LEVEL_ICONS: Record<SupportLevel, IconType> = {
  "production-ready": BiCheckCircle,
  "growing-support": BiTrendingUp,
  experimental: BiTestTube,
};

