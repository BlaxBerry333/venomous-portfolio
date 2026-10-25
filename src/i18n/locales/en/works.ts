import type * as I18n from "@/i18n";

export const WORKS = {
  "geniee-x": {
    subtitle: "All-in-one AI platform for website analytics, site building, and booking conversion",
    period: "2026 – Present",
    role: "UI/UX Design Team Lead\nFull-stack Developer (concurrent)",
    summary:
      "An AI platform for businesses built around bookings and visits. It brings site analytics, site building, and booking conversion management into one place. AI handles analysis, site building, and day-to-day operations, and the platform also integrates a customer CRM, LINE integration, AI chat, marketing automation, and a CDP.",
    contributionSummary:
      "I lead the UI/UX Design Team, driving UX and the design foundation for GENIEE-X, and also work as a full-stack developer on its site-building and form features.",
    contributions: [
      {
        title: "UX and design foundation",
        text: "Leading the UI/UX Design Team, I set the UX direction and build the design foundation, and am designing a Design System so every feature team builds with the same design language.",
      },
      {
        title: "Site building and form features",
        text: "Also on a feature team, I handle full-stack development of the site-building and form features.",
      },
    ],
  },
  "geniee-cdp": {
    subtitle: "Customer data platform SaaS",
    period: "2025 – 2026",
    role: "Frontend Tech Lead",
    summary:
      "A customer data platform SaaS for businesses. It merges customer data scattered across websites, apps, CRMs, and ads into unified customer profiles with consistent fields, then makes it available to the company’s marketing and analytics products and to client companies’ own analysis.",
    contributionSummary:
      "To launch in a short time, I led the adoption of a full-stack Next.js architecture with tRPC. On top of it I built the SQL editor and AI-generated metadata, which became the data foundation other products in the company rely on when they use CDP. Data isolation and query limits are owned by the data processing team.",
    contributions: [
      {
        title: "AI metadata",
        text: "Uses AI to analyze data in BigQuery and generate and update metadata. Other products in the company build on this metadata when they analyze data through CDP.",
      },
      {
        title: "SQL editor integrated with BigQuery",
        text: "Lets members who don’t write code query and configure data directly. As with the metadata, I took it from proposal through design and implementation.",
      },
      {
        title: "Full-stack Next.js architecture",
        text: "Casbin permission checks and the SDKs for data sources such as BigQuery, GCS, S3, and Azure Blob all run on the server. The client only receives data already filtered by permissions, and credentials never leave the server. With tRPC, breaking API changes show up at compile time.",
      },
      {
        title: "Tracking conventions",
        text: "Unified the GTM and GA4 tracking conventions across field names, parameter structure, and trigger timing, so every event the frontend sends can be read on the analytics side.",
      },
      {
        title: "Consecutive A+ in OKR reviews",
        text: "Received the top OKR rating, A+, for two consecutive quarters.",
      },
    ],
  },
  "geniee-chat": {
    subtitle: "Chatbot-based customer engagement SaaS",
    period: "2023 – Present",
    role: "Full-stack Developer",
    summary:
      "A chatbot-based customer engagement SaaS for businesses. It raises website conversion through conversational support and entry form optimization (EFO). It has two parts: the admin console used by operators, and the chat window embedded in customers’ sites.",
    contributionSummary:
      "I handle full-stack development of the admin console. I led the technology choices for the frontend migration, adopting an SPA (React + Vite) to fit a B2B product centered on admin screens, then built out the visual Workflow: the editor, unified node definitions, and AI-driven checking and analysis.",
    contributions: [
      {
        title: "Rebuilding the admin console and its toolchain",
        text: "I led the frontend technology choices for the migration, built a new React + TypeScript + Vite foundation, and set up all toolchain configuration and conventions. We rebuilt only the screens without touching backend APIs, replaced the old screens in six steps, and froze development on them once the new foundation was ready, so we never maintained two versions in parallel. On the development pipeline, I tracked down why CI/CD had become slow: I trimmed oversized dependencies found with a bundle visualizer, and sped up checks by running them locally in parallel, only on changed files, and with caching. I also set up routes generated automatically from the directory structure, and used ESLint to restrict each module’s public entry points and prevent circular dependencies.",
      },
      {
        title: "Workflow editor",
        text: "A node-based editor built with React Flow. Customers’ operators configure response logic themselves by connecting nodes and combining templates, with conversation version control.",
      },
      {
        title: "Unified Workflow node definitions",
        text: "Each node type’s component, styles, form validation, and the information passed to AI are defined in one place, so they no longer drift apart.",
      },
      {
        title: "AI agents that analyze Workflows",
        text: "I designed and built two agents, one for checking and one for analysis. The checking agent reads nodes and connections and validates them with the same rules as the editor. The analysis agent strips out sensitive information before analyzing and answering questions. CS no longer has to inspect every node by hand; together with the editor’s templates, setting up and checking a Workflow went from over an hour to a few minutes. Currently used internally.",
      },
      {
        title: "Consecutive A+ in OKR reviews",
        text: "Received the top OKR rating, A+, for four consecutive quarters.",
      },
    ],
  },
  "skyfall-skyflag": {
    subtitle: "Performance-based ad operations SaaS",
    period: "2023",
    role: "Frontend Developer\nFrontend Lead",
    summary:
      "A performance-based advertising SaaS from Skyfall Inc. Built around rewarded ads, it offers monetization, promotion, and user research services to mobile apps in games, utilities, and content.",
    contributionSummary:
      "Served as the de facto frontend tech lead. I led the team in improving the legacy admin console built on CRA, then took the initiative to introduce Vite and Refine to replace it screen by screen, so members with different levels of experience could build consistently under one set of rules.",
    contributions: [
      {
        title: "From CRA to Vite + Refine",
        text: "The old admin console was built on CRA, which React no longer recommended, and each screen handled routing, forms, and data fetching its own way. I first stabilized the old screens, then introduced Vite and Refine and replaced them screen by screen. Refine put routing, forms, and data fetching on one shared foundation, so members no longer had to assemble them on their own.",
      },
      {
        title: "Component design conventions",
        text: "Defined the boundary between business and generic components, along with rules for props naming and state ownership. Generic components went into Storybook and development conventions into Docusaurus.",
      },
      {
        title: "Point of contact for the business side",
        text: "As the frontend point of contact, I worked directly with business teams to sort out requirements and break them into tasks the team could take on.",
      },
      {
        title: "Newcomer Motto Award",
        text: "Just one month after joining, I received the company’s Newcomer Motto Award for driving the foundation of the new admin console, the fastest win in the award’s history. Motto refers to Skyfall’s core values.",
      },
    ],
  },
  "fni-saga-sunrise-park": {
    subtitle: "Booking and operations system for a public facility",
    period: "2019 – 2023",
    role: "Full-stack Developer\nFrontend Lead (later)",
    summary:
      "The booking and operations system for SAGA Sunrise Park, a large public sports and event complex in Saga Prefecture. It has two parts: visit and facility booking for residents, and an operations console used by several municipal departments.",
    contributionSummary:
      "A commissioned project that ran over three years, with several changes to the development team. In the later phase, as frontend lead, I led a large-scale improvement and refactor of both frontends, the residents’ booking site and the operations console, and turned knowledge that lived in individual heads into shared documentation.",
    contributions: [
      {
        title: "Large-scale refactor of both frontends",
        text: "Carried out a large-scale improvement and refactor of both frontends: the residents’ booking site (B2C) and the internal operations console (B2B). As part of it, I re-evaluated the UI component library and adopted Ant Design.",
      },
      {
        title: "Cleaning up the Sass",
        text: "The existing Sass was scattered and layered with overrides, so a change in one place often broke another. During the refactor, anything Ant Design’s components and theme settings could handle was handed to them; the remaining custom styles were grouped by module, and duplicated or conflicting rules were removed.",
      },
      {
        title: "Documenting technical knowledge",
        text: "With several rounds of turnover, much of the knowledge lived only with individuals. I organized design documents, API specifications, and a frontend development guide in Docusaurus, so new members could get up to speed without asking around.",
      },
    ],
  },
  "venomous-portfolio": {
    subtitle: "A multi-theme portfolio site with real-time 3D scenes",
    period: "2026 – Present",
    role: "Solo developer",
    summary:
      "My portfolio site, the one you are looking at now. It has two theme families, Warhammer 40K (Tzeentch, Slaanesh) and Devil May Cry (Dante, Vergil), each with its own full-screen real-time scene, palette, and component styling, in Japanese, Chinese, and English.",
    contributionSummary:
      "Designed and built solo, with the focus on giving every theme full immersion without slowing the page down.",
    images: {
      tzeentch: "Tzeentch theme: psychic lightning",
      slaanesh: "Slaanesh theme: the mists of the Warp",
      dante: "Dante theme: Million Stab and the style rank",
      vergil: "Vergil theme: a Judgement Cut finisher",
    },
    contributions: [
      {
        title: "A scene for every theme",
        text: "Two theme families, four themes, each with its own full-screen real-time shader scene. Tapping the screen triggers a matching effect: psychic lightning for Tzeentch, ripples through the Warp mists for Slaanesh, Dante’s Million Stab, and Vergil’s Judgement Cut.",
      },
      {
        title: "Style rank",
        text: "The Devil May Cry themes have a style meter: rapid taps and mouse movement build points, stopping lets them drain, and the rank climbs from D to SSS. Landing five hits in a row triggers a finisher.",
      },
      {
        title: "Load only what’s needed, scale down when it’s heavy",
        text: "Scene code is split per theme, so only the selected one is loaded. At runtime the frame time is measured; if the device falls behind, quality drops one step (three in all, by render resolution) and climbs back when there is headroom. The result is saved in the browser and reused on the next visit.",
      },
      {
        title: "Themes separated from components",
        text: "Pages and components take colors only from each theme’s color variables, so switching themes never requires touching a component. Text is managed per language, and a missing or extra translation fails the type check.",
      },
    ],
  },
} satisfies I18n.WorkTexts;
