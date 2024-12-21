import Grid from '@/components/Grid';
import { FloatingNav } from './ui/FloatingNav';
import { Approach } from './Approach';
import HeroSection from './HeroSection';
import FAQ from './FAQ';
import { ThemeProvider } from './ThemeProvider';
import Footer from './Footer';
import { navItems } from '@/data';
const LandingPage = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <main className="relative bg-black-100 flex flex-col justify-center items-center overflow-hidden mx-auto sm-px-10 px-5 text-white">
        <div className="max-w-7xl w-full">
          <FloatingNav navItems={navItems} />
          <HeroSection />
          <Grid />
          <Approach />
          <FAQ />
          <Footer />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default LandingPage;
