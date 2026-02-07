function About() {
  return (
    <div>
      <h1>About</h1>
      <p>
        This application is built with React, Express, and PostgreSQL,
        containerized with Docker for both development and production environments.
      </p>
      <h2>Tech Stack</h2>
      <ul>
        <li>Frontend: React 18 + Vite 5</li>
        <li>Backend: Express 4 + Node.js 20</li>
        <li>Database: PostgreSQL 16</li>
        <li>Containerization: Docker + Docker Compose</li>
        <li>Reverse Proxy: Nginx</li>
      </ul>
    </div>
  );
}

export default About;
