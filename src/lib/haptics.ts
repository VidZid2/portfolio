export function hapticTap() {
  if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(8);
    } catch (e) {
      // Ignore vibration error (some browsers block or restrict vibration API)
    }
  }
}
