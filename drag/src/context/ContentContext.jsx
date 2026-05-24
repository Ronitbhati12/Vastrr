import React, { createContext, useContext, useState } from 'react';

const ContentContext = createContext();

const defaultContent = {
  heroBadge: "Summer Archive '26",
  heroTitle1: "Redefining",
  heroTitle2: "Aesthetics.",
  heroCta: "Shop The Drop",
  heroDescription: "Minimalist clothing and essential streetwear.",
  heroCard1Title: "Urban",
  heroCard1Subtitle: "Street",
  heroCard2Title: "Lounge",
  heroCard2Subtitle: "Wear",
  promoBar: "Free Global Shipping on orders over $200",
  marqueeText1: "Vastrr CLOTHING",
  marqueeText2: "NEW ERA",
  productSectionTitle: "Curated Archive",
  productSectionSubtitle: "Pieces that speak for themselves.",
  productViewAll: "View Everything",
  navBrand: "Vastrr",
  navLinkMen: "Men",
  navLinkWomen: "Women",
  footerText: "© 2026 Vastrr CLOTHING. All rights reserved.",
  categorySubtitle: "Explore our curated collection.",
  loadingBrand: "Vastrr.",
  heroImage: "",
  heroCard1Image: "",
  heroCard2Image: ""
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultContent);

  const updateContent = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const resetContent = () => {
    setContent(defaultContent);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
