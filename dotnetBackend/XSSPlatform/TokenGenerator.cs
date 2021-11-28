using System.Linq;

namespace XSSPlatform
{
    public sealed class TokenGenerator
    {
        private readonly RandomStringGenerator _stringGenerator;
        private readonly string _charSet;

        public TokenGenerator(RandomStringGenerator stringGenerator)
        {
            _stringGenerator = stringGenerator;
            _charSet = new string(Enumerable.Range('a', 'z' - 'a' + 1).Select(i => (char) i)
                .Concat(Enumerable.Range('A', 'Z' - 'A' + 1).Select(i => (char) i))
                .Concat(Enumerable.Range('0', '9' - '0' + 1).Select(i => (char) i))
                .ToArray());
        }

        public string Generate()
        {
            return _stringGenerator.Generate(32, _charSet);
        }
    }
}