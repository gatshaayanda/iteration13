import fs from "node:fs";
import path from "node:path";

const roots = ["src", "public"].map(value => path.resolve(process.cwd(), value));
const extensions = new Set([".css", ".scss", ".sass", ".tsx", ".ts", ".jsx", ".js", ".svg", ".html"]);
const rules = [
  { pattern: /writing-mode\s*:\s*(?:vertical|sideways)(?:-[a-z]+)?\b/gi, message: "vertical/sideways writing mode" },
  { pattern: /writingMode\s*:\s*["']?(?:vertical|sideways)/gi, message: "vertical/sideways inline writing mode" },
  { pattern: /text-orientation\s*:\s*upright\b/gi, message: "upright vertical text orientation" },
  { pattern: /\.plugArtworkVertical\b/gi, message: "legacy decorative vertical-text selector" },
];

const failures = [];
function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (extensions.has(path.extname(entry.name).toLowerCase())) {
      const source = fs.readFileSync(fullPath, "utf8");
      for (const rule of rules) {
        rule.pattern.lastIndex = 0;
        for (const match of source.matchAll(rule.pattern)) {
          const line = source.slice(0, match.index).split("\n").length;
          failures.push(`${path.relative(process.cwd(), fullPath)}:${line} — ${rule.message}`);
        }
      }
    }
  }
}
for (const root of roots) walk(root);
if (failures.length) {
  console.error("TYPOGRAPHY VERIFICATION FAILED");
  failures.forEach(item => console.error(" - " + item));
  process.exit(1);
}
console.log("TYPOGRAPHY VERIFIED — no vertical or sideways text writing rules in app source or public assets.");
