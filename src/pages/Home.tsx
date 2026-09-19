import Hero from "../components/Hero";
import Story from "../components/Story";
import Tour from "../components/Tour";
import Women from "../components/Women";
import Shop from "../components/Shop";
import Newsletter from "../components/Newsletter";
import { useScrollToHash } from "../hooks/useScrollToHash";

export default function Home() {
  useScrollToHash();

  return (
    <>
      <Hero />
      <Story />
      <Tour />
      <Women />
      <Shop />
      <Newsletter />
    </>
  );
}
