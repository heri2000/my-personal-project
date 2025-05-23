import { enEN } from "@/app/translations/enEN";
import './about.css';

export const CURRENT_PAGE_ABOUT = "current_page_about";

export function About() {
  const translationStrings = enEN;

  return (
    <div className="standard_content">
      <h1 className="page_title">{translationStrings.about} {translationStrings.websiteTitle}</h1>
      <div>
        <h3 className="mt-8">Technology Stack</h3>
        <p>This demo web application is built using the following technologies:</p>
        <ul className="tech_stack">
          <li><b>Frontend</b>: <a href="https://nextjs.org/" target="_blank">Next.js</a> for the web applications with the power of <a href="https://react.dev/" target="_blank">React</a> components.</li>
          <li><b>Backend</b>: <a href="https://expressjs.com/" target="_blank">Express.js</a> for handling API routes and server logic.</li>
          <li><b>Database</b>: <a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a> for reliable and powerful relational data storage.</li>
          <li><b>Caching & Data Store</b>: <a href="https://valkey.io/" target="_blank">Valkey</a> for high-performance in-memory caching.</li>
          <li><b>Deployment</b>: Frontend is deployed on <a href="https://vercel.com/" target="_blank">Vercel</a>. Backend, PostgreSQL and Valkey are deployed on a Linux virtual machine, containerized and deployed using <a href="https://podman.io/" target="_blank">Podman</a>.</li>
        </ul>
      </div>
    </div>
  );
}
