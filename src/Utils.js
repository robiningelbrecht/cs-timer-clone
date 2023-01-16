export default class Utils {
  constructor() {}

  static randomScramble = (length) => {
    const directions = [
      ["D", "U"],
      ["L", "R"],
      ["F", "B"],
    ];

    const times = ["", "'", "2"];

    const random = (array, exclude) => {
      do {
        var n = Math.floor(Math.random() * array.length);
      } while (array[n] === exclude);
      return array[n];
    };

    const scramble = [];
    var direction;
    for (var i = 0; i < length; i++) {
      direction = random(directions, direction);
      scramble.push(random(direction) + random(times));
    }

    return scramble;
  };

  static rgba2hex = (rgba) =>
    `#${rgba
      .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
      .slice(1)
      .map((n, i) =>
        (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
          .toString(16)
          .padStart(2, "0")
          .replace("NaN", "")
      )
      .join("")}`;

  static uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };
}
