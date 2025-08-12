import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Leaf className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-green-600">Agri-Connect</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The digital marketplace connecting agricultural producers with partners. 
            Trade securely, communicate directly, and grow your agricultural business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Get Started as Producer
            </Button>
            <Button size="lg" variant="outline">
              Browse as Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Agri-Connect?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Direct Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect directly with producers and partners. No middlemen, 
                better prices, stronger relationships.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Secure Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built-in escrow system ensures safe payments. Your money is 
                protected until delivery is confirmed.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Grow Your Business</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access analytics, manage inventory, and scale your agricultural 
                operations with our comprehensive platform.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Register</h3>
              <p className="text-gray-600">Sign up as a Producer or Partner</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">List or Browse</h3>
              <p className="text-gray-600">Create listings or discover products</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Chat and negotiate deals</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Trade Safely</h3>
              <p className="text-gray-600">Complete secure transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Leaf className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-gray-400">
            © 2024 Agri-Connect. Connecting agriculture, growing futures.
          </p>
        </div>
      </footer>
    </div>
  );
}
