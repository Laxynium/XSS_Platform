using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace XSSPlatform
{
    public sealed class RandomStringGenerator
    {
        public string Generate(int length, string charSet)
        {
            using var rng = RandomNumberGenerator.Create();
            return Enumerable.Range(0, length).Select(_ => charSet[GetInt(rng, charSet.Length)])
                .Aggregate(new StringBuilder(),
                    (acc, x) => acc.Append(x),
                    x => x.ToString());
        }

        private static int GetInt(RandomNumberGenerator rnd, int max)
        {
            var r = new byte[4];
            int value;
            do
            {
                rnd.GetBytes(r);
                value = BitConverter.ToInt32(r, 0) & int.MaxValue;
            } while (value >= max * (int.MaxValue / max));

            return value % max;
        }
    }
}