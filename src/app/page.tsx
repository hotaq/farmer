import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, ShoppingCart, MessageCircle, Shield, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/585774-3840x2160-desktop-4k-vegetables-background-photo.jpg"
            alt="Fresh vegetables background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Leaf className="h-16 w-16 text-green-400" />
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 drop-shadow-lg">
              Welcome to <span className="text-green-400">Agri-Connect</span>
            </h1>
            <p className="text-xl mb-8 leading-relaxed drop-shadow-md max-w-3xl mx-auto">
              Connecting farmers directly with buyers for fresh, quality produce.
              Build trust, ensure fair prices, and grow together in a sustainable marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                Start as Producer
              </Button>
              <Button size="lg" variant="outline" className="border-white text-gray-900 bg-white/20 hover:bg-white hover:text-green-600 backdrop-blur-sm shadow-lg">
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
      <section className="bg-gradient-to-b from-white to-green-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Agri-Connect?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides everything you need for successful agricultural trading in the digital age
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Direct Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Connect directly with verified producers and partners without intermediaries. Build lasting relationships in the agricultural community.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Secure Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Protected payments and escrow services ensure safe and reliable transactions. Your money is secure until delivery is confirmed.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Market Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Access real-time market data and analytics to make informed decisions. Grow your agricultural business with data-driven insights.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and join the agricultural revolution
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                {/* Connecting line */}
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Create Your Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up as a Producer or Partner and complete your profile with verification. Join our trusted community of agricultural professionals.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                {/* Connecting line */}
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Connect & Trade</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse fresh products, chat with partners in real-time, and negotiate deals directly. Build relationships that last.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Secure Payment</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete transactions safely with our built-in escrow system. Your payments are protected until delivery is confirmed.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Agricultural Showcase Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Fresh from Farm to Table
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the finest agricultural products from verified producers across the region
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <Image
                src="/Agri900x450.jpg"
                alt="Fresh agricultural products"
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold mb-1">Premium Vegetables</h3>
                <p className="text-sm opacity-90">Fresh, organic, locally sourced</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <Image
                src="/1284104.jpg"
                alt="Quality agricultural produce"
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold mb-1">Farm Fresh Produce</h3>
                <p className="text-sm opacity-90">Direct from certified farms</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <Image
                src="/BST010720227279-scaled.jpg"
                alt="Agricultural marketplace"
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold mb-1">Sustainable Farming</h3>
                <p className="text-sm opacity-90">Eco-friendly practices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Agricultural Business?
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Join thousands of producers and partners who are already growing their business with Agri-Connect. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-lg px-8 py-4 text-lg font-semibold">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-gray-900 bg-white/20 hover:bg-white hover:text-green-600 backdrop-blur-sm shadow-lg px-8 py-4 text-lg font-semibold">
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-400 mr-2" />
                <span className="text-2xl font-bold">Agri-Connect</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting the agricultural community through technology. Building a sustainable future for farmers, producers, and partners worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">For Producers</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">For Partners</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Agri-Connect. All rights reserved. Built with ❤️ for the agricultural community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
