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

        [JsonConstructor]
        public LevelDto(int number, bool completed, string token, IReadOnlyList<HintDto> usedHints)
        {
            Number = number;
            Completed = completed;
            Token = token;
            UsedHints = usedHints.ToList();
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

    public record UserMessagesDto
    {
        public IReadOnlyList<string> Messages { get; }

        public UserMessagesDto(string[] messages)
        {
            Messages = messages;
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
                .Select(l => new LevelDto(l.Number, l.Completed, l.Token,
                    l.UsedHints.Select(h => new HintDto(h, _options.LevelsHints[l.Number.ToString()][h - 1])).ToList()))
                .ToList());
        }

        public UserMessagesDto ToDto(List<string> messages)
        {
            return new (messages.ToArray());
        }
    }
}