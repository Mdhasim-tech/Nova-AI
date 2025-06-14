"use client"
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import './page.css'
export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/chat');
  };

  return (
    <>
      <Head>
        <title>Nova - HasimTech Assistant</title>
      </Head>
      <div className="homeContainer">
        <header className="header">
          <h1 className="logo">🌟 HasimTech</h1>
        </header>

        <main className="main">
          <h2 className="title">
            Hi, I'm <span className="nova">Nova</span> 👋
          </h2>
          <p className="subtitle">
            Your intelligent assistant at HasimTech — here to help you explore our services,
            solve your queries, and even chat beyond!
          </p>

          <button className="ctaButton" onClick={handleStart}>
            🚀 Start Chatting
          </button>
        </main>

        <footer className="footer">
          <p>Made with 💡 at HasimTech</p>
        </footer>
      </div>
    </>
  );
}
