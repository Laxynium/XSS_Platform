using System;
using LiteDB;
using Optional;

namespace XSSPlatform
{
    public class UserMessagesRepository : IUserMessagesRepository
    {
        private readonly LiteDatabase _db;

        public UserMessagesRepository(LiteDatabase db)
        {
            _db = db;
        }

        public Option<UserMessages> GetById(string userId)
        {
            var col = _db.GetCollection<UserMessages>("userMessages");

            var userMessages = col.Query()
                .Where(x => x.UserId == userId)
                .SingleOrDefault();
            return userMessages.SomeNotNull();
        }

        public void Save(UserMessages userMessages)
        {
            if (userMessages is null)
            {
                throw new ArgumentNullException(nameof(userMessages));
            }
            
            var col = _db.GetCollection<UserMessages>("userMessages");
            col.Upsert(userMessages);
        }
    }
}