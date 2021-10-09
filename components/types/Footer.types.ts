import { FC } from "react";

interface Compound {
  Text: FC;
  NameLink: FC;
  GitHub: FC;
}

export type FooterCompound = FC & Compound;
