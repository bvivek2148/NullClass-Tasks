import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/Components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs.jsx";
import { MessageCircle, Calendar, MapPin, Ticket, Sparkles, Clock, Shield, Award, TrendingUp, Users, Globe, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils/index.js";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const features = [
  {
    icon: MessageCircle,
    title: "24/7 AI सहायता",
    description: "किसी भी समय अपने सवालों का तुरंत जवाब पाएं। हमारा AI सहायक हमेशा आपकी मदद के लिए तैयार है।",
    color: "orange",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: Calendar,
    title: "आसान बुकिंग",
    description: "सेकंडों में अपनी यात्रा बुक करें। बस हमारे सहायक से बात करें और अपनी यात्रा बुक करें।",
    color: "blue",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: MapPin,
    title: "रूट जानकारी",
    description: "उपलब्ध रूट, समय सारणी और कीमतों की जानकारी प्राप्त करें। अपनी यात्रा के लिए सभी विवरण पाएं।",
    color: "green",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Clock,
    title: "रियल-टाइम अपडेट",
    description: "लाइव शेड्यूल अपडेट और अपनी यात्रा के बारे में तत्काल सूचनाओं के साथ सूचित रहें।",
    color: "purple",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "सुरक्षित भुगतान",
    description: "आपके लेनदेन बैंक-स्तरीय सुरक्षा और एन्क्रिप्शन के साथ सुरक्षित हैं।",
    color: "red",
    gradient: "from-red-500 to-red-600"
  },
  {
    icon: Award,
    title: "सर्वोत्तम मूल्य गारंटी",
    description: "हम सुनिश्चित करते हैं कि आपको अपनी सभी यात्रा बुकिंग के लिए सबसे अच्छी कीमतें मिलें।",
    color: "yellow",
    gradient: "from-yellow-500 to-yellow-600"
  }
];

const stats = [
  { icon: Users, value: "10 लाख+", label: "खुश यात्री" },
  { icon: MapPin, value: "500+", label: "उपलब्ध रूट" },
  { icon: TrendingUp, value: "98%", label: "संतुष्टि दर" },
  { icon: Globe, value: "100+", label: "जुड़े शहर" }
];

const testimonials = [
  {
    name: "विवेक बुक्का",
    role: "व्यवसायिक यात्री",
    content: "Yatra Saathi ने मेरी यात्रा बुकिंग के तरीके में क्रांति ला दी है। AI सहायक बेहद मददगार है और मेरा बहुत समय बचाता है!",
    rating: 5
  },
  {
    name: "राजेश कुमार",
    role: "छुट्टी योजनाकार",
    content: "सबसे अच्छा ट्रैवल बुकिंग प्लेटफॉर्म जो मैंने इस्तेमाल किया है। इंटरफ़ेस सहज है और सहायता उत्कृष्ट है।",
    rating: 5
  },
  {
    name: "अनीता पटेल",
    role: "नियमित यात्री",
    content: "मुझे यह पसंद है कि रूट खोजना और टिकट बुक करना कितना आसान है। रियल-टाइम अपडेट गेम चेंजर हैं!",
    rating: 5
  }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-green-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">AI से चलने वाला यात्रा मंच</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              AI सहायता के साथ
              <span className="block mt-2">स्मार्ट यात्रा करें</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-orange-50 leading-relaxed"
            >
              तत्काल सहायता, रियल-टाइम अपडेट और व्यक्तिगत यात्रा सिफारिशों के साथ निर्बाध बुकिंग का अनुभव करें।
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link to={createPageUrl("Chat")}>
                <Button 
                  size="lg" 
                  className="gap-2 bg-white text-orange-700 hover:bg-slate-50 shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 text-lg px-10 py-7 rounded-2xl font-semibold"
                >
                  <MessageCircle className="h-6 w-6" />
                  अभी बात करें
                </Button>
              </Link>
              <Link to={createPageUrl("Routes")}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-lg px-10 py-7 rounded-2xl font-semibold"
                >
                  <MapPin className="h-6 w-6" />
                  रूट देखें
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section with Tabs */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              आपको जो कुछ भी चाहिए
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              शक्तिशाली सुविधाएं जो आपके यात्रा अनुभव को निर्बाध और आनंददायक बनाने के लिए डिज़ाइन की गई हैं
            </p>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-12" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-16 bg-slate-100 p-1.5 rounded-2xl">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 text-base font-semibold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                अवलोकन
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 text-base font-semibold"
              >
                <Award className="h-5 w-5 mr-2" />
                सुविधाएं
              </TabsTrigger>
              <TabsTrigger 
                value="how-it-works" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 text-base font-semibold"
              >
                <Globe className="h-5 w-5 mr-2" />
                कैसे काम करता है
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.slice(0, 3).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-full border-slate-200 hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-2xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-600 leading-relaxed text-base">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <Card className="h-full border-slate-200 hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-2xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-600 leading-relaxed text-base">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="how-it-works">
              <div className="max-w-4xl mx-auto space-y-8">
                {[
                  {
                    step: "01",
                    title: "बातचीत शुरू करें",
                    description: "चैट बटन पर क्लिक करें और हमारे AI सहायक को बताएं कि आप कहां जाना चाहते हैं।",
                    icon: MessageCircle,
                    color: "orange"
                  },
                  {
                    step: "02",
                    title: "विकल्प खोजें",
                    description: "तुरंत व्यक्तिगत रूट सुझाव, समय सारणी और मूल्य निर्धारण प्राप्त करें।",
                    icon: MapPin,
                    color: "blue"
                  },
                  {
                    step: "03",
                    title: "अपनी यात्रा बुक करें",
                    description: "अपने बुकिंग विवरण की पुष्टि करें और तुरंत पुष्टिकरण प्राप्त करें।",
                    icon: Ticket,
                    color: "green"
                  },
                  {
                    step: "04",
                    title: "आत्मविश्वास से यात्रा करें",
                    description: "अपनी यात्रा के दौरान रियल-टाइम अपडेट और सहायता प्राप्त करें।",
                    icon: Shield,
                    color: "purple"
                  }
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                    >
                      <Card className="border-slate-200 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                        <CardContent className="p-8 flex items-start gap-8">
                          <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-2xl flex items-center justify-center shadow-xl`}>
                            <Icon className="h-10 w-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-400 mb-3">चरण {step.step}</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-base">{step.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              यात्रियों द्वारा पसंद किया गया
            </h2>
            <p className="text-xl text-slate-600">
              हमारे ग्राहकों को अपने अनुभव के बारे में क्या कहना है, देखें
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-slate-200 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-8"
            >
              <Sparkles className="h-20 w-20 mx-auto" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">अपनी यात्रा शुरू करने के लिए तैयार हैं?</h2>
            <p className="text-xl text-orange-50 mb-10 leading-relaxed">
              हजारों संतुष्ट यात्रियों के साथ जुड़ें और आज ही यात्रा बुकिंग के भविष्य का अनुभव करें।
            </p>
            <Link to={createPageUrl("Chat")}>
              <Button 
                size="lg" 
                className="gap-2 bg-white text-orange-700 hover:bg-slate-50 shadow-2xl hover:shadow-white/50 transition-all duration-300 text-lg px-10 py-7 rounded-2xl font-semibold"
              >
                <MessageCircle className="h-6 w-6" />
                अभी शुरू करें
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}