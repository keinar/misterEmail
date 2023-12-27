import { useEffect, useState } from 'react';
import { eventBusService } from '../../services/event-bus.service';

export function UserMsg() {
  const [msg, setMsg] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = eventBusService.on('show-user-msg', msg => {
      setMsg(msg);
      setIsVisible(true);
      setTimeout(() => {
        onCloseMsg();
      }, 3000);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function onCloseMsg() {
    setIsVisible(false);
    setMsg(null);
  }

  if (!isVisible || !msg) return <></>;
  return (
    <div className={'user-msg ' + msg.type}>
      <p>{msg.txt}</p>
      <button onClick={onCloseMsg}>OK</button>
    </div>
  );
}
