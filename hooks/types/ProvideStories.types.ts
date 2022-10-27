import { StoryWithId } from "interfaces";

export interface ProvideStories {
  readonly stories: readonly StoryWithId[];
  readonly isLoading: boolean;
  readonly handlePlayArchiveStoryClick: (id: StoryWithId["uid"]) => void;
}
