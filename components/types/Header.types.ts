import { FC } from "react";

interface Compound {
  UserMenu: FC;
  StatsContainer: FC;
  StatsType: FC;
  Stat: FC;
  Favorites: FC;
  Archive: FC;
}

export type HeaderCompound = FC & Compound;
