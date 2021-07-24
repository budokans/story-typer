export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface Scrape {
  id: number;
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
  id: string;
  title: string;
  authorBio: string;
  content: {
    html: string;
    text: string;
  };
  url: string;
  dateScraped: string;
  datePublished: string;
}

export interface ProvideAuth {
  user: User | null;
  signInWithFacebook: () => Promise<User | null | undefined>;
  signOut: () => Promise<User | null | undefined>;
}

export type AuthContext = ProvideAuth | null;
