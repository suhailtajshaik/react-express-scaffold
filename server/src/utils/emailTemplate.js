import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateDir = process.env.STATIC_PATH
  ? path.join(process.env.STATIC_PATH, 'templates', 'email')
  : path.join(__dirname, '../../static/templates/email');

/**
 * Load and render an email template with variable substitution.
 * Templates use {{variableName}} syntax for placeholders.
 *
 * @param {string} templateName - Name of the template file (without .html extension)
 * @param {Record<string, string>} variables - Key-value pairs for template substitution
 * @returns {Promise<string>} Rendered HTML string
 */
export async function loadEmailTemplate(templateName, variables = {}) {
  const templatePath = path.join(templateDir, `${templateName}.html`);

  let html = await readFile(templatePath, 'utf-8');

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, value);
  }

  return html;
}
