import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import MarginRail from "./components/MarginRail";
import { AnnotationProvider } from "./components/AnnotationContext";

export default function App() {
  return (
    <AnnotationProvider>
      <div className="bg-paper text-ink">
        <Nav />
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <MarginRail />
      </div>
    </AnnotationProvider>
  );
}
