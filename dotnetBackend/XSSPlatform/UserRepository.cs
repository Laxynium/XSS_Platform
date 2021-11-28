using System;
using LiteDB;

namespace XSSPlatform
{
    public class UserRepository : IUserRepository
    {
        private readonly LiteDatabase _db;

        public UserRepository(LiteDatabase db)
        {
            _db = db;
        }
        
        public User? Get(string userId)
        {
            var col = _db.GetCollection<User>("users");
            var user = col.Query()
                .Where(x => x.Id == userId)
                .SingleOrDefault();
            return user;
        }

        public void Save(User user)
        {
            if (user is null)
            {
                throw new ArgumentNullException(nameof(user));
            }
            
            var col = _db.GetCollection<User>("users");
            col.Upsert(user);
        }
    }
}