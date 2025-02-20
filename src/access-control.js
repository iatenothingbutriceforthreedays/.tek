import { getRoomMetadata, currentRoomKey } from "./room-metadata";
import freeMode from "./utils/free-mode"

// Returns true if redirect was performed
export function redirectIfNotAuthorized(roomKey) {
  const meta = getRoomMetadata(roomKey); // uses current room if !roomKey
  if (freeMode || meta['requireLogin'] == false || (window.APP.hubChannel && window.APP.hubChannel.signedIn)) {
    return false;
  } else {
    // TODO: Caspian -> put sign in ref here
    location.href = `/?loginModal=true&sign_in_destination_url=${meta.url}`;
    return true;
  }
}
