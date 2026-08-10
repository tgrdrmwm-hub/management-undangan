import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star, Gem, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const stackRef = useRef(null);
  const heroImageRef = useRef(null);
  const marqueeRef = useRef(null);
  const scrubTextRef = useRef(null);
  const btnRef = useRef(null);
  
  // Magnetic Button Effect
  const handleMouseMove = (e) => {
    if(!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: 'power3.out' });
  };
  const handleMouseLeave = () => {
    if(!btnRef.current) return;
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Image Fade & Scale on Scroll
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          scale: 1.15,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }

      // 2. Floating Elements in Hero
      gsap.to('.floating-elem', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });
      
      gsap.to('.floating-elem-2', {
        y: 20,
        rotation: 5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3
      });

      // 3. Infinite Marquee
      if (marqueeRef.current) {
        gsap.to('.marquee-track', {
          xPercent: -50,
          ease: 'none',
          duration: 15,
          repeat: -1,
        });
      }

      // 4. Scroll Pinning Section (How It Works)
      if (stackRef.current) {
        ScrollTrigger.create({
          trigger: stackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: '.pin-left',
          pinSpacing: false,
        });
      }
      
      // Image Parallax for Steps
      gsap.utils.toArray('.img-parallax').forEach(img => {
        gsap.fromTo(img, 
          { scale: 1.15, y: -20 },
          {
            scale: 1,
            y: 20,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });

      // 5. Scrubbing Text Reveal
      if (scrubTextRef.current) {
        const words = scrubTextRef.current.querySelectorAll('.scrub-word');
        gsap.fromTo(
          words,
          { opacity: 0.1, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: scrubTextRef.current,
              start: 'top 80%',
              end: 'bottom 50%',
              scrub: 1,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-luxury-smoke text-luxury-dark selection:bg-luxury-dark selection:text-white">
      
      {/* NAV: Centered minimal */}
      <nav className="fixed top-0 w-full z-50 p-6 mix-blend-difference text-white">
        <div className="flex justify-between items-center max-w-[1400px] mx-auto">
          <div className="font-sans font-bold text-xl tracking-tight uppercase flex items-center gap-2">
            <Sparkles size={16} /> WD Group Company
          </div>
          <Link to="/login" className="text-sm font-medium tracking-wide uppercase hover:opacity-50 transition-opacity">
            Portal
          </Link>
        </div>
      </nav>

      <main>
        {/* HERO: Cinematic Center with Floating Elements */}
        <section className="hero-section relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 overflow-hidden bg-luxury-dark text-white">
          <div 
            ref={heroImageRef}
            className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(17,18,19,0.8)_100%)]"></div>
          </div>
          
          {/* Floating Decor Elements */}
          <div className="floating-elem absolute top-[20%] left-[10%] hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <Gem size={16} /> <span className="text-xs uppercase tracking-widest">Premium</span>
          </div>
          <div className="floating-elem-2 absolute bottom-[25%] right-[12%] hidden lg:flex items-center gap-3 bg-luxury-dark/40 backdrop-blur-md p-2 pr-6 rounded-full border border-white/10">
            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=100&q=80" className="w-10 h-10 rounded-full object-cover" alt="ring" />
            <span className="text-xs uppercase tracking-widest font-bold">100+ Tema</span>
          </div>
          
          <div className="relative z-10 w-full text-center px-4 flex flex-col items-center">
            <span className="uppercase tracking-[0.3em] text-xs font-bold text-luxury-silver mb-8 block">Est. 2026 • Digital</span>
            <h1 className="text-[clamp(4rem,10vw,12rem)] leading-[0.85] font-black tracking-tighter uppercase max-w-[90vw] mx-auto text-white mix-blend-overlay">
              The Art of <br/> Invitation
            </h1>
            <p className="mt-12 text-lg md:text-xl font-medium text-luxury-silver max-w-[40ch] mx-auto">
              Merayakan setiap babak baru dengan desain tak lekang oleh waktu dan teknologi yang mulus.
            </p>
          </div>
        </section>

        {/* INFINITE MARQUEE */}
        <section className="py-12 border-y border-luxury-silver/20 overflow-hidden bg-luxury-smoke text-luxury-dark" ref={marqueeRef}>
          <div className="flex whitespace-nowrap marquee-track w-max items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="text-2xl md:text-4xl font-bold uppercase tracking-widest px-8">WD Group Company</span>
                <Star size={16} className="text-luxury-grey" />
                <span className="text-2xl md:text-4xl font-serif italic px-8">Digital Luxury</span>
                <Star size={16} className="text-luxury-grey" />
              </div>
            ))}
          </div>
        </section>

        {/* HORIZONTAL ACCORDIONS (Interest) */}
        <section className="py-24 md:py-32 px-6 max-w-[1400px] mx-auto bg-luxury-smoke">
          <div className="mb-20 text-center flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-grey mb-4 block">Eksplorasi</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">Tanpa Batas</h2>
          </div>
          
          <div className="flex flex-col md:flex-row h-[60vh] gap-4">
            {[
              { title: "Desain Mewah", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { title: "Responsif", img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { title: "Interaktif", img: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="group relative flex-1 hover:flex-[3] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-[2rem] bg-luxury-silver cursor-pointer"
              >
                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/90 via-luxury-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-3xl font-bold uppercase tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm font-medium text-luxury-silver hidden md:block">Pengalaman visual yang dirancang untuk memukau di setiap detik guliran layar.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GSAP SCROLL PINNING (Cara Kerja - Reverted from V1) */}
        <section className="relative py-24 md:py-48 bg-luxury-smoke border-t border-luxury-silver/20" ref={stackRef}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 md:gap-24 relative">
            
            {/* Pinned Left Side */}
            <div className="w-full md:w-5/12 pin-left h-auto md:h-screen flex flex-col justify-center">
              <span className="text-luxury-grey font-bold tracking-widest uppercase text-xs mb-6 flex items-center gap-2">
                <Star size={16} /> Cara Kerja
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] uppercase">
                Tiga Langkah <br/>
                <span className="font-serif italic text-luxury-grey lowercase">Mudah</span>
              </h2>
              <p className="text-xl text-luxury-grey max-w-[30ch] font-medium leading-relaxed">
                Proses pembuatan undangan digital yang dirancang untuk efisiensi tinggi tanpa mengorbankan kualitas dan nilai estetika.
              </p>
            </div>

            {/* Scrolling Right Side */}
            <div className="w-full md:w-7/12 flex flex-col gap-32 py-[10vh] md:py-[15vh]">
              {[
                { num: "01", title: "Pilih Tema", desc: "Konsultasikan visi Anda dan pilih dari koleksi tema eksklusif WD Group Company.", img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                { num: "02", title: "Kirim Data", desc: "Lengkapi cerita cinta Anda, detail acara, dan galeri pre-wedding untuk personalisasi.", img: "https://images.unsplash.com/photo-1529636798458-18c639c42818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                { num: "03", title: "Siap Disebar", desc: "Terima tautan undangan Anda dan bagikan ke seluruh dunia hanya dengan satu klik.", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col gap-10 group bg-white p-6 md:p-8 rounded-[3rem] shadow-xl border border-black/5">
                  <div className="overflow-hidden rounded-[2rem] aspect-[4/3] w-full relative">
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover img-parallax scale-110" />
                    <div className="absolute inset-0 bg-luxury-dark/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-luxury-grey font-serif text-4xl italic block">{step.num}</span>
                      <div className="h-[1px] flex-1 bg-luxury-grey/20"></div>
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tight mb-4">{step.title}</h3>
                    <p className="text-lg text-luxury-grey max-w-[40ch] font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </section>

        {/* SCRUBBING TEXT REVEAL & FEEDBACK CAROUSEL */}
        <section className="py-32 md:py-48 bg-luxury-smoke text-luxury-dark flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          
          {/* Scrubbing Text */}
          <div className="max-w-[1000px] mx-auto mb-32" ref={scrubTextRef}>
            <p className="text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tighter uppercase">
              {"Jadikan kesan pertama pernikahan Anda sebuah karya seni yang tak terlupakan.".split(' ').map((word, i) => (
                <span key={i} className="scrub-word inline-block mr-3 md:mr-5">{word}</span>
              ))}
            </p>
          </div>

          <div className="max-w-[800px] mx-auto mb-32 flex flex-col items-center bg-white p-12 rounded-[3rem] shadow-xl border border-black/5 relative">
            <div className="absolute -top-6 bg-luxury-dark text-white p-3 rounded-full shadow-lg">
              <Star size={24} fill="#FFF" />
            </div>
            <p className="text-xl md:text-3xl font-serif italic mb-10 mt-4 text-center">
              "WD Group Company mengubah cara kami memandang undangan pernikahan. Bukan sekadar informasi, melainkan sebuah mahakarya digital yang memukau tamu kami."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Sarah & John" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div className="font-bold uppercase text-sm tracking-widest">Sarah & John</div>
                <div className="text-luxury-grey text-xs font-bold uppercase mt-1">Bali, 2026</div>
              </div>
            </div>
          </div>
          
          {/* Magnetic CTA Button */}
          <div className="p-8 cursor-pointer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <a 
              ref={btnRef}
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group inline-flex items-center justify-center bg-luxury-dark text-white px-12 py-6 rounded-[2rem] hover:bg-luxury-silver hover:text-luxury-dark transition-colors duration-500 text-lg md:text-xl font-bold tracking-wide uppercase shadow-2xl"
            >
              Mulai Sekarang
              <ArrowRight size={24} className="ml-4 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-luxury-dark text-luxury-silver py-12 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-12">
          <div className="font-bold text-2xl text-white uppercase tracking-tighter flex items-center gap-2">
            <Sparkles size={16} /> WD Group Company
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
