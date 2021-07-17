import { useAuth } from "../context/auth";

const Index: React.FC = () => {
  const auth = useAuth();
  console.log(auth?.user);

  return auth ? (
    <>
      <div>
        <code>{auth.user ? auth.user.email : "None"}</code>
      </div>
      <button onClick={() => auth.signInWithFacebook()}>Sign In</button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </>
  ) : null;
};

export default Index;
