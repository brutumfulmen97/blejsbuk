import { GoogleGeminiEffectDemo } from "~/components/ui/GoogleGemini";
import { HoverEffect } from "~/components/ui/card-hover-effect";

function page() {
  return (
    <div>
      <GoogleGeminiEffectDemo />
      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={blejsbukAboutUs} />
      </div>
    </div>
  );
}

export default page;

const blejsbukAboutUs = [
  {
    title: "Our Vision",
    description:
      "Welcome to Blejsbuk, a dedicated social network created by developers, for developers. Our vision is to cultivate a thriving ecosystem where developers can connect, collaborate, and flourish together, empowering one another to reach new heights in their coding journey.",
  },
  {
    title: "Diverse Developer Hub",
    description:
      "Dive into Blejsbuk's diverse developer hub, where coders of all skill levels and backgrounds come together. Whether you specialize in frontend, backend, or full-stack development, Blejsbuk is your go-to platform for camaraderie and growth.",
  },
  {
    title: "Interactive Learning Hub",
    description:
      "Explore our interactive learning hub packed with tutorials, articles, and resources curated to enhance your coding prowess. Stay ahead of the curve with the latest technologies and trends, all while expanding your knowledge base in a supportive environment.",
  },
  {
    title: "Expert-Led Discussions",
    description:
      "Engage in enlightening discussions led by industry experts covering a wide array of topics, from software architecture to career development. Gain valuable insights and guidance from seasoned professionals passionate about nurturing the developer community.",
  },
  {
    title: "Collaborative Coding Projects",
    description:
      "Embark on collaborative coding projects with fellow Blejsbuk members and bring your ideas to life. Whether you're building a passion project or contributing to open-source initiatives, Blejsbuk provides the platform for collective innovation.",
  },
  {
    title: "Networking Nexus",
    description:
      "Forge meaningful connections within Blejsbuk's expansive network of developers worldwide. Whether you're seeking mentorship, partnership opportunities, or simply wish to connect with like-minded peers, Blejsbuk is your gateway to a vibrant developer community.",
  },
  {
    title: "Constructive Feedback Exchange",
    description:
      "Exchange constructive feedback on your code and projects, fostering continuous improvement and learning. Receive invaluable input from peers and experts alike, helping you refine your skills and elevate your coding standards.",
  },
  {
    title: "Career Empowerment Center",
    description:
      "Access Blejsbuk's career empowerment center for invaluable resources and support tailored to your professional development needs. From resume optimization to interview preparation, unlock the tools and guidance necessary to propel your career forward.",
  },
  {
    title: "Innovative Hackathons and Challenges",
    description:
      "Participate in Blejsbuk's innovative hackathons and coding challenges, where creativity and collaboration reign supreme. Push the boundaries of your coding abilities, solve real-world problems, and vie for recognition among your peers.",
  },
  {
    title: "Inclusive Community Ethos",
    description:
      "At Blejsbuk, inclusivity and respect are at the core of our community ethos. We foster a safe and welcoming environment where all members can thrive, free from discrimination or harassment of any kind. Join us in shaping a more inclusive future for developers worldwide.",
  },
];
