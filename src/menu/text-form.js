import React, { useEffect } from "react";
import { debounce } from "lodash";

export const TextArea = ({ value, onValueChange, ...otherProps }) => {
  const inputRef = React.createRef();
  const stopPropagation = e => e.stopPropagation();
  useEffect(() => {
    const capturedRef = inputRef.current;
    const intercepted = ["keydown", "keyup"];
    intercepted.forEach(i => capturedRef.addEventListener(i, stopPropagation));
    // Capture enter events
    capturedRef.addEventListener("onkeypress", e => {
      if (e.which === 13 && !e.shiftKey) onValueChange(e.target.value);
      e.stopPropagation();
    });
    return () => intercepted.forEach(i => capturedRef.removeEventListener(i, stopPropagation));
  });
  const bounced = debounce(async update => onValueChange(update), 1e3, { trailing: true, maxWait: 3e3 });

  return (
    <textarea
      ref={inputRef}
      type={"text"}
      placeholder={value}
      onChange={({ target }) => {
        bounced(target.value);
      }}
      {...otherProps}
    />
  );
};

export const TextForm = ({ value, onValueChange, ...otherProps }) => {
  const inputRef = React.createRef();
  const stopPropagation = e => e.stopPropagation();
  useEffect(() => {
    const capturedRef = inputRef.current;
    const intercepted = ["keydown", "keypress", "keyup"];
    intercepted.forEach(i => capturedRef.addEventListener(i, stopPropagation));
    return () => intercepted.forEach(i => capturedRef.removeEventListener(i, stopPropagation));
  });
  const bounced = debounce(async update => onValueChange(update), 2e3, { trailing: true, maxWait: 5e3 });

  return (
    <input
      ref={inputRef}
      type={"text"}
      placeholder={value}
      onChange={({ target }) => {
        bounced(target.value);
      }}
      onSubmit={event => {
        bounced(event.target.value);
        event.preventDefault();
      }}
      {...otherProps}
    />
  );
};
