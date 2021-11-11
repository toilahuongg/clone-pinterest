const bbcode = [
  {
    pattern: /\[link\surl=('|")(.*)('|")\](.*)\[\/link\]/,
    replacementText: '<a href="$1">$2</a>',
  },
  {
    pattern: /\[b\](.*)\[\/b\]/,
    replacementText: '<b>$1</b>',
  },
  {
    pattern: /\[u\](.*)\[\/u\]/,
    replacementText: '<u>$1</u>',
  },
  {
    pattern: /\[s\](.*)\[\/s\]/,
    replacementText: '<s>$1</s>',
  },
];

const bbcodeToHTML = (str: string) => {
  let result = str.replace(/<[^>]*>?/gm, '');
  for (let i = 0; i < bbcode.length; i += 1) {
    while (bbcode[i].pattern.test(result)) {
      result = result.replace(bbcode[i].pattern, bbcode[i].replacementText);
    }
  }
  return result;
};

export default bbcodeToHTML;
