import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  FileText,
  GraduationCap,
  Lightbulb,
  ListTree,
  Scale,
  Settings2,
  Star,
  Target,
  Users,
  Waves,
} from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { Button } from '@/components/ui/button'
import { SplashLink } from '@/components/common/SplashTransition'
import { RexaLogoArtwork } from '@/components/common/Logo'

export function LandingPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-[#DCE8E1] bg-[#F7FAF7] dark:border-white/10 dark:bg-[#102D27]">
  {/* Soft background atmosphere */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
  >
<div className="absolute -right-32 -top-28 h-[520px] w-[520px] rounded-full bg-[#DDEFE5]/70 blur-3xl dark:bg-[#1D4C40]/60" />

<div className="absolute right-[18%] top-[24%] h-[360px] w-[360px] rounded-full border-[70px] border-[#E6F2EB]/70 dark:border-[#1D4C40]/60" />

<div className="absolute right-[27%] top-[18%] h-[430px] w-[430px] rounded-full border-[1px] border-[#D3E8DD]/80 dark:border-[#4C806D]/40" />

<div className="absolute right-[22%] top-[28%] h-[280px] w-[280px] rounded-full border-[1px] border-[#D8EADF]/70 dark:border-[#4C806D]/30" />

    {/* Small dotted texture */}
    <div
      className="absolute right-[5%] top-[18%] h-24 w-28 opacity-60"
      style={{
        backgroundImage:
          'radial-gradient(circle, #75B99B 1px, transparent 1px)',
        backgroundSize: '9px 9px',
      }}
    />

    <div
      className="absolute left-[43%] bottom-[8%] h-20 w-24 opacity-35"
      style={{
        backgroundImage:
          'radial-gradient(circle, #75B99B 1px, transparent 1px)',
        backgroundSize: '9px 9px',
      }}
    />
  </div>

  <div className="relative mx-auto grid min-h-[610px] max-w-[1400px] items-center gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:px-12 lg:py-16 xl:min-h-[650px] xl:px-16">
    {/* =========================================================
        LEFT — HERO COPY
       ========================================================= */}
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      className="relative z-10 max-w-[590px]"
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#286A56] dark:text-[#7AC7A8]">
          Descriptive answers. Deeper understanding.
        </span>

        <span className="hidden h-px w-10 bg-[#79B89C] sm:block" />
      </div>

      {/* Main heading */}
      <h1 className="mt-5 max-w-[560px] text-[#102D3D] dark:text-white">
        <span className="block font-serif text-[58px] font-semibold leading-[0.91] tracking-[-0.045em] text-[#17644F] dark:text-[#7AC7A8] sm:text-[68px] lg:text-[72px] xl:text-[78px]">
          REXA
        </span>
        <span className="mt-4 block max-w-[550px] text-[22px] font-semibold leading-[1.2] tracking-[-0.035em] sm:text-[25px] lg:text-[28px]">
          Explainable Reasoning Analysis of Descriptive Answers (REXA)
        </span>
      </h1>

      {/* Description */}
      <p className="mt-7 max-w-[475px] text-[15px] leading-[1.65] text-[#53636A] dark:text-[#B6C8C1] sm:text-base">
        RExA analyses descriptive answers to show how an answer is
        constructed, what it covers, and how deeply it reasons — with clear,
        evidence-based feedback.
      </p>

      {/* CTAs */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          className="h-11 rounded-lg border-0 bg-[#075B45] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#064D3B]"
          asChild
        >
          <SplashLink to={ROUTES.AUTH.LOGIN}>
            Get started
            <ArrowRight className="ml-1 h-4 w-4" />
          </SplashLink>
        </Button>

        <a
          href="#how-it-works"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#9ABDB0] bg-white/70 px-5 text-sm font-semibold text-[#183D35] transition-colors hover:bg-white dark:border-[#5A9D83] dark:bg-[#173C34] dark:text-white dark:hover:bg-[#1D4C40]"
        >
          See how it works
        </a>
      </div>
    </motion.div>

    {/* =========================================================
        RIGHT — RExA VISUAL
       ========================================================= */}
<motion.div
  initial={{ opacity: 0, x: 24 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7, delay: 0.12 }}
  className="relative hidden h-[430px] w-full lg:block"
>
  {/* Background reasoning rings */}
  <div
    aria-hidden="true"
    className="absolute left-[18%] top-[7%] h-[360px] w-[360px] rounded-full bg-[#DDEFE5]/55 dark:bg-[#1D4C40]/55"
  />

  <div
    aria-hidden="true"
    className="absolute left-[14%] top-[3%] h-[390px] w-[390px] rounded-full border border-[#CFE5DA] dark:border-[#4C806D]/40"
  />

  <div
    aria-hidden="true"
    className="absolute left-[25%] top-[13%] h-[300px] w-[300px] rounded-full border border-[#D7EAE1] dark:border-[#4C806D]/35"
  />

  <div
    aria-hidden="true"
   className="absolute left-[32%] top-[20%] h-[245px] w-[245px] rounded-full border border-[#DDEDE6] dark:border-[#4C806D]/30"
  />

  {/* Top-right dot pattern */}
  <div
    aria-hidden="true"
    className="absolute right-[1%] top-[4%] h-16 w-20 opacity-45"
    style={{
      backgroundImage:
        'radial-gradient(circle, #75B99B 1px, transparent 1px)',
      backgroundSize: '8px 8px',
    }}
  />

  {/* Bottom-left dot pattern */}
  <div
    aria-hidden="true"
    className="absolute bottom-[3%] left-[17%] h-16 w-20 opacity-40"
    style={{
      backgroundImage:
        'radial-gradient(circle, #75B99B 1px, transparent 1px)',
      backgroundSize: '8px 8px',
    }}
  />

  {/* =====================================================
      CONNECTOR SYSTEM
      Student Answer → junction → five analysis dimensions
      ===================================================== */}
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    viewBox="0 0 620 430"
    preserveAspectRatio="none"
    fill="none"
  >
    {/* Answer → central junction */}
    <path
      d="M255 214 H345"
      stroke="#17644F"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Sentence Roles */}
    <path
      d="M345 214 C385 214 386 63 430 63"
      stroke="#17644F"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Concept Coverage */}
    <path
      d="M345 214 C390 214 395 121 430 121"
      stroke="#17644F"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Support & Contradiction */}
    <path
      d="M345 214 C390 214 395 179 430 179"
      stroke="#17644F"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Reasoning Depth */}
    <path
      d="M345 214 C390 214 395 237 430 237"
      stroke="#17644F"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Star Prediction */}
    <path
      d="M345 214 C385 214 386 295 430 295"
      stroke="#17644F"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Central junction */}
    <circle
      cx="345"
      cy="214"
      r="4"
      fill="#17644F"
    />
  </svg>

  {/* =====================================================
      STUDENT ANSWER — compact 3D stack
      ===================================================== */}
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.25 }}
    className="absolute left-[5%] top-[25%] z-30 w-[205px]"
  >
    {/* Rear sheet 2 */}
    <div className="absolute left-5 top-5 h-[220px] w-[205px] rounded-[18px] border border-[#DCE8E1] bg-white/60 shadow-[0_12px_25px_rgba(20,70,55,0.06)] dark:border-white/10 dark:bg-[#173C34]/60" />

    {/* Rear sheet 1 */}
    <div className="absolute left-2.5 top-2.5 h-[220px] w-[205px] rounded-[18px] border border-[#DCE8E1] bg-white/80 shadow-[0_14px_28px_rgba(20,70,55,0.08)] dark:border-white/10 dark:bg-[#1A4238]/80"/>

    {/* Main answer sheet */}
    <div className="relative h-[220px] w-[205px] rounded-[18px] border border-[#DCE8E1] bg-white p-5 shadow-[0_20px_40px_rgba(20,70,55,0.12)] dark:border-white/10 dark:bg-[#173C34] dark:shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#183D35] dark:text-white">
          Student Answer
        </span>

        <span className="rounded-full bg-[#E7F2EC] px-2.5 py-1 text-[8px] font-semibold text-[#17644F] dark:bg-[#245446] dark:text-[#9DE0C2]">
          Answer
        </span>
      </div>

      <p className="mt-2 text-[8px] text-[#8A9994] dark:text-[#8FAEA3]">
        Descriptive response
      </p>

      <div className="mt-5 space-y-2.5">
        <div className="h-2.5 w-[88%] rounded-full bg-[#E8EEEB]" />
        <div className="h-2.5 w-[72%] rounded-full bg-[#CDE9DD]" />
        <div className="h-2.5 w-[62%] rounded-full bg-[#B8DECF]" />
        <div className="h-2.5 w-[80%] rounded-full bg-[#E8EEEB]" />

        <div className="h-2.5 w-[58%] rounded-full bg-[#F8D978]" />

        <div className="h-2.5 w-[74%] rounded-full bg-[#D9CCF7]" />
        <div className="h-2.5 w-[52%] rounded-full bg-[#C8B8F0]" />

        <div className="h-2.5 w-[70%] rounded-full bg-[#E8EEEB]" />
      </div>
    </div>
  </motion.div>

  {/* =====================================================
      FIVE ANALYSIS CARDS
      ===================================================== */}
  <div className="absolute right-0 top-[9%] z-30 w-[190px] space-y-[10px]">
    {[
      {
        icon: ListTree,
        title: 'Sentence Roles',
        iconClass: 'bg-[#E7F4ED] text-[#15936B]',
      },
      {
        icon: Target,
        title: 'Concept Coverage',
        iconClass: 'bg-[#EAF1FF] text-[#4D8DF7]',
      },
      {
        icon: Scale,
        title: 'Support & Contradiction',
        iconClass: 'bg-[#FFF0F1] text-[#F05B67]',
      },
      {
        icon: Waves,
        title: 'Reasoning Depth',
        iconClass: 'bg-[#F1EAFF] text-[#8B5CF6]',
      },
      {
        icon: Star,
        title: 'Star Prediction',
        iconClass: 'bg-[#FFF5DD] text-[#F2A900]',
      },
    ].map((item, index) => {
      const Icon = item.icon

      return (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.38 + index * 0.07,
          }}
          className="flex h-[48px] items-center gap-3 rounded-[15px] border border-[#DCE8E1] bg-white px-3 shadow-[0_8px_20px_rgba(20,70,55,0.09)]"
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}
          >
            <Icon className="h-[17px] w-[17px]" />
          </div>

          <span className="whitespace-nowrap text-[10px] font-semibold text-[#263E46]">
            {item.title}
          </span>
        </motion.div>
      )
    })}
  </div>
