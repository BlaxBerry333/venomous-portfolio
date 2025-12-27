/** Skill category stored in skills.json */
export interface SkillCategory {
  id: string;
  skills: string[];
}

/** Individual skill item stored in skills.json */
export interface SkillItem {
  label: string;
  icon: string;
}

/** Skill category with localized label */
export interface SkillCategoryLocalized {
  id: string;
  label: string;
  skills: string[];
}
