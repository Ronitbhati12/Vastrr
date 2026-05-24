import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    promoBar: { type: String, default: 'FREE SHIPPING ON ALL ORDERS OVER $100' },
    marqueeText1: { type: String, default: 'NEW COLLECTION OUT NOW' },
    marqueeText2: { type: String, default: 'LIMITED STOCK' },
    heroBadge: { type: String, default: 'SUMMER DROP 01' },
    heroTitle1: { type: String, default: 'REDEFINE' },
    heroTitle2: { type: String, default: 'YOUR REALITY.' },
    heroCta: { type: String, default: 'SHOP COLLECTION' },
    heroDescription: { type: String, default: 'Premium streetwear built for the modern urban landscape. Distinctive. Unapologetic. VASTRR.' },
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
