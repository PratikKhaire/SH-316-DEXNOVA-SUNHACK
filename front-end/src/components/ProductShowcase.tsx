"use client"
import ProductImage from "@/assets/product-image.png"
import Image from "next/image";
import pyramidImage from "@/assets/pyramid.png";
import tubeImage from "@/assets/tube.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, BarChart3, Users, Globe } from "lucide-react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Verified Ownership",
      description: "Every land transaction is recorded on the blockchain for complete transparency"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      title: "Real-time Analytics",
      description: "Track land value trends and ownership history with detailed analytics"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Multi-party Access",
      description: "Secure access for owners, government agencies, and legal representatives"
    },
    {
      icon: <Globe className="h-6 w-6 text-amber-600" />,
      title: "Global Standards",
      description: "Compliant with international land registry and blockchain standards"
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 overflow-x-clip"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZmEiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Innovative Technology
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Transforming Land{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Registry Management
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Revolutionize how land ownership is recorded, verified, and transferred with our 
            blockchain-powered platform designed for security, transparency, and efficiency.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm border flex items-center justify-center mx-auto mb-4 group-hover:shadow-md transition-shadow">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <Image 
              src={ProductImage} 
              alt="LandLedger platform interface showing property management dashboard" 
              className="w-full h-auto"
              width={1200}
              height={800}
            />
          </div>
          
          {/* Floating elements */}
          <motion.img 
            src={pyramidImage.src} 
            alt="Data structure visualization"
            width={120}
            height={120}
            className="hidden lg:block absolute -top-12 -right-12"
            style={{ translateY: translateY }}
          />
          
          <motion.img 
            src={tubeImage.src} 
            alt="Network connection visualization"
            width={100}
            height={100}
            className="hidden lg:block absolute -bottom-8 -left-8 rotate-45"
            style={{ translateY: translateY }}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mt-20 text-center"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime Reliability</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">1000+</div>
            <div className="text-gray-600">Properties Registered</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
