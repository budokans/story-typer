import { StoryWithId } from "interfaces";

export interface ProvideStories {
  stories: StoryWithId[];
  isLoading: boolean;
  handlePlayArchiveStoryClick: (id: StoryWithId["uid"]) => void;
}
