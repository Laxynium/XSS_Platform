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

        public Level? FindLevel(int level, string token)
        {
            return Levels.SingleOrDefault(x =>
                x.Number == level && x.Token == token && x.Completed == false);
        }

        public void CompleteLevel(Level level, int levelsCount)
        {
            var levelIdx = Levels.IndexOf(level);
            Levels[levelIdx] = level with {Completed = true};
            if (levelIdx == levelsCount - 1)
            {
                ChallengeCompleted = true;
            }
        }

        public void AddNextLevel(Level level, string levelToken)
        {
            Levels.Add(new Level {Number = level.Number + 1, Completed = false, Token = levelToken});
        }

        public bool UseHint(Level level, int hintNumber, IDictionary<string, string[]> levelsHints)
        {
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

            if (level.UsedHints.DefaultIfEmpty(0).Min() + 1 != hintNumber)
            {
                return false;
            }
            
            var levelIdx = Levels.IndexOf(level);
            Levels[levelIdx] = level with {UsedHints = level.UsedHints.Append(hintNumber).ToArray()};

            return true;
        }
    }
}