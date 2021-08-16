import { Welcome } from "@/components/Welcome";
import { LayoutContainer } from "@/containers/layout";
import { useAuth } from "@/context/auth";

const Index: React.FC = () => {
  const auth = useAuth();

  return (
    <LayoutContainer auth={auth}>
      <Welcome>
        <Welcome.Brand />
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
