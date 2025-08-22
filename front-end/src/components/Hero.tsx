"use client"
import ArrowIcon from "@/assets/arrow-right.svg";
import Image from "next/image";
import cogImage from "@/assets/cog.png";
import cylinderImage from "@/assets/cylinder.png";
import noodleImage from "@/assets/noodle.png";
import { easeInOut, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const Hero = () => {

    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start end", "end start"]
    });

    const translateY = useTransform(scrollYProgress, [0, 1], [150, -150])

    return <section ref={heroRef} className="   max-w-full p-25  md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#F5DB8C,#EAEEFE_100%)] overflow-x-clip">
        <div className="container lg:px-0">
            <div className="md:flex items-center justify-center gap-16">
                <div className="md:[w-478px]">
                    <div>
                        <div className="text-sm border border-[#222]/10 inline-flex px-3 py-1 rounded-lg tracking-tight">Version 2.0 is here</div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#008026] text-transparent bg-clip-text mt-5  line-height">Welcome to LandLedger. </h1>
                        <p className="text-xl text-[#010D3E] tracking-tight mt-6 ">The simple, modern, and secure way to manage and verify land ownership online. Visualize properties on the map and see their history.</p>
                    </div>
                    <div className="mt-7 flex gap-1 items-center">
                        <button className="btn btn-primary">connect wallet</button>
                        <button className="btn btn-text gap-1"><span>Learn more</span>
                            {/* <ArrowIcon className="h-5 w-5" /> */}
                        </button>
                    </div>
                </div>

                <div className="pt-12 md:mt-0 md:h-[648px] md:w-[648px] lg:h-[600px] relative  ">
                    <motion.img src={cogImage.src} alt="cog image" className="md:absolute  md:h-full md:w-auto md:max-w-none lg:-left-50 lg:-top-4" animate={{ translateY: [-20, 50], }} transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: easeInOut }} />
                    {/* <motion.img src={cylinderImage.src} alt="house img " width={220} height={220} className="hidden md:block -top-8 -left-32 md:absolute lg:-left-44" style={{ translateY: translateY }} /> */}
                    <motion.img src={noodleImage.src} alt="noodle image" width={220} className="hidden lg:block absolute top-[520px] left-[350px] rotate-[30deg]" style={{ rotate: 30, translateY: translateY }} />
                </div>
            </div>
        </div>
    </section>;
};
