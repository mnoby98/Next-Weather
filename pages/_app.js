import Layout from "@/components/layout";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <main className="max-w-4xl mx-auto bg-red-300  relative  h-full ">
        <Component {...pageProps} />
      </main>
    </Layout>
  );
}
