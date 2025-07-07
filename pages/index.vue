<template>
  <div class="homepage-vol1">
    <!-- Video Background -->
    <video class="video-background" autoplay muted loop playsinline>
      <source src="/2024-fall-video-6-horizontal.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Video Overlay Gradients -->
    <div class="video-overlay" />
    <div class="content-overlay" />

    <!-- Navigation -->
    <Navbar />

    <!-- Main Hero Text -->
    <div class="hero-text">A World of Window Coverings</div>

    <!-- Reseller Portal Banner -->
    <div class="reseller-banner">
      <div class="banner-background" />
      <div class="banner-text">Reseller Portal Coming Soon...</div>
    </div>

    <!-- Footer -->
    <div class="footer-wrapper">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

// Define meta data for SEO
definePageMeta({
  title: "Home - Crastino Window Treatments",
  description:
    "A world of window coverings - Premium window treatments and solutions.",
  layout: false,
});
</script>

<style scoped>
/* Import Albert Sans font */
@import url("https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap");

.homepage-vol1 {
  width: 100%;
  position: relative;
  background-color: #fff;
  height: 1024px;
  overflow: hidden;
  text-align: left;
  font-size: 16px;
  color: #fff;
  font-family: "Albert Sans", sans-serif;
}

/* Video Background */
.video-background {
  position: absolute;
  top: 119px;
  left: calc(50% - 733px);
  width: 1465px;
  height: 824px;
  object-fit: cover;
  z-index: 1;
}

/* Video Overlay - First gradient */
.video-overlay {
  position: absolute;
  top: calc(50% - 393px);
  left: calc(50% - 736px);
  background: linear-gradient(
    180deg,
    rgba(61, 57, 53, 0),
    rgba(61, 57, 53, 0.3)
  );
  width: 1471px;
  height: 828px;
  z-index: 2;
}

/* Content Overlay - Second gradient */
.content-overlay {
  position: absolute;
  top: 106px;
  left: calc(50% - 733px);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2),
    rgba(102, 102, 102, 0.2)
  );
  width: 1466px;
  height: 847px;
  z-index: 3;
}

/* Hero Text */
.hero-text {
  position: absolute;
  top: 390px;
  left: calc(50% - 386px);
  font-size: 56.63px;
  letter-spacing: 0.2em;
  line-height: 68px;
  text-transform: uppercase;
  text-align: center;
  display: inline-block;
  width: 772px;
  text-shadow: 0px 3px 7px rgba(0, 0, 0, 0.25);
  z-index: 4;
  color: #fff;
}

/* Reseller Portal Banner */
.reseller-banner {
  position: absolute;
  top: 574px;
  left: 408px;
  width: 624px;
  height: 59px;
  text-align: center;
  font-size: 24px;
  color: #8a7c59;
  z-index: 4;
}

.banner-background {
  position: absolute;
  top: 0px;
  left: 0px;
  border-radius: 37px;
  background-color: #f7f7f5;
  width: 624px;
  height: 59px;
}

.banner-text {
  position: absolute;
  top: 23px;
  left: calc(50% - 275px);
  letter-spacing: 0.2em;
  line-height: 14px;
  text-transform: uppercase;
}

/* Footer Wrapper */
.footer-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 4;
}

/* Responsive adjustments */
@media (max-width: 1440px) {
  .video-background {
    width: 100%;
    left: 0;
  }

  .video-overlay,
  .content-overlay {
    width: 100%;
    left: 0;
  }

  .hero-text {
    left: 50%;
    transform: translateX(-50%);
  }

  .reseller-banner {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 768px) {
  .homepage-vol1 {
    height: 100vh;
    min-height: 600px;
  }

  .video-background {
    top: 120px;
    height: calc(100vh - 200px);
    min-height: 500px;
  }

  .video-overlay,
  .content-overlay {
    top: 120px;
    height: calc(100vh - 200px);
    min-height: 500px;
  }

  .hero-text {
    font-size: 28px;
    line-height: 34px;
    width: 90%;
    left: 5%;
    transform: none;
    top: 45%;
    text-align: center;
  }

  .reseller-banner {
    width: 85%;
    left: 7.5%;
    transform: none;
    top: calc(55% + 40px);
  }

  .banner-background {
    width: 100%;
    height: 50px;
  }

  .banner-text {
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    top: 18px;
  }
}

@media (max-width: 480px) {
  .hero-text {
    font-size: 24px;
    line-height: 30px;
    width: 95%;
    left: 2.5%;
  }

  .reseller-banner {
    width: 90%;
    left: 5%;
  }

  .banner-text {
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .hero-text {
    font-size: 20px;
    line-height: 26px;
  }

  .banner-text {
    font-size: 12px;
  }
}
</style>
