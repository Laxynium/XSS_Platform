using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace XSSPlatform
{
    public record HintDto(int Number, string Value);

    public record LevelDto
    {
        public int Number { get; }
        public bool Completed { get; }
        public string Token { get; }
        public IReadOnlyList<HintDto> UsedHints { get; }
        public int TotalHints { get; }

        [JsonConstructor]
        public LevelDto(int number, bool completed, string token, IReadOnlyList<HintDto> usedHints, int totalHints)
        {
            Number = number;
            Completed = completed;
            Token = token;
            UsedHints = usedHints.ToList();
            TotalHints = totalHints;
        }
    }

    public record UserDto
    {
        public string Id { get; }
        public string Name { get; }
        public IReadOnlyList<LevelDto> Levels { get; }

        public bool ChallengeCompleted { get; }

        public UserDto(string id, string name, bool challengeCompleted, IReadOnlyList<LevelDto> levels)
        {
            Id = id;
            Name = name;
            ChallengeCompleted = challengeCompleted;
            Levels = levels.ToList();
        }
    }

    public class UserMapper
    {
        private readonly LevelsOptions _options;

        public UserMapper(LevelsOptions options)
        {
            _options = options;
        }

        public UserDto ToDto(User user)
        {
            return new UserDto(user.Id, user.Name, user.ChallengeCompleted, user.Levels
                .Select(l =>
                {
                    var levelHints = _options.LevelsHints[l.Number.ToString()];
                    return new LevelDto(l.Number, 
                        l.Completed, 
                        l.Token,
                        l.UsedHints.Select(h => new HintDto(h, levelHints[h - 1])).ToList(), 
                        levelHints.Length);
                })
                .ToList());
        }
    }
}