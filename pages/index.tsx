// import axios from "axios";
// import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";

const Index: React.FC = () => {
  // const [html, setHtml] = useState(null);
  const auth = useAuth();

  // const getHtml = async () => {
  //   const { data: html } = await axios("http://localhost:3000/api/scrape");
  //   setHtml(html);
  // };

  // useEffect(() => {
  //   getHtml();
  // }, []);

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
