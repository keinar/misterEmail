import { File, Inbox, MailPlus, SendHorizontal, Trash2, X } from "lucide-react";

export function SideNav({ currentNav, showNavBar, setShowNavBar, isMobile }) {
  function handleClose() {
    setShowNavBar(-400);
  }

  return (
    <nav className="side-nav" style={{ left: `${showNavBar}px` }}>
      {isMobile && <X onClick={handleClose} />}

      <button className="email-compose">
        <MailPlus size={20} /> Compose
      </button>
      <ul className={`index ${currentNav === "inbox" ? "active" : ""}`}>
        <Inbox size={20} />
        Inbox
      </ul>
      <ul className={`sent ${currentNav === "sent" ? "active" : ""}`}>
        <SendHorizontal size={20} /> Sent
      </ul>
      <ul className={`drafts ${currentNav === "drafts" ? "active" : ""}`}>
        <File size={20} /> Drafts
      </ul>
      <ul className={`bin ${currentNav === "bin" ? "active" : ""}`}>
        <Trash2 size={20} /> Bin
      </ul>
    </nav>
  );
}
