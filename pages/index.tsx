import { useAuth } from "../context/auth";

const Index: React.FC = () => {
  const auth = useAuth();
  console.log(auth?.user);

  return (
    <>
      <div>{auth?.user?.email}</div>
      <button onClick={() => auth?.signInWithFacebook()}>Sign In</button>
      <button onClick={() => auth?.signOut()}>Sign Out</button>
    </>
  );
};

export default Index;
