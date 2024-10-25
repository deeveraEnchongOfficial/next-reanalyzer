const getLetterByIndex = (index: number): string | undefined => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (index >= 0 && index < alphabet.length) {
    return alphabet[index];
  }

  return undefined;
};

export default getLetterByIndex;
