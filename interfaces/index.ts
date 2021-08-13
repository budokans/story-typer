export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
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

export interface ProvideAuth {
  user: User | null;
  signInWithGoogle: () => Promise<User | null | undefined>;
  signOut: () => Promise<User | null | undefined>;
}

export type AuthContext = ProvideAuth | null;
