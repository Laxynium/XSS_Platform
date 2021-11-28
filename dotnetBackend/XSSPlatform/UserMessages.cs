using System.Collections.Generic;
using LiteDB;

namespace XSSPlatform
{
    public record UserMessages
    {
        [BsonId]
        public string UserId { get; }
        public List<string> Messages { get; init; } = new();

        [BsonCtor]
        public UserMessages(string userId)
        {
            UserId = userId;
        }
        
        public UserMessages(string userId, List<string> messages)
        {
            UserId = userId;
            Messages = messages;
        }

        public UserMessages AddMessage(string message)
        {
            Messages.Add(message);
            return this;
        }
    }
}