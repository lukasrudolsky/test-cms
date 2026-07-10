"use client";

type Listener = () => void;

let isOpen = false;
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function openWaitlist() {
  isOpen = true;
  emitChange();
}

export function closeWaitlist() {
  isOpen = false;
  emitChange();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return isOpen;
}

export function getServerSnapshot() {
  return false;
}
