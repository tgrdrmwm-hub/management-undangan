import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Smartphone, Globe, MessageCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-serif text-2xl sm:text-3xl font-bold text-wedding-gold">Eterna</div>
          <Link to="/login" className="text-sm sm:text-base text-gray-800 font-medium hover:text-wedding-gold transition-colors px-3 py-1.5 rounded-md hover:bg-white/50">
            Login Admin
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[70vh] sm:min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-pink/20 to-wedding-gold/10 mix-blend-multiply" />
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Wedding Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up w-full">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight leading-tight">
            Bagikan Momen <br/> 
            <span className="text-wedding-gold italic font-handwriting text-4xl sm:text-6xl md:text-8xl">Spesialmu</span>
          </h1>
          <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
            Layanan pembuatan undangan pernikahan digital yang elegan, modern, dan mudah dibagikan. Buat kesan pertama yang tak terlupakan.
          </p>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-wedding-gold rounded-full hover:bg-yellow-600 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <MessageCircle size={20} className="mr-2" />
            Buat Undangan Sekarang
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-4">Kenapa Memilih Eterna?</h2>
            <div className="w-20 sm:w-24 h-1 bg-wedding-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {[
              { icon: <Smartphone size={36} className="text-wedding-gold"/>, title: 'Responsif', desc: 'Tampilan undangan sempurna di berbagai perangkat, baik ponsel, tablet, maupun desktop.' },
              { icon: <Sparkles size={36} className="text-wedding-gold"/>, title: 'Desain Elegan', desc: 'Pilihan tema modern dan mewah yang dirancang khusus untuk pernikahan Anda.' },
              { icon: <Globe size={36} className="text-wedding-gold"/>, title: 'Mudah Dibagikan', desc: 'Cukup bagikan satu tautan unik ke semua tamu undangan Anda melalui pesan singkat.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-wedding-gold/10 mb-4 sm:mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wedding-dark text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wedding-gold mb-3 sm:mb-4">Eterna</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Layanan Undangan Digital Premium</p>
          <div className="flex justify-center space-x-4 sm:space-x-6 text-gray-400 text-sm sm:text-base">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
            <a href="#" className="hover:text-white transition-colors">Email</a>
          </div>
          <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">© 2026 Eterna Invitation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