</motion.div>
  </div>
</section>

{/* =========================================================
    THE PROBLEM → THE SOLUTION
   ========================================================= */}
<section className="border-b border-[#DCE8E1] bg-[#F7FAF7] dark:border-white/10 dark:bg-[#102D27]">
  <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[1fr_90px_1fr] lg:px-12 lg:py-16 xl:px-16">

    {/* THE PROBLEM */}
    <div className="grid grid-cols-[1fr_150px] items-center gap-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#286A56] dark:text-[#7AC7A8]">
            The problem
          </span>
          <span className="h-px w-10 bg-[#79B89C]" />
        </div>

        <h2 className="mt-3 max-w-[430px] font-serif text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-[#102D3D] dark:text-white sm:text-[34px]">
          A single score
          <br />
          doesn’t show the full story.
        </h2>

        <p className="mt-4 max-w-[430px] text-sm leading-[1.6] text-[#53636A] dark:text-[#B6C8C1]">
          Traditional evaluation often focuses on marks or keywords,
          missing the reasoning, structure and depth behind an answer.
        </p>
      </div>

      {/* Score visual */}
      <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-[16px] bg-white shadow-[0_12px_30px_rgba(20,70,55,0.07)] dark:bg-[#173C34] dark:shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
        <div className="absolute left-3 top-3 h-[120px] w-[120px] rounded-[12px] border border-[#E3ECE7] bg-white" />

        <div className="relative z-10 h-[105px] w-[78px] rounded-[8px] border border-[#E1EAE5] bg-white p-3 shadow-sm">
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-[#E5ECE9]" />
            <div className="h-2 w-[82%] rounded-full bg-[#DDE7E2]" />
            <div className="h-2 w-[90%] rounded-full bg-[#E5ECE9]" />
            <div className="h-2 w-[70%] rounded-full bg-[#DDE7E2]" />
            <div className="h-2 w-[84%] rounded-full bg-[#E5ECE9]" />
          </div>

          <div className="absolute -right-5 bottom-5 flex h-11 w-11 items-center justify-center rounded-full border-[2px] border-[#F15B63] bg-white text-sm font-semibold text-[#F15B63] shadow-sm">
            3/5
          </div>
        </div>
      </div>
    </div>

    {/* ARROW */}
    <div className="hidden justify-center lg:flex">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F2EC] text-[#17644F] dark:bg-[#1D4C40] dark:text-[#8AD5B6]">
        <ArrowRight className="h-5 w-5" />
      </div>
    </div>

    {/* THE SOLUTION */}
    <div className="grid grid-cols-[1fr_150px] items-center gap-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#286A56] dark:text-[#7AC7A8]">
            The solution
          </span>
          <span className="h-px w-10 bg-[#79B89C]" />
        </div>

        <h2 className="mt-3 max-w-[430px] font-serif text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-[#102D3D] dark:!text-white sm:text-[34px]">
          RExA shows you the reasoning.
        </h2>

        <p className="mt-4 max-w-[430px] text-sm leading-[1.6] text-[#53636A] dark:!text-[#B6C8C1]">
          Instead of just a mark, RExA analyses the answer to reveal what
          it claims, how it supports its ideas, which key concepts are
          covered and how deeply it reasons.
        </p>
      </div>

      {/* Analysis visual */}
      <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-[16px] bg-[#EAF4EE]">
        <div className="relative h-[105px] w-[95px] rounded-[10px] border border-[#D6E7DE] bg-white p-3 shadow-sm">
          <div className="space-y-2">
            <div className="h-2 w-[88%] rounded-full bg-[#BFE4D4]" />
            <div className="h-2 w-[74%] rounded-full bg-[#BFE4D4]" />
            <div className="h-2 w-[64%] rounded-full bg-[#C9B8F1]" />
            <div className="h-2 w-[80%] rounded-full bg-[#F5D36E]" />
            <div className="h-2 w-[55%] rounded-full bg-[#C9B8F1]" />
          </div>

          {/* Analysis lens */}
          <div className="absolute -right-5 -bottom-4 flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-[#17644F] bg-white shadow-md">
            <div className="h-3 w-3 rounded-full bg-[#D9EEE4]" />
          </div>

          <div className="absolute -right-7 bottom-[-23px] h-7 w-[3px] rotate-[-42deg] rounded-full bg-[#17644F]" />
        </div>
      </div>
    </div>
  </div>
</section>
<section
  id="features"
  className="border-b border-[#DCE8E1] bg-[#F7FAF7] dark:border-white/10 dark:bg-[#102D27]"
>
  <div className="mx-auto max-w-[1320px] px-8 py-14 lg:px-12">

    {/* Section heading */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#17644F] dark:text-[#7AC7A8]">
          Features
        </span>

        <span className="h-px w-10 bg-[#79B89C] dark:bg-[#5A9D83]" />
      </div>

      <h2 className="mx-auto mt-4 max-w-[850px] font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#102D3D] dark:text-white sm:text-[38px]">
        Key capabilities for meaningful feedback
      </h2>

      <div className="mx-auto mt-4 h-[2px] w-10 bg-[#17644F] dark:bg-[#7AC7A8]" />
    </motion.div>

    {/* Feature row */}
    <div className="mx-auto mt-10 grid max-w-[1260px] grid-cols-5">

      {/* Sentence Roles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="px-6"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#E2F6ED] text-[#00A878] shadow-[0_4px_12px_rgba(0,168,120,0.08)]">
          <ListTree className="h-6 w-6" strokeWidth={2.5} />
        </div>

        <h3 className="mt-5 text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#173C34] dark:text-white">
          Sentence Roles
        </h3>

        <p className="mt-3 max-w-[205px] text-[13px] leading-[1.55] text-[#64766D] dark:text-[#B6C8C1]">
          Understand the role of each sentence — claim, evidence, reasoning,
          elaboration and more.
        </p>
      </motion.div>

      {/* Concept Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="border-l border-[#D4E1DB] px-6 dark:border-white/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#E8F1FF] text-[#377DFF] shadow-[0_4px_12px_rgba(55,125,255,0.08)]">
          <Target className="h-6 w-6" strokeWidth={2.5} />
        </div>

        <h3 className="mt-5 text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#173C34] dark:text-white">
          Concept Coverage
        </h3>

        <p className="mt-3 max-w-[205px] text-[13px] leading-[1.55] text-[#64766D] dark:text-[#B6C8C1]">
          See which key concepts from the reference answer are covered,
          partially covered or missing.
        </p>
      </motion.div>

      {/* Support & Contradiction */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="border-l border-[#D4E1DB] px-6 dark:border-white/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#FFF0F2] text-[#F05262] shadow-[0_4px_12px_rgba(240,82,98,0.08)]">
          <Scale className="h-6 w-6" strokeWidth={2.4} />
        </div>

        <h3 className="mt-5 text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#173C34] dark:text-white">
          Support & Contradiction
        </h3>

        <p className="mt-3 max-w-[205px] text-[13px] leading-[1.55] text-[#64766D] dark:text-[#B6C8C1]">
          Identify supporting statements, neutral information and direct
          contradictions.
        </p>
      </motion.div>

      {/* Reasoning Depth */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="border-l border-[#D4E1DB] px-6 dark:border-white/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#F1EBFF] text-[#8055F5] shadow-[0_4px_12px_rgba(128,85,245,0.08)]">
          <Waves className="h-6 w-6" strokeWidth={2.5} />
        </div>

        <h3 className="mt-5 text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#173C34] dark:text-white">
          Reasoning Depth
        </h3>

        <p className="mt-3 max-w-[205px] text-[13px] leading-[1.55] text-[#64766D] dark:text-[#B6C8C1]">
          Evaluate how far the answer goes beyond basic recall towards deeper
          explanation and synthesis.
        </p>
      </motion.div>

      {/* Star Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="border-l border-[#D4E1DB] px-6 dark:border-white/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#FFF6DE] text-[#F4B400] shadow-[0_4px_12px_rgba(244,180,0,0.08)]">
          <Star className="h-6 w-6" strokeWidth={2.3} />
        </div>

        <h3 className="mt-5 text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#173C34] dark:text-white">
          Star Prediction
        </h3>

        <p className="mt-3 max-w-[205px] text-[13px] leading-[1.55] text-[#64766D] dark:text-[#B6C8C1]">
          Combine all analysis insights into an explainable 1–5 star score.
        </p>
      </motion.div>

    </div>
  </div>
</section>

<section className="border-b border-[#DCE8E1] bg-[#F7FAF7] dark:border-white/10 dark:bg-[#102D27]">
  <div className="mx-auto max-w-[1380px] px-8 py-16 sm:px-10 lg:px-12 lg:py-20">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="text-center"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#286A56] dark:text-[#7AC7A8]">
        Built for everyone involved in assessment
      </p>

      <h2 className="mx-auto mt-3 max-w-[900px] font-serif text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#102D3D] dark:text-white sm:text-[36px] lg:text-[40px]">
        Support better learning with explainable evaluation
      </h2>
    </motion.div>

    {/* Audience cards */}
    <div className="mx-auto mt-10 grid max-w-[1240px] gap-5 md:grid-cols-3">

      {/* Students */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[128px] items-center gap-5 rounded-[10px] border border-white bg-white px-6 py-5 shadow-[0_8px_26px_rgba(20,70,55,0.07)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.045]"
      >
        <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[#E4F3EB] text-[#087653] dark:bg-[#174B3D] dark:text-[#8AD5B6]">
          <GraduationCap
            className="h-[32px] w-[32px]"
            strokeWidth={1.8}
          />
        </div>

        <div>
          <h3 className="text-[17px] font-semibold leading-tight text-[#173C34] dark:text-white">
            For Students
          </h3>

          <p className="mt-2 max-w-[270px] text-[12px] leading-[1.45] text-[#64766D] dark:text-[#B6C8C1]">
            Understand how your answer can be improved with clear,
            evidence-based feedback.
          </p>
        </div>
      </motion.div>

      {/* Teachers */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="flex min-h-[128px] items-center gap-5 rounded-[10px] border border-white bg-white px-6 py-5 shadow-[0_8px_26px_rgba(20,70,55,0.07)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.045]"
      >
        <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[#E4F3EB] text-[#087653] dark:bg-[#174B3D] dark:text-[#8AD5B6]">
          <Users
            className="h-[32px] w-[32px]"
            strokeWidth={1.8}
          />
        </div>

        <div>
          <h3 className="text-[17px] font-semibold leading-tight text-[#173C34] dark:text-white">
            For Teachers
          </h3>

          <p className="mt-2 max-w-[270px] text-[12px] leading-[1.45] text-[#64766D] dark:text-[#B6C8C1]">
            Save time and get consistent, transparent evaluation of
            descriptive answers.
          </p>
        </div>
      </motion.div>

      {/* Institutions */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="flex min-h-[128px] items-center gap-5 rounded-[10px] border border-white bg-white px-6 py-5 shadow-[0_8px_26px_rgba(20,70,55,0.07)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.045]"
      >
        <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[#E4F3EB] text-[#087653] dark:bg-[#174B3D] dark:text-[#8AD5B6]">
          <Building2
            className="h-[32px] w-[32px]"
            strokeWidth={1.8}
          />
        </div>

        <div>
          <h3 className="text-[17px] font-semibold leading-tight text-[#173C34] dark:text-white">
            For Institutions
          </h3>

          <p className="mt-2 max-w-[270px] text-[12px] leading-[1.45] text-[#64766D] dark:text-[#B6C8C1]">
            Bring reasoning-based evaluation into assessment and
            support fairer feedback.
          </p>
        </div>
      </motion.div>

    </div>
  </div>
</section>
{/* =========================================================
    HOW IT WORKS
   ========================================================= */}
<section
  id="how-it-works"
  className="border-t border-[#DCE8E1] bg-[#F7FAF7] dark:border-white/10 dark:bg-[#102D27]"
>
  <div className="mx-auto max-w-[1400px] px-8 py-8 sm:px-10 lg:px-12">
    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="text-center"
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#286A56] dark:text-[#7AC7A8]">
        HOW IT WORKS
      </p>

      <h2 className="mt-2 font-serif text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#102D3D] dark:text-white sm:text-[34px]">
        From question to explainable insights, in three simple steps
      </h2>

      <div className="mx-auto mt-3 h-[2px] w-[60px] bg-[#28765F] dark:bg-[#7AC7A8]" />
    </motion.div>

    {/* Steps */}
    <div className="mx-auto mt-8 grid max-w-[1320px] items-center lg:grid-cols-[1fr_48px_1fr_48px_1fr]">

      {/* STEP 01 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#087653] text-[10px] font-bold text-white">
          01
        </div>

        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#E4F3EB] text-[#087653] dark:bg-[#174B3D] dark:text-[#8AD5B6]">
          <FileText
            className="h-[27px] w-[27px]"
            strokeWidth={1.8}
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold leading-tight text-[#173C34] dark:text-white">
            Provide the question
          </h3>

          <p className="mt-1 max-w-[230px] text-[9px] leading-[1.4] text-[#64766D] dark:text-[#B6C8C1]">
            Enter a question along with the reference answer and key concepts.
          </p>
        </div>
      </motion.div>

      {/* ARROW */}
      <ArrowRight
        className="mx-auto hidden h-[22px] w-[22px] text-[#087653] lg:block"
        strokeWidth={1.7}
      />

      {/* STEP 02 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.07 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#087653] text-[10px] font-bold text-white">
          02
        </div>

        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#E4F3EB] text-[#087653] dark:bg-[#174B3D] dark:text-[#8AD5B6]">
          <Settings2
            className="h-[27px] w-[27px]"
            strokeWidth={1.8}
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold leading-tight text-[#173C34] dark:text-white">
            Run the analysis
          </h3>

          <p className="mt-1 max-w-[230px] text-[9px] leading-[1.4] text-[#64766D] dark:text-[#B6C8C1]">
            RExA analyses the answer using five reasoning dimensions.
          </p>
        </div>
      </motion.div>

      {/* ARROW */}
      <ArrowRight
        className="mx-auto hidden h-[22px] w-[22px] text-[#087653] lg:block"
        strokeWidth={1.7}
      />

      {/* STEP 03 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.14 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#087653] text-[10px] font-bold text-white">
          03
        </div>

        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#E4F3EB] text-[#087653] dark:bg-[#174B3D] dark:text-[#8AD5B6]">
          <Lightbulb
            className="h-[27px] w-[27px]"
            strokeWidth={1.8}
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold leading-tight text-[#173C34] dark:text-white">
            Explore the insights
          </h3>

          <p className="mt-1 max-w-[230px] text-[9px] leading-[1.4] text-[#64766D] dark:text-[#B6C8C1]">
            See the reasoning behind the evaluation with clear, explainable feedback.
          </p>
        </div>
      </motion.div>
    </div>
  </div>
</section>

{/* =========================================================
    FINAL CTA
   ========================================================= */}
<section className="relative isolate overflow-hidden bg-[#075B45] text-white dark:bg-[#063F32]">
  {/* Decorative curved atmosphere */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    <div className="absolute -left-20 top-1/2 h-[170px] w-[400px] -translate-y-1/2 rounded-[50%] border border-white/10" />

    <div className="absolute -left-8 top-1/2 h-[125px] w-[330px] -translate-y-1/2 rounded-[50%] border border-white/[0.07]" />

    <div className="absolute -right-20 top-1/2 h-[190px] w-[440px] -translate-y-1/2 rounded-[50%] border border-white/10" />

    <div className="absolute -right-8 top-1/2 h-[145px] w-[370px] -translate-y-1/2 rounded-[50%] border border-white/[0.07]" />

    <div
      className="absolute bottom-0 left-0 h-14 w-64 opacity-25"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '8px 8px',
      }}
    />
  </div>

  <div className="relative mx-auto flex max-w-[1400px] items-center justify-between gap-8 px-8 py-5 sm:px-10 lg:px-12">
    {/* CTA copy */}
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <p className="text-[7px] font-semibold uppercase tracking-[0.32em] text-[#A9DDC7]">
        Ready to explore RExA?
      </p>

      <h2 className="mt-1 font-serif text-[24px] font-semibold leading-none tracking-[-0.02em] text-white">
        See the reasoning, not just the score.
      </h2>

      <p className="mt-1.5 text-[8px] text-white/75">
        Create your account and start analysing descriptive answers.
      </p>
    </motion.div>

    {/* CTA buttons */}
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="flex shrink-0 items-center gap-2.5"
    >
      <Button
        asChild
        className="h-9 rounded-md bg-white px-4 text-[9px] font-semibold text-[#075B45] shadow-sm hover:bg-[#F2F8F5]"
      >
        <SplashLink to={ROUTES.AUTH.REGISTER}>
          Get started
          <ArrowRight className="ml-1 h-3 w-3" />
        </SplashLink>
      </Button>

      <Button
        asChild
        variant="outline"
        className="h-9 rounded-md border-white/40 bg-transparent px-5 text-[9px] font-semibold text-white hover:bg-white/10"
      >
        <SplashLink to={ROUTES.AUTH.LOGIN}>
          Sign in
        </SplashLink>
      </Button>
    </motion.div>
  </div>
</section>

{/* =========================================================
    FOOTER
   ========================================================= */}
<footer className="border-t border-[#DCE8E1] bg-[#F7FAF7] dark:border-white/10 dark:bg-[#102D27]">
  <div className="mx-auto flex h-[58px] max-w-[1400px] items-center justify-between px-8 sm:px-10 lg:px-12">
    {/* Brand */}
    <RexaLogoArtwork className="h-8 text-[11px]" />

    {/* Footer links */}
    <div className="flex items-center gap-6 text-[7px] text-[#64766D] dark:text-[#B6C8C1]">
      <a
        href="#features"
        className="transition-colors hover:text-[#075B45] dark:hover:text-[#8AD5B6]"
      >
        Features
      </a>

      <a
        href="#how-it-works"
        className="transition-colors hover:text-[#075B45] dark:hover:text-[#8AD5B6]"
      >
        How it works
      </a>

      <span>
        © 2026 RExA. All rights reserved.
      </span>
    </div>
  </div>
</footer>
    </div>
  )
}
