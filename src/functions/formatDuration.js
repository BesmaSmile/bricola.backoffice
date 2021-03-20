export function formatDuration(secondsDuration) {
  const hours = Math.floor(secondsDuration / 3600);
  secondsDuration %= 3600;
  const minutes = Math.floor(secondsDuration / 60);
  return (hours > 0 ? `${hours} h ` : '') + `${minutes} min`
}