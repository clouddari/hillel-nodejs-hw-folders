import "./Footer.css";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} MyLibrary - Review-Bro — All rights
          reserved.
        </p>
        <p>Built using React, Express, and MongoDB.</p>
      </div>
    </footer>
  );
}

export default Footer;
