import { FieldValue } from "firebase/firestore";
import { ReactNode } from "react";

export interface UserAuth {
  readonly uid: string;
  readonly name: string | null;
  readonly email: string | null;
  readonly photoURL: string | null;
}

export interface User extends UserAuth {
  readonly registeredDate: FieldValue;
  readonly personalBest: number | null;
  readonly lastTenScores: readonly number[];
  readonly gamesPlayed: number;
  readonly newestPlayedStoryPublishedDate: string | null;
  readonly oldestPlayedStoryPublishedDate: string | null;
}

export interface Post {
  readonly date: string;
  readonly link: string;
  readonly title: {
    readonly rendered: string;
  };
  readonly content: {
    readonly rendered: string;
  };
}

export interface Story {
  readonly title: string;
  readonly authorBio: string;
  readonly storyHtml: string;
  readonly storyText: string;
  readonly url: string;
  readonly datePublished: string;
}

export interface StoryWithId extends Story {
  readonly uid: string;
}

export interface PrevGame {
  readonly userId: string;
  readonly storyId: string;
  readonly storyTitle: string;
  readonly storyHtml: string;
  readonly datePlayed: string;
  readonly score: number;
}

export interface FavoriteBase {
  readonly storyId: string;
  readonly storyTitle: string;
  readonly storyHtml: string;
}

export interface Favorite extends FavoriteBase {
  readonly userId: User["uid"];
  readonly dateFavorited: string;
}

export interface ChildrenProps {
  readonly children: ReactNode;
}
