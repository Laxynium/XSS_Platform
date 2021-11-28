using Optional;

namespace XSSPlatform
{
    public interface IUserMessagesRepository
    {
        Option<UserMessages> GetById(string userId);
        void Save(UserMessages userMessages);
    }
}