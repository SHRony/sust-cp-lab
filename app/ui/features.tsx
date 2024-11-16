"use client";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Target, 
  Scale, 
  Trophy,
  ClipboardList,
  LineChart,
  Zap,
  Link as LinkIcon,
  MessageCircle
} from "lucide-react";

const FeatureSections = () => {
  return (
    <div className="px-4 py-16 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Smart Team Formation */}
      <section className="max-w-6xl mx-auto mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-slate-200 mb-4 text-center"
        >
          Algorithmic Team Formation
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-slate-400 text-center mb-12 max-w-2xl mx-auto"
        >
          Our sophisticated algorithms ensure optimal team composition based on performance metrics and compatibility factors
        </motion.p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Performance-Based Matching"
            description="Advanced algorithms analyze Codeforces ratings, solving patterns, and historical performance to create balanced teams"
            icon={<BarChart3 className="w-8 h-8 stroke-2" />}
          />
          <FeatureCard
            title="Multi-Factor Analysis"
            description="Comprehensive evaluation considering problem categories, solving speed, and consistency metrics"
            icon={<Target className="w-8 h-8 stroke-2" />}
          />
          <FeatureCard
            title="Balanced Distribution"
            description="Ensures even distribution of skills across teams using mathematical optimization techniques"
            icon={<Scale className="w-8 h-8 stroke-2" />}
          />
        </div>
      </section>

      {/* Contest Management */}
      <section className="max-w-6xl mx-auto mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-slate-200 mb-4 text-center"
        >
          Comprehensive Contest Platform
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-slate-400 text-center mb-12 max-w-2xl mx-auto"
        >
          Everything you need to run successful programming contests
        </motion.p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Contest Creation"
            description="Intuitive tools for creating and managing programming contests with customizable parameters"
            icon={<Trophy className="w-8 h-8 stroke-2" />}
          />
          <FeatureCard
            title="Team Registration"
            description="Streamlined process for team formation and contest registration with automated validation"
            icon={<ClipboardList className="w-8 h-8 stroke-2" />}
          />
          <FeatureCard
            title="Performance Analytics"
            description="Comprehensive real-time tracking and analysis of contest performance with detailed insights"
            icon={<LineChart className="w-8 h-8 stroke-2" />}
          />
        </div>
      </section>

      {/* Platform Integration */}
      <section className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-slate-200 mb-4 text-center"
        >
          Integrated Platforms
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-slate-400 text-center mb-12 max-w-2xl mx-auto"
        >
          Seamlessly connected with popular competitive programming platforms
        </motion.p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Codeforces Integration"
            description="Direct connection with Codeforces API for real-time rating and performance data synchronization"
            icon={<Zap className="w-8 h-8 stroke-2" />}
          />
          <FeatureCard
            title="Vjudge Support"
            description="Comprehensive integration with Vjudge platform for access to diverse problem sets"
            icon={<LinkIcon className="w-8 h-8 stroke-2" />}
          />
          <FeatureCard
            title="Community Forum"
            description="Interactive space for discussions, problem-solving strategies, and knowledge exchange"
            icon={<MessageCircle className="w-8 h-8 stroke-2" />}
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className="p-8 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-600 transition-all shadow-lg hover:shadow-xl"
    >
      <div className="text-slate-200 mb-6 bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureSections;
