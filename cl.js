#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import PDFDocument from "pdfkit";

// Pre-defined cover letter template with placeholders
const template = `
Dear Hiring Team at {{companyName}},

I’m thrilled to apply for the {{jobTitle}} position at {{companyName}}. With hands-on experience with tools such as {{skills}} coupled with my passion for creating seamless, accessible, and user-friendly platforms, I’m excited about the opportunity to contribute to your mission of delivering exceptional user experiences.

In my current role as a Junior Developer at {{currentRoleCompany}}, I’ve:

-    Built and documented responsive front-ends using React, implementing concepts such as BEM and progressive enhancement into my workflow, ensuring scalability.
-    Developed UI components with Storybook following designs for an ecommerce platform.
-    Followed Agile methodologies working in sprints, and managing workload via kanban boards.
-    Created a monorepo in Express with various project templates for the purpose of teaching work experience students. 

One of my key achievements was leading the frontend development for a client project - Rank my Rental. During this project I gained hands-on experience with many aspects of the Software Development Lifecycle, such as requirements gathering and wireframing. I utilised Laravel's blade templates to build a seamless UI and worked closely with the client during the whole development.

With a strong foundation in modern frontend technologies and a passion for continuous learning, I’m confident in my ability to contribute to {{companyName}}’s future success.

Thank you for considering my application. I look forward to the opportunity to discuss how I can make a positive contribution to your fantastic company.

Best regards,
Phillip Hickinbotham
`;

// CLI form to gather user input
async function generateCoverLetter() {
  try {
    const answers = await inquirer.prompt([
      {
        name: "jobTitle",
        message: "What is the job title?",
        validate: (input) => (input ? true : "Job title cannot be empty"),
      },
      {
        name: "companyName",
        message: "What is the company name?",
        validate: (input) => (input ? true : "Company name cannot be empty"),
      },
      {
        name: "skills",
        message: "What skills would you like to highlight?",
        default:
          "React, HTML, CSS, TailwindCSS, Git, Next.js, Laravel",
      },
      {
        name: "currentRoleCompany",
        message: "What is your current role/company?",
        default: "Sunderland Software City",
      },
    ]);

    // Replace placeholders in the template
    const filledTemplate = template
      .replace(/{{companyName}}/g, answers.companyName)
      .replace(/{{jobTitle}}/g, answers.jobTitle)
      .replace(/{{companyValues}}/g, answers.companyValues)
      .replace(/{{skills}}/g, answers.skills)
      .replace(/{{currentRoleCompany}}/g, answers.currentRoleCompany);

    // Output the result to console
    console.log(chalk.green("\nYour generated cover letter:\n"));
    console.log(chalk.blue(filledTemplate));

    // Generate PDF document
    const doc = new PDFDocument();

    // Create a writable stream for the file with the dynamic filename
    const fileName = `${answers.companyName
      .replace(/\s+/g, "_")
      .toLowerCase()}_cover_letter.pdf`;

    doc.pipe(fs.createWriteStream(fileName));

    // Set up the font and spacing
    doc.fontSize(12);

    doc.text(filledTemplate.trim(), {
      align: "left",
      lineGap: 6,
    });

    // Finalize PDF and end the document stream
    doc.end();
    console.log(chalk.yellow(`\nCover letter saved as "${fileName}"!\n`));
  } catch (error) {
    console.error(chalk.red(`Error generating cover letter: ${error.message}`));
  }
}

generateCoverLetter();
