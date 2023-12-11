import { File, Inbox, MailPlus, SendHorizontal, Trash2, X } from "lucide-react";

export function SideNav({
  currentNav,
  showNavBar,
  setShowNavBar,
  isMobile,
  emails,
  onComposeModalChange,
}) {
  function handleClose() {
    setShowNavBar(-400);
  }

  function openComposeModal() {
    onComposeModalChange(true);
  }

  return (
    <nav className="side-nav" style={{ left: `${showNavBar}px` }}>
      {isMobile && <X onClick={handleClose} />}

      <button className="email-compose" onClick={openComposeModal}>
        <MailPlus size={20} /> Compose
      </button>
      <ul className={`index ${currentNav === "inbox" ? "active" : ""}`}>
        <Inbox
          size={20}
          stroke={currentNav === "inbox" ? "black" : "#484A49"}
        />
        Inbox <span>{emails.length}</span>
      </ul>
      <ul className={`sent ${currentNav === "sent" ? "active" : ""}`}>
        <SendHorizontal
          size={20}
          stroke={currentNav === "sent" ? "black" : "#484A49"}
        />
        Sent
      </ul>
      <ul className={`drafts ${currentNav === "drafts" ? "active" : ""}`}>
        <File
          size={20}
          stroke={currentNav === "drafts" ? "black" : "#484A49"}
        />
        Drafts
      </ul>
      <ul className={`bin ${currentNav === "bin" ? "active" : ""}`}>
        <Trash2 size={20} stroke={currentNav === "bin" ? "black" : "#484A49"} />
        Bin
      </ul>
    </nav>
  );
}
