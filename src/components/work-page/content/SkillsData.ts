export interface SkillCategory {
  title: string;
  items: string[];
}

export const skillsets: SkillCategory[] = [
  {
    title: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SQL", "SOQL", "Python", "Java", "EasyLanguage", "Google Apps Script"],
  },
  {
    title: "Analytics",
    items: [
      "Data Cleaning/Validation",
      "KPI Reporting",
      "Pivot Tables",
      "VLOOKUP",
      "Google Sheets/Excel",
      "Tableau", 
      "TradeStation", 
      "Jira",
      "Git",
      "Power BI",
      "VS Code", 
      "Salesforce"
    ],
  },
  {
    title: "Practices",
    items: [
      "Stakeholder Management", 
      "Requirements Gathering", 
      "Process Improvement", 
      "Root Cause Analysis",
      "Trend Analysis",
      "Data Storytelling",
      "Executive Reporting",
      "Dashboard Design"

    ],
  },
];
