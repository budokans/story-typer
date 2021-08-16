import { Welcome } from "@/components/Welcome";
import { LayoutContainer } from "@/containers/layout";
import { useAuth } from "@/context/auth";
import { FiftyWordStoriesLink } from "@/components/FiftyWordStoriesLink";

const Index: React.FC = () => {
  const auth = useAuth();

  return (
    <LayoutContainer auth={auth}>
      <Welcome>
        <Welcome.Brand />
        <Welcome.Headline>
          The speed-typing game for lovers of short stories.
        </Welcome.Headline>
        <Welcome.Headline>
          Over 2000 stories sourced from{" "}
          <FiftyWordStoriesLink>fiftywordstories.com</FiftyWordStoriesLink>.
        </Welcome.Headline>
        <Welcome.Headline>Updated daily.</Welcome.Headline>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          laboriosam! Doloremque consequatur fuga maiores, corporis dignissimos
          cum, delectus illo eius necessitatibus vitae quasi ad assumenda
          dolorem laudantium? Sequi, consectetur esse?
        </p>
      </Welcome>
    </LayoutContainer>
  );
};

export default Index;
