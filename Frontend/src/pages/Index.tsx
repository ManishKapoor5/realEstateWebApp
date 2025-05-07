import AppPromoSection from "@/components/AppPromotion";
import ExploreByCategories from "@/components/ExploreByCategories";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LocationList from "@/components/LocationList";
import PropertyFilters from "@/components/PropertyFilters";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        {/* <PropertyFilters /> */}
        <FeaturedProperties />
        <ExploreByCategories />
        <LocationList />
        <AppPromoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
