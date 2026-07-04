import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Acknowledgements from "./components/Acknowledgements";
import References from "./components/References";
import Contact from "./components/Contact";
import MarginRail from "./components/MarginRail";
import CompileFooter from "./components/CompileFooter";
import SkipTypesetting from "./components/SkipTypesetting";
import PageNumber from "./components/PageNumber";
import CompileLog from "./components/CompileLog";
import PaperBehaviours from "./components/PaperBehaviours";
import { AnnotationProvider } from "./components/AnnotationContext";
import { TypesetProvider } from "./typeset/TypesetContext";

export default function App() {
  return (
    <TypesetProvider>
      <AnnotationProvider>
        <div className="bg-paper text-ink">
          <Nav />
          <main>
            <Hero />
            <About />
            <Projects />
            <Acknowledgements />
            <References order={140} />
            <Contact />
          </main>
          <CompileFooter />
          <MarginRail />
          <SkipTypesetting />
          <PageNumber />
          <CompileLog />
          <PaperBehaviours />
        </div>
      </AnnotationProvider>
    </TypesetProvider>
  );
}
