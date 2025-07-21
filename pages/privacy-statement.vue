<template>
  <div class="privacy-statement-page bg-white px-8">
   <section class="hero-section flex items-center justify-s w-full h-[60vh] md:h-[80vh] bg-cover bg-center relative" :style="heroStyle">
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        <div class="relative z-10 flex flex-col items-start justify-end w-full h-full">
            <h1 class="text-white text-4xl md:text-6xl font-bold drop-shadow-lg uppercase p-10">Privacy statement</h1>
        </div>
        </section>
    <!-- Breadcrumb -->
    <div class=" mx-auto py-6">
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    <!-- Language Switcher -->
    <div class=" mx-auto mb-6 flex gap-2">
      <span class=" py-1  text-[#2D1713] p-0 m-0 font-normal cursor-pointer"><a href="#" class="underline">ENG</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0  font-normal cursor-pointer"><a href="#" class="underline">NL</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0  font-normal cursor-pointer"><a href="#" class="underline">DE</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0 font-normal cursor-pointer"><a href="#" class="underline">ES</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0 font-normal cursor-pointer"><a href="#" class="underline">PL</a></span>
    </div>
    <!-- Content -->
    <div class=" mx-auto py-8">
      <h1 class="text-2xl font-black mb-8 text-[#2D1713]">Privacy Statement</h1>
      <div class="space-y-8 text-[#6F6259] text-base leading-8">
        <p class="text-base leading-10 font-light">
          When you visit our website, we (Crastino) process your personal data, for example through the use of cookies or because you fill in the contact form on the website. “Personal data" means all information about natural persons. This includes information such as names, telephone numbers, addresses and e-mail addresses, but also IP addresses and visitor behaviour. We want to inform you clearly about how we process your personal data and how we protect your privacy. In this privacy statement, we explain, among other things, the purposes for which we process your personal data in this context, the legal basis on which this is done and the rights you have under the General Data Protection Regulation (GDPR).
        </p>
        <p class="text-base leading-10 font-light">This data protection declaration was last amended on 11 May 2023</p>
        <h2 class="text-xl font-normal mb-2 text-black">Types of personal data</h2>
        <p class="text-base leading-10 font-light">
          We process the personal data you provide to us, for example when you sign up for our newsletter or contact us. We also process certain personal data through the use of cookies and similar technologies. For more information about the processing of personal data in this context, please see our Cookie Banner and our Cookie Policy. The information in this privacy statement is in addition to the information set out there.
        </p>
        <p class="text-base leading-10 font-light">
          Where reference is made in this privacy statement to processing by us, this may also mean processing by processors or other recipients engaged by us. The relevant processors and other recipients are identified in this privacy statement.
        </p>
        <h2 class="text-xl font-normal mb-2 text-black">Purpose of processing</h2>
        <p class="text-base leading-10 font-light">
          We only process your personal data if and to the extent necessary for our (legitimate) purposes. In this context, we process your personal data for the following purposes:
        </p>
        <ul class="list-disc pl-6">
          <li class="font-light">Receipt and processing of completed service or contact forms and/or other contact requests;</li>
          <li class="font-light">Processing your subscription to our newsletter;</li>
          <li class="font-light">Sending out our newsletter;</li>
          <li class="font-light">Recruitment and selection of new employees;</li>
          <li class="font-light">Marketing purposes, namely: Personalising advertising based on your interests, visiting behaviour and geolocation; The analysis of your product preferences; The adaptation of the content of the website to your interests; The compilation of aggregate statistics, e.g. on the effectiveness of online advertising campaigns; Creating "customer profiles" based on individual interests;</li>
          <li class="font-light">Handling of any complaints;</li>
          <li class="font-light">Hosting of the website;</li>
          <li class="font-light">Ensuring the continuity of our systems and protecting the integrity and confidentiality of information.</li>
        </ul>
        <h2 class="text-xl font-normal mb-2 text-black">Legal basis for processing</h2>
        <p class="text-base leading-10 font-light">
          The bases under the GDPR on which we rely for processing your personal data are: Consent, performance of contract and/or legitimate interest. Have we asked you for your consent? Then you can revoke it at any time by sending a message to <a href="mailto:privacy@crastino.com" class="text-blue-400 underline">privacy@crastino.com</a>.
        </p>
        <h2 class="text-xl font-normal mb-2 text-black">Provision of your personal data</h2>
        <p class="text-base leading-10 font-light">
          You are under no legal or contractual obligation to provide us with your personal data. However, the provision of some of your personal data is necessary in certain cases. For example, to send our newsletter or to answer a contact request.
        </p>
        <h2 class="text-xl font-normal mb-2 text-black">Recipients of your personal data</h2>
        <p class="text-base leading-10 font-light">
          We will only share your personal data with third parties if this is necessary. These include cookie providers, as described in our Cookie Policy, hosting parties and parties from whom we purchase management software and other tools.
        </p>
        <h2 class="text-xl font-normal mb-2 text-black">Retention period for personal data</h2>
        <p class="text-base leading-10 font-light">
          We do not process your personal data for longer than is necessary to fulfil the purposes described above. The retention periods stated in our Cookie Banner and Cookie Policy apply to the processing of personal data in connection with the use of cookies. We no longer process personal data collected in the context of registering and sending our newsletter if the relevant consent is revoked. We do not process personal data collected in the context of completed contact forms for longer than is necessary for the processing and follow-up of the contact form.
        </p>
        <h2 class="text-xl font-normal mb-2 text-black">Rights of the data subjects</h2>
        <p class="text-base leading-10 font-light">
          When your personal data is processed, you have several rights under the GDPR. We describe these below.
        </p>
        <h3 class="text-xl font-normal mb-2 text-black">Right of access, rectification and erasure of data</h3>
        <p class="text-base leading-10 font-light">
          You have the right to know from us whether we are processing your personal data and to access that personal data and certain information about its processing, provided that this does not infringe the rights (e.g. the right to privacy) and freedoms of others.
        </p>
        <p>
          In addition, you have the right to have personal data processed by us that is inaccurate or incomplete corrected. You also have the right to have your personal data deleted in certain circumstances. This is the case:
        </p>
        <ul class="list-disc pl-6">
          <li class="font-light">If the personal data are no longer necessary for the purpose for which they are processed;</li>
          <li class="font-light">If the personal data are processed on the basis of your consent, you revoke this consent and no other basis for the processing applies;</li>
          <li class="font-light">If you object to the processing of your personal data and there are no weightier legitimate grounds for the processing;</li>
          <li class="font-light">If the personal data have been processed unlawfully;</li>
          <li class="font-light">If the personal data must be erased due to a legal obligation of the respective controller.</li>
        </ul>
        <p class="text-base leading-10 font-light">
          In certain circumstances, you also have the right to temporarily "stop" the processing of your personal data.
        </p>
        <h3 class="text-xl font-normal mb-2 text-black">Right to data portability</h3>
        <p class="text-base leading-10 font-light">
          Subject to certain conditions, you have the right to receive the personal data you have provided to us in a structured, commonly used and machine-readable format. You can then transfer this personal data to another party. You can also ask us to transfer your personal data directly to that other party.
        </p>
        <p class="text-base leading-10 font-light">
          The right to portability only applies to granted data that is processed automatically on the following bases:
        </p>
        <ul class="list-disc pl-6">
          <li class="font-light">your consent (or that of your parent/legal guardian); or</li>
          <li class="font-light">the necessity of the processing for the performance of a contract to which you are a party.</li>
        </ul>
        <h3 class="text-xl font-normal mb-2 text-black">Right to object</h3>
        <p class="text-base leading-10 font-light">
          In certain circumstances, you may object to the (further) processing of your personal data. We will then stop processing unless there are compelling legitimate grounds for processing your personal data.
        </p>
        <h3 class="text-xl font-normal mb-2 text-black">Identification on exercise</h3>
        <p class="text-base leading-10 font-light">
          You can exercise the above rights by making a written request to us (including a request by email). We may ask you to identify yourself.
        </p>
        <h3 class="text-xl font-normal mb-2 text-black">Right to complain to a supervisory authority</h3>
        <p class="text-base leading-10 font-light">
          You have the right to lodge a complaint with the supervisory authority (in the Netherlands, the Autoriteit Persoonsgegevens). This is possible, for example, if you believe that the processing of your personal data does not comply with the law or if you have any other complaint.
        </p>
        <h2 class="text-xl font-normal mb-2 text-black">Contacting us</h2>
        <p class="text-base leading-10 font-light">
          If you have any questions, comments or complaints about this privacy statement, the processing of your personal data or the exercise of your rights, please contact our data protection officer - Nelleke Jans - at <a href="mailto:privacy@crastino.com" class="text-blue-400 underline">privacy@crastino.com</a>.
        </p>
        <h2 class="text-xl font-normal mb-2 text-black">Changes</h2>
        <p class="text-base leading-10 font-light">
          This privacy policy may be amended by us. We will post any new versions of this privacy policy on our website.
        </p>
       <div class=" mx-auto mb-6 flex gap-2">
      <span class=" py-1  text-[#2D1713] p-0 m-0 font-normal cursor-pointer"><a href="#" class="underline">DE</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0  font-normal cursor-pointer"><a href="#" class="underline">NL</a> /</span>
      <span class=" py-1  text-[#2D1713] p-0 m-0  font-normal cursor-pointer"><a href="#" class="underline">EN</a> /</span>
     
    </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue';
import { computed } from 'vue';
const breadcrumbItems = [
  { label: 'Home', to: '/' },
  { label: 'Privacy Statement' }
];
const heroImage = 'https://d2d1pua3mz4gez.cloudfront.net/__o/images/Large-web-Jasper-Abels-7313.jpg';
const heroStyle = computed(() => `background-image: url('${heroImage}');`);
</script>
<style scoped>
.hero-section {
  min-height: 60vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>