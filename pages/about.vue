<template>
    <div class="min-h-screen about-page" style="background-color: #ffffff;">
      <!-- Main Content Container -->
      <div class="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <!-- Hero Section -->
        <div class="text-center mb-20">
          <h1 class="about-title mb-8">About</h1>
          <div class="about-content max-w-4xl mx-auto">
            <p class="about-description mb-12">
              Crastino was established in Denmark in 2020 and has deep roots in Scandinavia's world-famous design tradition.
            </p>
            <p class="about-description-secondary">
              A leader in design innovation, Crastino produces quality contemporary textiles and textile related products for architects, designers and private consumers across the world.
            </p>
          </div>
        </div>
  
        <!-- Values Section -->
        <div class="values-section mb-20">
          <div class="max-w-6xl mx-auto">
            <h2 class="section-title text-center mb-16">Our Values</h2>
            <div class="grid md:grid-cols-3 gap-12">
              <!-- Quality -->
              <div class="value-card text-center">
                <div class="value-icon mb-6">
                  <div class="icon-circle">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="value-title mb-4">Quality</h3>
                <p class="value-description">
                  We are committed to producing the highest quality contemporary textiles using premium materials and craftsmanship.
                </p>
              </div>
  
              <!-- Innovation -->
              <div class="value-card text-center">
                <div class="value-icon mb-6">
                  <div class="icon-circle">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="value-title mb-4">Innovation</h3>
                <p class="value-description">
                  Our design team continuously pushes boundaries to create innovative solutions that meet evolving market needs.
                </p>
              </div>
  
              <!-- Heritage -->
              <div class="value-card text-center">
                <div class="value-icon mb-6">
                  <div class="icon-circle">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                </div>
                <h3 class="value-title mb-4">Scandinavian Heritage</h3>
                <p class="value-description">
                  Rooted in Denmark's renowned design tradition, we bring authentic Scandinavian aesthetics to our global audience.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Mission Statement -->
        <div class="mission-section mb-20">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="section-title mb-8">Our Mission</h2>
            <div class="mission-content">
              <p class="mission-description">
                To transform spaces worldwide through exceptional textile design that combines Scandinavian heritage with contemporary innovation, delivering quality products that inspire architects, designers, and consumers to create beautiful, functional environments.
              </p>
            </div>
          </div>
        </div>
  
        <!-- Contact Information -->
        <div class="contact-section">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="section-title mb-12">Get in Touch</h2>
            <div class="grid md:grid-cols-2 gap-12">
              <!-- Contact Info -->
              <div class="contact-info">
                <h3 class="contact-title mb-6">Contact Information</h3>
                <div class="space-y-4 text-left">
                  <div class="contact-item">
                    <span class="contact-label">Address:</span>
                    <span class="contact-value">Søborg Hovedgade 3, 2870 Dyssegård, Denmark</span>
                  </div>
                  <div class="contact-item">
                    <span class="contact-label">Founded:</span>
                    <span class="contact-value">2020</span>
                  </div>
                  <div class="contact-item">
                    <span class="contact-label">Focus:</span>
                    <span class="contact-value">Contemporary Textiles & Window Treatments</span>
                  </div>
                </div>
              </div>
  
              <!-- Business Info -->
              <div class="business-info">
                <h3 class="contact-title mb-6">Business Focus</h3>
                <div class="space-y-4 text-left">
                  <div class="business-item">
                    <span class="business-bullet">•</span>
                    <span class="business-text">Architects & Design Professionals</span>
                  </div>
                  <div class="business-item">
                    <span class="business-bullet">•</span>
                    <span class="business-text">Interior Designers</span>
                  </div>
                  <div class="business-item">
                    <span class="business-bullet">•</span>
                    <span class="business-text">Private Consumers</span>
                  </div>
                  <div class="business-item">
                    <span class="business-bullet">•</span>
                    <span class="business-text">Global Distribution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({
    title: "About - Crastino Window Treatments",
    description: "Learn about Crastino's heritage, values, and commitment to quality contemporary textiles and window treatments.",
  });
  </script>
  
  <style scoped>
  /* Import Albert Sans font */
  @import url("https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap");
  
  .about-page {
    font-family: "Albert Sans", sans-serif;
  }
  
  /* Hero Section */
  .about-title {
    font-size: 56px;
    font-weight: 300;
    line-height: 1.2;
    color: #2d2d2d;
    letter-spacing: 0.02em;
  }
  
  .about-description {
    font-size: 24px;
    font-weight: 300;
    line-height: 1.6;
    color: #2d2d2d;
    letter-spacing: 0.01em;
  }
  
  .about-description-secondary {
    font-size: 20px;
    font-weight: 300;
    line-height: 1.6;
    color: #6b6b6b;
    letter-spacing: 0.01em;
  }
  
  /* Section Titles */
  .section-title {
    font-size: 36px;
    font-weight: 300;
    color: #2d2d2d;
    letter-spacing: 0.02em;
  }
  
  /* Values Section */
  .values-section {
    padding: 60px 0;
  }
  
  .value-card {
    padding: 20px;
  }
  
  .value-icon {
    display: flex;
    justify-content: center;
  }
  
  .icon-circle {
    width: 80px;
    height: 80px;
    background-color: #f7f7f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8a7c59;
    transition: all 0.3s ease;
  }
  
  .value-card:hover .icon-circle {
    background-color: #8a7c59;
    color: #ffffff;
    transform: translateY(-2px);
  }
  
  .value-title {
    font-size: 20px;
    font-weight: 400;
    color: #2d2d2d;
    letter-spacing: 0.02em;
  }
  
  .value-description {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.6;
    color: #6b6b6b;
  }
  
  /* Mission Section */
  .mission-section {
    padding: 60px 0;
    background-color: #f7f7f5;
    margin-left: -50vw;
    margin-right: -50vw;
    padding-left: 50vw;
    padding-right: 50vw;
  }
  
  .mission-content {
    padding: 40px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .mission-description {
    font-size: 20px;
    font-weight: 300;
    line-height: 1.7;
    color: #2d2d2d;
    letter-spacing: 0.01em;
  }
  
  /* Contact Section */
  .contact-section {
    padding: 60px 0;
  }
  
  .contact-title {
    font-size: 24px;
    font-weight: 400;
    color: #2d2d2d;
    letter-spacing: 0.02em;
  }
  
  .contact-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .contact-label {
    font-size: 14px;
    font-weight: 500;
    color: #8a7c59;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  .contact-value {
    font-size: 16px;
    font-weight: 300;
    color: #2d2d2d;
    line-height: 1.5;
  }
  
  .business-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .business-bullet {
    color: #8a7c59;
    font-size: 18px;
    font-weight: 500;
  }
  
  .business-text {
    font-size: 16px;
    font-weight: 300;
    color: #2d2d2d;
    line-height: 1.5;
  }
  
  /* Responsive Design */
  @media (max-width: 1024px) {
    .about-title {
      font-size: 44px;
    }
    
    .about-description {
      font-size: 20px;
    }
    
    .about-description-secondary {
      font-size: 18px;
    }
    
    .section-title {
      font-size: 32px;
    }
    
    .mission-section {
      margin-left: -20px;
      margin-right: -20px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  
  @media (max-width: 768px) {
    .about-title {
      font-size: 36px;
    }
    
    .about-description {
      font-size: 18px;
    }
    
    .about-description-secondary {
      font-size: 16px;
    }
    
    .section-title {
      font-size: 28px;
    }
    
    .values-section .grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    
    .contact-section .grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    
    .mission-content {
      padding: 30px;
    }
    
    .mission-description {
      font-size: 18px;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding-left: 20px;
      padding-right: 20px;
    }
    
    .about-title {
      font-size: 32px;
    }
    
    .about-description {
      font-size: 16px;
    }
    
    .section-title {
      font-size: 24px;
    }
    
    .mission-content {
      padding: 20px;
    }
    
    .mission-description {
      font-size: 16px;
    }
    
    .icon-circle {
      width: 60px;
      height: 60px;
    }
    
    .value-title {
      font-size: 18px;
    }
    
    .contact-title {
      font-size: 20px;
    }
  }
  
  /* Animation for smooth hover effects */
  .value-card {
    transition: transform 0.3s ease;
  }
  
  .value-card:hover {
    transform: translateY(-5px);
  }
  
  /* Selection styling to match site theme */
  ::selection {
    background-color: #8a7c59;
    color: #ffffff;
  }
  
  ::-moz-selection {
    background-color: #8a7c59;
    color: #ffffff;
  }
  </style>