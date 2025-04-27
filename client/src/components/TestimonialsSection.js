import React from 'react';
import '../assets/css/TestimonialsSection.css';

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2>What Our Users Say           <span className="quote">"</span>
        </h2>
        <p>Here's what developers and users think about our Web Dev Tools</p>
      </div>

      <div className="testimonial-grid">
        <div className="testimonial">
          <p>
            "These APIs are game-changers for our projects! The ease of integration and the wide range of tools saved us so much time!"
          </p>
          <span>- Sarah J., Developer</span>
        </div>

        <div className="testimonial">
          <p>
            "I love the regex tester and JSON validators! It's made coding so much smoother and debugging easier."
          </p>
          <span>- Mark T., Backend Developer</span>
        </div>

        <div className="testimonial">
          <p>
            "The password strength checker helped us build secure applications. A must-have tool for any developer!"
          </p>
          <span>- James B., Security Expert</span>
        </div>

        <div className="testimonial">
          <p>
            "The collection of tools available is unmatched. It covers everything I need for front-end development."
          </p>
          <span>- Emily R., Front-End Developer</span>
        </div>
        <div className="testimonial">
          <p>
            "I can't imagine working without this toolset. It simplifies everything, from code beautification to API testing."
          </p>
          <span>- Brian M., Full-Stack Developer</span>
        </div>

        <div className="testimonial">
          <p>
            "This platform is my go-to for all my web development needs. From minification to JSON/YAML conversion, it's a one-stop shop!"
          </p>
          <span>- Olivia P., Web Developer</span>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
