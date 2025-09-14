import React from 'react'
import Navbar from '@/components/Navbar'
import Chat from '@/components/Chat'
import Footer from '@/components/Footer'

const ChatPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="pt-20">
        <Chat />
      </main>
      <Footer />
    </div>
  )
}

export default ChatPage
