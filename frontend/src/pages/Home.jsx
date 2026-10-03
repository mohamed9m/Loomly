import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Products from "../components/Products";

export default function Home() {
  console.log("HOME RENDER");
  return (
    <>
      <Navbar />
      <Hero />
      <Products />
    </>
  );
}
