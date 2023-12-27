function createEventEmitter() {
  const listenersMap = {};
  // Trick for DEBUG
  // window.mapmap = listenersMap;
  return {
    // Use this function to subscribe to an event
    on(evName, listener) {
      // debugger
      listenersMap[evName] = listenersMap[evName]
        ? [...listenersMap[evName], listener]
        : [listener];
      return () => {
        listenersMap[evName] = listenersMap[evName].filter(
          func => func !== listener
        );
      };
    },
    // Use this function to emit an event
    emit(evName, data) {
      if (!listenersMap[evName]) return;
      listenersMap[evName].forEach(listener => listener(data));
    },
  };
}

export const eventBusService = createEventEmitter();

// For debug only
// window.ebs = eventBusService;
// window.showSuccessMsg = showSuccessMsg;
// window.showErrorMsg = showErrorMsg;

export function showUserMsg(msg) {
  eventBusService.emit('show-user-msg', msg);
}

export function showSuccessMsg(txt) {
  showUserMsg({ txt, type: 'success' });
}

export function showErrorMsg(txt) {
  showUserMsg({ txt, type: 'error' });
}
