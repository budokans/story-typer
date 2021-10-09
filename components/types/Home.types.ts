import { FC } from "react";

interface Compound {
  Brand: FC;
  HeadlinesWrapper: FC;
  Headline: FC;
  FeaturesWrapper: FC;
  FeaturesHeading: FC;
  Features: FC;
  Feature: FC;
  PlayBtn: FC<{ onClick: () => void }>;
}

export type HomeCompound = FC & Compound;
