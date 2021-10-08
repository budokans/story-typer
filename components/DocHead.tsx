import Head from "next/head";

export const DocHead: React.FC = () => {
  return (
    <Head>
      <meta
        name="description"
        content="Story Typer: The speed-typing game for lovers of short stories."
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
    </Head>
  );
};
