import SanguineAboutPage from "./SanguineAboutPage";
import SanguineDesignSystemPage from "./SanguineDesignSystemPage";
import SanguineHomePage from "./SanguineHomePage";
import SanguineNotFoundPage from "./SanguineNotFoundPage";
import SanguineWorkDetailPage from "./SanguineWorkDetailPage";
import SanguineWorksPage from "./SanguineWorksPage";

export const PagesSanguine = {
  Home: SanguineHomePage,
  About: SanguineAboutPage,
  Works: SanguineWorksPage,
  WorkDetail: SanguineWorkDetailPage,
  DesignSystem: SanguineDesignSystemPage,
  NotFound: SanguineNotFoundPage,
} as const;
