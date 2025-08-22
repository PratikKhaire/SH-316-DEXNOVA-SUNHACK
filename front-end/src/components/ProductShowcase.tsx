"use client"
import ProductImage from "@/assets/product-image.png"
import Image from "next/image";
import pyramidImage from "@/assets/pyramid.png";
import tubeImage from "@/assets/tube.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {

    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const translateY = useTransform(scrollYProgress, [0, 1], [150, -150])


    return <section ref={sectionRef} className="pt-32 pb-10 bg-gradient-to-b from-white to-[#D2DCFF] overflow-x-clip">
        <div className="container">
            <div className="">
                <div className=" md:mx-28 lg:mx-44 flex flex-col  items-center text-center">
                    <div className="tag" >Boost your productivity</div>
                    <h1 className="text-3xl lg:text-7xl bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text font-bold tracking-tighter mt-6 ">A more effective way to track progress</h1>
                    <p className="sub-heading">Celebrate the joy of accomplishment with an app designed to track your progress, motivate your efforts.</p>
                </div>

                <div className="relative mt-20">
                    <Image src={ProductImage} alt="product-image" />
                    <motion.img src={pyramidImage.src} alt="pyramid-image" height={220} width={220} className=" hidden md:block md:absolute -top-24 -right-28" style={{ translateY }} />
                    <motion.img src={tubeImage.src} alt="tube-image" height={220} width={220} className="hidden md:block md:absolute top-40 -left-28" style={{ translateY }} />
                </div>

            </div>

        </div>

    </section>;
};
