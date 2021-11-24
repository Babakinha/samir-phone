function randItem(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function RandomPhrase() {
  let nouns = ["Big chungus", "Samir", "Someone", "A duck", "The Teacher", "An old lady", "A hamster", "A dog", "Amogus", "Zé ramalho"];
  let verbs = ["kicked " + randItem(nouns), "ran", "sliced " + randItem(nouns), "rolled", "died", "breathed", "slept", "killed " + randItem(nouns)];
  let adjectives = ["beautiful", "lazy", "a professional", "lovely", "dumb", "a bad person", "soft", "hot", "vibrating", "slimy"];
  let adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "proudly", "shockingly", "calmly", "passionately"];

  return `${randItem(nouns)} ${(Math.random() < 0.7)? randItem(adverbs) + ' ' : ''}${randItem(verbs)}${(Math.random() < 0.7)? ` beacuse he was ${randItem(adjectives)}`: ''}`;
}