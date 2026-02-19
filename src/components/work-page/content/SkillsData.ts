export interface SkillCategory {
  title: string;
  items: string[];
}

export const skillsets: SkillCategory[] = [
  {
    title: "Platforms & Tooling",
    items: [
      "Vercel",
      "GitHub",
      "Git",
      "Docker",
      "Node.js",
      "Google Apps Script",
      "Google Sheets / Excel",
      "Bash / CLI",
      "VS Code",
      "Jira",
      "CI/CD",
      "Salesforce",
    ],
  },
  {
    title: "Data & Analytics",
    items: [
      "Data Cleaning & Validation",
      "Data Validation Frameworks",
      "KPI Design",
      "Data Modeling",
      "Pivot Tables & Lookups",
      "Dashboard Design (Tableau, Power BI, Sheets)",
      "Reporting Automation",
      "ETL & Data Pipelines",
    ],
  },
  {
    title: "Technologies",
    items: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "SQL",
      "SOQL",
      "React",
      "REST API Integration",
      "Vite",
      "HTML",
      "CSS",
      "Data Structures & Algorithms",
    ],
  },
  {
    title: "Practices",
    items: [
      "Systems Design",
      "Workflow Automation",
      "Process Automation",
      "Documentation",
      "QA / Data Quality",
      "Debugging & Troubleshooting",
      "Performance Optimization (Dashboards / Scripts)",
      "Version Control",
      "Requirements Gathering",
      "Stakeholder Communication",
      "Root Cause Analysis",
      "Executive Reporting",
      "Process Improvement",
    ],
  },
];
