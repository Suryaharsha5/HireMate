import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="/services" className="text-white text-decoration-none">Services</a></li>
              <li><a href="/blog" className="text-white text-decoration-none">Blog</a></li>
              <li><a href="/contact" className="text-white text-decoration-none">Contact Us</a></li>
            </ul>
          </div>
          <div className="col-md-3 col-sm-6 mb-4">
            <h5>Our Services</h5>
            <ul className="list-unstyled">
              <li><a href="/freelancers" className="text-white text-decoration-none">Find Freelancers</a></li>
              <li><a href="/post-jobs" className="text-white text-decoration-none">Post Jobs</a></li>
              <li><a href="/consultations" className="text-white text-decoration-none">Consultations</a></li>
              <li><a href="/support" className="text-white text-decoration-none">Customer Support</a></li>
            </ul>
          </div>
          <div className="col-md-3 col-sm-6 mb-4">
            <h5>Resources</h5>
            <ul className="list-unstyled">
              <li><a href="/faq" className="text-white text-decoration-none">FAQ</a></li>
              <li><a href="/guides" className="text-white text-decoration-none">Guides</a></li>
              <li><a href="/tutorials" className="text-white text-decoration-none">Tutorials</a></li>
              <li><a href="/terms" className="text-white text-decoration-none">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-white text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-md-3 col-sm-6 mb-4">
            <h5>Contact Info</h5>
            <p>123 Freelance St, WorkCity, Earth</p>
            <p>+1 234 567 890</p>
            <p>info@hiremate.com</p>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="row">
          <div className="col-md-6">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                <i className="fab fa-facebook"></i> Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <h5 className='text-center'>Any Suggestions</h5>
            <form className="d-flex">
              <textarea
                type="text"
                className="form-control mx-2"
                placeholder="Enter your suggestions"
              />
              <button type="submit" className="btn btn-primary">Suggest</button>
            </form>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="row text-center">
          <div className="col-12">
            <p className="m-0">&copy; 2025 HireMate. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
