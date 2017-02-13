// @flow

/**
 *  cancelEvent - Cancel Events so we dont bubble up our events to the document
 *
 *  @param { Object } event
 *  @return { Void }
 **/
 export const cancelEvent = (e: Event): void => {
   e.stopPropagation();
   e.preventDefault();
 };
