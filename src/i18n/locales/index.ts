import type { Locale } from "../config";
import type { Messages } from "../types";
import * as en from "./en";
import * as ja from "./ja";
import * as zh from "./zh";

export const MESSAGES: Record<Locale, Messages> = { zh, ja, en };
