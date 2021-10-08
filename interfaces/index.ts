import { FieldValue } from "@firebase/firestore-types";

export interface UserAuth {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface User extends UserAuth {
  registeredDate: FieldValue;
  personalBest: number | null;
  lastTenScores: number[];
  gamesPlayed: number;
  newestPlayedStoryPublishedDate: string | null;
  oldestPlayedStoryPublishedDate: string | null;
}

export interface Post {
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

export interface Story {
  title: string;
  authorBio: string;
  storyHtml: string;
  storyText: string;
  url: string;
  datePublished: string;
}

export interface StoryWithId extends Story {
  uid: string;
}

export interface ProvideAuth {
  userId: string | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export type AuthContext = ProvideAuth | null;

export interface PrevGame {
  userId: string;
  storyId: string;
  storyTitle: string;
  storyHtml: string;
  datePlayed: string;
  score: number;
}

export interface FavoriteBase {
  storyId: StoryWithId["uid"];
  storyTitle: StoryWithId["title"];
  storyHtml: StoryWithId["storyHtml"];
}

export interface Favorite extends FavoriteBase {
  userId: User["uid"];
  dateFavorited: string;
}
