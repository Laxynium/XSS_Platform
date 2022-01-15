using System.Collections.Generic;
using System.Linq;
using LiteDB;

namespace XSSPlatform
{
    public record User
    {
        public string Id { get; }
        public string Name { get; }
        public List<Level> Levels { get; init; } = new();

        public bool ChallengeCompleted { get; private set; }

        [BsonCtor]
        public User(string id, string name)
        {
            Id = id;
            Name = name;
        }

        public static User Create(string name, TokenGenerator generator)
        {
            var user = new User(generator.Generate(), name)
            {
                Levels = new List<Level> { new() { Number = 1, Completed = false, Token = generator.Generate() } }
            };
            return user;
        }

        public bool CompleteLevel(int levelNumber, string levelToken, int levelsCount, TokenGenerator tokenGenerator)
        {
            var level = FindLevel(levelNumber, levelToken);
            if (level is null)
            {
                return false;
            }

            var levelIdx = Levels.IndexOf(level);
            Levels[levelIdx] = (Level)level with { Completed = true };
            if (levelIdx == levelsCount - 1)
            {
                ChallengeCompleted = true;
            }

            if (ChallengeCompleted)
            {
                return true;
            }

            var nextLevelToken = tokenGenerator.Generate();
            AddNextLevel(level, nextLevelToken);

            return true;
        }

        public Level? FindLevel(int level, string token)
        {
            return Levels.SingleOrDefault(x =>
                x.Number == level && x.Token == token && x.Completed == false);
        }

        private void AddNextLevel(Level level, string levelToken)
        {
            Levels.Add(new Level { Number = level.Number + 1, Completed = false, Token = levelToken });
        }

        public bool UseHint(int levelNumber, string levelToken, int hintNumber, Dictionary<string,string[]> levelsHints)
        {
            var level = FindLevel(levelNumber, levelToken);
            if (level is null)
            {
                return false;
            }

            if (!levelsHints.ContainsKey(level.Number.ToString()))
            {
                return false;
            }

            if (level.UsedHints.Contains(hintNumber))
            {
                return false;
            }

            var hints = levelsHints[level.Number.ToString()];
            if (hintNumber < 1 || hintNumber > hints.Length)
            {
                return false;
            }

            if (level.UsedHints.DefaultIfEmpty(0).Max() + 1 != hintNumber)
            {
                return false;
            }

            var levelIdx = Levels.IndexOf(level);
            Levels[levelIdx] = level with { UsedHints = level.UsedHints.Append(hintNumber).ToArray() };

            return true;
        }
    }
}