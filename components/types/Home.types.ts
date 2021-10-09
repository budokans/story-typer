import { FC } from "react";

interface Compound {
  Brand: FC;
  HeadlinesWrapper: FC;
  Headline: FC;
  CTAWrapper: FC;
  CTA: FC;
  Benefits: FC;
  Benefit: FC;
  PlayBtn: FC<{ onClick: () => void }>;
}

export type HomeCompound = FC & Compound;
