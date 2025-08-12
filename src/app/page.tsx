import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, ShoppingCart, MessageCircle, Shield, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/585774-3840x2160-desktop-4k-vegetables-background-photo.jpg"
            alt="Fresh vegetables background"
            fill
            className="object-cover"
            priority
          />
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-green-900/30"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="glass rounded-full p-6 border border-white/20">
                <Leaf className="h-12 w-12 sm:h-16 sm:w-16 text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 drop-shadow-2xl">
              Welcome to <span className="gradient-green bg-clip-text text-transparent">Agri-Connect</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-10 leading-relaxed drop-shadow-lg max-w-4xl mx-auto opacity-95">
              Connecting farmers directly with buyers for fresh, quality produce.
              Build trust, ensure fair prices, and grow together in a sustainable marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md sm:max-w-none mx-auto">
              <Button size="lg" className="gradient-green hover:scale-105 text-white shadow-2xl transition-all duration-300 text-lg px-8 py-4">
                Start as Producer
              </Button>
              <Button size="lg" variant="outline" className="glass border-white/30 text-white hover:bg-white hover:text-slate-900 shadow-2xl transition-all duration-300 text-lg px-8 py-4">
                Join as Partner
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
              Why Choose <span className="gradient-green bg-clip-text text-transparent">Agri-Connect</span>?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our platform provides everything you need for successful agricultural trading in the digital age
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="glass p-6 sm:p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-200/50">
              <div className="flex justify-center mb-6">
                <div className="gradient-green rounded-full p-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Direct Connection</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect directly with verified producers and partners without intermediaries. Build lasting relationships in the agricultural community.
              </p>
            </Card>
            
            <Card className="glass p-6 sm:p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-200/50">
              <div className="flex justify-center mb-6">
                <div className="gradient-green rounded-full p-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Secure Transactions</h3>
              <p className="text-slate-600 leading-relaxed">
                Protected payments and escrow services ensure safe and reliable transactions. Your money is secure until delivery is confirmed.
              </p>
            </Card>
            
            <Card className="glass p-6 sm:p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-200/50 sm:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-6">
                <div className="gradient-green rounded-full p-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Market Growth</h3>
              <p className="text-slate-600 leading-relaxed">
                Access real-time market data and analytics to make informed decisions. Grow your agricultural business with data-driven insights.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              How It <span className="gradient-green bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Get started in three simple steps and join the agricultural revolution
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="gradient-green rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl font-bold text-white">1</span>
                </div>
                {/* Connecting line */}
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent"></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Create Your Profile</h3>
              <p className="text-slate-300 leading-relaxed">
                Sign up as a Producer or Partner and complete your profile with verification. Join our trusted community of agricultural professionals.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="gradient-green rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl font-bold text-white">2</span>
                </div>
                {/* Connecting line */}
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent"></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Connect & Trade</h3>
              <p className="text-slate-300 leading-relaxed">
                Browse fresh products, chat with partners in real-time, and negotiate deals directly. Build relationships that last.
              </p>
            </div>
            
            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="relative mb-8">
                <div className="gradient-green rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl sm:text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Secure Payment</h3>
              <p className="text-slate-300 leading-relaxed">
                Complete transactions safely with our built-in escrow system. Your payments are protected until delivery is confirmed.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Agricultural Showcase Section */}
      <section id="showcase" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
              Fresh from <span className="gradient-green bg-clip-text text-transparent">Farm to Table</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover the finest agricultural products from verified producers across the region
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 glass border border-slate-200/50">
              <Image
                src="/Agri900x450.jpg"
                alt="Fresh agricultural products"
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-1">Premium Vegetables</h3>
                <p className="text-sm opacity-90">Fresh, organic, locally sourced</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 glass border border-slate-200/50">
              <Image
                src="/1284104.jpg"
                alt="Quality agricultural produce"
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-1">Farm Fresh Produce</h3>
                <p className="text-sm opacity-90">Direct from certified farms</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 glass border border-slate-200/50 md:col-span-2 lg:col-span-1">
              <Image
                src="/BST010720227279-scaled.jpg"
                alt="Agricultural marketplace"
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-1">Sustainable Farming</h3>
                <p className="text-sm opacity-90">Eco-friendly practices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">
              Ready to Transform Your <span className="text-green-200">Agricultural Business</span>?
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-10 opacity-90 leading-relaxed">
              Join thousands of producers and partners who are already growing their business with Agri-Connect. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md sm:max-w-none mx-auto">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 hover:scale-105 shadow-2xl transition-all duration-300 text-lg px-8 py-4 font-semibold">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white bg-white/20 hover:bg-white hover:text-green-600 backdrop-blur-sm shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-8 py-4 font-semibold">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      </section>
      
      {/* Footer */}
        <footer id="contact" className="bg-slate-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-400 mr-2" />
                <span className="text-2xl font-bold">Agri-Connect</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md leading-relaxed">
                Connecting the agricultural community through technology. Building a sustainable future for farmers, producers, and partners worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 cursor-pointer hover:scale-110">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 cursor-pointer hover:scale-110">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 cursor-pointer hover:scale-110">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-green-400 transition-colors duration-200">For Producers</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors duration-200">For Partners</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors duration-200">Marketplace</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors duration-200">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-green-400 transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 sm:mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Agri-Connect. All rights reserved. Built with ❤️ for the agricultural community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
