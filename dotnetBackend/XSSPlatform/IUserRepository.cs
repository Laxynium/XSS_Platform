namespace XSSPlatform
{
    public interface IUserRepository
    {
        User? Get(string userId);
        void Save(User user);
    }
}